import assert from 'node:assert/strict'
import test from 'node:test'
import { BalanceService } from '../lib/service.js'

function channel(fetch) {
  return {
    id: 'example',
    label: 'Example',
    credentialRef: () => 'EXAMPLE_API_KEY',
    fetch,
  }
}

function credentials(value = 'secret') {
  return {
    async resolve() {
      return value ? { value, source: 'file' } : undefined
    },
    async describe() {
      return { configured: Boolean(value), source: value ? 'file' : undefined, writable: true }
    },
  }
}

test('refresh resolves credentials for every operation', async () => {
  let resolves = 0
  const provider = credentials()
  const originalResolve = provider.resolve
  provider.resolve = async (...args) => {
    resolves += 1
    return originalResolve(...args)
  }
  const service = new BalanceService({
    channels: [channel(async () => ({
      currency: 'USD',
      balance: 12.5,
      detail: [],
      periods: [],
    }))],
    credentials: provider,
    config: () => ({}),
  })

  await service.refresh('example')
  await service.refresh('example')

  assert.equal(resolves, 2)
  assert.equal(service.snapshot().channels[0].balance, 12.5)
})

test('environment credentials take precedence over model and user configuration', async () => {
  const resolved = []
  const provider = {
    async resolve(ref) {
      resolved.push(ref)
      if (ref === 'EXAMPLE_API_KEY') return { value: 'user-secret', source: 'file' }
      if (ref === 'ENVIRONMENT_API_KEY') {
        return { value: 'environment-secret', source: 'user-env' }
      }
      if (ref === 'MODEL_API_KEY') return { value: 'model-secret', source: 'file' }
      return undefined
    },
    async describe(ref) {
      return {
        configured: true,
        source: ref === 'ENVIRONMENT_API_KEY' ? 'user-env' : 'file',
        writable: ref !== 'ENVIRONMENT_API_KEY',
      }
    },
  }
  const target = channel(async ({ apiKey }) => {
    assert.equal(apiKey, 'environment-secret')
    return { currency: 'USD', balance: 12.5, detail: [], periods: [] }
  })
  target.environmentRefs = () => ['ENVIRONMENT_API_KEY']
  const service = new BalanceService({
    channels: [target],
    credentials: provider,
    credentialRefs: () => ['MODEL_API_KEY'],
    config: () => ({}),
  })

  await service.refresh('example')

  assert.deepEqual(resolved, ['EXAMPLE_API_KEY', 'ENVIRONMENT_API_KEY', 'MODEL_API_KEY'])
  assert.equal(service.snapshot().channels[0].credential.origin, 'environment')
})

test('model configuration takes precedence over user configuration', async () => {
  const resolved = []
  const provider = {
    async resolve(ref) {
      resolved.push(ref)
      return {
        value: ref === 'MODEL_API_KEY' ? 'model-secret' : 'user-secret',
        source: 'file',
      }
    },
    async describe(ref) {
      return {
        configured: true,
        source: 'file',
        writable: true,
      }
    },
  }
  const service = new BalanceService({
    channels: [channel(async ({ apiKey }) => {
      assert.equal(apiKey, 'model-secret')
      return { currency: 'USD', balance: 9, detail: [], periods: [] }
    })],
    credentials: provider,
    credentialRefs: () => ['MODEL_API_KEY'],
    config: () => ({}),
  })

  await service.refresh('example')
  const state = service.snapshot().channels[0]

  assert.deepEqual(resolved, ['EXAMPLE_API_KEY', 'MODEL_API_KEY'])
  assert.equal(state.status, 'ready')
  assert.equal(state.credential.origin, 'model')
  assert.equal(JSON.stringify(state).includes('model-secret'), false)
})

test('a user reference shared with a model is treated as model configuration', async () => {
  const service = new BalanceService({
    channels: [channel(async ({ apiKey }) => {
      assert.equal(apiKey, 'shared-secret')
      return { currency: 'USD', balance: 8, detail: [], periods: [] }
    })],
    credentials: credentials('shared-secret'),
    credentialRefs: () => ['EXAMPLE_API_KEY'],
    config: () => ({}),
  })

  await service.refresh('example')

  assert.equal(service.snapshot().channels[0].credential.origin, 'model')
})

