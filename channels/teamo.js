function dayStart(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(0, 0, 0, 0)
  return Math.floor(date.getTime() / 1000)
}

function money(currency, value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '--'
  if (currency === 'USD') {
    return `$${new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(number)}`
  }
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(number)
}

function tokens(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '--'
  return new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

async function getJson(baseUrl, path, apiKey, fetchImpl) {
  const response = await fetchImpl(new URL(path, `${baseUrl.replace(/\/+$/, '')}/`), {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`接口返回 HTTP ${response.status}`)
  return response.json()
}

export const teamoChannel = {
  id: 'teamo',
  label: 'TeamoRouter',
  credentialRef(config) {
    return config.teamoApiKeyRef
  },
  credentialEndpoint(config) {
    return config.teamoBaseUrl
  },
  async fetch({ apiKey, config, fetchImpl = fetch }) {
    const baseUrl = config.teamoBaseUrl
    const now = Math.floor(Date.now() / 1000)
    const days = Math.max(2, Math.min(90, Number(config.teamoRangeDays) || 7))
    const balanceBody = await getJson(baseUrl, '/v1/billing/balance', apiKey, fetchImpl)
    if (balanceBody?.balance?.value === undefined) throw new Error('余额接口返回结构异常')

    const currency = String(balanceBody.balance.currency || 'USD').toUpperCase()
    const balance = Number(balanceBody.balance.value)
    if (!Number.isFinite(balance)) throw new Error('余额不是有效数字')

    const paths = [
      `/v1/billing/costs?start_time=${dayStart(1)}&end_time=${now}`,
      `/v1/billing/costs?start_time=${dayStart(days)}&end_time=${now}`,
      `/v1/usage?start_time=${dayStart(days)}&end_time=${now}`,
    ]
    const [today, range, usage] = await Promise.allSettled(
      paths.map(path => getJson(baseUrl, path, apiKey, fetchImpl)),
    )
    const detail = [{ label: '账户余额', value: money(currency, balance) }]
    const periods = []

    for (const [label, result] of [['今日', today], [`近 ${days} 天`, range]]) {
      if (result.status === 'fulfilled' && result.value?.total_amount?.value !== undefined) {
        periods.push({
          label,
          cost: money(currency, result.value.total_amount.value),
          requests: Number(result.value.requests) || 0,
        })
      } else {
        detail.push({
          label: `${label}账单`,
          value: result.status === 'rejected' ? result.reason.message : '无数据',
          tone: 'error',
        })
      }
    }

    if (usage.status === 'fulfilled' && usage.value?.usage) {
      const value = usage.value.usage
      const input = Number(value.input_tokens) || 0
      const cached = Number(value.cached_read_tokens) || 0
      detail.push(
        { label: `近 ${days} 天总 Token`, value: tokens(value.total_tokens) },
        { label: '输入 / 输出', value: `${tokens(input)} / ${tokens(value.output_tokens)}` },
        {
          label: '缓存命中',
          value: `${tokens(cached)}${input ? ` (${Math.round(cached / input * 100)}%)` : ''}`,
        },
      )
    } else {
      detail.push({
        label: `近 ${days} 天用量`,
        value: usage.status === 'rejected' ? usage.reason.message : '无数据',
        tone: 'error',
      })
    }

    return { currency, balance, detail, periods }
  },
}
