import React, { useEffect, useSyncExternalStore, useState } from 'react'
import { createUpdateStore } from './update-store.js'

export const inject = ['slots', 'settingsScope', 'remote', 'remote.credentials']

const NS = 'dsh-balance-monitor'
const VERSION = __DSH_BALANCE_MONITOR_VERSION_LABEL__
const FEEDBACK_DURATION_MS = 2_400
const MAX_SIDEBAR_CHANNELS = 3
const CHANNEL_OPTIONS = Object.freeze([
  { id: 'deepseek', label: 'DeepSeek 官方' },
  { id: 'teamo', label: 'TeamoRouter' },
])
const WALLET_ICON = '<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4.75h10.25a.75.75 0 0 1 .75.75v7a1 1 0 0 1-1 1h-9a1.5 1.5 0 0 1-1.5-1.5V4a1.5 1.5 0 0 1 1.5-1.5h8"/><path d="M10.25 8h3.25v2.5h-3.25a1.25 1.25 0 0 1 0-2.5Z"/></svg>'
const REFRESH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"/></svg>'
const CLOSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg>'

const STYLE = `
body{--bm-feedback-success:#15803d;--bm-feedback-error:var(--dsw-alias-state-error-primary,#dc2626)}
body[data-ds-dark-theme]{--bm-feedback-success:var(--dsw-alias-state-success-primary,#22c55e);--bm-feedback-error:var(--dsw-alias-state-error-primary,#f25a5a)}
[data-dsh-balance-monitor-entry]{box-sizing:border-box;width:100%;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#d6d9df);display:flex;align-items:center;gap:8px;min-height:36px;padding:5px 10px;cursor:pointer;font:inherit;text-align:left}
[data-dsh-balance-monitor-entry]:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#eef0f3)}[data-dsh-balance-monitor-entry][data-active]{background:var(--dsw-alias-interactive-bg-active,rgba(127,127,127,.16));color:var(--dsw-alias-label-primary,#eef0f3);font-weight:600}
[data-dsh-balance-monitor-entry] .bm-icon{width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;flex:none}
[data-dsh-balance-monitor-entry] .bm-icon svg{display:block;width:18px;height:18px}.bm-icon-button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-dsh-balance-monitor-entry] .bm-summary{display:grid;gap:1px;min-width:0;flex:1}
[data-dsh-balance-monitor-entry] .bm-line{display:flex;justify-content:space-between;gap:8px;min-width:0;font-size:12px;line-height:17px}
[data-dsh-balance-monitor-entry] .bm-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit}
[data-dsh-balance-monitor-entry] .bm-value{--bm-feedback-rest:var(--dsw-alias-label-secondary,#61666b);white-space:nowrap;font-variant-numeric:tabular-nums}[data-dsh-balance-monitor-entry]:hover .bm-value,[data-dsh-balance-monitor-entry][data-active] .bm-value{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115)}
[data-dsh-frame][data-sidebar-collapsed] [data-dsh-balance-monitor-entry],[data-sidebar-collapsed] [data-dsh-balance-monitor-entry]{justify-content:center;padding:0;width:36px;height:36px;min-height:36px;margin:0 auto 12px;border-radius:50%}
[data-dsh-frame][data-sidebar-collapsed] [data-dsh-balance-monitor-entry] .bm-summary,[data-sidebar-collapsed] [data-dsh-balance-monitor-entry] .bm-summary{display:none}
.bm-popover{position:fixed;z-index:10000;width:min(390px,calc(100vw - 24px));max-height:min(620px,calc(100vh - 24px));overflow:auto;border:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:8px;background:var(--dsw-alias-bg-layer-2,#fff);color:var(--dsw-alias-label-primary,#0f1115);box-shadow:var(--dsw-elevation-prominent,0 12px 32px rgba(0,0,0,.14));font-family:inherit}
.bm-popover[hidden]{display:none}.bm-popover-header{position:sticky;top:0;z-index:1;display:flex;align-items:center;padding:12px 14px;border-bottom:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.16));background:inherit}
.bm-popover-heading{display:flex;align-items:center;gap:6px;min-width:0;flex:1}.bm-popover-title{font-size:14px;font-weight:600}.bm-version{font-size:10px;font-weight:400;line-height:1;color:var(--dsw-alias-label-tertiary,#9ca3af);white-space:nowrap}.bm-update-pill{-webkit-appearance:none;appearance:none;box-sizing:border-box;height:20px;border:0;border-radius:5px;outline:0;background:#d09a00;box-shadow:none;color:#fff;padding:3px 8px;font:inherit;font-size:10px;font-weight:600;line-height:14px;white-space:nowrap}.bm-update-pill:not(span){cursor:pointer}.bm-update-pill:not(span):hover{background:#b98200}.bm-update-pill:focus-visible{outline:2px solid var(--dsw-alias-focus-ring,#4d6bfe);outline-offset:2px}.bm-update-pill:disabled{cursor:wait;opacity:.72}.bm-update-pill[data-state=restart-required]{background:#16803d}.bm-update-pill[data-state=error]{background:#b42318}.bm-actions{display:flex;gap:4px}.bm-icon-button{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115);width:30px;height:30px;border:0;border-radius:6px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
.bm-icon-button{transition:color .35s ease,background .12s ease}.bm-icon-button:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}.bm-icon-button:disabled{opacity:.45;cursor:default}.bm-spinning svg{animation:bm-spin 1.1s linear infinite}.bm-refresh-success{animation:bm-success-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-refresh-error{animation:bm-error-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-refresh-success svg,.bm-refresh-error svg{animation:bm-stroke-feedback 2.4s cubic-bezier(.4,0,.2,1)}
.bm-channel{padding:14px}.bm-channel+.bm-channel{border-top:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.16))}.bm-channel-head{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.bm-channel-name{font-size:13px;font-weight:600;flex:1}.bm-status{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-balance{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115);font-size:24px;line-height:1.2;font-weight:650;font-variant-numeric:tabular-nums;margin-bottom:12px}.bm-value-success,.bm-balance-success{animation:bm-success-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-value-error,.bm-balance-error{animation:bm-error-feedback 2.4s cubic-bezier(.4,0,.2,1)}
.bm-periods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:12px}.bm-period{padding:9px;background:var(--dsw-alias-bg-multi-select,rgba(127,127,127,.08));border-radius:6px}
.bm-period-label,.bm-detail-label{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-period-value{font-size:14px;font-weight:600;margin-top:3px}.bm-period-meta{font-size:10px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin-top:2px}
.bm-details{display:grid;gap:7px}.bm-detail{display:flex;justify-content:space-between;gap:14px;font-size:12px}.bm-detail-value{text-align:right;font-variant-numeric:tabular-nums}.bm-error{color:var(--dsw-alias-state-error-primary,#ef4444)}
.bm-note{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin-top:10px}.bm-empty{padding:16px;font-size:12px;color:var(--dsw-alias-label-tertiary,#9ca3af)}
.bm-settings{list-style:none;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:12px;background:var(--dsw-alias-bg-layer-3,transparent);color:inherit;transition:border-color .16s,background .16s}.bm-settings:hover{border-color:var(--dsw-alias-label-dimmed,rgba(127,127,127,.45))}.bm-settings[data-open=true]{background:var(--dsw-alias-bg-layer-2,transparent);border-color:var(--dsw-alias-label-dimmed,rgba(127,127,127,.45))}
.bm-settings-header{appearance:none;box-sizing:border-box;width:100%;border:0;border-radius:12px;background:transparent;color:inherit;display:flex;align-items:center;gap:12px;padding:14px 16px;text-align:left;font:inherit;cursor:pointer}.bm-settings-head{display:flex;flex:1;min-width:0;flex-direction:column;gap:4px}.bm-settings-title-row{display:flex;align-items:baseline;gap:6px;min-width:0}.bm-settings-title{font-size:15px;font-weight:600;line-height:1.4}.bm-settings-description{font-size:13px;line-height:1.5;color:var(--dsw-alias-label-secondary,#9ca3af)}.bm-chevron{width:14px;height:14px;flex:none;fill:none;stroke:currentColor;stroke-width:1.5;transition:transform .16s}.bm-settings[data-open=true] .bm-card-chevron,.bm-multi[data-open=true] .bm-chevron{transform:rotate(180deg)}.bm-settings-body{border-top:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.2));margin:0 16px;padding:4px 0 8px}.bm-settings-update{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0 2px;font-size:12px;color:var(--dsw-alias-label-secondary,#9ca3af)}
.bm-form{display:grid;gap:14px}.bm-field{display:grid;gap:6px;padding-top:8px}.bm-field label{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:550}.bm-field-row{display:flex;gap:8px;align-items:center}.bm-field input,.bm-field select{min-width:0;flex:1;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:0 10px;font:inherit;font-size:12px}
.bm-multi{position:relative}.bm-multi-trigger{box-sizing:border-box;width:100%;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:0 10px;display:flex;align-items:center;gap:8px;font:inherit;font-size:12px;cursor:pointer}.bm-multi-value{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.bm-multi-count{font-size:10px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-multi-menu{position:absolute;z-index:5;top:calc(100% + 5px);left:0;right:0;padding:5px;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:6px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3,#fff));box-shadow:var(--dsw-elevation-panel,0 8px 24px rgba(0,0,0,.14))}.bm-multi-option{display:flex!important;align-items:center;gap:8px;padding:7px 8px;border-radius:5px;font-weight:400!important;cursor:pointer}.bm-multi-option:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.1))}.bm-multi-option input{width:14px!important;height:14px!important;flex:none!important;margin:0}.bm-multi-option[data-disabled=true]{opacity:.45;cursor:default}
.bm-badge{font-size:10px;padding:2px 6px;border-radius:999px;background:var(--dsw-alias-bg-layer-2,rgba(127,127,127,.12));color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-badge[data-set=true]{color:var(--dsw-alias-state-success-primary,#22c55e)}
.bm-buttons{display:flex;justify-content:flex-end;gap:8px}.bm-button{height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.25));border-radius:6px;padding:0 12px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer}.bm-button-primary{background:var(--dsw-alias-button-info-fill,#2563eb);border-color:transparent;color:var(--dsw-alias-label-primary-foreground,#fff)}.bm-button:disabled{opacity:.5;cursor:default}.bm-message{font-size:11px}.bm-message[data-error=true]{color:var(--dsw-alias-state-error-primary,#ef4444)}
@keyframes bm-spin{to{transform:rotate(360deg)}}@keyframes bm-success-feedback{0%,100%{color:var(--bm-feedback-rest,var(--dsw-alias-label-primary,#eef0f3))}35%,65%{color:var(--bm-feedback-success)}}@keyframes bm-error-feedback{0%,100%{color:var(--bm-feedback-rest,var(--dsw-alias-label-primary,#eef0f3))}35%,65%{color:var(--bm-feedback-error)}}@keyframes bm-stroke-feedback{0%,100%{stroke-width:1.8}35%,65%{stroke-width:3}}`

