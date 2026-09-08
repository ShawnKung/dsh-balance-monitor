export function createUpdateStore({ currentVersion, request }) {
  let snapshot = {
    status: 'idle',
    currentVersion,
    latestVersion: null,
    installedVersion: currentVersion,
    updateAvailable: false,
    error: null,
  }
  let operation = null
  const listeners = new Set()

  const publish = next => {
    snapshot = next
    for (const listener of listeners) listener()
    return snapshot
  }

  const run = action => {
    if (operation) return operation
    const previous = snapshot
    publish({
      ...snapshot,
      status: action === 'install' ? 'updating' : 'checking',
      error: null,
    })
    const pending = request(action)
      .then(result => {
        const { ok: _ok, ...next } = result
        return publish(next)
      })
      .catch(error => publish({
        ...previous,
        status: 'error',
        error: String(error?.message ?? error),
      }))
      .finally(() => {
        if (operation === pending) operation = null
      })
    operation = pending
    return operation
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot() {
      return snapshot
    },
    check() {
      return run('check')
    },
    install() {
      return run('install')
    },
  }
}
