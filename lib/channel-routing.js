const BUILTIN_CHANNELS = Object.freeze({
  deepseek: 'deepseek',
})

const CHANNEL_DOMAINS = Object.freeze([
  ['teamorouter.cn', 'teamo'],
  ['moonshot.cn', 'kimi'],
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

function routeFromEntry(entry, settings) {
  const namespace = settings.get(entry.settingsNs)
  const profile = valueAtPath(namespace, entry.settingsPath)
  const baseURL = typeof profile?.baseURL === 'string' && profile.baseURL.trim() !== ''
    ? profile.baseURL.trim()
    : undefined
  const credentialRef = typeof profile?.apiKeyEnv === 'string' && profile.apiKeyEnv.trim() !== ''
    ? profile.apiKeyEnv.trim()
    : undefined
  return { entry, baseURL, credentialRef }
}

export function providerRoute(provider, llm, settings) {
  const directory = llm.listConfigurableProviders()
  const entry = directory.find(candidate => candidate.provider === provider)
  if (!entry) return undefined
  return routeFromEntry(entry, settings)
}

function channelForRoute(route) {
  if (route.baseURL) return channelForBaseURL(route.baseURL)
  return route.entry.declared === false
    ? BUILTIN_CHANNELS[route.entry.provider]
    : undefined
}

export function providerCredentialRefsForChannel(channel, targetBaseURL, llm, settings) {
  if (channelForBaseURL(targetBaseURL) !== channel) return []

  const refs = new Set()
  for (const entry of llm.listConfigurableProviders()) {
    const route = routeFromEntry(entry, settings)
    if (channelForRoute(route) !== channel || !route.credentialRef) continue
    refs.add(route.credentialRef)
  }
  return refs.size === 1 ? [...refs] : []
}

export function refreshTargetForSession(session, { llm, settings }) {
  const provider = providerForSession(session)
  if (!provider) return { kind: 'skip' }

  const route = providerRoute(provider, llm, settings)
  if (!route) return { kind: 'skip' }
  const channel = channelForRoute(route)
  return channel
    ? { kind: 'channel', channel }
    : { kind: 'skip' }
}
