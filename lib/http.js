const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

function isLoopback(address) {
  if (!address) return false
  return address === '::1'
    || address === '127.0.0.1'
    || address.startsWith('127.')
    || address.startsWith('::ffff:127.')
}

function sameOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return true
  const host = req.headers.host
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function trusted(req) {
  return isLoopback(req.socket?.remoteAddress) && sameOrigin(req)
}

function writeJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, { ...JSON_HEADERS, 'Content-Length': Buffer.byteLength(body) })
  res.end(body)
}

function readJson(req, limit = 4096) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', chunk => {
      size += chunk.length
      if (size > limit) {
        reject(new Error('请求体过大'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8')
        resolve(text ? JSON.parse(text) : {})
      } catch {
        reject(new Error('JSON 格式无效'))
      }
    })
    req.on('error', reject)
  })
}

export function createRoutes(service, updater) {
  const guard = (req, res) => {
    if (trusted(req)) return true
    writeJson(res, 403, { ok: false, error: 'forbidden' })
    return false
  }

  return [
    {
      kind: 'exact',
      path: '/api/dsh-balance-monitor/state',
      handler(req, res) {
        if (req.method !== 'GET') {
          writeJson(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        if (!guard(req, res)) return
        writeJson(res, 200, { ok: true, ...service.snapshot() })
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-balance-monitor/refresh',
      async handler(req, res) {
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        if (!guard(req, res)) return
        try {
          const body = await readJson(req)
          let snapshot
          if (body.channel) {
            await service.refresh(String(body.channel))
            snapshot = service.snapshot()
          } else {
            [snapshot] = await Promise.all([
              service.refreshAll(),
              updater.check({ force: true }),
            ])
          }
          writeJson(res, 200, { ok: true, ...snapshot })
        } catch (error) {
          writeJson(res, 400, {
            ok: false,
            error: String(error?.message ?? error).slice(0, 240),
          })
        }
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-balance-monitor/credential',
      async handler(req, res) {
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        if (!guard(req, res)) return
        try {
          const body = await readJson(req)
          const channel = String(body.channel ?? '')
          if (body.action === 'set') {
            await service.setUserCredential(channel, body.value)
          } else if (body.action === 'unset') {
            await service.unsetUserCredential(channel)
          } else {
            throw new Error('未知凭据操作')
          }
          writeJson(res, 200, { ok: true, ...service.snapshot() })
        } catch (error) {
          writeJson(res, 400, {
            ok: false,
            error: String(error?.message ?? error).slice(0, 240),
          })
        }
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-balance-monitor/events',
      handler(req, res) {
        if (req.method !== 'GET') {
          writeJson(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        if (!guard(req, res)) return
        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        })
        res.flushHeaders?.()
        const send = (snapshot, channel = null) => {
          res.write(`data: ${JSON.stringify({ snapshot, channel })}\n\n`)
        }
        send(service.snapshot())
        const unsubscribe = service.subscribe(send)
        const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25_000)
        req.on('close', () => {
          clearInterval(heartbeat)
          unsubscribe()
        })
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-balance-monitor/update/events',
      handler(req, res) {
        if (req.method !== 'GET') {
          writeJson(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        if (!guard(req, res)) return
        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        })
        res.flushHeaders?.()
        const send = snapshot => {
          res.write(`data: ${JSON.stringify({ ok: true, ...snapshot })}\n\n`)
        }
        send(updater.snapshot())
        const unsubscribe = updater.subscribe(send)
        const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25_000)
        req.on('close', () => {
          clearInterval(heartbeat)
          unsubscribe()
        })
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-balance-monitor/update',
      async handler(req, res) {
        if (req.method !== 'GET' && req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        if (!guard(req, res)) return
        try {
          if (req.method === 'GET') {
            writeJson(res, 200, { ok: true, ...updater.snapshot() })
            return
          }
          const body = await readJson(req)
          if (body.action === 'check') {
            writeJson(res, 200, { ok: true, ...await updater.check() })
            return
          }
          if (body.action === 'install') {
            writeJson(res, 200, { ok: true, ...await updater.install() })
            return
          }
          writeJson(res, 400, { ok: false, error: 'unknown-action' })
        } catch (error) {
          writeJson(res, 500, {
            ok: false,
            error: String(error?.message ?? error).slice(0, 320),
          })
        }
      },
    },
  ]
}
