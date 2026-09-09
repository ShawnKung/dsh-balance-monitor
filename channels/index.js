import { deepseekChannel } from './deepseek.js'
import { kimiChannel } from './kimi.js'
import { teamoChannel } from './teamo.js'

export const channels = Object.freeze([deepseekChannel, teamoChannel, kimiChannel])

export function channelById(id) {
  return channels.find(channel => channel.id === id)
}
