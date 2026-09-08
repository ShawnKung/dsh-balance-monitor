# 更新日志

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 和 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

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

[0.1.0]: https://github.com/ShawnKung/dsh-balance-monitor/releases/tag/v0.1.0
