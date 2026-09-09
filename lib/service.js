function errorMessage(error) {
  return String(error?.message ?? error ?? '未知错误').slice(0, 240)
}

function clone(value) {
  return structuredClone(value)
}

const ENVIRONMENT_SOURCES = new Set(['env', 'project-env', 'user-env'])

export class BalanceService {
  constructor({
    channels,
    credentials,
    config,
    credentialRefs = () => [],
    fetchImpl = fetch,
    now = () => new Date(),
  }) {
    this.channels = channels
    this.credentials = credentials
    this.config = config
    this.credentialRefs = credentialRefs
    this.fetchImpl = fetchImpl
    this.now = now
    this.states = new Map(channels.map(channel => [channel.id, {
      id: channel.id,
      label: channel.label,
      status: 'idle',
      updatedAt: null,
    }]))
    this.inFlight = new Map()
    this.listeners = new Set()
    this.revision = 0
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  publish(channel) {
    const snapshot = this.snapshot()
    for (const listener of this.listeners) {
      try {
        listener(snapshot, channel)
      } catch (error) {
        console.error('[dsh-balance-monitor] state listener failed:', error)
      }
    }
  }

  snapshot() {
    return {
      revision: this.revision,
      channels: this.channels.map(channel => clone(this.states.get(channel.id))),
      updatedAt: this.latestUpdate(),
    }
  }

  setState(id, state) {
    this.states.set(id, state)
    this.revision += 1
  }

  latestUpdate() {
    const values = [...this.states.values()]
      .map(state => state.updatedAt)
      .filter(Boolean)
      .sort()
    return values.at(-1) ?? null
  }

  refreshAll() {
    return Promise.allSettled(this.channels.map(channel => this.refresh(channel.id)))
      .then(() => this.snapshot())
  }

  refreshAllAfterCurrent() {
    return Promise.allSettled(this.channels.map(channel => {
      const current = this.inFlight.get(channel.id)
      return current ? current.then(() => this.refresh(channel.id)) : this.refresh(channel.id)
    })).then(() => this.snapshot())
  }

  refresh(id) {
    const channel = this.channels.find(candidate => candidate.id === id)
    if (!channel) return Promise.reject(new Error(`未知渠道: ${id}`))
    if (this.inFlight.has(id)) return this.inFlight.get(id)

    const operation = this.runRefresh(channel).finally(() => this.inFlight.delete(id))
    this.inFlight.set(id, operation)
    return operation
  }

  async setUserCredential(id, value) {
    const channel = this.channels.find(candidate => candidate.id === id)
    if (!channel) throw new Error(`未知渠道: ${id}`)
    const credential = String(value ?? '').trim()
    if (!credential) throw new Error('API Key 不能为空')
    await this.credentials.set(channel.credentialRef(this.config()), credential)
    return this.refresh(id)
  }

  async unsetUserCredential(id) {
    const channel = this.channels.find(candidate => candidate.id === id)
    if (!channel) throw new Error(`未知渠道: ${id}`)
    await this.credentials.unset(channel.credentialRef(this.config()))
    return this.refresh(id)
  }

  async resolveCredential(channel, config) {
    const userRef = channel.credentialRef(config)
    const environmentRefs = channel.environmentRefs?.(config) ?? []
    const modelRefs = [...new Set(await this.credentialRefs(channel, config))]
    const refs = [...new Set([userRef, ...environmentRefs, ...modelRefs])]
    const candidates = await Promise.all(refs.map(async ref => {
      const [credential, info] = await Promise.all([
        this.credentials.resolve(ref),
        this.credentials.describe(ref),
      ])
      return { ref, credential, info }
    }))

    const environment = candidates.find(candidate => (
      candidate.credential && ENVIRONMENT_SOURCES.has(candidate.credential.source)
    ))
    if (environment) {
      return { ...environment, origin: 'environment' }
    }

    for (const ref of modelRefs) {
      const model = candidates.find(candidate => candidate.ref === ref)
      if (model?.credential) return { ...model, origin: 'model' }
    }

    const user = candidates.find(candidate => candidate.ref === userRef)
    if (user?.credential) return { ...user, origin: 'user' }
    return { ...user, credential: undefined, origin: 'none' }
  }

  async runRefresh(channel) {
    const previous = this.states.get(channel.id)
    this.setState(channel.id, { ...previous, status: 'loading', error: undefined })
    const config = this.config()
    let credentialInfo = previous.credential

    try {
      const { credential, info, origin } = await this.resolveCredential(channel, config)
      credentialInfo = { ...info, origin }
      if (!credential) {
        const state = {
          id: channel.id,
          label: channel.label,
          status: 'unconfigured',
          credential: credentialInfo,
          updatedAt: null,
        }
        this.setState(channel.id, state)
        this.publish(channel.id)
        return clone(state)
      }

      const result = await channel.fetch({
        apiKey: credential.value,
        config,
        fetchImpl: this.fetchImpl,
      })
      const state = {
        id: channel.id,
        label: channel.label,
        status: 'ready',
        ...result,
        credential: credentialInfo,
        updatedAt: this.now().toISOString(),
      }
      this.setState(channel.id, state)
      this.publish(channel.id)
      return clone(state)
    } catch (error) {
      const state = {
        ...previous,
        id: channel.id,
        label: channel.label,
        status: 'error',
        stale: previous.status === 'ready',
        error: errorMessage(error),
        credential: credentialInfo,
      }
      this.setState(channel.id, state)
      this.publish(channel.id)
      return clone(state)
    }
  }
}
