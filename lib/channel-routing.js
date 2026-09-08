const BUILTIN_CHANNELS = Object.freeze({
  deepseek: 'deepseek',
})

const CHANNEL_DOMAINS = Object.freeze([
  ['teamorouter.cn', 'teamo'],
  ['deepseek.com', 'deepseek'],
])

function valueAtPath(value, path) {
  let current = value
  for (const segment of path) {
    if (current === null || typeof current !== 'object') return undefined
    current = current[segment]
  }
  return current
}

function matchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}

export function channelForBaseURL(baseURL) {
  if (typeof baseURL !== 'string' || baseURL.trim() === '') return undefined
  let hostname
  try {
    hostname = new URL(baseURL).hostname.toLowerCase().replace(/\.$/, '')
  } catch {
    return undefined
  }
  return CHANNEL_DOMAINS.find(([domain]) => matchesDomain(hostname, domain))?.[1]
}

export function providerForSession(session) {
  const provider = session?.requestHeader?.()?.config?.provider
    ?? session?.requestContext?.()?.provider
  return typeof provider === 'string' && provider.trim() !== ''
    ? provider.trim()
    : undefined
}

export function providerRoute(provider, llm, settings) {
  const directory = llm.listConfigurableProviders()
  const entry = directory.find(candidate => candidate.provider === provider)
  if (!entry) return undefined

  const namespace = settings.get(entry.settingsNs)
  const profile = valueAtPath(namespace, entry.settingsPath)
  const baseURL = typeof profile?.baseURL === 'string' && profile.baseURL.trim() !== ''
    ? profile.baseURL.trim()
    : undefined
  return { entry, baseURL }
}

export function refreshTargetForSession(session, { llm, settings }) {
  const provider = providerForSession(session)
  if (!provider) return { kind: 'skip' }

  const route = providerRoute(provider, llm, settings)
  if (!route) return { kind: 'skip' }

  if (route.baseURL) {
    const channel = channelForBaseURL(route.baseURL)
    return channel ? { kind: 'channel', channel } : { kind: 'skip' }
  }

  const builtinChannel = route.entry.declared === false
    ? BUILTIN_CHANNELS[provider]
    : undefined
  return builtinChannel
    ? { kind: 'channel', channel: builtinChannel }
    : { kind: 'skip' }
}
