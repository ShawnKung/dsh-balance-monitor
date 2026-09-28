import assert from 'node:assert/strict'
import test from 'node:test'

import { popupChannels, selectedSidebarChannels } from '../lib/channel-display.js'

test('popup shows configured channels in the user-defined order', () => {
  const channels = [
    { id: 'deepseek', status: 'ready', credential: { configured: true } },
    { id: 'kimi', status: 'unconfigured', credential: { configured: false } },
    { id: 'zhipu', status: 'error', credential: { configured: true } },
    { id: 'teamo', status: 'idle' },
  ]

  assert.deepEqual(
    popupChannels(channels, ['zhipu', 'teamo', 'deepseek', 'kimi'])
      .map(channel => channel.id),
    ['zhipu', 'deepseek'],
  )
})

test('popup has no channels when no credential is configured', () => {
  assert.deepEqual(
    popupChannels([
      { id: 'deepseek', credential: { configured: false } },
      { id: 'kimi' },
    ], ['kimi', 'deepseek']),
    [],
  )
})

test('sidebar shows only selected channels in the user-defined order', () => {
  const channels = [
    { id: 'deepseek', balance: 12 },
    { id: 'kimi', balance: 34 },
    { id: 'zhipu', balance: 56 },
  ]

  assert.deepEqual(
    selectedSidebarChannels(
      channels,
      ['deepseek', 'zhipu'],
      ['zhipu', 'kimi', 'deepseek', 'teamo'],
    ).map(channel => channel.id),
    ['zhipu', 'deepseek'],
  )
})

test('sidebar retains a selected channel before its first balance snapshot', () => {
  assert.deepEqual(
    selectedSidebarChannels([], ['deepseek'], ['deepseek']),
    [{ id: 'deepseek', status: 'unconfigured' }],
  )
})
