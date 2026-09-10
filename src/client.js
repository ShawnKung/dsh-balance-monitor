import React, { useEffect, useRef, useSyncExternalStore, useState } from 'react'
import Sortable from 'sortablejs'
import {
  BALANCE_PRECISIONS,
  formatMoney,
  normalizeBalancePrecision,
} from '../lib/balance-format.js'

export const inject = ['slots', 'settingsScope']

const NS = 'dsh-balance-monitor'
const VERSION = __DSH_BALANCE_MONITOR_VERSION_LABEL__
const FEEDBACK_DURATION_MS = 2_400
const POPOVER_EXIT_MS = 160
const MAX_SIDEBAR_CHANNELS = 3
const CHANNEL_OPTIONS = Object.freeze([
  {
    id: 'deepseek',
    label: 'DeepSeek 官方',
    website: 'https://platform.deepseek.com/usage',
  },
  {
    id: 'kimi',
    label: 'Kimi 官方',
    website: 'https://platform.kimi.com/console/account',
  },
  {
    id: 'zhipu',
    label: '智谱 GLM',
    website: 'https://bigmodel.cn/finance-center/finance/overview',
  },
  {
    id: 'teamo',
    label: 'TeamoRouter',
    website: 'https://teamorouter.com/dashboard',
  },
])
const CHANNEL_IDS = CHANNEL_OPTIONS.map(channel => channel.id)
const CHANNEL_BY_ID = new Map(CHANNEL_OPTIONS.map(channel => [channel.id, channel]))
const WALLET_ICON = '<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4.75h10.25a.75.75 0 0 1 .75.75v7a1 1 0 0 1-1 1h-9a1.5 1.5 0 0 1-1.5-1.5V4a1.5 1.5 0 0 1 1.5-1.5h8"/><path d="M10.25 8h3.25v2.5h-3.25a1.25 1.25 0 0 1 0-2.5Z"/></svg>'
const REFRESH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"/></svg>'
const EXTERNAL_LINK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'

function normalizeChannelOrder(value) {
  const requested = Array.isArray(value) ? value : []
  return [...new Set([...requested.filter(id => CHANNEL_IDS.includes(id)), ...CHANNEL_IDS])]
}

function balancePrecisionLabel(value) {
  if (value === 'exact') return '精确'
  if (value === '0') return '无小数位'
  return `${value} 位`
}

