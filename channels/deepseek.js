const BALANCE_URL = 'https://api.deepseek.com/user/balance'

function amount(currency, value) {
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

function pickBalance(infos) {
  if (!Array.isArray(infos) || infos.length === 0) return undefined
  return infos.find(item => Number(item?.total_balance) > 0)
    ?? infos.find(item => item?.currency === 'CNY')
    ?? infos[0]
}

export const deepseekChannel = {
  id: 'deepseek',
  label: 'DeepSeek 官方',
  credentialRef(config) {
    return config.deepseekApiKeyRef
  },
  environmentRefs() {
    return ['DEEPSEEK_API_KEY']
  },
  credentialEndpoint() {
    return BALANCE_URL
  },
  async fetch({ apiKey, fetchImpl = fetch }) {
    const response = await fetchImpl(BALANCE_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) throw new Error(`余额接口返回 HTTP ${response.status}`)

    const body = await response.json()
    const info = pickBalance(body?.balance_infos)
    if (info?.total_balance === undefined) throw new Error('余额接口返回结构异常')

    const currency = String(info.currency || 'CNY').toUpperCase()
    const balance = Number(info.total_balance)
    if (!Number.isFinite(balance)) throw new Error('余额不是有效数字')

    return {
      currency,
      balance,
      balanceRaw: info.total_balance,
      detail: [
        {
          label: '账户总余额',
          value: amount(currency, info.total_balance),
          amount: Number(info.total_balance),
          rawAmount: info.total_balance,
          currency,
        },
        {
          label: '充值余额',
          value: amount(currency, info.topped_up_balance),
          amount: Number(info.topped_up_balance),
          rawAmount: info.topped_up_balance,
          currency,
        },
        {
          label: '赠送余额',
          value: amount(currency, info.granted_balance),
          amount: Number(info.granted_balance),
          rawAmount: info.granted_balance,
          currency,
        },
        { label: '账户状态', value: body?.is_available ? '可用' : '不可用' },
      ],
      periods: [],
      note: '官方接口仅提供账户余额。',
    }
  },
}
