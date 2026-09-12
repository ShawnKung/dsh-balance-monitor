import z from '@deepseek-ai/schemastery'
import { channels } from './channels/index.js'
import { ActiveSessionRefresher } from './lib/active-session-refresher.js'
import {
  providerCredentialRefsForChannel,
  refreshTargetForSession,
} from './lib/channel-routing.js'
import { createRoutes } from './lib/http.js'
import { BalanceService } from './lib/service.js'
import {
  getUpdateService,
  UPDATE_CHECK_INTERVAL_MS,
} from './lib/updater.js'

export const name = 'dsh-balance-monitor'
export const inject = ['webServer', 'credentials']

export const Config = z.object({
  showSidebar: z.boolean().default(true),
  balancePrecision: z.union(['0', '1', '2', '3', '4', '5', '6', 'exact']).default('2'),
  sidebarChannels: z.array(z.union(['deepseek', 'kimi', 'zhipu', 'teamo'])).min(1).max(3).default(['deepseek']),
  channelOrder: z.array(z.union(['deepseek', 'kimi', 'zhipu', 'teamo'])).min(1).max(4).default(['deepseek', 'kimi', 'zhipu', 'teamo']),
  deepseekApiKeyRef: z.string().role('credential-ref').default('DEEPSEEK_API_KEY'),
  kimiApiKeyRef: z.string().role('credential-ref').default('KIMI_API_KEY'),
  zhipuApiKeyRef: z.string().role('credential-ref').default('ZAI_API_KEY'),
  teamoApiKeyRef: z.string().role('credential-ref').default('TEAMO_API_KEY'),
  teamoBaseUrl: z.string().default('https://teamorouter.cn'),
  teamoRangeDays: z.number().step(1).min(2).max(90).default(7),
})

const DEFAULT_CONFIG = Object.freeze({
  showSidebar: true,
  balancePrecision: '2',
  sidebarChannels: ['deepseek'],
  channelOrder: ['deepseek', 'kimi', 'zhipu', 'teamo'],
  deepseekApiKeyRef: 'DEEPSEEK_API_KEY',
  kimiApiKeyRef: 'KIMI_API_KEY',
  zhipuApiKeyRef: 'ZAI_API_KEY',
  teamoApiKeyRef: 'TEAMO_API_KEY',
  teamoBaseUrl: 'https://teamorouter.cn',
  teamoRangeDays: 7,
})

function withDefaults(value = {}) {
  return { ...DEFAULT_CONFIG, ...value }
}

export function balanceSourceSignature(value = {}) {
  const config = withDefaults(value)
  return JSON.stringify({
    deepseekApiKeyRef: config.deepseekApiKeyRef,
    kimiApiKeyRef: config.kimiApiKeyRef,
    zhipuApiKeyRef: config.zhipuApiKeyRef,
    teamoApiKeyRef: config.teamoApiKeyRef,
    teamoBaseUrl: config.teamoBaseUrl,
    teamoRangeDays: config.teamoRangeDays,
  })
}

export function apply(ctx, entry = {}) {
  let source = () => withDefaults(entry)
  let sourceSignature = balanceSourceSignature(entry)
  const noProviderCredentials = () => []
  let providerCredentialRefs = noProviderCredentials
  const service = new BalanceService({
    channels,
    credentials: ctx.credentials,
    config: () => withDefaults(source()),
    credentialRefs: (channel, config) => providerCredentialRefs(
      channel.id,
      channel.credentialEndpoint?.(config),
    ),
  })
  const updater = getUpdateService()

  ctx.effect(() => {
    const dispose = createRoutes(service, updater).map(route => ctx.webServer.register(route))
    void updater.check()
    const updateTimer = setInterval(() => {
      void updater.check({ force: true })
    }, UPDATE_CHECK_INTERVAL_MS)
    return () => {
      clearInterval(updateTimer)
      for (const unregister of dispose) unregister()
    }
  }, 'dsh-balance-monitor: routes')

  ctx.inject(['llm', 'settings', 'sessions'], routingCtx => {
    routingCtx.effect(() => {
      const resolver = (channel, targetBaseURL) => providerCredentialRefsForChannel(
        channel,
        targetBaseURL,
        routingCtx.llm,
        routingCtx.settings,
      )
      providerCredentialRefs = resolver
      void service.refreshAllAfterCurrent()
      const channelForSession = session => {
        const target = refreshTargetForSession(session, {
          llm: routingCtx.llm,
          settings: routingCtx.settings,
        })
        return target.kind === 'channel' ? target.channel : undefined
      }
      const activeRefresher = new ActiveSessionRefresher({
        sessions: () => routingCtx.sessions.list(),
        channelForSession,
        refresh: channel => service.refresh(channel),
      })
      activeRefresher.start()

      const offEvent = routingCtx.on('session/event', (session, event) => {
        if (event?.type !== 'turn/end') return
        const channel = channelForSession(session)
        if (!channel) return
        void service.refresh(channel).catch(error => {
          console.error('[dsh-balance-monitor] turn-end refresh failed:', error)
        })
      }, { global: true })
      return () => {
        if (providerCredentialRefs === resolver) {
          providerCredentialRefs = noProviderCredentials
        }
        offEvent()
        activeRefresher.dispose()
      }
    }, 'dsh-balance-monitor: active session refresh')
  })

  ctx.inject(['settings'], settingsCtx => {
    settingsCtx.settings.installSection(
      ctx,
      'dsh-balance-monitor',
      Config,
      withDefaults(entry),
      {
        setSource(next) {
          source = next
        },
        onChange() {
          const nextSignature = balanceSourceSignature(source())
          if (nextSignature === sourceSignature) return
          sourceSignature = nextSignature
          void service.refreshAllAfterCurrent()
        },
      },
    )
  })
}
