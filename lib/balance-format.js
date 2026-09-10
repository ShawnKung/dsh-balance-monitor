export const BALANCE_PRECISIONS = Object.freeze([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  'exact',
])

const PRECISIONS = new Set(BALANCE_PRECISIONS)

export function normalizeBalancePrecision(value) {
  return PRECISIONS.has(value) ? value : '2'
}

function exactMoney(value, currency) {
  const raw = String(value)
  if (!Number.isFinite(Number(raw))) return '--'

  if (currency === 'USD') return `$${raw}`
  if (currency === 'CNY') return `¥${raw}`

  try {
    const symbol = new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(0).find(part => part.type === 'currency')?.value
    return `${symbol || currency}${raw}`
  } catch {
    return `${raw} ${currency}`.trim()
  }
}

export function formatMoney(
  value,
  currency = 'CNY',
  precision = 'exact',
  rawValue = value,
) {
  if (value === undefined || value === null || value === '') return '--'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '--'

  const normalized = normalizeBalancePrecision(precision)
  const code = String(currency || 'CNY').toUpperCase()
  if (normalized === 'exact') return exactMoney(rawValue, code)

  const digits = Number(normalized)
  const fractionDigits = {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }
  try {
    if (code === 'USD') {
      return `$${new Intl.NumberFormat('zh-CN', fractionDigits).format(amount)}`
    }
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: code,
      ...fractionDigits,
    }).format(amount)
  } catch {
    const formatted = new Intl.NumberFormat('zh-CN', fractionDigits).format(amount)
    return `${formatted} ${code}`.trim()
  }
}
