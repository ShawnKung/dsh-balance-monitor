import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatMoney,
  normalizeBalancePrecision,
} from '../lib/balance-format.js'

test('balance precision supports exact and fixed fraction digits', () => {
  assert.equal(formatMoney(12.34567, 'USD', 'exact'), '$12.34567')
  assert.equal(formatMoney(12.3, 'USD', 'exact', '12.3000'), '$12.3000')
  assert.equal(formatMoney(12.34567, 'USD', '2'), '$12.35')
  assert.equal(formatMoney(12.34567, 'USD', '1'), '$12.3')
  assert.equal(formatMoney(12.34567, 'USD', '0'), '$12')
  assert.equal(formatMoney(12.3456789, 'USD', '6'), '$12.345679')
})

test('balance formatting preserves currency and handles missing values', () => {
  assert.equal(formatMoney(92.246524285, 'CNY', '2'), '¥92.25')
  assert.equal(formatMoney(undefined, 'CNY', 'exact'), '--')
  assert.equal(formatMoney(null, 'CNY', 'exact'), '--')
})

test('unknown balance precision preserves the source value', () => {
  assert.equal(normalizeBalancePrecision('unexpected'), 'exact')
  assert.equal(formatMoney(12.345, 'USD', 'unexpected'), '$12.345')
})
