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