const STYLE = `
[data-dsh-balance-monitor-entry][hidden]{display:none}
.bm-checkbox-field{display:flex;align-items:center;gap:8px;padding-top:8px;font-size:12px;font-weight:550}.bm-checkbox-field input{width:14px!important;height:14px!important;flex:none!important;margin:0;cursor:pointer}
.bm-sortable-ghost{opacity:.28;background:var(--dsw-alias-interactive-bg-active,rgba(127,127,127,.16))}.bm-sortable-chosen{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.1))}.bm-sortable-drag{opacity:.96;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3,#fff));box-shadow:var(--dsw-elevation-panel,0 8px 24px rgba(0,0,0,.16))}
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
.bm-popover{position:fixed;z-index:10000;width:min(390px,calc(100vw - 24px));max-height:min(620px,calc(100vh - 24px));overflow:auto;border:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:8px;background:var(--dsw-alias-bg-layer-2,#fff);color:var(--dsw-alias-label-primary,#0f1115);box-shadow:var(--dsw-elevation-prominent,0 12px 32px rgba(0,0,0,.14));font-family:inherit;transform-origin:left top;animation:bm-popover-in .18s var(--ds-ease-out,cubic-bezier(0,0,.2,1))}
.bm-popover[hidden]{display:none}.bm-popover-header{position:sticky;top:0;z-index:1;display:flex;align-items:center;padding:12px 14px;border-bottom:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.16));background:inherit}
.bm-popover[data-closing=true]{pointer-events:none;animation:bm-popover-out .16s var(--ds-ease-in,cubic-bezier(.4,0,1,1)) forwards}
.bm-popover-heading{display:flex;align-items:center;gap:6px;min-width:0;flex:1}.bm-popover-title{font-size:14px;font-weight:600}.bm-version{font-size:10px;font-weight:400;line-height:1;color:var(--dsw-alias-label-tertiary,#9ca3af);white-space:nowrap}.bm-update-pill{-webkit-appearance:none;appearance:none;box-sizing:border-box;height:20px;border:0;border-radius:5px;outline:0;background:#d09a00;box-shadow:none;color:#fff;padding:3px 8px;font:inherit;font-size:10px;font-weight:600;line-height:14px;white-space:nowrap}.bm-update-pill:not(span){cursor:pointer}.bm-update-pill:not(span):hover{background:#b98200}.bm-update-pill:focus-visible{outline:2px solid var(--dsw-alias-focus-ring,#4d6bfe);outline-offset:2px}.bm-update-pill:disabled{cursor:wait;opacity:.72}.bm-update-pill[data-state=restart-required]{background:#16803d}.bm-update-pill[data-state=error]{background:#b42318}.bm-actions{display:flex;gap:4px}.bm-icon-button{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115);width:30px;height:30px;border:0;border-radius:6px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
.bm-icon-button{transition:color .35s ease,background .12s ease}.bm-icon-button:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}.bm-icon-button:disabled{opacity:.45;cursor:default}.bm-spinning svg{animation:bm-spin 1.1s linear infinite}.bm-refresh-success{animation:bm-success-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-refresh-error{animation:bm-error-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-refresh-success svg,.bm-refresh-error svg{animation:bm-stroke-feedback 2.4s cubic-bezier(.4,0,.2,1)}
.bm-channel{padding:14px}.bm-channel+.bm-channel{border-top:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.16))}.bm-channel-head{display:flex;align-items:center;gap:8px;margin-bottom:12px}.bm-channel-title{display:flex;align-items:center;gap:4px;min-width:0;flex:1}
.bm-channel-name{font-size:13px;font-weight:600}.bm-channel-website{box-sizing:border-box;width:20px;height:20px;flex:none;border-radius:4px;color:var(--dsw-alias-label-tertiary,#9ca3af);display:grid;place-items:center;text-decoration:none}.bm-channel-website:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-channel-website:focus-visible{outline:2px solid var(--dsw-alias-focus-ring,#4d6bfe);outline-offset:1px}.bm-channel-website svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.bm-status{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-balance{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115);font-size:24px;line-height:1.2;font-weight:650;font-variant-numeric:tabular-nums;margin-bottom:12px}.bm-value-success,.bm-balance-success{animation:bm-success-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-value-error,.bm-balance-error{animation:bm-error-feedback 2.4s cubic-bezier(.4,0,.2,1)}
.bm-periods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:12px}.bm-period{padding:9px;background:var(--dsw-alias-bg-multi-select,rgba(127,127,127,.08));border-radius:6px}
.bm-period-label,.bm-detail-label{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-period-value{font-size:14px;font-weight:600;margin-top:3px}.bm-period-meta{font-size:10px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin-top:2px}
.bm-details{display:grid;gap:7px}.bm-detail{display:flex;justify-content:space-between;gap:14px;font-size:12px}.bm-detail-value{text-align:right;font-variant-numeric:tabular-nums}.bm-error{color:var(--dsw-alias-state-error-primary,#ef4444)}
.bm-note{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin-top:10px}.bm-empty{padding:16px;font-size:12px;color:var(--dsw-alias-label-tertiary,#9ca3af)}
.bm-settings{list-style:none;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:12px;background:var(--dsw-alias-bg-layer-3,transparent);color:inherit;transition:border-color .16s,background .16s}.bm-settings:hover{border-color:var(--dsw-alias-label-dimmed,rgba(127,127,127,.45))}.bm-settings[data-open=true]{background:var(--dsw-alias-bg-layer-2,transparent);border-color:var(--dsw-alias-label-dimmed,rgba(127,127,127,.45))}
.bm-settings-header{appearance:none;box-sizing:border-box;width:100%;border:0;border-radius:12px;background:transparent;color:inherit;display:flex;align-items:center;gap:12px;padding:14px 16px;text-align:left;font:inherit;cursor:pointer}.bm-settings-head{display:flex;flex:1;min-width:0;flex-direction:column;gap:4px}.bm-settings-title-row{display:flex;align-items:baseline;gap:6px;min-width:0}.bm-settings-title{font-size:15px;font-weight:600;line-height:1.4}.bm-settings-description{font-size:13px;line-height:1.5;color:var(--dsw-alias-label-secondary,#9ca3af)}.bm-chevron{width:14px;height:14px;flex:none;fill:none;stroke:currentColor;stroke-width:1.5;transition:transform .16s}.bm-settings[data-open=true] .bm-card-chevron,.bm-multi[data-open=true] .bm-chevron{transform:rotate(180deg)}.bm-settings-body{border-top:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.2));margin:0 16px;padding:4px 0 8px}.bm-settings-update{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0 2px;font-size:12px;color:var(--dsw-alias-label-secondary,#9ca3af)}
.bm-form{display:grid;gap:14px}.bm-field{display:grid;gap:6px;padding-top:8px}.bm-field-label{position:relative;display:flex;align-items:center;min-height:28px;gap:8px}.bm-field-label>label{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:550}.bm-field-row{display:flex;gap:8px;align-items:center}.bm-field input,.bm-field select{box-sizing:border-box;min-width:0;flex:1;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:0 10px;font:inherit;font-size:12px}.bm-credential-control{position:relative;display:flex;min-width:0;flex:1}.bm-credential-control>input{width:100%;padding-right:34px}.bm-secret-input{-webkit-text-security:disc}.bm-credential-clear{position:absolute;top:4px;right:4px;width:26px;height:26px;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-tertiary,#9ca3af);display:grid;place-items:center;padding:0;font:inherit;font-size:18px;line-height:1;cursor:pointer}.bm-credential-clear:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-field-refresh{box-sizing:border-box;width:34px;height:34px;flex:none;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#6b7280);display:grid;place-items:center;padding:0;cursor:pointer}.bm-field-refresh:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-field-refresh:disabled,.bm-credential-clear:disabled{opacity:.45;cursor:default}.bm-field-refresh svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.bm-precision-setting{display:grid;grid-template-columns:minmax(150px,1fr) minmax(180px,300px);align-items:center;gap:16px;min-height:34px;padding-top:8px}.bm-precision-title{display:flex;align-items:baseline;gap:10px;min-width:0;font-size:12px;font-weight:550;white-space:nowrap}.bm-precision-current{font-size:11px;font-weight:400;color:var(--dsw-alias-label-secondary,#6b7280);font-variant-numeric:tabular-nums}.bm-precision-control{display:flex;align-items:center;justify-self:end;gap:10px;width:100%;min-width:0}.bm-precision-end{box-sizing:border-box;flex:none;font-size:10px;line-height:14px;color:var(--dsw-alias-label-secondary,#6b7280);white-space:nowrap}.bm-precision-end:last-child{text-align:right}.bm-precision-track{position:relative;flex:1;min-width:90px;height:20px}.bm-precision-slider{-webkit-appearance:none;appearance:none;position:absolute;z-index:2;inset:0;box-sizing:border-box;width:100%;height:20px;margin:0;border:0;background:transparent;padding:0;cursor:pointer}.bm-precision-slider::-webkit-slider-runnable-track{height:3px;border-radius:2px;background:linear-gradient(to right,var(--dsw-alias-state-info-primary,#2563eb) 0 var(--bm-precision-progress),var(--dsw-alias-border-l2,rgba(127,127,127,.22)) var(--bm-precision-progress) 100%)}.bm-precision-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;box-sizing:border-box;width:12px;height:12px;margin-top:-4.5px;border:1.5px solid var(--dsw-alias-bg-layer-2,#fff);border-radius:50%;background:var(--dsw-alias-state-info-primary,#2563eb);box-shadow:0 1px 2px rgba(0,0,0,.12)}.bm-precision-slider::-moz-range-track{height:3px;border:0;border-radius:2px;background:var(--dsw-alias-border-l2,rgba(127,127,127,.22))}.bm-precision-slider::-moz-range-progress{height:3px;border-radius:2px;background:var(--dsw-alias-state-info-primary,#2563eb)}.bm-precision-slider::-moz-range-thumb{box-sizing:border-box;width:12px;height:12px;border:1.5px solid var(--dsw-alias-bg-layer-2,#fff);border-radius:50%;background:var(--dsw-alias-state-info-primary,#2563eb);box-shadow:0 1px 2px rgba(0,0,0,.12)}.bm-precision-ticks{position:absolute;z-index:1;left:6px;right:6px;top:9px;display:flex;justify-content:space-between;pointer-events:none}.bm-precision-ticks span{opacity:.5;width:2px;height:2px;border-radius:50%;background:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-precision-tooltip{position:fixed;z-index:10002;transform:translateX(-50%);padding:4px 7px;border-radius:5px;background:var(--dsw-alias-bg-tooltip,#1f2937);color:var(--dsw-alias-label-primary-foreground,#fff);box-shadow:0 4px 12px rgba(0,0,0,.18);font-size:11px;font-weight:550;line-height:16px;white-space:nowrap;pointer-events:none}
.bm-credential-readonly{box-sizing:border-box;min-width:0;flex:1;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.18));border-radius:6px;background:var(--dsw-alias-bg-disabled,rgba(127,127,127,.06));color:var(--dsw-alias-label-tertiary,#9ca3af);padding:0 10px;display:flex;align-items:center;font-size:12px}
.bm-source-settings{position:relative;margin-left:auto}.bm-source-settings-trigger{box-sizing:border-box;width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#6b7280);display:grid;place-items:center;padding:0;cursor:pointer}.bm-source-settings-trigger:hover,.bm-source-settings-trigger[data-open=true]{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-source-settings-trigger svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.bm-source-popover{position:absolute;z-index:20;top:calc(100% + 5px);right:0;width:min(340px,calc(100vw - 64px));padding:14px;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:8px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3,#fff));box-shadow:var(--dsw-elevation-panel,0 10px 30px rgba(0,0,0,.16));display:grid;gap:12px;animation:bm-popover-in .18s var(--ds-ease-out,cubic-bezier(0,0,.2,1))}.bm-source-popover-title{font-size:13px;font-weight:600}.bm-source-popover-field{display:grid;gap:6px}.bm-source-popover-field label{font-size:11px;color:var(--dsw-alias-label-secondary,#6b7280)}.bm-source-popover-field input{width:100%}.bm-source-popover-actions{display:flex;justify-content:flex-end;gap:8px}
.bm-multi{position:relative;width:100%;max-width:100%;flex:none}.bm-multi-trigger{box-sizing:border-box;width:100%;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:0 10px;display:flex;align-items:center;gap:8px;font:inherit;font-size:12px;cursor:pointer}.bm-multi-value{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.bm-multi-count{font-size:10px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-multi-menu{position:absolute;z-index:5;top:calc(100% + 5px);left:0;right:0;padding:5px;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:6px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3,#fff));box-shadow:var(--dsw-elevation-panel,0 8px 24px rgba(0,0,0,.14))}.bm-multi-option{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:5px}.bm-multi-option:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.1))}.bm-multi-option-select{display:flex;align-items:center;gap:8px;min-width:0;flex:1;font-weight:400;cursor:pointer}.bm-multi-option input{width:14px!important;height:14px!important;flex:none!important;margin:0}.bm-multi-option[data-disabled=true]{position:relative}.bm-multi-option[data-disabled=true]>.bm-multi-option-select,.bm-multi-option[data-disabled=true]>.bm-drag-handle{opacity:.45}.bm-limit-tooltip{position:fixed;z-index:10001;padding:5px 7px;border-radius:5px;background:var(--dsw-alias-bg-tooltip,#1f2937);color:var(--dsw-alias-label-primary-foreground,#fff);box-shadow:0 4px 12px rgba(0,0,0,.18);font-size:11px;font-weight:400;line-height:16px;white-space:nowrap;pointer-events:none}.bm-drag-handle{width:24px;height:24px;flex:none;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-tertiary,#9ca3af);display:grid;place-items:center;padding:0;cursor:grab;touch-action:none;user-select:none}.bm-drag-handle:active{cursor:grabbing}.bm-drag-handle:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-drag-handle svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round}
.bm-credential-dot{width:7px;height:7px;border-radius:50%;flex:none}.bm-credential-dot[data-status=success]{background:var(--dsw-alias-state-success-primary,#16a34a)}.bm-credential-dot[data-status=error]{background:var(--dsw-alias-state-error-primary,#dc2626)}
.bm-buttons{display:flex;justify-content:flex-end;gap:8px}.bm-button{height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.25));border-radius:6px;padding:0 12px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer}.bm-button-primary{background:var(--dsw-alias-button-info-fill,#2563eb);border-color:transparent;color:var(--dsw-alias-label-primary-foreground,#fff)}.bm-button:disabled{opacity:.5;cursor:default}.bm-message{font-size:11px}.bm-message[data-error=true]{color:var(--dsw-alias-state-error-primary,#ef4444)}
@keyframes bm-spin{to{transform:rotate(360deg)}}@keyframes bm-popover-in{from{opacity:0;transform:translateY(-4px) scale(.985)}to{opacity:1;transform:none}}@keyframes bm-popover-out{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-4px) scale(.985)}}@keyframes bm-success-feedback{0%,100%{color:var(--bm-feedback-rest,var(--dsw-alias-label-primary,#eef0f3))}35%,65%{color:var(--bm-feedback-success)}}@keyframes bm-error-feedback{0%,100%{color:var(--bm-feedback-rest,var(--dsw-alias-label-primary,#eef0f3))}35%,65%{color:var(--bm-feedback-error)}}@keyframes bm-stroke-feedback{0%,100%{stroke-width:1.8}35%,65%{stroke-width:3}}@media(prefers-reduced-motion:reduce){.bm-popover{animation:none}}`

