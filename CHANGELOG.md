# 更新日志

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 和 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

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
