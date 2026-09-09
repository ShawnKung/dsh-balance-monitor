import assert from 'node:assert/strict'
import test from 'node:test'
import {
  channelForBaseURL,
  providerCredentialRefsForChannel,
  providerForSession,
  providerRoute,
  refreshTargetForSession,
} from '../lib/channel-routing.js'

function runtime(profiles, entries = Object.keys(profiles).map(provider => ({
  provider,
  settingsNs: 'llm-pi-ai',
  settingsPath: ['providers', provider],
  declared: true,
}))) {
  return {
    llm: {
      listConfigurableProviders: () => entries,
    },
    settings: {
      get: namespace => namespace === 'llm-pi-ai' ? { providers: profiles } : undefined,
    },
  }
}

function session(provider) {
  return {
    requestHeader: () => provider ? { config: { provider, model: 'example' } } : undefined,
  }
}

test('channel routing matches exact domains and their subdomains', () => {
  assert.equal(channelForBaseURL('https://api.teamorouter.cn/v1'), 'teamo')
  assert.equal(channelForBaseURL('https://api.moonshot.cn/v1'), 'kimi')
  assert.equal(channelForBaseURL('https://api.deepseek.com'), 'deepseek')
  assert.equal(channelForBaseURL('https://DEEPSEEK.COM./v1'), 'deepseek')
  assert.equal(channelForBaseURL('https://moonshot.cn.example.org'), undefined)
  assert.equal(channelForBaseURL('https://deepseek.com.example.org'), undefined)
  assert.equal(channelForBaseURL('not a URL'), undefined)
})

test('session provider comes from the durable request header', () => {
  assert.equal(providerForSession(session('arbitrary-route')), 'arbitrary-route')
})

test('session provider falls back to request context', () => {
  const current = {
    requestHeader: () => undefined,
    requestContext: () => ({ provider: 'fallback-route' }),
  }
  assert.equal(providerForSession(current), 'fallback-route')
  assert.equal(providerForSession(session(undefined)), undefined)
})

test('provider route follows the configurable-provider settings address', () => {
  const services = runtime({
    'arbitrary-route': { baseURL: 'https://api.teamorouter.cn/v1' },
  })
  assert.deepEqual(providerRoute('arbitrary-route', services.llm, services.settings), {
    entry: {
      provider: 'arbitrary-route',
      settingsNs: 'llm-pi-ai',
      settingsPath: ['providers', 'arbitrary-route'],
      declared: true,
    },
    baseURL: 'https://api.teamorouter.cn/v1',
    credentialRef: undefined,
  })
})

test('provider credentials are discovered by channel domain', () => {
  const services = runtime({
    teamorouter: {
      apiKeyEnv: 'TEAMOROUTER_API_KEY',
      baseURL: 'https://api.teamorouter.cn/v1',
    },
    unrelated: {
      apiKeyEnv: 'UNRELATED_API_KEY',
      baseURL: 'https://gateway.example.org/v1',
    },
  })

  assert.deepEqual(
    providerCredentialRefsForChannel(
      'teamo',
      'https://teamorouter.cn',
      services.llm,
      services.settings,
    ),
    ['TEAMOROUTER_API_KEY'],
  )
})

test('duplicate provider routes may share one credential reference', () => {
  const services = runtime({
    primary: {
      apiKeyEnv: 'TEAMOROUTER_API_KEY',
      baseURL: 'https://api.teamorouter.cn/v1',
    },
    secondary: {
      apiKeyEnv: 'TEAMOROUTER_API_KEY',
      baseURL: 'https://backup.teamorouter.cn/v1',
    },
  })

  assert.deepEqual(
    providerCredentialRefsForChannel(
      'teamo',
      'https://teamorouter.cn',
      services.llm,
      services.settings,
    ),
    ['TEAMOROUTER_API_KEY'],
  )
})

test('ambiguous provider credentials are not selected automatically', () => {
  const services = runtime({
    primary: {
      apiKeyEnv: 'PRIMARY_API_KEY',
      baseURL: 'https://api.teamorouter.cn/v1',
    },
    secondary: {
      apiKeyEnv: 'SECONDARY_API_KEY',
      baseURL: 'https://backup.teamorouter.cn/v1',
    },
  })

  assert.deepEqual(
    providerCredentialRefsForChannel(
      'teamo',
      'https://teamorouter.cn',
      services.llm,
      services.settings,
    ),
    [],
  )
})

test('provider credentials are not reused for an unrelated request endpoint', () => {
  const services = runtime({
    teamorouter: {
      apiKeyEnv: 'TEAMOROUTER_API_KEY',
      baseURL: 'https://api.teamorouter.cn/v1',
    },
  })

  assert.deepEqual(
    providerCredentialRefsForChannel(
      'teamo',
      'https://gateway.example.org',
      services.llm,
      services.settings,
    ),
    [],
  )
})

test('custom provider id routes by configured URL hostname', () => {
  const services = runtime({
    'arbitrary-route': { baseURL: 'https://api.teamorouter.cn/v1' },
  })
  assert.deepEqual(
    refreshTargetForSession(session('arbitrary-route'), services),
    { kind: 'channel', channel: 'teamo' },
  )
})

test('provider identity cannot override an unrelated configured URL', () => {
  const services = runtime({
    teamorouter: { baseURL: 'https://gateway.example.org/v1' },
  })
  assert.deepEqual(refreshTargetForSession(session('teamorouter'), services), { kind: 'skip' })
})

test('built-in DeepSeek uses its catalog identity when URL is omitted', () => {
  const services = runtime(
    { deepseek: { apiKeyEnv: 'DEEPSEEK_API_KEY' } },
    [{
      provider: 'deepseek',
      settingsNs: 'llm-pi-ai',
      settingsPath: ['providers', 'deepseek'],
      declared: false,
    }],
  )
  assert.deepEqual(
    refreshTargetForSession(session('deepseek'), services),
    { kind: 'channel', channel: 'deepseek' },
  )
})

test('explicit URL overrides built-in provider identity', () => {
  const services = runtime(
    { deepseek: { baseURL: 'https://gateway.example.org/v1' } },
    [{
      provider: 'deepseek',
      settingsNs: 'llm-pi-ai',
      settingsPath: ['providers', 'deepseek'],
      declared: false,
    }],
  )
  assert.deepEqual(refreshTargetForSession(session('deepseek'), services), { kind: 'skip' })
})

test('unmatched, unknown, and missing providers do not refresh', () => {
  const services = runtime({
    unrelated: { baseURL: 'https://gateway.example.org/v1' },
  })
  assert.deepEqual(refreshTargetForSession(session('unrelated'), services), { kind: 'skip' })
  assert.deepEqual(refreshTargetForSession(session('unknown'), services), { kind: 'skip' })
  assert.deepEqual(refreshTargetForSession(session(undefined), services), { kind: 'skip' })
})