function installStyle() {
  if (document.querySelector('style[data-dsh-balance-monitor-style]')) return
  const style = document.createElement('style')
  style.dataset.dshBalanceMonitorStyle = ''
  style.textContent = STYLE
  document.head.append(style)
}

function formatBalance(channel) {
  if (channel.status === 'unconfigured') return '未配置'
  if (channel.status === 'loading' && channel.balance === undefined) return '加载中'
  if (channel.balance === undefined) return '--'
  try {
    if (channel.currency === 'USD') {
      return `$${new Intl.NumberFormat('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(channel.balance)}`
    }
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: channel.currency || 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(channel.balance)
  } catch {
    return `${channel.balance} ${channel.currency || ''}`.trim()
  }
}

async function api(path, options) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
  })
  const body = await response.json()
  if (!response.ok || !body.ok) throw new Error(body.error || `HTTP ${response.status}`)
  return body
}

const updateStore = createUpdateStore({
  currentVersion: VERSION,
  request: action => api('/api/dsh-balance-monitor/update', {
    method: 'POST',
    body: JSON.stringify({ action }),
  }),
})

function updatePresentation(update) {
  if (update.status === 'restart-required') {
    return { label: '重启后生效', state: 'restart-required', disabled: true }
  }
  if (update.status === 'updating') {
    return { label: '正在更新', state: 'updating', disabled: true }
  }
  if (update.status === 'error' && update.updateAvailable) {
    return {
      label: '更新失败',
      state: 'error',
      disabled: false,
      title: update.error || '点击重试',
    }
  }
  if (update.status === 'available') {
    return {
      label: '发现新版本',
      state: 'available',
      disabled: false,
      title: update.error || `更新至 v${update.latestVersion}`,
    }
  }
  return undefined
}

