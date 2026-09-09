const BALANCE_URL = 'https://api.moonshot.cn/v1/users/me/balance'

function money(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '--'
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(number)
}

export const kimiChannel = {
  id: 'kimi',
  label: 'Kimi 官方',
  credentialRef(config) {
    return config.kimiApiKeyRef
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
    if (body?.status !== true || Number(body?.code) !== 0) {
      throw new Error(body?.message || '余额接口返回失败')
    }

    const data = body?.data
    const balance = Number(data?.available_balance)
    if (!Number.isFinite(balance)) throw new Error('余额不是有效数字')

    return {
      currency: 'CNY',
      balance,
      detail: [
        { label: '可用余额', value: money(data.available_balance) },
        { label: '现金余额', value: money(data.cash_balance) },
        { label: '赠金余额', value: money(data.voucher_balance) },
      ],
      periods: [],
      note: '官方 CN 接口仅提供账户余额。',
    }
  },
}
