# Agent 能力继承、Stage 收窄与撤权技术验证报告

状态：`validated`（可丢弃授权协议原型）\
日期：2026-07-26\
验证包：TV-03（VAL-006）

> 归档说明：本报告保留授权协议、不变量与 Digest；可丢弃 evaluator、生产适配审计文件和执行命令未纳入正式开发基线。

## 1. 结论

TV-03 证明了首期“默认继承、可选稳定 ID 收窄、绝不提权”可以由一套通用协议表达，不需要让 SOP/Stage 绑定 Connector、Secret 或 Extension，也不需要为 Extension Tool 新增第三套 Grant。

两套全新 scratch PostgreSQL 连续执行均得到相同语义基数：9 个场景、4 个 Agent Snapshot/Stage Manifest 组合、5 个当前能力状态、39 条授权审计和 4 次合法 Tool Dispatch。21 次拒绝与 1 次待审批均没有 Dispatch。

在 TV-05 增加可逆 Heartbeat 执行接缝后，TV-03 已针对当前源码重新执行并保持相同语义基数；当前可复核 Evidence Digest 为 `24f0ad87c755d61b78169add367372d2345b5575b34aecfed28308cf1d5a7b0f`。

## 2. 已验证的不变量

- `inherit` 等于固定 Agent Configuration Snapshot 中当前仍有效的 Tool 集合。
- `restricted` 严格等于该集合与 Stage exact-ID Allowlist 的交集；Stage 中不存在于 Agent Snapshot 的 ID 不能提权。
- Connection-backed Tool 与 Connectionless Extension Tool 经过同一 Binding、Token、Gateway、Stage Allowlist 和审计逻辑。
- Display Name、Description 和相同 Tool Key 不参与授权；伪造同名但不同 Contribution ID 的能力被拒绝。
- Allow Policy、Trust Rule、人工批准和缓存工具名均不能突破 Agent/Stage Ceiling；Block 仍具有否决权，Approval 只作用于本来有权的请求。
- Tool List 与 Tool Call 使用相同 evaluator；Agent 即使记住未展示工具也无法调用。
- Connection Token Mint 与 Secret Read 使用同一 Ceiling；Connection/Tool/Secret Path 必须精确匹配，请求 Scope 必须是固定 Binding Scope 的子集。
- Token 签发后撤销 Grant、停用 Connection 或停用 Extension，下一次请求立即拒绝；旧 Token 的剩余 TTL 不构成授权。
- Stage Epoch 变化、Token 过期、签名篡改和 Scope 错配均被拒绝；Company、Agent、Run、Stage、Invocation、Connection、Tool 与 Secret 都是指向性约束。
- Worker Service Credential 是独立 Token Type，不能被 Agent Gateway 接受；Agent Token Claims 不包含 Worker Identity 或 Worker Secret。
- 安装 Extension V2 不改变旧 Snapshot/活跃 Run 的 V1 Manifest；只有显式创建新 Agent Configuration Snapshot 与 Stage Manifest 才能采用 V2 Contribution Revision 和 Tool Contract Digest。
- 每个入口的 Allowed、Approval Required 与 Denied 结果都追加一条不可变审计；Denied 永不 Dispatch。

## 3. Paperclip 适配结论

当前 Paperclip 的短期 Run-bound MCP Token、Connection Token Broker、Scope Subset、Plugin Namespaced Tool、Policy 和审计都可复用。但 `tool-access-policy.decide()` 允许 Trust/Allow/Explicit Grant 在 Profile 前返回允许，Profile 又采用最窄作用域覆盖；`buildPaperclipRuntimeMcpServers()` 只有 Agent/Run 输入；Plugin Agent Descriptor 缺少 Extension Version/Contribution Revision/Contract Digest。因此现有 Profile 不能直接充当 Stage Allowlist。

正式接入必须在 Tool Gateway、Connection Token 和 Secret Access 的共同前置位置消费固定 Agent Snapshot、Stage Manifest、Epoch 与当前撤权事实。原型生产适配审计的有效结论已经收口到本节与正式运行规格，原始审计文件不再保留。

## 4. 历史证据

当时的统一验证生成 `paperclip.validation-evidence.v1`，包括验证工作区源码 Revision、脏工作区标记、原型与生产适配文件 SHA-256、TV-02 Evidence Digest 依赖、两次场景/语义基数、Invariant 和 Scope Limit。证据不含真实 Provider Credential、Secret 或业务正文；原始命令和源码已按可丢弃原型边界移除。

## 5. 适用边界

本报告验证授权协议与 Paperclip 接缝方向，不代表生产 Agent Configuration Snapshot、Stage Binding、Capability Token 或 Tool Gateway 已实现。原型没有签发现实 Provider Token、没有执行外部 Tool，也没有修改生产权限行为；正式纵切仍需把已验证 evaluator 接到三个入口，并用相同矩阵防止路径回退。