function updateButton(update) {
  const presentation = updatePresentation(update)
  if (!presentation) return undefined
  const control = document.createElement(
    presentation.state === 'restart-required' ? 'span' : 'button',
  )
  control.className = 'bm-update-pill'
  control.dataset.state = presentation.state
  control.textContent = presentation.label
  control.title = presentation.title ?? presentation.label
  if (control instanceof HTMLButtonElement) {
    control.type = 'button'
    control.disabled = presentation.disabled
    control.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      void updateStore.install()
    })
  }
  return control
}

function sidebarRoot() {
  const column = document.querySelector('[data-pane="sidebar"], [class*="sidebarCol"]')
  if (!column) return undefined
  return column.querySelector('[class*="logoRow"]')?.parentElement
    ?? column.firstElementChild
    ?? undefined
}

function newSessionRow(root) {
  const button = root.querySelector('button[class*="newSession"]')
  if (!button) return undefined
  const row = button.closest('[class*="logoRow"]')
  return row?.parentElement === root ? row : button
}

function placeEntry(root, entry) {
  const base = newSessionRow(root)
  if (!base) return false
  if (entry.parentElement === root) return true
  const siblings = Array.from(root.children).filter(element => element.matches(
    '[data-dsh-taskboard-entry],[data-dsh-ssh-entry],[data-dsh-better-sidebar-entry],[data-dsh-balance-monitor-entry]',
  ))
  const anchor = siblings.length ? siblings.at(-1).nextElementSibling : base.nextElementSibling
  root.insertBefore(entry, anchor)
  return true
}