test('user configuration is used when automatic sources are unavailable', async () => {
  const provider = {
    async resolve(ref) {
      return ref === 'EXAMPLE_API_KEY'
        ? { value: 'user-secret', source: 'file' }
        : undefined
    },
    async describe(ref) {
      return {
        configured: ref === 'EXAMPLE_API_KEY',
        source: ref === 'EXAMPLE_API_KEY' ? 'file' : undefined,
        writable: true,
      }
    },
  }
  const service = new BalanceService({
    channels: [channel(async ({ apiKey }) => {
      assert.equal(apiKey, 'user-secret')
      return { currency: 'USD', balance: 7, detail: [], periods: [] }
    })],
    credentials: provider,
    credentialRefs: () => ['MODEL_API_KEY'],
    config: () => ({}),
  })

  await service.refresh('example')

  assert.equal(service.snapshot().channels[0].credential.origin, 'user')
})

test('user credential writes are scoped by channel and refresh immediately', async () => {
  let stored
  let fetches = 0
  const provider = {
    async resolve() {
      return stored ? { value: stored, source: 'file' } : undefined
    },
    async describe() {
      return {
        configured: Boolean(stored),
        source: stored ? 'file' : undefined,
        writable: true,
      }
    },
    async set(ref, value) {
      assert.equal(ref, 'EXAMPLE_API_KEY')
      stored = value
    },
    async unset(ref) {
      assert.equal(ref, 'EXAMPLE_API_KEY')
      stored = undefined
    },
  }
  const service = new BalanceService({
    channels: [channel(async () => {
      fetches += 1
      return { currency: 'USD', balance: 6, detail: [], periods: [] }
    })],
    credentials: provider,
    config: () => ({}),
  })

  await service.setUserCredential('example', ' new-secret ')
  assert.equal(stored, 'new-secret')
  assert.equal(service.snapshot().channels[0].status, 'ready')

  await service.unsetUserCredential('example')
  assert.equal(stored, undefined)
  assert.equal(service.snapshot().channels[0].status, 'unconfigured')
  assert.equal(fetches, 1)
})

test('unconfigured credentials produce a safe public snapshot', async () => {
  const service = new BalanceService({
    channels: [channel(() => assert.fail('channel fetch must not run'))],
    credentials: credentials(null),
    config: () => ({}),
  })

  await service.refresh('example')
  const state = service.snapshot().channels[0]

  assert.equal(state.status, 'unconfigured')
  assert.equal(state.credential.configured, false)
  assert.equal(state.credential.origin, 'none')
  assert.equal(JSON.stringify(state).includes('secret'), false)
})

test('a failed refresh retains the last successful balance as stale', async () => {
  let attempts = 0
  const service = new BalanceService({
    channels: [channel(async () => {
      attempts += 1
      if (attempts > 1) throw new Error('upstream unavailable')
      return { currency: 'CNY', balance: 8, detail: [], periods: [] }
    })],
    credentials: credentials(),
    config: () => ({}),
  })

  await service.refresh('example')
  await service.refresh('example')
  const state = service.snapshot().channels[0]

  assert.equal(state.status, 'error')
  assert.equal(state.balance, 8)
  assert.equal(state.stale, true)
  assert.match(state.error, /upstream unavailable/)
})

test('subscribers receive completed channel refreshes', async () => {
  const service = new BalanceService({
    channels: [channel(async () => ({
      currency: 'USD',
      balance: 4,
      detail: [],
      periods: [],
    }))],
    credentials: credentials(),
    config: () => ({}),
  })
  const received = []
  const unsubscribe = service.subscribe((snapshot, channelId) => {
    received.push({ snapshot, channelId })
  })

  await service.refresh('example')
  unsubscribe()
  await service.refresh('example')

  assert.equal(received.length, 1)
  assert.equal(received[0].channelId, 'example')
  assert.equal(received[0].snapshot.channels[0].status, 'ready')
})

test('snapshot revisions advance across loading and completed states', async () => {
  let release
  const pending = new Promise(resolve => {
    release = resolve
  })
  const service = new BalanceService({
    channels: [channel(async () => {
      await pending
      return { currency: 'USD', balance: 4, detail: [], periods: [] }
    })],
    credentials: credentials(),
    config: () => ({}),
  })

  const initial = service.snapshot()
  const refresh = service.refresh('example')
  const loading = service.snapshot()
  release()
  await refresh
  const ready = service.snapshot()

  assert.equal(initial.revision, 0)
  assert.equal(loading.channels[0].status, 'loading')
  assert.ok(loading.revision > initial.revision)
  assert.equal(ready.channels[0].status, 'ready')
  assert.ok(ready.revision > loading.revision)
})
