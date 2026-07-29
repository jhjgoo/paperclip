# TV-07：Attention Signal 与 Incident Projection 验证报告

状态：孤立领域契约原型 `validated`；生产集成未验证\
日期：2026-07-27\
验证项：VAL-010\
依赖 TV-06 收口重跑 Evidence：`5a0ef48fc596de691e442cdc137598de8f87ca74cb82de6b3296fdc3e8065e41`\
收口重跑 Evidence Digest：`0761ed2f41216204eec018664b96f702b5ebb2ea2c7986cfcdcc99ebd639e58a`

> 2026-07-27 治理校准：本报告保留原型证据，但此前“生产领域核心”的称谓不成立。相关模块没有生产事实源、Route/Service 调用链、持久存储或 UI 接入；不得据此宣称 TV-07 生产纵切通过。

> 归档说明：孤立投影模块、验证驱动器和执行命令未纳入正式开发基线；本报告只保留投影规则、观测基数、Digest 与生产缺口。

## 1. 结论

TV-07 使用孤立的 `attention-projection` 领域契约原型连续执行两轮完整否证矩阵。两轮均覆盖 5 个场景、7 类 Source Adapter、0 次投影回写来源、0 次 Required 永久 Dismiss 和 0 个 Stop Rule 违规，语义基数一致。

已证明：

- Approval、Interaction、Recovery、人员改派、能力撤销、External Action Unknown、Worker 故障都能投影为带稳定 Source Ref 的事项；
- 投影基于权威事实全量快照，而非依赖事件恰好按顺序且只投递一次；
- 重复、乱序、漏掉中间事件、Stage Epoch 变化后均能选择最高 Source Revision/Epoch；
- 投影清空后可以由同一事实快照精确重建；
- Incident 聚合保留全部独立 Source Ref，部分关闭不会吞掉来源或错误标记已解决；
- Required Item 只能 Snooze，不能永久 Dismiss；
- 每次动作重新鉴权，随后只调用来源领域 Service；拒绝不 Dispatch，允许也不直接修改投影或来源事实。

## 2. 候选生产接缝（尚未接入）

- 候选投影契约：正式实现时新建持久、可重建且不拥有来源状态的 Attention Projection
- 既有聚合 Adapter 接缝：`server/src/services/attention.ts`
- 既有 Dismissal 接缝：`server/src/services/inbox-dismissals.ts`
- Recovery 权威事实接缝：`server/src/services/recovery/service.ts`

现有 `attentionService` 可以经 Adapter 提供来源事实，但不因此获得 SOP Run 写权限。Projection 的 `executeAction` 只保存和提交 Source Ref、Action Contract 与 Actor，真正状态变化仍由来源 Service 完成，并等待下一次重建反映。

## 3. 历史机器证据

```text
executions: 2
scenarios: 5 / 5
sourceAdapters: 7
projectionWritesToSource: 0
requiredPermanentDismissals: 0
stopRuleViolations: 0
verdict: validated
```

目标 Vitest：5/5 通过。

原始驱动器与命令已按可丢弃原型边界移除，以上输出只作为历史验证记录保留。

## 4. Stop Rule

两个停止条件均未触发：

1. 投影没有独立关闭、批准、恢复或修改底层领域事实的路径，因此没有成为第二写模型。
2. Incident 同时保留 `sourceRefs` 与 `openSourceRefs`，部分关闭和全量重建不会丢失或错误关闭来源事项。

## 5. 范围限制

本结论不代表完整 SOP Run Cockpit、刷新调度、持久投影表或所有 UI 动作已经生产就绪。它只证明候选读模型的身份、重建、聚合和动作边界在孤立原型内可行；后续实现必须在真实持久化和路由链路重新验证这些规则，不能把 Incident 状态反向写成 Run/Approval/Recovery 真相。
