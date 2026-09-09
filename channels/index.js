import { deepseekChannel } from './deepseek.js'
import { kimiChannel } from './kimi.js'
import { teamoChannel } from './teamo.js'
import { zhipuChannel } from './zhipu.js'

export const channels = Object.freeze([
  deepseekChannel,
  kimiChannel,
  zhipuChannel,
  teamoChannel,
])

export function channelById(id) {
  return channels.find(channel => channel.id === id)
}
