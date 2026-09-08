import { deepseekChannel } from './deepseek.js'
import { teamoChannel } from './teamo.js'

export const channels = Object.freeze([deepseekChannel, teamoChannel])

export function channelById(id) {
  return channels.find(channel => channel.id === id)
}
