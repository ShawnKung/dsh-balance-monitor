export const ACTIVE_REFRESH_INTERVAL_MS = 60_000

export function isSessionTurnActive(session) {
  if (typeof session?.snapshotEvents !== 'function') return false
  const events = session.snapshotEvents()
  for (let index = events.length - 1; index >= 0; index -= 1) {
    if (events[index].type === 'turn/start') return true
    if (events[index].type === 'turn/end') return false
  }
  return false
}

export class ActiveSessionRefresher {
  constructor({
    sessions,
    channelForSession,
    refresh,
    intervalMs = ACTIVE_REFRESH_INTERVAL_MS,
    setIntervalFn = setInterval,
    clearIntervalFn = clearInterval,
    onError = error => {
      console.error('[dsh-balance-monitor] active session refresh failed:', error)
    },
  }) {
    this.sessions = sessions
    this.channelForSession = channelForSession
    this.refresh = refresh
    this.intervalMs = intervalMs
    this.setIntervalFn = setIntervalFn
    this.clearIntervalFn = clearIntervalFn
    this.onError = onError
    this.timer = undefined
    this.inFlight = undefined
    this.disposed = false
  }

  start() {
    if (this.timer !== undefined || this.disposed) return
    void this.tick()
    this.timer = this.setIntervalFn(() => {
      void this.tick()
    }, this.intervalMs)
  }

  tick() {
    if (this.disposed) return Promise.resolve()
    if (this.inFlight) return this.inFlight

    const operation = Promise.resolve()
      .then(() => {
        if (!this.disposed) return this.reconcile()
      })
      .catch(error => this.onError(error))
      .finally(() => {
        if (this.inFlight === operation) this.inFlight = undefined
      })
    this.inFlight = operation
    return operation
  }

  async reconcile() {
    const channels = new Set()
    for (const session of this.sessions()) {
      try {
        if (!isSessionTurnActive(session)) continue
        const channel = this.channelForSession(session)
        if (channel) channels.add(channel)
      } catch (error) {
        this.onError(error)
      }
    }

    await Promise.all([...channels].map(async channel => {
      try {
        await this.refresh(channel)
      } catch (error) {
        this.onError(error)
      }
    }))
  }

  dispose() {
    this.disposed = true
    if (this.timer !== undefined) {
      this.clearIntervalFn(this.timer)
      this.timer = undefined
    }
  }
}
