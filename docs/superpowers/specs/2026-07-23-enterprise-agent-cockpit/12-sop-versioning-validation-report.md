# SOP 不可变版本与发布漂移技术验证报告

状态：`validated`（可丢弃数据库原型）\
日期：2026-07-26\
验证包：TV-02（VAL-001、VAL-007）

> 归档说明：本报告保留数据库原型得出的版本语义、场景结果与 Digest；可丢弃 overlay、字段审计文件和执行命令未纳入正式开发基线。

## 1. 结论

TV-02 证明了独立的 SOP Draft、Validation Snapshot、SOP Release、Execution Definition Revision 与 Binding Revision 可以在不复制一套可变平台对象的前提下，稳定表达发布、运行、回滚和历史恢复。完整证伪矩阵在两套全新 scratch PostgreSQL 上连续执行，语义基数完全一致：8 个场景、14 个 Snapshot、5 个 Release、5 个 Production Run、3 条 Effect Audit。

因此，VAL-001 与 VAL-007 的目标版本机制可以收口：Business SOP Release 是唯一业务版本事实；Execution Definition 与 Binding 使用不可变 Revision；Agent、Connection、Resource Content 和 Project Env 使用精确修订身份固定；Pipeline/Routine 只作为可复用执行或兼容呈现能力，不能成为 SOP 语义事实源。

## 2. 已验证的不变量

- Draft 可修改；Validation Snapshot、Execution Definition Revision、Binding Revision、Agent Configuration Snapshot、Connection Configuration Revision、Resource Content Revision、Project Env Revision 与 Release 均拒绝 Update/Delete。
- 编译器失败时，Execution Definition、Snapshot 和 Release 的新增全部事务回滚。
- Validation Run 只读取 Snapshot，不读取后续 Draft；Simulation 和 Historical Replay 默认禁止 Effect。
- 发布前分别检测 Draft、Binding、Agent Configuration、Connection Configuration、Resource Content 与 Project Env 漂移，并返回指向性冲突码。
- Agent 配置变化不会静默进入旧 Release；显式同步必须生成新 Binding Revision、Validation Snapshot 和 Release。
- 同一个 Snapshot 两路并发发布时只有一个 `published`，另一条得到 `snapshot_already_published`，不会出现重复 Release。
- Release 回滚只改变未来 Run 的选择；历史 Run 继续固定原 Release、Execution Definition、Binding 与引用修订。
- 从历史 Release 恢复只派生新 Draft，不修改 Release、Snapshot 或历史 Run。
- Resource File ID 在替换内容后保持稳定；旧 Run 固定旧 Content Revision，新 Run解析新 Content Revision，不受共享 Blob 或当前指针影响。
- Controlled Fault 必须显式限定非生产目标、Owner、允许动作和清理计划；合法 Effect 仍标记为 `connector_intent_attempt` 路径，不能绕过 TV-01 的 Intent/Attempt 协议。

## 3. Paperclip 复用边界

Routine Revision 已能快照 Routine 与 Trigger，Routine Run 也会保存 `routineRevisionId`，因此适合承载 exact executable strategy revision。Heartbeat 适合作为一次 Invocation 的交付记录。Pipeline/Stage/Transition 能复用部分看板、人工操作和转换能力。

但这些对象均不能成为 SOP Release：Routine Snapshot 不含完整 Stage 图、I/O、Acceptance、Binding 和跨 Stage 状态；Heartbeat 不是 SOP/Stage 状态；Pipeline 转换仍读取 live Stage、Transition、Gate 和 Automation。原型字段审计的有效结论已经收口到本节与正式运行规格，原始审计文件不再保留。

## 4. 历史证据

当时的统一验证在系统临时目录生成 `evidence.json`，记录验证工作区 Git Revision、脏工作区标记、原型文件 SHA-256、两次场景覆盖、语义基数、Invariant、Scope Limit 与 Evidence Digest；未保存业务正文或 Secret。原始命令和 overlay 已按可丢弃原型边界移除。

## 5. 适用边界

本报告验证的是版本身份、事务、漂移、并发、回滚和重放语义，不是正式 SOP Schema/API/UI 的实现完成证明。原型 overlay 可整体丢弃；进入生产开发时仍需设计 Company Scope、迁移、授权、Activity Log、运行规模、清理和正式 Service API，并以同一证伪矩阵作为验收基线。