function setButtonIcon(button, icon) {
  button.innerHTML = icon
}

function iconButton(icon, label, action) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'bm-icon-button'
  button.title = label
  button.setAttribute('aria-label', label)
  setButtonIcon(button, icon)
  button.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()
    action(event)
  })
  return button
}

function detailRow(item) {
  const row = document.createElement('div')
  row.className = 'bm-detail'
  const label = document.createElement('span')
  label.className = 'bm-detail-label'
  label.textContent = item.label
  const value = document.createElement('span')
  value.className = `bm-detail-value${item.tone === 'error' ? ' bm-error' : ''}`
  value.textContent = item.value
  row.append(label, value)
  return row
}

function channelView(channel, refresh, feedback, loading) {
  const section = document.createElement('section')
  section.className = 'bm-channel'
  const header = document.createElement('div')
  header.className = 'bm-channel-head'
  const name = document.createElement('span')
  name.className = 'bm-channel-name'
  name.textContent = channel.label
  const status = document.createElement('span')
  status.className = `bm-status${channel.status === 'error' ? ' bm-error' : ''}`
  status.textContent = channel.status === 'error'
    ? '刷新失败'
    : channel.updatedAt
      ? new Date(channel.updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      : ''
  const refreshButton = iconButton(REFRESH_ICON, `刷新 ${channel.label}`, refresh)
  refreshButton.disabled = loading || channel.status === 'loading'
  if (loading || channel.status === 'loading') refreshButton.classList.add('bm-spinning')
  if (feedback) refreshButton.classList.add(`bm-refresh-${feedback}`)
  header.append(name, status, refreshButton)
  section.append(header)

  if (channel.status === 'unconfigured') {
    const empty = document.createElement('div')
    empty.className = 'bm-empty'
    empty.textContent = '尚未配置 API Key'
    section.append(empty)
    return section
  }

  if (channel.balance !== undefined) {
    const balance = document.createElement('div')
    balance.className = `bm-balance${feedback ? ` bm-balance-${feedback}` : ''}`
    balance.textContent = formatBalance(channel)
    section.append(balance)
  }

  if (channel.periods?.length) {
    const periods = document.createElement('div')
    periods.className = 'bm-periods'
    for (const item of channel.periods) {
      const box = document.createElement('div')
      box.className = 'bm-period'
      const label = document.createElement('div')
      label.className = 'bm-period-label'
      label.textContent = item.label
      const value = document.createElement('div')
      value.className = 'bm-period-value'
      value.textContent = item.cost
      const meta = document.createElement('div')
      meta.className = 'bm-period-meta'
      meta.textContent = `${item.requests} 次请求`
      box.append(label, value, meta)
      periods.append(box)
    }
    section.append(periods)
  }

  if (channel.detail?.length) {
    const details = document.createElement('div')
    details.className = 'bm-details'
    for (const item of channel.detail) details.append(detailRow(item))
    section.append(details)
  }

  if (channel.error) section.append(detailRow({ label: '错误', value: channel.error, tone: 'error' }))
  if (channel.note) {
    const note = document.createElement('div')
    note.className = 'bm-note'
    note.textContent = channel.note
    section.append(note)
  }
  return section
}

function mountMonitor(scope) {
  installStyle()
  const entry = document.createElement('button')
  entry.type = 'button'
  entry.dataset.dshBalanceMonitorEntry = ''
  entry.dataset.dshPlugin = 'dsh-balance-monitor'
  entry.dataset.dshPart = 'sidebar-entry'
  entry.setAttribute('aria-label', '余额监控')
  const icon = document.createElement('span')
  icon.className = 'bm-icon'
  icon.innerHTML = WALLET_ICON
  const summary = document.createElement('span')
  summary.className = 'bm-summary'
  entry.append(icon, summary)

  const popup = document.createElement('div')
  popup.className = 'bm-popover'
  popup.hidden = true
  popup.setAttribute('role', 'dialog')
  popup.setAttribute('aria-label', '余额详情')
  document.body.append(popup)

  let snapshot = { revision: -1, channels: [] }
  let root
  const refreshing = new Set()
  const feedback = new Map()
  const feedbackTimers = new Map()
  const feedbackStarted = new Map()
  const pendingFeedback = new Map()

  const selectedChannels = () => {
    const settings = scope.getSnapshot()
    const selected = settings.status === 'ready' ? settings.value?.sidebarChannels : undefined
    return Array.isArray(selected) && selected.length
      ? selected.slice(0, MAX_SIDEBAR_CHANNELS)
      : CHANNEL_OPTIONS.map(channel => channel.id)
  }

  const acceptSnapshot = next => {
    if (!next || !Array.isArray(next.channels)) return false
    const currentRevision = Number(snapshot.revision)
    const nextRevision = Number(next.revision)
    if (Number.isFinite(currentRevision)
      && Number.isFinite(nextRevision)
      && nextRevision < currentRevision) return false
    snapshot = next
    return true
  }

  const renderSummary = () => {
    summary.replaceChildren()
    const selected = new Set(selectedChannels())
    const visible = snapshot.channels.filter(channel => selected.has(channel.id))
    for (const channel of visible) {
      const row = document.createElement('span')
      row.className = 'bm-line'
      const label = document.createElement('span')
      label.className = 'bm-label'
      label.textContent = channel.label
      const value = document.createElement('span')
      const result = feedback.get(channel.id)
      value.className = `bm-value${result ? ` bm-value-${result}` : ''}`
      value.textContent = formatBalance(channel)
      row.append(label, value)
      summary.append(row)
    }
    if (!visible.length) summary.textContent = '余额监控'
  }

  const positionPopup = () => {
    if (popup.hidden) return
    const rect = entry.getBoundingClientRect()
    const width = Math.min(390, window.innerWidth - 24)
    const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.right + 10))
    const top = Math.min(window.innerHeight - popup.offsetHeight - 12, Math.max(12, rect.top))
    popup.style.left = `${left}px`
    popup.style.top = `${top}px`
  }

  const setFeedback = (key, result) => {
    const now = Date.now()
    if (feedback.get(key) === result && now - (feedbackStarted.get(key) ?? 0) < 300) {
      return false
    }
    feedback.set(key, result)
    feedbackStarted.set(key, now)
    window.clearTimeout(feedbackTimers.get(key))
    feedbackTimers.set(key, window.setTimeout(() => {
      feedback.delete(key)
      feedbackStarted.delete(key)
      feedbackTimers.delete(key)
      render()
    }, FEEDBACK_DURATION_MS))
    return true
  }

  const showFeedback = (key, result) => {
    if (setFeedback(key, result)) render()
  }

  const refresh = async channel => {
    const key = channel ?? 'all'
    if (refreshing.has(key)) return
    refreshing.add(key)
    render()
    let result = 'error'
    try {
      const next = await api('/api/dsh-balance-monitor/refresh', {
        method: 'POST',
        body: JSON.stringify(channel ? { channel } : {}),
      })
      acceptSnapshot(next)
      const selected = channel
        ? snapshot.channels.filter(item => item.id === channel)
        : snapshot.channels
      const succeeded = selected.length > 0 && selected.every(item => item.status !== 'error')
      result = succeeded ? 'success' : 'error'
    } catch (error) {
      console.error('[dsh-balance-monitor] refresh failed:', error)
    }
    refreshing.delete(key)
    if (channel) {
      setFeedback(channel, pendingFeedback.get(channel) ?? result)
      pendingFeedback.delete(channel)
    } else {
      for (const [channelId, channelResult] of pendingFeedback) {
        setFeedback(channelId, channelResult)
      }
      pendingFeedback.clear()
      setFeedback('all', result)
    }
    render()
  }

  const renderPopup = () => {
    popup.replaceChildren()
    const header = document.createElement('header')
    header.className = 'bm-popover-header'
    const heading = document.createElement('span')
    heading.className = 'bm-popover-heading'
    const title = document.createElement('span')
    title.className = 'bm-popover-title'
    title.textContent = '余额详情'
    const version = document.createElement('span')
    version.className = 'bm-version'
    version.textContent = VERSION
    heading.append(title, version)
    const update = updateButton(updateStore.getSnapshot())
    if (update) heading.append(update)
    const actions = document.createElement('span')
    actions.className = 'bm-actions'
    const refreshAll = iconButton(REFRESH_ICON, '刷新全部', () => {
      void refresh()
    })
    refreshAll.disabled = refreshing.has('all')
    if (refreshing.has('all')) refreshAll.classList.add('bm-spinning')
    if (feedback.has('all')) refreshAll.classList.add(`bm-refresh-${feedback.get('all')}`)
    const close = iconButton(CLOSE_ICON, '关闭', () => {
      popup.hidden = true
      delete entry.dataset.active
    })
    actions.append(refreshAll, close)
    header.append(heading, actions)
    popup.append(header)
    if (!snapshot.channels.length) {
      const empty = document.createElement('div')
      empty.className = 'bm-empty'
      empty.textContent = '正在加载余额'
      popup.append(empty)
    }
    for (const channel of snapshot.channels) {
      popup.append(channelView(
        channel,
        () => void refresh(channel.id),
        feedback.get(channel.id),
        refreshing.has(channel.id) || refreshing.has('all'),
      ))
    }
    requestAnimationFrame(positionPopup)
  }

  const render = () => {
    renderSummary()
    if (!popup.hidden) renderPopup()
  }

  entry.addEventListener('click', () => {
    popup.hidden = !popup.hidden
    if (popup.hidden) delete entry.dataset.active
    else {
      entry.dataset.active = 'true'
      renderPopup()
    }
  })

  const place = () => {
    if (root && !root.isConnected) root = undefined
    root ??= sidebarRoot()
    if (root) placeEntry(root, entry)
  }
  const observer = new MutationObserver(place)
  observer.observe(document.body, { childList: true, subtree: true })
  const unsubscribe = scope.subscribe(renderSummary)
  const unsubscribeUpdates = updateStore.subscribe(render)
  const outside = event => {
    if (!popup.hidden && !popup.contains(event.target) && !entry.contains(event.target)) {
      popup.hidden = true
      delete entry.dataset.active
    }
  }
  const escape = event => {
    if (event.key === 'Escape') {
      popup.hidden = true
      delete entry.dataset.active
    }
  }
  document.addEventListener('pointerdown', outside)
  document.addEventListener('keydown', escape)
  window.addEventListener('resize', positionPopup)
  place()
  api('/api/dsh-balance-monitor/state').then(value => {
    if (acceptSnapshot(value)) render()
  }).catch(() => void refresh())
  const events = new EventSource('/api/dsh-balance-monitor/events')
  events.onmessage = event => {
    try {
      const payload = JSON.parse(event.data)
      if (!acceptSnapshot(payload.snapshot)) return
      if (payload.channel) {
        const channel = snapshot.channels.find(item => item.id === payload.channel)
        const result = channel?.status === 'error' ? 'error' : 'success'
        if (refreshing.has(payload.channel) || refreshing.has('all')) {
          pendingFeedback.set(payload.channel, result)
        } else {
          showFeedback(payload.channel, result)
        }
      } else {
        render()
      }
    } catch (error) {
      console.error('[dsh-balance-monitor] event decode failed:', error)
    }
  }
  return () => {
    observer.disconnect()
    events.close()
    unsubscribe()
    unsubscribeUpdates()
    for (const timeout of feedbackTimers.values()) window.clearTimeout(timeout)
    document.removeEventListener('pointerdown', outside)
    document.removeEventListener('keydown', escape)
    window.removeEventListener('resize', positionPopup)
    entry.remove()
    popup.remove()
  }
}

