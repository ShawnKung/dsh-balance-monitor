export function popupChannels(channels, order) {
  const byId = new Map(
    (Array.isArray(channels) ? channels : []).map(channel => [channel.id, channel]),
  )
  return (Array.isArray(order) ? order : [])
    .map(id => byId.get(id))
    .filter(channel => channel?.credential?.configured === true)
}

export function selectedSidebarChannels(channels, selected, order) {
  const byId = new Map(
    (Array.isArray(channels) ? channels : []).map(channel => [channel.id, channel]),
  )
  const selectedIds = new Set(Array.isArray(selected) ? selected : [])
  return (Array.isArray(order) ? order : [])
    .filter(id => selectedIds.has(id))
    .map(id => byId.get(id) ?? { id, status: 'unconfigured' })
}
