import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ACTIVE_REFRESH_INTERVAL_MS,
  ActiveSessionRefresher,
  isSessionTurnActive,
} from '../lib/active-session-refresher.js'

function session(channel, events = [{ type: 'turn/start' }]) {
  return {
    channel,
    snapshotEvents: () => events,
  }
}

function harness({
  sessions = [],
  refresh = async () => {},
  onError = () => {},
} = {}) {
  let nextTimer = 0
  const timers = new Map()
  const cleared = []
  const refresher = new ActiveSessionRefresher({
    sessions: () => sessions,
    channelForSession: current => current.channel,
    refresh,
    onError,
    setIntervalFn(callback, interval) {
      const timer = ++nextTimer
      timers.set(timer, { callback, interval })
      return timer
    },
    clearIntervalFn(timer) {
      cleared.push(timer)
      timers.delete(timer)
    },
  })
  return { refresher, timers, cleared }
}

test('session activity follows the latest turn boundary', () => {
  const events = []
  const current = session('deepseek', events)

  assert.equal(isSessionTurnActive(current), false)
  events.push({ type: 'turn/start' })
  assert.equal(isSessionTurnActive(current), true)
  events.push({ type: 'assistant/message' })
  assert.equal(isSessionTurnActive(current), true)
  events.push({ type: 'turn/end' })
  assert.equal(isSessionTurnActive(current), false)
  assert.equal(isSessionTurnActive({}), false)
})

test('global worker refreshes each active channel once per tick', async () => {
  const refreshed = []
  const sessions = [
    session('deepseek'),
    session('deepseek'),
    session('kimi'),
    session('zhipu', [{ type: 'turn/start' }, { type: 'turn/end' }]),
    session(undefined),
  ]
  const { refresher, timers } = harness({
    sessions,
    refresh: async channel => refreshed.push(channel),
  })

  refresher.start()
  refresher.start()
  await new Promise(resolve => setImmediate(resolve))

  assert.equal(timers.size, 1)
  assert.equal(timers.get(1).interval, ACTIVE_REFRESH_INTERVAL_MS)
  assert.deepEqual(refreshed.sort(), ['deepseek', 'kimi'])
})

test('global worker does not overlap reconciliation ticks', async () => {
  let calls = 0
  let release
  const { refresher, timers } = harness({
    sessions: [session('deepseek')],
    refresh: () => {
      calls += 1
      return new Promise(resolve => {
        release = resolve
      })
    },
  })

  refresher.start()
  await new Promise(resolve => setImmediate(resolve))
  timers.get(1).callback()
  timers.get(1).callback()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(calls, 1)

  release()
  await new Promise(resolve => setImmediate(resolve))
  timers.get(1).callback()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(calls, 2)

  release()
})

test('a failed tick is contained and the next tick can recover', async () => {
  let attempts = 0
  const errors = []
  const { refresher, timers } = harness({
    sessions: [session('deepseek')],
    refresh: async () => {
      attempts += 1
      if (attempts === 1) throw new Error('failed')
    },
    onError: error => errors.push(error.message),
  })

  refresher.start()
  await new Promise(resolve => setImmediate(resolve))
  timers.get(1).callback()
  await new Promise(resolve => setImmediate(resolve))

  assert.equal(attempts, 2)
  assert.deepEqual(errors, ['failed'])
})

test('one invalid session does not block other active channels', async () => {
  const refreshed = []
  const errors = []
  const invalid = {
    snapshotEvents() {
      throw new Error('invalid session')
    },
  }
  const { refresher } = harness({
    sessions: [invalid, session('kimi')],
    refresh: async channel => refreshed.push(channel),
    onError: error => errors.push(error.message),
  })

  refresher.start()
  await new Promise(resolve => setImmediate(resolve))

  assert.deepEqual(refreshed, ['kimi'])
  assert.deepEqual(errors, ['invalid session'])
})

test('dispose stops the global worker', async () => {
  let calls = 0
  const { refresher, timers, cleared } = harness({
    sessions: [session('deepseek')],
    refresh: async () => {
      calls += 1
    },
  })

  refresher.start()
  const tick = timers.get(1).callback
  await new Promise(resolve => setImmediate(resolve))
  refresher.dispose()
  tick()
  await new Promise(resolve => setImmediate(resolve))

  assert.equal(calls, 1)
  assert.equal(timers.size, 0)
  assert.deepEqual(cleared, [1])
})

test('dispose cancels a queued initial reconciliation', async () => {
  let calls = 0
  const { refresher } = harness({
    sessions: [session('deepseek')],
    refresh: async () => {
      calls += 1
    },
  })

  refresher.start()
  refresher.dispose()
  await new Promise(resolve => setImmediate(resolve))

  assert.equal(calls, 0)
})