function installStyle() {
  if (document.querySelector('style[data-dsh-balance-monitor-style]')) return
  const style = document.createElement('style')
  style.dataset.dshBalanceMonitorStyle = ''
  style.textContent = STYLE
  document.head.append(style)
}

function formatBalance(channel, precision) {
  if (channel.status === 'unconfigured') return '未配置'
  if (channel.status === 'loading' && channel.balance === undefined) return '加载中'
  if (channel.balance === undefined) return '--'
  return formatMoney(
    channel.balance,
    channel.currency,
    precision,
    channel.balanceRaw,
  )
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

function installUpdate() {
  return api('/api/dsh-balance-monitor/update', {
    method: 'POST',
    body: JSON.stringify({ action: 'install' }),
  })
}

function triggerUpdate() {
  void installUpdate().catch(() => {})
}

function subscribeUpdateState(listener) {
  let active = true
  api('/api/dsh-balance-monitor/update')
    .then(snapshot => {
      if (active) listener(snapshot)
    })
    .catch(error => console.error('[dsh-balance-monitor] update state failed:', error))
  const events = new EventSource('/api/dsh-balance-monitor/update/events')
  events.onmessage = event => {
    try {
      listener(JSON.parse(event.data))
    } catch (error) {
      console.error('[dsh-balance-monitor] update event decode failed:', error)
    }
  }
  return () => {
    active = false
    events.close()
  }
}

const balanceStateStore = (() => {
  const listeners = new Set()
  let snapshot
  let revision = -1
  let events
  let starting

  const publish = (next, channel = null) => {
    if (!next || !Array.isArray(next.channels)) return
    const nextRevision = Number(next.revision)
    if (Number.isFinite(nextRevision) && nextRevision < revision) return
    if (Number.isFinite(nextRevision)) revision = nextRevision
    snapshot = next
    for (const listener of listeners) listener({ snapshot, channel })
  }

  const start = () => {
    if (starting || events) return
    starting = api('/api/dsh-balance-monitor/state')
      .then(next => publish(next))
      .catch(error => console.error('[dsh-balance-monitor] state failed:', error))
      .finally(() => {
        starting = undefined
        if (listeners.size > 0 && !events) start()
      })
    events = new EventSource('/api/dsh-balance-monitor/events')
    events.onmessage = event => {
      try {
        const payload = JSON.parse(event.data)
        publish(payload.snapshot, payload.channel)
      } catch (error) {
        console.error('[dsh-balance-monitor] state event decode failed:', error)
      }
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      if (snapshot) listener({ snapshot, channel: null })
      start()
      return () => {
        listeners.delete(listener)
        if (listeners.size > 0) return
        events?.close()
        events = undefined
      }
    },
  }
})()

function subscribeBalanceState(listener) {
  return balanceStateStore.subscribe(listener)
}

function updatePresentation(update) {
  if (!update) return undefined
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

function updateButton(update, onInstall) {
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
      void onInstall()
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

function channelWebsiteLink(channelId) {
  const channel = CHANNEL_BY_ID.get(channelId)
  if (!channel?.website) return undefined

  const link = document.createElement('a')
  link.className = 'bm-channel-website'
  link.href = channel.website
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.title = `打开 ${channel.label} 控制台`
  link.setAttribute('aria-label', `打开 ${channel.label} 控制台`)
  link.innerHTML = EXTERNAL_LINK_ICON
  link.addEventListener('click', event => event.stopPropagation())
  return link
}

function detailRow(item, precision) {
  const row = document.createElement('div')
  row.className = 'bm-detail'
  const label = document.createElement('span')
  label.className = 'bm-detail-label'
  label.textContent = item.label
  const value = document.createElement('span')
  value.className = `bm-detail-value${item.tone === 'error' ? ' bm-error' : ''}`
  value.textContent = item.amount === undefined
    ? item.value
    : formatMoney(item.amount, item.currency, precision, item.rawAmount)
  row.append(label, value)
  return row
}

function channelView(channel, refresh, feedback, loading, precision) {
  const section = document.createElement('section')
  section.className = 'bm-channel'
  const header = document.createElement('div')
  header.className = 'bm-channel-head'
  const name = document.createElement('span')
  name.className = 'bm-channel-name'
  name.textContent = channel.label
  const title = document.createElement('span')
  title.className = 'bm-channel-title'
  title.append(name)
  const website = channelWebsiteLink(channel.id)
  if (website) title.append(website)
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
  header.append(title, status, refreshButton)
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
    balance.textContent = formatBalance(channel, precision)
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
      value.textContent = item.amount === undefined
        ? item.cost
        : formatMoney(item.amount, item.currency, precision, item.rawAmount)
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
    for (const item of channel.detail) details.append(detailRow(item, precision))
    section.append(details)
  }

  if (channel.error) {
    section.append(detailRow({ label: '错误', value: channel.error, tone: 'error' }, precision))
  }
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
  entry.setAttribute('aria-haspopup', 'dialog')
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
  let updateSnapshot
  let root
  let popupCloseTimer
  const refreshing = new Set()
  const feedback = new Map()
  const feedbackTimers = new Map()
  const feedbackStarted = new Map()
  const pendingFeedback = new Map()

  const selectedChannels = () => {
    const settings = scope.getSnapshot()
    const selected = settings.status === 'ready' ? settings.value?.sidebarChannels : undefined
    const selectedSet = new Set(
      Array.isArray(selected) && selected.length ? selected.slice(0, MAX_SIDEBAR_CHANNELS) : CHANNEL_IDS,
    )
    const order = normalizeChannelOrder(
      settings.status === 'ready' ? settings.value?.channelOrder : undefined,
    )
    return order.filter(id => selectedSet.has(id))
  }

  const sidebarVisible = () => {
    const settings = scope.getSnapshot()
    return settings.status !== 'ready' || settings.value?.showSidebar !== false
  }

  const balancePrecision = () => {
    const settings = scope.getSnapshot()
    return normalizeBalancePrecision(
      settings.status === 'ready' ? settings.value?.balancePrecision : undefined,
    )
  }

  const orderedChannels = () => {
    const settings = scope.getSnapshot()
    const order = normalizeChannelOrder(
      settings.status === 'ready' ? settings.value?.channelOrder : undefined,
    )
    const byId = new Map(snapshot.channels.map(channel => [channel.id, channel]))
    return order.map(id => byId.get(id)).filter(Boolean)
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
    const visible = sidebarVisible()
    entry.hidden = !visible
    if (!visible) {
      popup.hidden = true
      delete popup.dataset.closing
      delete entry.dataset.active
      return
    }
    const byId = new Map(snapshot.channels.map(channel => [channel.id, channel]))
    const channels = selectedChannels().map(id => byId.get(id)).filter(Boolean)
    for (const channel of channels) {
      const row = document.createElement('span')
      row.className = 'bm-line'
      const label = document.createElement('span')
      label.className = 'bm-label'
      label.textContent = channel.label
      const value = document.createElement('span')
      const result = feedback.get(channel.id)
      value.className = `bm-value${result ? ` bm-value-${result}` : ''}`
      value.textContent = formatBalance(channel, balancePrecision())
      row.append(label, value)
      summary.append(row)
    }
    if (!channels.length) summary.textContent = '余额监控'
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
    const update = updateButton(updateSnapshot, triggerUpdate)
    if (update) heading.append(update)
    const actions = document.createElement('span')
    actions.className = 'bm-actions'
    const refreshAll = iconButton(REFRESH_ICON, '刷新全部', () => {
      void refresh()
    })
    refreshAll.disabled = refreshing.has('all')
    if (refreshing.has('all')) refreshAll.classList.add('bm-spinning')
    if (feedback.has('all')) refreshAll.classList.add(`bm-refresh-${feedback.get('all')}`)
    actions.append(refreshAll)
    header.append(heading, actions)
    popup.append(header)
    if (!snapshot.channels.length) {
      const empty = document.createElement('div')
      empty.className = 'bm-empty'
      empty.textContent = '正在加载余额'
      popup.append(empty)
    }
    for (const channel of orderedChannels()) {
      popup.append(channelView(
        channel,
        () => void refresh(channel.id),
        feedback.get(channel.id),
        refreshing.has(channel.id) || refreshing.has('all'),
        balancePrecision(),
      ))
    }
    requestAnimationFrame(positionPopup)
  }

  const render = () => {
    renderSummary()
    if (!popup.hidden) renderPopup()
  }

  const openPopup = () => {
    window.clearTimeout(popupCloseTimer)
    popupCloseTimer = undefined
    delete popup.dataset.closing
    popup.hidden = false
    entry.dataset.active = 'true'
    renderPopup()
  }

  const closePopup = () => {
    if (popup.hidden || popup.dataset.closing) return
    delete entry.dataset.active
    popup.dataset.closing = 'true'
    window.clearTimeout(popupCloseTimer)
    popupCloseTimer = window.setTimeout(() => {
      popup.hidden = true
      delete popup.dataset.closing
      popupCloseTimer = undefined
    }, POPOVER_EXIT_MS)
  }

  entry.addEventListener('click', () => {
    if (popup.hidden || popup.dataset.closing) openPopup()
    else closePopup()
  })

  const place = () => {
    if (root && !root.isConnected) root = undefined
    root ??= sidebarRoot()
    if (root) placeEntry(root, entry)
  }
  const observer = new MutationObserver(place)
  observer.observe(document.body, { childList: true, subtree: true })
  const unsubscribe = scope.subscribe(render)
  const unsubscribeUpdates = subscribeUpdateState(next => {
    updateSnapshot = next
    if (next.status === 'updating' || next.status === 'restart-required') {
      openPopup()
      return
    }
    render()
  })
  const outside = event => {
    if (!popup.hidden && !popup.contains(event.target) && !entry.contains(event.target)) {
      closePopup()
    }
  }
  const escape = event => {
    if (event.key === 'Escape') closePopup()
  }
  document.addEventListener('pointerdown', outside)
  document.addEventListener('keydown', escape)
  window.addEventListener('resize', positionPopup)
  place()
  const unsubscribeBalance = subscribeBalanceState(payload => {
    if (!acceptSnapshot(payload.snapshot)) return
    if (payload.channel) {
      const channel = snapshot.channels.find(item => item.id === payload.channel)
      const result = channel?.status === 'error' ? 'error' : 'success'
      if (refreshing.has(payload.channel) || refreshing.has('all')) {
        pendingFeedback.set(payload.channel, result)
      } else {
        showFeedback(payload.channel, result)
      }
    }
    render()
  })
  return () => {
    observer.disconnect()
    unsubscribeBalance()
    unsubscribe()
    unsubscribeUpdates()
    window.clearTimeout(popupCloseTimer)
    for (const timeout of feedbackTimers.values()) window.clearTimeout(timeout)
    document.removeEventListener('pointerdown', outside)
    document.removeEventListener('keydown', escape)
    window.removeEventListener('resize', positionPopup)
    entry.remove()
    popup.remove()
  }
}

function credentialPresentation(snapshot, channelId) {
  const channel = snapshot?.channels?.find(candidate => candidate.id === channelId)
  const credential = channel?.credential
  const indicator = credential?.configured && channel.status === 'ready'
    ? 'success'
    : credential?.configured && channel.status === 'error'
      ? 'error'
      : undefined
  if (credential?.origin === 'environment') {
    return { kind: 'environment', indicator, readonly: '来自环境变量（只读）' }
  }
  if (credential?.origin === 'model') {
    return { kind: 'model', indicator, readonly: '来自模型配置（只读）' }
  }
  if (credential?.origin === 'user') {
    return { kind: 'user', indicator, configured: true }
  }
  if (credential?.origin === 'none') {
    return { kind: 'none', configured: false }
  }
  return { kind: 'loading', readonly: '正在检测凭据来源' }
}

function SettingsIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': true },
    React.createElement('path', {
      d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.09a2 2 0 0 1 1 1.74v.5a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z',
    }),
    React.createElement('circle', { cx: 12, cy: 12, r: 3 }),
  )
}

function RefreshIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': true },
    React.createElement('path', { d: 'M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5' }),
    React.createElement('path', { d: 'M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5' }),
  )
}

function DragHandleIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 18 18', 'aria-hidden': true },
    React.createElement('path', { d: 'M4 5h10M4 9h10M4 13h10' }),
  )
}

function ExternalLinkIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': true },
    React.createElement('path', { d: 'M15 3h6v6' }),
    React.createElement('path', { d: 'm10 14 11-11' }),
    React.createElement('path', {
      d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
    }),
  )
}

function channelWebsiteReactLink(channelId) {
  const channel = CHANNEL_BY_ID.get(channelId)
  if (!channel?.website) return null

  return React.createElement(
    'a',
    {
      className: 'bm-channel-website',
      href: channel.website,
      target: '_blank',
      rel: 'noopener noreferrer',
      title: `打开 ${channel.label} 控制台`,
      'aria-label': `打开 ${channel.label} 控制台`,
    },
    React.createElement(ExternalLinkIcon),
  )
}

function createSettingsCard(scope) {
  return function DshBalanceMonitorSettings() {
    const snapshot = useSyncExternalStore(
      listener => scope.subscribe(listener),
      () => scope.getSnapshot(),
    )
    const [update, setUpdate] = useState()
    const values = snapshot.status === 'ready' ? snapshot.value ?? {} : {}
    const [open, setOpen] = useState(false)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [sourceSettingsOpen, setSourceSettingsOpen] = useState(false)
    const [showSidebar, setShowSidebar] = useState(values.showSidebar ?? true)
    const [balancePrecision, setBalancePrecision] = useState(
      normalizeBalancePrecision(values.balancePrecision),
    )
    const [sidebarChannels, setSidebarChannels] = useState(
      values.sidebarChannels ?? CHANNEL_IDS,
    )
    const [channelOrder, setChannelOrder] = useState(() => normalizeChannelOrder(values.channelOrder))
    const pickerMenu = useRef()
    const limitTooltip = useRef()
    const precisionTooltip = useRef()
    const precisionDragging = useRef(false)
    const [teamoRangeDays, setTeamoRangeDays] = useState(values.teamoRangeDays ?? 7)
    const [deepseekKey, setDeepseekKey] = useState('')
    const [kimiKey, setKimiKey] = useState('')
    const [zhipuKey, setZhipuKey] = useState('')
    const [teamoKey, setTeamoKey] = useState('')
    const [balanceSnapshot, setBalanceSnapshot] = useState()
    const [saving, setSaving] = useState(false)
    const [refreshingChannels, setRefreshingChannels] = useState(() => new Set())
    const [message, setMessage] = useState('')
    const [failed, setFailed] = useState(false)
    const settingsWrites = useRef(Promise.resolve())

    useEffect(() => {
      if (snapshot.status !== 'ready') return
      setShowSidebar(values.showSidebar ?? true)
      setBalancePrecision(normalizeBalancePrecision(values.balancePrecision))
      setSidebarChannels(values.sidebarChannels ?? CHANNEL_IDS)
      setChannelOrder(normalizeChannelOrder(values.channelOrder))
      setTeamoRangeDays(values.teamoRangeDays ?? 7)
    }, [snapshot.revision])

    useEffect(() => {
      if (!open) {
        setPickerOpen(false)
        setSourceSettingsOpen(false)
      }
    }, [open])

    useEffect(() => {
      if (!pickerOpen) return undefined
      const closeOutside = event => {
        if (!(event.target instanceof Element) || !event.target.closest('.bm-multi')) {
          setPickerOpen(false)
        }
      }
      const closeOnEscape = event => {
        if (event.key === 'Escape') setPickerOpen(false)
      }
      document.addEventListener('pointerdown', closeOutside)
      document.addEventListener('keydown', closeOnEscape)
      return () => {
        document.removeEventListener('pointerdown', closeOutside)
        document.removeEventListener('keydown', closeOnEscape)
      }
    }, [pickerOpen])

    useEffect(() => {
      if (!sourceSettingsOpen) return undefined
      const closeOutside = event => {
        if (!event.target.closest('[data-bm-source-settings]')) setSourceSettingsOpen(false)
      }
      const closeOnEscape = event => {
        if (event.key === 'Escape') setSourceSettingsOpen(false)
      }
      document.addEventListener('pointerdown', closeOutside)
      document.addEventListener('keydown', closeOnEscape)
      return () => {
        document.removeEventListener('pointerdown', closeOutside)
        document.removeEventListener('keydown', closeOnEscape)
      }
    }, [sourceSettingsOpen])

    useEffect(() => subscribeUpdateState(setUpdate), [])
    useEffect(() => subscribeBalanceState(({ snapshot: next }) => {
      setBalanceSnapshot(next)
    }), [])

    const persistSetting = (path, value) => {
      setFailed(false)
      setMessage('')
      settingsWrites.current = settingsWrites.current
        .then(async () => {
          const current = scope.getSnapshot()
          if (current.status !== 'ready' || !current.writable) {
            throw new Error('设置暂不可保存')
          }
          await scope.mutate([
            { op: 'set', path: [path], value },
          ], current.revision)
        })
        .catch(error => {
          setFailed(true)
          setMessage(error.message)
        })
      return settingsWrites.current
    }

    useEffect(() => {
      if (!pickerOpen || !pickerMenu.current) return undefined
      const sortable = Sortable.create(pickerMenu.current, {
        animation: 180,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        handle: '.bm-drag-handle',
        draggable: '.bm-multi-option',
        dataIdAttr: 'data-channel-id',
        direction: 'vertical',
        forceFallback: true,
        fallbackOnBody: true,
        fallbackTolerance: 3,
        swapThreshold: 0.65,
        ghostClass: 'bm-sortable-ghost',
        chosenClass: 'bm-sortable-chosen',
        dragClass: 'bm-sortable-drag',
        onEnd: event => {
          const from = event.oldDraggableIndex
          const to = event.newDraggableIndex
          if (!Number.isInteger(from) || !Number.isInteger(to) || from === to) return
          const next = normalizeChannelOrder(channelOrder)
          next.splice(to, 0, next.splice(from, 1)[0])
          setChannelOrder(next)
          void persistSetting('channelOrder', next)
        },
      })
      return () => sortable.destroy()
    }, [pickerOpen, channelOrder])

    const saveTeamoSettings = async () => {
      setSaving(true)
      setFailed(false)
      setMessage('')
      try {
        const rangeDays = Number(teamoRangeDays)
        if (!Number.isInteger(rangeDays) || rangeDays < 2 || rangeDays > 90) {
          throw new Error('统计天数必须是 2 到 90 的整数')
        }
        await scope.mutate([
          { op: 'set', path: ['teamoRangeDays'], value: rangeDays },
        ], snapshot.revision)
        await api('/api/dsh-balance-monitor/refresh', {
          method: 'POST',
          body: JSON.stringify({ channel: 'teamo' }),
        })
        setSourceSettingsOpen(false)
        setMessage('TeamoRouter 设置已保存')
      } catch (error) {
        setFailed(true)
        setMessage(error.message)
      } finally {
        setSaving(false)
      }
    }

    const removeCredential = async (channel, clearValue) => {
      setSaving(true)
      setFailed(false)
      setMessage('')
      try {
        await api('/api/dsh-balance-monitor/credential', {
          method: 'POST',
          body: JSON.stringify({ action: 'unset', channel }),
        })
        clearValue()
        setMessage('已移除')
      } catch (error) {
        setFailed(true)
        setMessage(error.message)
      } finally {
        setSaving(false)
      }
    }

    const refreshCredential = async (channel, value, clearValue) => {
      if (refreshingChannels.has(channel)) return
      setRefreshingChannels(current => new Set(current).add(channel))
      setFailed(false)
      setMessage('')
      try {
        const credential = value.trim()
        const next = credential
          ? await api('/api/dsh-balance-monitor/credential', {
            method: 'POST',
            body: JSON.stringify({ action: 'set', channel, value: credential }),
          })
          : await api('/api/dsh-balance-monitor/refresh', {
            method: 'POST',
            body: JSON.stringify({ channel }),
          })
        if (credential) {
          clearValue()
          setMessage('已保存并刷新')
        }
        setBalanceSnapshot(next)
      } catch (error) {
        setFailed(true)
        setMessage(error.message)
      } finally {
        setRefreshingChannels(current => {
          const next = new Set(current)
          next.delete(channel)
          return next
        })
      }
    }

    const field = (label, control, indicator, action, refresh, websiteChannel) => React.createElement(
      'div',
      { className: 'bm-field' },
      React.createElement(
        'div',
        { className: 'bm-field-label' },
        React.createElement('label', null, label),
        websiteChannel ? channelWebsiteReactLink(websiteChannel) : null,
        indicator === undefined ? null : React.createElement(
          'span',
          {
            className: 'bm-credential-dot',
            'data-status': indicator,
            role: 'img',
            'aria-label': indicator === 'success' ? '数据获取正常' : '数据获取失败',
            title: indicator === 'success' ? '数据获取正常' : '数据获取失败',
          },
        ),
        action,
      ),
      React.createElement(
        'div',
        { className: 'bm-field-row' },
        control,
        refresh ? React.createElement(
          'button',
          {
            className: `bm-field-refresh${refreshingChannels.has(refresh.channel) ? ' bm-spinning' : ''}`,
            type: 'button',
            title: `刷新 ${label}`,
            'aria-label': `刷新 ${label}`,
            disabled: saving || refreshingChannels.has(refresh.channel),
            onClick: () => void refreshCredential(refresh.channel, refresh.value, refresh.clearValue),
          },
          React.createElement(RefreshIcon),
        ) : null,
      ),
    )

    const toggleSidebarChannel = id => {
      const next = sidebarChannels.includes(id)
        ? sidebarChannels.length > 1
          ? sidebarChannels.filter(value => value !== id)
          : sidebarChannels
        : sidebarChannels.length >= MAX_SIDEBAR_CHANNELS
          ? sidebarChannels
          : [...sidebarChannels, id]
      if (next === sidebarChannels) return
      setSidebarChannels(next)
      void persistSetting('sidebarChannels', next)
    }

    const optionsById = new Map(CHANNEL_OPTIONS.map(channel => [channel.id, channel]))
    const orderedOptions = channelOrder.map(id => optionsById.get(id)).filter(Boolean)
    const selectedLabels = orderedOptions
      .filter(channel => sidebarChannels.includes(channel.id))
      .map(channel => channel.label)
      .join('、')

    const moveLimitTooltip = event => {
      const tooltip = limitTooltip.current
      if (!tooltip) return

      tooltip.textContent = event.currentTarget.dataset.limitMessage ?? ''
      tooltip.hidden = false

      const gap = 12
      const edge = 8
      const rect = tooltip.getBoundingClientRect()
      let left = event.clientX + gap
      let top = event.clientY + gap

      if (left + rect.width > window.innerWidth - edge) {
        left = event.clientX - rect.width - gap
      }
      if (top + rect.height > window.innerHeight - edge) {
        top = event.clientY - rect.height - gap
      }

      tooltip.style.left = `${Math.max(edge, left)}px`
      tooltip.style.top = `${Math.max(edge, top)}px`
    }

    const hideLimitTooltip = () => {
      if (limitTooltip.current) limitTooltip.current.hidden = true
    }

    const movePrecisionTooltip = event => {
      if (!precisionDragging.current || !precisionTooltip.current) return
      const tooltip = precisionTooltip.current
      const value = BALANCE_PRECISIONS[Number(event.currentTarget.value)]
      tooltip.textContent = balancePrecisionLabel(value)
      tooltip.hidden = false
      tooltip.style.left = `${event.clientX}px`

      const height = tooltip.getBoundingClientRect().height
      const above = event.clientY - height - 12
      tooltip.style.top = `${above >= 8 ? above : event.clientY + 14}px`
    }

    const hidePrecisionTooltip = () => {
      precisionDragging.current = false
      if (precisionTooltip.current) precisionTooltip.current.hidden = true
    }

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
        {
          className: 'bm-multi-menu',
          ref: pickerMenu,
          role: 'listbox',
          'aria-multiselectable': true,
        },
        ...orderedOptions.map(channel => {
          const checked = sidebarChannels.includes(channel.id)
          const disabled = !checked && sidebarChannels.length >= MAX_SIDEBAR_CHANNELS
          return React.createElement(
            'div',
            {
              key: channel.id,
              className: 'bm-multi-option',
              'data-channel-id': channel.id,
              'data-disabled': String(disabled),
              'aria-disabled': disabled,
              'data-limit-message': disabled
                ? '侧边栏最多仅展示 3 个'
                : undefined,
              onPointerMove: disabled ? moveLimitTooltip : undefined,
              onPointerLeave: disabled ? hideLimitTooltip : undefined,
            },
            React.createElement(
              'label',
              { className: 'bm-multi-option-select' },
              React.createElement('input', {
                type: 'checkbox',
                checked,
                disabled,
                onChange: () => toggleSidebarChannel(channel.id),
              }),
              React.createElement('span', null, channel.label),
            ),
            React.createElement(
              'button',
              {
                className: 'bm-drag-handle',
                type: 'button',
                title: `拖动调整 ${channel.label} 顺序`,
                'aria-label': `拖动调整 ${channel.label} 顺序`,
              },
              React.createElement(DragHandleIcon),
            ),
          )
        }),
      ) : null,
      pickerOpen ? React.createElement('div', {
        className: 'bm-limit-tooltip',
        ref: limitTooltip,
        role: 'tooltip',
        hidden: true,
      }) : null,
    )

    const teamoSettings = React.createElement(
      'div',
      { className: 'bm-source-settings', 'data-bm-source-settings': '' },
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'bm-source-settings-trigger',
          title: 'TeamoRouter 设置',
          'aria-label': 'TeamoRouter 设置',
          'aria-expanded': sourceSettingsOpen,
          'data-open': String(sourceSettingsOpen),
          disabled: saving,
          onClick: () => setSourceSettingsOpen(value => !value),
        },
        React.createElement(SettingsIcon),
      ),
      sourceSettingsOpen ? React.createElement(
        'div',
        { className: 'bm-source-popover', role: 'dialog', 'aria-label': 'TeamoRouter 设置' },
        React.createElement('div', { className: 'bm-source-popover-title' }, 'TeamoRouter 设置'),
        React.createElement(
          'div',
          { className: 'bm-source-popover-field' },
          React.createElement('label', null, '统计天数'),
          React.createElement('input', {
            type: 'number',
            min: 2,
            max: 90,
            step: 1,
            value: teamoRangeDays,
            disabled: saving,
            onChange: event => setTeamoRangeDays(event.target.value),
          }),
        ),
        React.createElement(
          'div',
          { className: 'bm-source-popover-actions' },
          React.createElement(
            'button',
            {
              className: 'bm-button',
              type: 'button',
              disabled: saving,
              onClick: () => setSourceSettingsOpen(false),
            },
            '取消',
          ),
          React.createElement(
            'button',
            {
              className: 'bm-button bm-button-primary',
              type: 'button',
              disabled: saving || snapshot.status !== 'ready' || !snapshot.writable,
              onClick: () => void saveTeamoSettings(),
            },
            saving ? '保存中' : '保存',
          ),
        ),
      ) : null,
    )

    const credentialField = ({
      channel,
      label,
      placeholder,
      value,
      setValue,
    }) => {
      const presentation = credentialPresentation(balanceSnapshot, channel)
      const editable = presentation.kind === 'user' || presentation.kind === 'none'
      const control = editable
        ? React.createElement(
          'div',
          { className: 'bm-credential-control' },
          React.createElement('input', {
            type: 'text',
            className: 'bm-secret-input',
            name: `dsh-balance-monitor-${channel}-credential`,
            value,
            autoComplete: 'off',
            spellCheck: false,
            'data-form-type': 'other',
            'data-1p-ignore': true,
            'data-lpignore': 'true',
            placeholder: presentation.configured ? '已配置——输入新值可替换' : placeholder,
            disabled: saving,
            onChange: event => setValue(event.target.value),
          }),
          presentation.kind === 'user' ? React.createElement(
            'button',
            {
              className: 'bm-credential-clear',
              type: 'button',
              title: `移除 ${label}`,
              'aria-label': `移除 ${label}`,
              disabled: saving,
              onClick: () => void removeCredential(channel, () => setValue('')),
            },
            React.createElement('span', { 'aria-hidden': true }, '×'),
          ) : null,
        )
        : React.createElement(
          'div',
          { className: 'bm-credential-readonly', 'aria-disabled': true },
          presentation.readonly,
        )
      return field(
        label,
        control,
        presentation.indicator,
        channel === 'teamo' ? teamoSettings : undefined,
        { channel, value, clearValue: () => setValue('') },
        channel,
      )
    }

    const form = React.createElement(
      'div',
      { className: 'bm-form' },
      React.createElement(
        'div',
        { className: 'bm-checkbox-field' },
        React.createElement('input', {
          type: 'checkbox',
          checked: showSidebar,
          'aria-label': '展示侧边栏',
          onChange: event => {
            const next = event.target.checked
            setShowSidebar(next)
            void persistSetting('showSidebar', next)
          },
        }),
        React.createElement('span', null, '展示侧边栏'),
      ),
      React.createElement(
        'div',
        { className: 'bm-precision-setting' },
        React.createElement(
          'label',
          { className: 'bm-precision-title', htmlFor: 'bm-balance-precision' },
          '余额保留位数',
          React.createElement(
            'span',
            { className: 'bm-precision-current' },
            balancePrecisionLabel(balancePrecision),
          ),
        ),
        React.createElement(
          'div',
          { className: 'bm-precision-control' },
          React.createElement('span', { className: 'bm-precision-end' }, '无小数位'),
          React.createElement(
            'div',
            { className: 'bm-precision-track' },
            React.createElement('input', {
              id: 'bm-balance-precision',
              type: 'range',
              className: 'bm-precision-slider',
              min: 0,
              max: BALANCE_PRECISIONS.length - 1,
              step: 1,
              value: BALANCE_PRECISIONS.indexOf(balancePrecision),
              style: {
                '--bm-precision-progress':
                  `${BALANCE_PRECISIONS.indexOf(balancePrecision) / 7 * 100}%`,
              },
              'aria-valuetext': balancePrecision === 'exact'
                ? '精确'
                : balancePrecision === '0'
                  ? '无小数位'
                  : `保留 ${balancePrecision} 位`,
              onPointerDown: event => {
                precisionDragging.current = true
                movePrecisionTooltip(event)
              },
              onPointerMove: movePrecisionTooltip,
              onPointerUp: hidePrecisionTooltip,
              onPointerCancel: hidePrecisionTooltip,
              onBlur: hidePrecisionTooltip,
              onChange: event => {
                const next = BALANCE_PRECISIONS[Number(event.target.value)]
                setBalancePrecision(next)
                void persistSetting('balancePrecision', next)
              },
            }),
            React.createElement(
              'span',
              { className: 'bm-precision-ticks', 'aria-hidden': true },
              ...BALANCE_PRECISIONS.map(value =>
                React.createElement('span', { key: value }),
              ),
            ),
          ),
          React.createElement('span', { className: 'bm-precision-end' }, '精确'),
        ),
        React.createElement('span', {
          className: 'bm-precision-tooltip',
          ref: precisionTooltip,
          role: 'tooltip',
          hidden: true,
        }),
      ),
      field('侧边栏渠道', channelPicker),
      credentialField({
        channel: 'deepseek',
        label: 'DeepSeek API Key',
        placeholder: 'sk-...',
        value: deepseekKey,
        setValue: setDeepseekKey,
      }),
      credentialField({
        channel: 'kimi',
        label: 'Kimi API Key',
        placeholder: 'sk-...',
        value: kimiKey,
        setValue: setKimiKey,
      }),
      credentialField({
        channel: 'zhipu',
        label: '智谱 GLM API Key',
        placeholder: '请输入 API Key',
        value: zhipuKey,
        setValue: setZhipuKey,
      }),
      credentialField({
        channel: 'teamo',
        label: 'TeamoRouter API Key',
        placeholder: 'sk-teamo-...',
        value: teamoKey,
        setValue: setTeamoKey,
      }),
      message ? React.createElement(
        'div',
        { className: 'bm-message', 'data-error': String(failed) },
        message,
      ) : null,
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
            onClick: triggerUpdate,
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
  const scope = ctx.settingsScope.bind({ namespace: NS })
  const SettingsCard = createSettingsCard(scope)
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: NS,
    order: 1_000,
  }, SettingsCard))
  ctx.effect(() => mountMonitor(scope), 'dsh-balance-monitor: sidebar')
}
