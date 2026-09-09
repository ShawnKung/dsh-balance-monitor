const BALANCE_URL =
  'https://www.bigmodel.cn/api/biz/account/query-customer-account-report'

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

export const zhipuChannel = {
  id: 'zhipu',
  label: '智谱 GLM',
  credentialRef(config) {
    return config.zhipuApiKeyRef
  },
  environmentRefs() {
    return ['ZAI_API_KEY']
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
    if (body?.success !== true || Number(body?.code) !== 200) {
      throw new Error(body?.message || body?.msg || '余额接口返回失败')
    }

    const data = body?.data
    const balance = Number(data?.availableBalance ?? data?.balance)
    if (!Number.isFinite(balance)) throw new Error('余额不是有效数字')

    return {
      currency: 'CNY',
      balance,
      detail: [
        { label: '可用余额', value: money(balance) },
        { label: '充值余额', value: money(data?.rechargeAmount) },
        { label: '赠金余额', value: money(data?.giveAmount) },
        { label: '今日消费', value: money(data?.todaySpendAmount) },
        { label: '累计消费', value: money(data?.totalSpendAmount) },
      ],
      periods: [],
      note: '智谱按量账户余额。',
    }
  },
}
