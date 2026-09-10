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
    const balanceRaw = data?.availableBalance ?? data?.balance
    const balance = Number(balanceRaw)
    if (!Number.isFinite(balance)) throw new Error('余额不是有效数字')

    return {
      currency: 'CNY',
      balance,
      balanceRaw,
      detail: [
        {
          label: '可用余额',
          value: money(balance),
          amount: balance,
          rawAmount: balanceRaw,
          currency: 'CNY',
        },
        {
          label: '充值余额',
          value: money(data?.rechargeAmount),
          amount: Number(data?.rechargeAmount),
          rawAmount: data?.rechargeAmount,
          currency: 'CNY',
        },
        {
          label: '赠金余额',
          value: money(data?.giveAmount),
          amount: Number(data?.giveAmount),
          rawAmount: data?.giveAmount,
          currency: 'CNY',
        },
        {
          label: '今日消费',
          value: money(data?.todaySpendAmount),
          amount: Number(data?.todaySpendAmount),
          rawAmount: data?.todaySpendAmount,
          currency: 'CNY',
        },
        {
          label: '累计消费',
          value: money(data?.totalSpendAmount),
          amount: Number(data?.totalSpendAmount),
          rawAmount: data?.totalSpendAmount,
          currency: 'CNY',
        },
      ],
      periods: [],
      note: '智谱按量账户余额。',
    }
  },
}
