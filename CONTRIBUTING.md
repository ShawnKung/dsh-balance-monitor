# 贡献指南

感谢你参与 dsh-balance-monitor。提交代码前，请先确认变更范围清晰、没有包含任何凭据或本机信息。

## 开发环境

- Node.js 20 或更高版本
- npm 10 或更高版本
- 可运行的 DSH Web 环境（仅手动集成测试需要）

```bash
git clone https://github.com/ShawnKung/dsh-balance-monitor.git
cd dsh-balance-monitor
npm ci
npm run ci
```

本地挂载：

```bash
dsh plugin --profile web add link:"$(pwd)"
```

## 分支与 Pull Request

1. 从最新 `main` 创建短生命周期分支。
2. 保持变更聚焦，不混入无关重构。
3. 新增渠道时，将 API 请求、数据映射和展示元数据封装在独立 channel 模块中。
4. 修改共享状态、路由、安全边界或自动刷新逻辑时，必须补充回归测试。
5. 提交 Pull Request 前执行 `npm run ci` 和 `npm pack --dry-run`。

Pull Request 描述应包含：

- 变更动机和用户可见行为。
- 安全、兼容性或数据处理影响。
- 已执行的测试。
- UI 变更的脱敏截图（如适用）。

## Conventional Commits

所有提交信息必须遵循 Conventional Commits：

```text
<type>(可选 scope): <description>
```

常用类型：

- `feat`：新增用户可见能力。
- `fix`：修复缺陷。
- `refactor`：不改变行为的结构调整。
- `test`：增加或调整测试。
- `docs`：文档变更。
- `build`：构建或依赖变更。
- `ci`：持续集成与发布流程变更。
- `chore`：其他维护工作。

示例：

```text
feat(channel): add a new balance provider
fix(client): ignore stale startup snapshots
docs: document source installation
```

## 安全要求

- 不提交 API Key、Token、Cookie、私有地址或真实账户数据。
- 测试凭据必须使用明显的假值。
- 不把凭据明文返回给浏览器。
- 新增 HTTP 接口必须保留 loopback 与同源校验。
- 域名识别必须使用解析后的 hostname，不使用不受边界约束的字符串包含判断。

发现安全问题请按 [SECURITY.md](./SECURITY.md) 私下报告，不要创建公开 Issue。
