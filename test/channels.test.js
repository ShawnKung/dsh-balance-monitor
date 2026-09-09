import assert from 'node:assert/strict'
import test from 'node:test'
import { deepseekChannel } from '../channels/deepseek.js'
import { kimiChannel } from '../channels/kimi.js'
import { teamoChannel } from '../channels/teamo.js'

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

test('DeepSeek adapter maps official balance fields', async () => {
  const result = await deepseekChannel.fetch({
    apiKey: 'secret',
    fetchImpl: async (_url, options) => {
      assert.equal(options.headers.Authorization, 'Bearer secret')
      return json({
        is_available: true,
        balance_infos: [{
          currency: 'CNY',
          total_balance: '12.34',
          topped_up_balance: '10',
          granted_balance: '2.34',
        }],
      })
    },
  })

  assert.equal(result.currency, 'CNY')
  assert.equal(result.balance, 12.34)
  assert.equal(result.detail.length, 4)
})

test('Teamo adapter combines balance, costs, and token usage', async () => {
  const paths = []
  const result = await teamoChannel.fetch({
    apiKey: 'secret',
    config: { teamoBaseUrl: 'https://teamorouter.cn', teamoRangeDays: 7 },
    fetchImpl: async (url, options) => {
      paths.push(url.pathname)
      assert.equal(options.headers.Authorization, 'Bearer secret')
      if (url.pathname === '/v1/billing/balance') {
        return json({ balance: { currency: 'USD', value: '23.50' } })
      }
      if (url.pathname === '/v1/billing/costs') {
        return json({ total_amount: { value: '1.25' }, requests: 4 })
      }
      return json({
        usage: {
          total_tokens: 1_500_000,
          input_tokens: 1_000_000,
          cached_read_tokens: 500_000,
          output_tokens: 500_000,
        },
        requests: 4,
      })
    },
  })

  assert.equal(result.currency, 'USD')
  assert.equal(result.balance, 23.5)
  assert.deepEqual(paths, [
    '/v1/billing/balance',
    '/v1/billing/costs',
    '/v1/billing/costs',
    '/v1/usage',
  ])
  assert.equal(result.periods.length, 2)
  assert.equal(result.periods[0].cost, '$1.25')
  assert.equal(result.detail[0].value, '$23.50')
  assert.equal(result.detail.length, 4)
})

test('Kimi adapter maps Moonshot CN balance fields', async () => {
  const result = await kimiChannel.fetch({
    apiKey: 'secret',
    fetchImpl: async (url, options) => {
      assert.equal(String(url), 'https://api.moonshot.cn/v1/users/me/balance')
      assert.equal(options.headers.Authorization, 'Bearer secret')
      return json({
        code: 0,
        status: true,
        data: {
          available_balance: 41.71543,
          cash_balance: 40,
          voucher_balance: 1.71543,
        },
      })
    },
  })

  assert.equal(result.currency, 'CNY')
  assert.equal(result.balance, 41.71543)
  assert.equal(result.detail.length, 3)
  assert.equal(result.detail[0].value, '¥41.71543')
})
