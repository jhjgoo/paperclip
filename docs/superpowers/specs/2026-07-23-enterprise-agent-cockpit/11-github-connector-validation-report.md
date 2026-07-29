# GitHub 双面 Connector 技术验证报告

状态：`validated`；确定性协议、Paperclip 生产接缝与隔离真实 GitHub Canary 均通过\
日期：2026-07-27\
验证包：TV-01（VAL-004、VAL-012）

> 归档说明：本报告保留当时验证工作区的实验事实、Digest 与适用边界；可丢弃 Connector 原型、临时 Tool Gateway Interceptor 和执行命令未纳入正式开发基线，不代表当前生产代码含有这些接缝。

## 1. 结论

受控 Provider、持久 Journal、Coordinator、Connector MCP Runtime、生产 Tool Gateway、Plugin Loader 与 Plugin Worker RPC 已形成一条闭合的确定性链路。连续两次完整运行均得到相同语义基数：3 个 External Action Intent、3 个 Provider Pull Request、8 个 Platform Worker Observation，且 scratch PostgreSQL 自动清理。

隔离真实 GitHub Canary 连续两次完整验证均为 `validated`。两轮分别使用 PR #9/#10，且 Create PR、Merge、Workflow Dispatch 的 Provider Mutation 均为 1；响应丢失后只执行 Reconcile，没有第二次外部写入。两轮机器证据 Digest 分别为 `66dcc8f4…c69eb0` 与 `ae7cfaba…8ed7`，后者作为 TV-01 当前保留证据。

## 2. 已通过的协议语义

- 一个 Connector-first Package 同时提供 Agent-facing MCP Runtime 和 Platform-facing Plugin Manifest，不产生第二个产品 Connector 或第二条 Connection。
- Tool 调用在当时的验证工作区经过生产 MCP Gateway Route、Profile/Policy、权威 Tool Invocation、临时 Remote Dispatch Interceptor、Coordinator、签名 Attempt Envelope 和远程 Connector MCP Runtime。
- 审批重放在批准前不 Dispatch，批准后复用同一生产执行链；无 Heartbeat Run 的 Test Call 进入相同 Dispatch Seam 后按 Connector 约束失败关闭。
- Agent 参数和 Caller/Static/Credential Header 不能伪造 Connection、Intent、Attempt 或签名 Envelope；一次 Gateway Invocation 的 `next()` 只能调用一次。
- Webhook、Sync 与 External Object 由 Host 用不透明 Route Key 解析 Connection、Configuration Revision、Connector Version 和 Credential Reference，再进入真实 Plugin Worker RPC；Payload 不能决定 Connection，Context 不包含 Secret。
- Agent Tool 选择、Platform Capability 启停、Connection 启停和两面健康保持正交；同 Company 的两个 Connection 使用不同 Credential Reference。
- Credential Secret 原地轮换不改变 Connection Configuration Revision；显式 V2 Migration 生成新 Revision，已有 Intent 仍固定 V1。
- 现有 Company-scoped External Object 会合并两个 Connection 的同一 Provider Object，只能作为 Fit/Gap 投影，不能作为授权事实或 Connection-scoped External Fact。

## 3. 生产接缝与缺口

本轮唯一生产代码变化是 `createToolGatewayService()` 中默认关闭、默认委托原行为的 Remote MCP Dispatch Interceptor，以及对应聚焦测试。它不引用 SOP、Connector、Intent 或 Attempt 类型，是可整块删除的验证接缝，不是正式 Connector 领域实现。

若进入生产开发，仍需正式设计：

- Connector Definition/Version 与 Connection Configuration Revision 的生产 Schema 和迁移生命周期；
- Connection-aware Platform Execution Context 的稳定 Plugin SDK Contract；
- Connection-scoped、append-only External Fact、Fact Attribution 与 Consumption；
- External Action Intent/Attempt/Reconciliation Journal、CAS、Fencing 与恢复调度；
- Webhook Delivery 唯一约束、Cursor Lease 和两面独立健康；
- Managed Connector MCP Runtime 在独立 Execution Worker 中的生命周期。

## 4. 真实 GitHub 证据

Canary 使用专用仓库 `jhjgoo/paperclip-tv01-canary`、固定 Workflow ID `320858572`、测试 Environment `paperclip-tv01` 和每轮独立的临时 Webhook 接收器。Preflight 先校验数值 Repository ID、Base Branch、Workflow Contract、Environment、Hook URL/事件集合和真实 Signed Ping，之后才允许外部写入。

每轮均真实完成 Branch/Commit、PR、Merge、Workflow、唯一 Envelope Artifact、Deployment 和最新成功 Status；机器证据显式记录 Repository/Workflow/Run/Artifact/Deployment/Status ID、Commit/Merge SHA、Artifact Digest、Delivery ID 与 SQL 基数。Webhook 路径验证 Receipt 独立提交后崩溃、fresh Registry/Store/Sync 轮询恢复和 replay：Receipt=1、Fact=1，Delivery/Receipt/Poll 版本完全相等，replay 与 recovery 使用同一 Fact ID。

两轮结束后，Deployment、Workflow Run、head/base refs 均由独立 Provider 查询确认 404；PR #9/#10 保留为 merged/closed 的不可逆审计事实。Hook 均停用并轮换清理密钥，结果未暴露 Token、Webhook Secret 或业务正文。公共 Webhook.site 发生过 429 的轮次被判为外部观测设施 `inconclusive`，没有混入通过证据。

## 5. 历史证据

当时的完整验证执行在系统临时目录生成 `evidence.json`，包含验证工作区 Git Revision、脏工作区标记、相关文件 SHA-256、场景结果、Invariant、Scope Limit 与 Evidence Digest；未纳入 Git，也不包含 Token、Webhook Secret 或业务正文。原始命令和可丢弃源码不属于正式开发基线，不能从本报告直接重放。

## 6. 适用边界

本报告证明双面 Connector 与非幂等副作用协议能够适配 Paperclip 当前接缝，并在隔离真实 GitHub 上通过 PR/Merge/Workflow/Artifact/Deployment、Signed Webhook、响应丢失恢复和精确清理。它仍不表示生产 Connector Schema/API、Managed MCP Runtime、Agent Sandbox、Worker 接管或 SOP Kernel 已实现；这些边界由 Gate A 后的最小生产纵切以及 TV-04/TV-05 的既有证据共同约束。
