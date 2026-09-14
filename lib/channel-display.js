export function popupChannels(channels, order) {
  const byId = new Map(
    (Array.isArray(channels) ? channels : []).map(channel => [channel.id, channel]),
  )
  return (Array.isArray(order) ? order : [])
    .map(id => byId.get(id))
    .filter(channel => channel?.credential?.configured === true)
}