function credentialRef(snapshot, field, fallback) {
  const value = snapshot.status === 'ready' ? snapshot.value?.[field] : undefined
  return typeof value === 'string' && value ? value : fallback
}

function unwrap(response, action) {
  if (!response?.ok) throw new Error(response?.error?.message || `${action}失败`)
  return response.value
}

function createSettingsCard(ctx, scope) {
  return function DshBalanceMonitorSettings() {
    const snapshot = useSyncExternalStore(
      listener => scope.subscribe(listener),
      () => scope.getSnapshot(),
    )
    const update = useSyncExternalStore(updateStore.subscribe, updateStore.getSnapshot)
    const values = snapshot.status === 'ready' ? snapshot.value ?? {} : {}
    const [open, setOpen] = useState(false)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [sidebarChannels, setSidebarChannels] = useState(
      values.sidebarChannels ?? CHANNEL_OPTIONS.map(channel => channel.id),
    )
    const [teamoBaseUrl, setTeamoBaseUrl] = useState(values.teamoBaseUrl ?? 'https://teamorouter.cn')
    const [teamoRangeDays, setTeamoRangeDays] = useState(values.teamoRangeDays ?? 7)
    const [deepseekKey, setDeepseekKey] = useState('')
    const [teamoKey, setTeamoKey] = useState('')
    const [credentials, setCredentials] = useState({})
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [failed, setFailed] = useState(false)

    const deepseekRef = credentialRef(snapshot, 'deepseekApiKeyRef', 'DEEPSEEK_API_KEY')
    const teamoRef = credentialRef(snapshot, 'teamoApiKeyRef', 'TEAMO_API_KEY')

    useEffect(() => {
      if (snapshot.status !== 'ready') return
      setSidebarChannels(values.sidebarChannels ?? CHANNEL_OPTIONS.map(channel => channel.id))
      setTeamoBaseUrl(values.teamoBaseUrl ?? 'https://teamorouter.cn')
      setTeamoRangeDays(values.teamoRangeDays ?? 7)
    }, [snapshot.revision])

    useEffect(() => {
      if (!open) setPickerOpen(false)
    }, [open])

    const readCredentials = async () => {
      try {
        const result = unwrap(
          await ctx.remote.credentials.describe([deepseekRef, teamoRef]),
          '读取凭据状态',
        )
        setCredentials(result)
      } catch (error) {
        setFailed(true)
        setMessage(error.message)
      }
    }

    useEffect(() => {
      void readCredentials()
    }, [deepseekRef, teamoRef])

    const save = async () => {
      setSaving(true)
      setFailed(false)
      setMessage('')
      try {
        const writes = []
        if (deepseekKey.trim()) {
          writes.push(ctx.remote.credentials.set(deepseekRef, deepseekKey.trim()))
        }
        if (teamoKey.trim()) {
          writes.push(ctx.remote.credentials.set(teamoRef, teamoKey.trim()))
        }
        for (const response of await Promise.all(writes)) unwrap(response, '保存 API Key')
        await scope.mutate([
          { op: 'set', path: ['sidebarChannels'], value: sidebarChannels },
          { op: 'set', path: ['teamoBaseUrl'], value: teamoBaseUrl.trim() },
          { op: 'set', path: ['teamoRangeDays'], value: Number(teamoRangeDays) },
        ], snapshot.revision)
        setDeepseekKey('')
        setTeamoKey('')
        await readCredentials()
        setMessage('已保存')
      } catch (error) {
        setFailed(true)
        setMessage(error.message)
      } finally {
        setSaving(false)
      }
    }

    const removeCredential = async ref => {
      setSaving(true)
      setFailed(false)
      setMessage('')
      try {
        unwrap(await ctx.remote.credentials.unset(ref), '移除 API Key')
        await readCredentials()
        setMessage('已移除')
      } catch (error) {
        setFailed(true)
        setMessage(error.message)
      } finally {
        setSaving(false)
      }
    }

    const field = (label, control, badge, remove) => React.createElement(
      'div',
      { className: 'bm-field' },
      React.createElement(
        'label',
        null,
        label,
        badge === undefined ? null : React.createElement(
          'span',
          { className: 'bm-badge', 'data-set': String(Boolean(badge)) },
          badge ? '已配置' : '未配置',
        ),
      ),
      React.createElement(
        'div',
        { className: 'bm-field-row' },
        control,
        remove ? React.createElement(
          'button',
          {
            className: 'bm-button',
            type: 'button',
            disabled: saving || !badge || credentials[remove]?.writable === false,
            onClick: () => void removeCredential(remove),
          },
          '移除',
        ) : null,
      ),
    )

    const toggleSidebarChannel = id => {
      setSidebarChannels(current => {
        if (current.includes(id)) {
          return current.length > 1 ? current.filter(value => value !== id) : current
        }
        if (current.length >= MAX_SIDEBAR_CHANNELS) return current
        return [...current, id]
      })
    }

    const selectedLabels = CHANNEL_OPTIONS
      .filter(channel => sidebarChannels.includes(channel.id))
      .map(channel => channel.label)
      .join('、')

    const channelPicker = React.createElement(
      'div',
      { className: 'bm-multi', 'data-open': String(pickerOpen) },
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'bm-multi-trigger',
          'aria-expanded': pickerOpen,
          'aria-haspopup': 'listbox',
          onClick: () => setPickerOpen(value => !value),
        },
        React.createElement('span', { className: 'bm-multi-value' }, selectedLabels),
        React.createElement(
          'span',
          { className: 'bm-multi-count' },
          `${sidebarChannels.length}/${MAX_SIDEBAR_CHANNELS}`,
        ),
        React.createElement(
          'svg',
          { className: 'bm-chevron', viewBox: '0 0 14 14', 'aria-hidden': true },
          React.createElement('path', { d: 'm3 5.25 4 4 4-4' }),
        ),
      ),
      pickerOpen ? React.createElement(
        'div',
        { className: 'bm-multi-menu', role: 'listbox', 'aria-multiselectable': true },
        ...CHANNEL_OPTIONS.map(channel => {
          const checked = sidebarChannels.includes(channel.id)
          const disabled = !checked && sidebarChannels.length >= MAX_SIDEBAR_CHANNELS
          return React.createElement(
            'label',
            {
              key: channel.id,
              className: 'bm-multi-option',
              'data-disabled': String(disabled),
            },
            React.createElement('input', {
              type: 'checkbox',
              checked,
              disabled,
              onChange: () => toggleSidebarChannel(channel.id),
            }),
            React.createElement('span', null, channel.label),
          )
        }),
      ) : null,
    )

    const form = React.createElement(
      'div',
      { className: 'bm-form' },
      field('侧边栏展示', channelPicker),
      field(
        'DeepSeek API Key',
        React.createElement('input', {
          type: 'password',
          value: deepseekKey,
          autoComplete: 'new-password',
          placeholder: credentials[deepseekRef]?.configured ? '输入新 Key 以替换' : 'sk-...',
          disabled: credentials[deepseekRef]?.writable === false,
          onChange: event => setDeepseekKey(event.target.value),
        }),
        credentials[deepseekRef]?.configured,
        deepseekRef,
      ),
      field(
        'TeamoRouter API Key',
        React.createElement('input', {
          type: 'password',
          value: teamoKey,
          autoComplete: 'new-password',
          placeholder: credentials[teamoRef]?.configured ? '输入新 Key 以替换' : 'sk-teamo-...',
          disabled: credentials[teamoRef]?.writable === false,
          onChange: event => setTeamoKey(event.target.value),
        }),
        credentials[teamoRef]?.configured,
        teamoRef,
      ),
      field('TeamoRouter 地址', React.createElement('input', {
        type: 'url',
        value: teamoBaseUrl,
        onChange: event => setTeamoBaseUrl(event.target.value),
      })),
      field('TeamoRouter 统计天数', React.createElement('input', {
        type: 'number',
        min: 2,
        max: 90,
        step: 1,
        value: teamoRangeDays,
        onChange: event => setTeamoRangeDays(event.target.value),
      })),
      message ? React.createElement(
        'div',
        { className: 'bm-message', 'data-error': String(failed) },
        message,
      ) : null,
      React.createElement(
        'div',
        { className: 'bm-buttons' },
        React.createElement(
          'button',
          {
            className: 'bm-button bm-button-primary',
            type: 'button',
            disabled: saving || snapshot.status !== 'ready' || !snapshot.writable,
            onClick: () => void save(),
          },
          saving ? '保存中' : '保存',
        ),
      ),
    )
    const updateStatus = updatePresentation(update)
    const updateNotice = updateStatus ? React.createElement(
      'div',
      { className: 'bm-settings-update' },
      React.createElement('span', null, `当前版本 ${VERSION}`),
      updateStatus.state === 'restart-required'
        ? React.createElement(
          'span',
          {
            className: 'bm-update-pill',
            'data-state': updateStatus.state,
            title: updateStatus.title ?? updateStatus.label,
          },
          updateStatus.label,
        )
        : React.createElement(
          'button',
          {
            type: 'button',
            className: 'bm-update-pill',
            'data-state': updateStatus.state,
            disabled: updateStatus.disabled,
            title: updateStatus.title ?? updateStatus.label,
            onClick: () => void updateStore.install(),
          },
          updateStatus.label,
        ),
    ) : null

    return React.createElement(
      'li',
      {
        className: 'bm-settings',
        'data-open': String(open),
        'data-dsh-plugin': NS,
        'data-dsh-part': 'settings-card',
      },
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'bm-settings-header',
          'aria-expanded': open,
          onClick: () => setOpen(value => !value),
        },
        React.createElement(
          'span',
          { className: 'bm-settings-head' },
          React.createElement(
            'span',
            { className: 'bm-settings-title-row' },
            React.createElement('span', { className: 'bm-settings-title' }, '余额监控'),
            React.createElement('span', { className: 'bm-version' }, VERSION),
          ),
          React.createElement(
            'span',
            { className: 'bm-settings-description' },
            '查看余额渠道、凭据与用量设置。',
          ),
        ),
        React.createElement(
          'svg',
          { className: 'bm-chevron bm-card-chevron', viewBox: '0 0 14 14', 'aria-hidden': true },
          React.createElement('path', { d: 'm3 5.25 4 4 4-4' }),
        ),
      ),
      open ? React.createElement(
        'div',
        { className: 'bm-settings-body' },
        updateNotice,
        form,
      ) : null,
    )
  }
}

export function apply(ctx) {
  installStyle()
  void updateStore.check()
  const scope = ctx.settingsScope.bind({ namespace: NS })
  const SettingsCard = createSettingsCard(ctx, scope)
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: NS,
    order: 1_000,
  }, SettingsCard))
  ctx.effect(() => mountMonitor(scope), 'dsh-balance-monitor: sidebar')
}
