# Stage Execution Kernel 收口验证报告

状态：已完成\
日期：2026-07-24\
覆盖：P4–P10\
归档说明：本报告保留验证问题、结果与边界；可丢弃原型源码和执行命令未纳入正式开发基线，本文不再作为可运行操作手册。

## 1. 总判定

Stage Execution Kernel 的核心状态语义已经具备进入产品规格设计的证据：独立 Kernel、Runtime-neutral Executor 协议、持久人工续跑、Provider Retry 分层、Resume 前事实重校验、Pause Hold/Release、完整返工 Loop 重建和机械 Completion Gate 可以组成一致的架构。

该判定不等于生产实现已经完成，也不等于真实模型质量已经稳定。收口回归明确区分已验证的 Kernel 语义、被实测推翻的现有生产假设，以及必须留给生产集成或真实模型消融的验证项。

## 2. 一键回归结果

2026-07-24 的 fresh closure run 依次执行 7 个隔离探针，全部退出 0：

| 探针 | 结果 | 耗时 |
| --- | --- | ---: |
| P4 durable continuation | 通过 | 4.818 秒 |
| P5 Heartbeat source adapters | 通过 | 7.643 秒 |
| P6 Provider retry chain contract | 通过 | 5.541 秒 |
| P7 production retry seam | 通过，观察到生产缺口 | 5.512 秒 |
| P8 idempotent retry target | 通过 | 6.534 秒 |
| P9 resume eligibility matrix | 通过 | 4.494 秒 |
| P10 durable Loop reconstruction | 通过 | 4.824 秒 |

每个探针使用独立 disposable PostgreSQL 并在退出时清理。Embedded PostgreSQL 因本机缺少 `@embedded-postgres/darwin-arm64` 自动降级为 disposable Docker PostgreSQL；这不改变 Schema、事务和并发断言。

## 3. 已验证语义

### 3.1 持久 Wait 与续跑交付

P4/P5 共同验证：Human Decision、Continuation Intent、claim/lease/fencing、稳定 receipt 和 Heartbeat Wake/Run 可以跨进程恢复。Interaction、Approval 与 Recovery Action 归一到同一个 Decision/Intent 交付协议；旧 owner、重复 callback、重复 reconcile 和重复 consume 不产生第二次语义副作用。

### 3.2 Provider Retry 分层

P6 验证一个语义 Invocation 可以投影多个 Delivery Attempt，Provider 重试不增加 SOP Loop 业务预算。502、硬超时目标分类、断流耗尽、重启对账、迟到结果拒绝和 exactly-once Result consume 均已覆盖。

### 3.3 Retry Attempt 单链目标

P8 在生产 `heartbeat_runs`/`agent_wakeup_requests` 的 scratch 副本上增加 Retry Attempt 唯一身份，并对生产 `scheduleBoundedRetry` 做唯一冲突回读：顺序重复和 4 路并发调度均只留下 1 个子 Run、1 个 Wake 和 1 次晋升，唯一冲突事务没有遗留孤儿 Wake。

这证明“数据库唯一身份 + 冲突回读”是可行的最小修正方向，但尚未修改生产 Schema 或 Service。

### 3.4 Resume 漂移矩阵

P9 持久化 10 个 Continuation Intent，并统一重校验：

- 事实未变化：允许 dispatch；
- Active Pause Hold：保持同一个 Intent 等待；
- Hold Release：跨 Store 重建后允许 dispatch，重放复用同一个 Invocation；
- Stage Epoch、版本或 Artifact 漂移：Intent invalidated；
- Authority Revision、Capability Revision 或 Actor 授权撤销：拒绝；
- 预算耗尽：派发前阻塞；
- Wait Contract 过期：拒绝。

最终只有“事实未漂移”和“Hold 已释放”两个场景创建 Invocation。

### 3.5 完整 Loop 重建

P10 执行 Planner → Worker → Planner → failed Verifier 后销毁内存 Store，只凭 PostgreSQL 最新快照重建 Recovery Envelope，再执行 Worker 修复、Verifier 通过、Completion Candidate 和机械 Completion Gate。

最终有 11 个带 SHA-256 的持久快照、9 个唯一语义 receipt 和 9 个 Invocation。旧 receipt replay 被去重，旧 Stage Epoch 结果被拒绝；Revision 1 Finding 只由 Revision 2 Evidence 解决。Recovery Envelope 固定 SOP Release、Execution Definition、Stage、Epoch、版本、工件、Finding、预算和允许动作，不依赖旧 Provider Session 或 Transcript。

## 4. 被推翻的生产假设

### 4.1 现有 generic retry 已经是单链

错误。P7 对同一个失败 Root Run顺序调用两次生产 `scheduleBoundedRetry`，创建了两个不同的 Attempt-1 子 Run、两个无幂等键 Wake Request，且两个子 Run均被晋升为 `queued`。

### 4.2 Codex 硬超时已经自动重试

错误。当前硬超时分支返回 `timedOut = true`，没有稳定 Error Family；Heartbeat 自动 transient retry 只接受可形成 recovery contract 的 `transient_upstream` 或 `provider_quota`。

## 5. 进入生产实现前的必需项

1. 通用 Retry Attempt 数据库唯一身份、唯一冲突回读以及 Wake 共享幂等身份；
2. `execution_timeout` 等 Provider-neutral Error Family；
3. 生产 Schema、API、Source Route 与 Continuation Intent 的事务接入；
4. 生产 Pause Hold Release Reconciler；
5. 生产 lease scheduler、接管、告警与指标；
6. Kernel Chain Projection 对历史分叉的检测和处置。

## 6. 仍需真实模型消融的结论

以下问题不能由确定性状态原型替代：

- Session Resume、Recovery Envelope、Envelope + Selected Transcript 的完成率、Token、时延和缺失事实对比；
- 无测试故障注入的真实复杂返工质量；
- Codex、Claude、Hermes 等 Adapter 的结构化输出稳定性；
- 长时间跨日运行和真实 Provider 抖动下的运营表现。

因此可以把“State Reconstruction 是正确性基础、Session Resume 是优化”写成目标架构，但不能把“Fresh Context 与 Resume 质量完全等价”写成已验证事实。

## 7. 适用边界

本报告收口的是 Stage Execution Kernel 原型链，不代替以下独立验证域：SOP Release/Binding 版本模型、Connector 非幂等外部动作、能力 Token/Secret 实际签发、SOP Studio/UI、企业治理投影和跨运行改进候选闭环。
