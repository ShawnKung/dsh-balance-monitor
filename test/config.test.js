import assert from 'node:assert/strict'
import test from 'node:test'
import { balanceSourceSignature, Config } from '../index.js'

test('sidebar defaults to DeepSeek only', () => {
  assert.deepEqual(Config({}).sidebarChannels, ['deepseek'])
})

test('presentation settings do not change the balance source signature', () => {
  const base = balanceSourceSignature()
  const presentationOnly = balanceSourceSignature({
    showSidebar: false,
    balancePrecision: '0',
    sidebarChannels: ['kimi'],
    channelOrder: ['zhipu', 'kimi', 'teamo', 'deepseek'],
  })

  assert.equal(presentationOnly, base)
})

test('channel data settings change the balance source signature', () => {
  const base = balanceSourceSignature()

  assert.notEqual(
    balanceSourceSignature({ deepseekApiKeyRef: 'CUSTOM_DEEPSEEK_KEY' }),
    base,
  )
  assert.notEqual(
    balanceSourceSignature({ teamoRangeDays: 30 }),
    base,
  )
  assert.notEqual(
    balanceSourceSignature({ zhipuApiKeyRef: 'CUSTOM_ZHIPU_KEY' }),
    base,
  )
})
