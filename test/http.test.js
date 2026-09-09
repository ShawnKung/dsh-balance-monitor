import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import test from 'node:test'
import { createRoutes } from '../lib/http.js'

function request(body) {
  const req = new EventEmitter()
  req.method = 'POST'
  req.headers = { host: '127.0.0.1:3080' }
  req.socket = { remoteAddress: '127.0.0.1' }
  queueMicrotask(() => {
    req.emit('data', Buffer.from(JSON.stringify(body)))
    req.emit('end')
  })
  return req
}

function response() {
  return {
    status: null,
    payload: null,
    writeHead(status) {
      this.status = status
    },
    end(body) {
      this.payload = JSON.parse(body)
    },
  }
}

function refreshRoute(service, updater) {
  return createRoutes(service, updater)
    .find(route => route.path === '/api/dsh-balance-monitor/refresh')
}

function credentialRoute(service) {
  return createRoutes(service, {})
    .find(route => route.path === '/api/dsh-balance-monitor/credential')
}

test('refreshing all channels also forces an update check', async () => {
  const calls = []
  const service = {
    async refreshAll() {
      calls.push('balances')
      return { revision: 2, channels: [] }
    },
  }
  const updater = {
    async check(options) {
      calls.push(['updates', options])
    },
  }
  const res = response()

  await refreshRoute(service, updater).handler(request({}), res)

  assert.deepEqual(calls, ['balances', ['updates', { force: true }]])
  assert.equal(res.status, 200)
  assert.equal(res.payload.revision, 2)
})

test('refreshing one channel does not check for plugin updates', async () => {
  let updateChecks = 0
  const service = {
    async refresh(channel) {
      assert.equal(channel, 'deepseek')
    },
    snapshot() {
      return { revision: 3, channels: [] }
    },
  }
  const updater = {
    async check() {
      updateChecks += 1
    },
  }
  const res = response()

  await refreshRoute(service, updater).handler(request({ channel: 'deepseek' }), res)

  assert.equal(updateChecks, 0)
  assert.equal(res.status, 200)
  assert.equal(res.payload.revision, 3)
})

test('credential writes are addressed by channel and return the refreshed snapshot', async () => {
  const calls = []
  const service = {
    async setUserCredential(channel, value) {
      calls.push(['set', channel, value])
    },
    async unsetUserCredential(channel) {
      calls.push(['unset', channel])
    },
    snapshot() {
      return { revision: calls.length, channels: [] }
    },
  }

  const setResponse = response()
  await credentialRoute(service).handler(request({
    action: 'set',
    channel: 'teamo',
    value: 'secret',
  }), setResponse)

  const unsetResponse = response()
  await credentialRoute(service).handler(request({
    action: 'unset',
    channel: 'teamo',
  }), unsetResponse)

  assert.deepEqual(calls, [
    ['set', 'teamo', 'secret'],
    ['unset', 'teamo'],
  ])
  assert.equal(setResponse.payload.revision, 1)
  assert.equal(unsetResponse.payload.revision, 2)
})
