import assert from 'node:assert/strict'
import test from 'node:test'

import { popupChannels } from '../lib/channel-display.js'

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
