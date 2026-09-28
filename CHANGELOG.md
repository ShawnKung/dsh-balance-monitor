# 更新日志

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 和 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [Unreleased]

## [0.2.3] - 2026-09-29

### 修复

- 将插件配置页迁移到 DSH 0.1.7 官方 `plugins.row.config` 扩展点；配置入口现在位于侧边栏“插件”中对应组件行的“配置”，不再注册已经移除的 `settings.plugin.item`。
- 配置页直接使用 Plugin Manager 提供的带 revision 栅栏表单，以暂存、保存和撤销动作提交显示设置，并移除由外层详情页重复提供的标题与折叠卡片 chrome。
- 让“展示侧边栏”真正控制 `sidebar.panellist` 注册生命周期；展开时按用户顺序逐行显示左侧渠道和右对齐余额，折叠时保留居中的钱包图标。
- 恢复渠道刷新完成后的侧边栏余额反馈动画；即使余额数值未变化，也会对成功和失败结果分别闪烁提示。

## [0.2.2] - 2026-09-28

### 变更

- 侧边栏入口迁移至 DSH 框架的 `sidebar.panellist` slot，作为独立 PanelRow 渲染在任务看板之后（order=200），交由框架统一管理图标对齐、hover / active 样式与折叠动画；点击图标仍弹出余额面板，不切换到 panel 路由。
- 服务端配置改由 `configForms` 的 volatile 快照驱动：所有字段声明为 `.volatile()`，通过 `settings.describe()` + `settings/document-updated` 事件同步命名空间快照，取代已弃用的 `settings.installSection` 流程。
- 将 `@deepseek-ai/schemastery` 的 peer 与开发依赖同步至 `^3.18.4`，以支持 volatile schema。

### 移除

- 移除手写 `sidebarRoot` / `newSessionRow` / `placeEntry` 定位逻辑与 MutationObserver 贴片，同步删除入口专用的 `[data-dsh-balance-monitor-entry]` CSS 规则。

## [0.2.1] - 2026-09-28

### 修复

- 修复服务端 `settings.get` 调用因 DSH 0.1.7 `SettingsForms` 服务不再提供该方法而抛出 `settings.get is not a function`，导致余额面板持续"正在加载"、所有渠道均为 error 的问题；改为通过 `settings.describe()` 检索命名空间快照。

## [0.2.0] - 2026-09-28

### 变更

- 迁移至 DSH 0.1.7 的 `configForms` 服务，取代已下线的 `settingsScope`。声明兼容 dsh `>=0.1.7-rc.1 <0.2.0`；不再兼容 0.1.6 及更早版本。

## [0.1.16] - 2026-09-14

### 变更

- 余额弹窗仅按用户设置顺序展示已配置 API Key 的渠道。

## [0.1.15] - 2026-09-12

### 新增

- 活跃会话执行期间每分钟刷新对应渠道余额；全局任务按渠道去重，并保留会话回合结束后的即时刷新。

## [0.1.14] - 2026-09-10

### 修复

- 修复官方 DeepSeek 和 Moonshot AI CN 模型在会话结束后未触发对应余额刷新的问题。

## [0.1.13] - 2026-09-10

### 变更

- 新安装默认仅在侧边栏展示 DeepSeek 渠道。

## [0.1.12] - 2026-09-10

### 新增

- 在余额弹窗和设置页提供各渠道控制台的快捷入口。

## [0.1.11] - 2026-09-10

### 新增

- 支持统一设置所有余额与金额的显示精度。

## [0.1.10] - 2026-09-10

### 新增

- 支持智谱 GLM 按量账户余额查询，并自动复用 `ZAI_API_KEY` 或匹配 `bigmodel.cn` 的模型凭据。

## [0.1.7] - 2026-09-09

### 新增

- 支持 Kimi 官方 API 余额查询，使用 CN Host `https://api.moonshot.cn/v1`。

## [0.1.6] - 2026-09-09

### 改进

- 点击“刷新全部”时同步触发一次插件更新检查，单渠道刷新不受影响。
- 为余额弹窗增加淡入淡出动画，并移除右上角关闭按钮。

## [0.1.5] - 2026-09-09

### 修复

- 将更新状态收敛到 Host 全局单例，并通过 SSE 同步弹窗与设置页，避免安装触发插件热重载后状态回退。
- 每 10 分钟由 Host 自动检查一次 npm 新版本。

## [0.1.4] - 2026-09-09

### 修复

- 侧边栏收起时采用与任务看板一致的入口尺寸和居中规则，避免余额图标发生偏移。

## [0.1.3] - 2026-09-09

### 新增

- 在余额弹窗和设置页展示插件版本。
- 启动时检查 npm 新版本，并支持从插件内安装精确版本；安装完成后提示重启生效。

### 修复

- npm 安装与更新流程改为解析并安装精确版本，避免 pnpm 沿用旧 lockfile 或因新版本冷却策略保留旧包。

## [0.1.2] - 2026-09-08

### 新增

- 插件凭据未配置时，可通过 DSH provider 的 `apiKeyEnv` 自动复用唯一匹配渠道的模型凭据。

### 安全

- 模型凭据仅通过 DSH credentials 服务在 Host 端解析；多个不同凭据匹配同一渠道时不自动选择。

## [0.1.1] - 2026-09-08

### 修复

- 使用 scoped npm 包名注册浏览器模块，修复从 npm 安装后 DSH 无法加载插件的问题。

## [0.1.0] - 2026-09-08

### 新增

- 在 DSH Web 侧边栏展示多渠道余额。
- 支持 DeepSeek 官方 API 与 TeamoRouter。
- 提供余额详情、区间消费、请求数和 Token 用量。
- 支持单渠道刷新、全量刷新与刷新结果动画。
- 支持浅色、深色和跟随系统主题。
- 支持通过 DSH credentials 安全配置 API Key。
- 会话结束后根据 provider 的实际 API 域名定向刷新。

### 安全

- Host HTTP 与 SSE 接口限制为 loopback 且同源访问。
- API Key 不返回浏览器。
- provider 域名使用解析后的 hostname 精确匹配。

[0.1.7]: https://github.com/ShawnKung/dsh-balance-monitor/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/ShawnKung/dsh-balance-monitor/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/ShawnKung/dsh-balance-monitor/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/ShawnKung/dsh-balance-monitor/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/ShawnKung/dsh-balance-monitor/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/ShawnKung/dsh-balance-monitor/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/ShawnKung/dsh-balance-monitor/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ShawnKung/dsh-balance-monitor/releases/tag/v0.1.0
