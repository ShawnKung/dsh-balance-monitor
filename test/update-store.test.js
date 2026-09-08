import assert from 'node:assert/strict'
import test from 'node:test'
import { createUpdateStore } from '../src/update-store.js'

test('update store publishes available and restart-required states', async () => {
  const actions = []
  const notifications = []
  const store = createUpdateStore({
    currentVersion: 'v1.2.3',
    async request(action) {
      actions.push(action)
      return action === 'check'
        ? {
            ok: true,
            status: 'available',
            currentVersion: '1.2.3',
            latestVersion: '1.3.0',
            installedVersion: '1.2.3',
            updateAvailable: true,
            error: null,
          }
        : {
            ok: true,
            status: 'restart-required',
            currentVersion: '1.2.3',
            latestVersion: '1.3.0',
            installedVersion: '1.3.0',
            updateAvailable: false,
            error: null,
          }
    },
  })
  store.subscribe(() => notifications.push(store.getSnapshot().status))
  const mirroredNotifications = []
  store.subscribe(() => mirroredNotifications.push(store.getSnapshot().status))

  await store.check()
  await store.install()

  assert.deepEqual(actions, ['check', 'install'])
  assert.deepEqual(notifications, [
    'checking',
    'available',
    'updating',
    'restart-required',
  ])
  assert.deepEqual(mirroredNotifications, notifications)
})

test('failed installs preserve update availability for retry', async () => {
  const store = createUpdateStore({
    currentVersion: 'v1.2.3',
    async request(action) {
      if (action === 'check') {
        return {
          ok: true,
          status: 'available',
          currentVersion: '1.2.3',
          latestVersion: '1.3.0',
          installedVersion: '1.2.3',
          updateAvailable: true,
          error: null,
        }
      }
      throw new Error('安装失败')
    },
  })

  await store.check()
  await store.install()

  const state = store.getSnapshot()
  assert.equal(state.status, 'error')
  assert.equal(state.updateAvailable, true)
  assert.equal(state.error, '安装失败')
})
