# dsh-balance-monitor

<div align="center">
  <strong>在 DSH Web 侧边栏中查看多渠道余额与用量</strong>
  <br /><br />
  <a href="https://www.npmjs.com/package/%40shawnkung%2Fdsh-balance-monitor"><img alt="npm version" src="https://img.shields.io/npm/v/%40shawnkung%2Fdsh-balance-monitor" /></a>
  <a href="https://github.com/ShawnKung/dsh-balance-monitor/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/ShawnKung/dsh-balance-monitor/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/ShawnKung/dsh-balance-monitor/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ShawnKung/dsh-balance-monitor" /></a>
  <a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
  <br /><br />
  <a href="https://www.npmjs.com/package/@deepseek-ai/dsh?activeTab=versions"><img alt="DSH 0.1.2-rc.1+" src="https://img.shields.io/badge/DSH-0.1.2--rc.1%2B-4d6bfe" /></a>
  <img alt="多渠道" src="https://img.shields.io/badge/-多渠道-4d6bfe" />
  <img alt="余额与用量" src="https://img.shields.io/badge/-余额与用量-4d6bfe" />
  <img alt="主题适配" src="https://img.shields.io/badge/-主题适配-4d6bfe" />
  <img alt="安全凭据" src="https://img.shields.io/badge/-安全凭据-4d6bfe" />
</div>

## 功能

- 在“新会话”和工作区之间展示所选渠道的余额，不干扰任务看板等其他侧边栏插件。
- 点击侧边栏入口查看所有渠道的余额、消费、请求数和 Token 用量。
- 支持单渠道刷新与全量刷新，并通过颜色渐变反馈刷新结果。
- 会话结束后，根据当前模型 provider 的实际 API 域名定向刷新对应渠道。
- 支持浅色、深色和跟随系统主题。
- 在插件设置中选择侧边栏展示渠道、配置凭据引用和 TeamoRouter 查询范围。

## 支持渠道

| 渠道 | 余额 | 每日/区间消费 | Token 用量 | 自动刷新识别 |
| --- | --- | --- | --- | --- |
| DeepSeek 官方 API | 是 | 否 | 否 | `deepseek.com` |
| TeamoRouter | 是 | 是 | 是 | `teamorouter.cn` |

未知域名、缺失 provider 或无效 URL 不会触发兜底全量刷新。

## 安装

前置条件：

- 已安装 DSH，且 `dsh web` 可以正常运行。
- Node.js 20 或更高版本。

### 从 npm 安装

```bash
version="$(npm view @shawnkung/dsh-balance-monitor version)"
dsh plugin --profile web add "@shawnkung/dsh-balance-monitor@$version"
dsh plugin --profile web list
```

使用精确版本可以避免 pnpm 的现有 lockfile 或新版本冷却策略继续保留旧版本。安装后先在列表中确认实际版本，再重启 DSH Web 进程并硬刷新浏览器（macOS：`Cmd+Shift+R`；Windows/Linux：`Ctrl+Shift+R`）。

### 从源码安装

```bash
git clone https://github.com/ShawnKung/dsh-balance-monitor.git
cd dsh-balance-monitor
npm ci
npm run ci
dsh plugin --profile web add link:"$(pwd)"
```

`link:` 会让 DSH profile 直接引用当前目录。修改前端源码后执行 `npm run build` 并刷新页面；修改 Host 代码后还需要重启 DSH Web。

### 更新

```bash
version="$(npm view @shawnkung/dsh-balance-monitor version)"
dsh plugin --profile web add "@shawnkung/dsh-balance-monitor@$version"
dsh plugin --profile web list
```

## 配置

进入 DSH 的“设置 → 插件 → DSH Balance Monitor”：

- **侧边栏展示渠道**：可多选，最多展示 3 个渠道。
- **DeepSeek API Key**：默认凭据引用为 `DEEPSEEK_API_KEY`。
- **TeamoRouter API Key**：默认凭据引用为 `TEAMO_API_KEY`。
- **TeamoRouter API 地址**：余额与用量接口地址。
- **统计天数**：TeamoRouter 区间统计范围，支持 2 至 90 天。

API Key 通过 DSH credentials 服务解析和写入，明文不会发送到浏览器。插件优先使用自身配置的凭据；未配置时，会按 provider 的实际 API 域名查找唯一匹配渠道，并通过该 provider 的 `apiKeyEnv` 凭据引用自动复用模型 Key。只有插件请求端点仍属于同一受支持渠道域名时才会复用；若同一渠道存在多个不同的 provider 凭据，插件不会擅自选择。

## 自动刷新

插件启动时会刷新全部可解析到凭据的渠道。此后：

- 点击顶部刷新按钮：刷新全部渠道。
- 点击渠道刷新按钮：只刷新该渠道。
- 会话回合结束：读取 Session 中的 provider，通过 DSH provider 目录找到对应 `baseURL`，再按 hostname 匹配渠道。
- provider 未命中已支持域名：不刷新。

Host 快照带有单调递增的 revision，前端会拒绝迟到的旧快照，避免启动阶段的 `loading` 覆盖已完成结果。

## 安全设计

- API Key 只存在于 DSH credentials 服务和 Host 请求链路。
- 自动复用模型 Key 时只读取 provider 的凭据引用，并调用 `ctx.credentials.resolve()`；插件不直接读取环境变量或凭据文件。
- 浏览器只接收凭据是否已配置、来源和是否可写等元数据。
- HTTP 与 SSE 接口仅接受 loopback 且同源的请求。
- provider 识别使用 `URL.hostname` 做精确域名或子域名匹配，不使用字符串包含判断。
- npm 发布内容由 `package.json#files` 白名单控制，并在 CI 中执行 tarball 审计。

安全问题请参阅 [SECURITY.md](./SECURITY.md)。

## 开发

```bash
npm ci
npm run check
npm test
npm run build
```

完整检查：

```bash
npm run ci
npm pack --dry-run
```

提交信息必须遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)：

```text
feat: add a new balance channel
fix: prevent stale snapshots from replacing fresh data
docs: clarify local installation
```

详细流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 发布

1. 更新 `package.json` 和 `CHANGELOG.md` 中的版本。
2. 合并通过 CI 的 Conventional Commit。
3. 创建并推送格式为 `vX.Y.Z` 的 Tag。
4. `release.yml` 校验 Tag 与包版本一致后，通过 npm Trusted Publishing 自动发布，并创建 GitHub Release。

## 许可证

[MIT](./LICENSE) © ShawnKung
