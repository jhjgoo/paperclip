# TV-06：Resource Library 与 Run Authority 验证报告

状态：孤立领域契约原型 `validated`；生产集成未验证\
日期：2026-07-27\
验证项：VAL-016、VAL-017\
收口重跑 Evidence Digest：`5a0ef48fc596de691e442cdc137598de8f87ca74cb82de6b3296fdc3e8065e41`

> 2026-07-27 治理校准：本报告保留原型证据，但此前“生产领域核心”的称谓不成立。相关模块没有生产 Schema、Route/Service 调用链、持久存储或 UI 接入；不得据此宣称 TV-06 生产纵切通过。

> 归档说明：孤立领域模块、验证驱动器和执行命令未纳入正式开发基线；本报告只保留规则、观测基数、Digest 与生产缺口。

## 1. 结论

TV-06 在两个孤立领域契约模块和一个可丢弃验证驱动器上连续执行两轮，5 个场景、4 种 Trigger、2 个资源场景、2 个 Authority 场景的语义基数完全一致，Stop Rule 命中数为 0。

验证结果证明以下规则可以同时成立：

- Resource File/Folder 使用稳定逻辑 ID，Blob 使用 SHA-256 内容寻址且不可变；
- 相同内容只产生一个 Blob，替换一个 Resource File 采用 Copy-on-Write，不联动其他逻辑文件；
- Run Snapshot 固定启动时的 File→Blob 与 Folder 成员集合，后续替换或新增不改变历史 Run；
- File Binding 保护文件身份，Folder Binding 保护 Folder 自身及其绑定完整性，但普通子项仍可动态进出；
- 回收站恢复不改变 Resource ID，Blob 只有在逻辑文件和 Artifact/Run Snapshot 等保留引用均释放后才回收；
- 人工、API、Webhook、定时触发均在 Run 创建前解析具体有效成员；无法解析时不创建 Run；
- 人员失效原子暂停 Run，并按 Authority Revision 只产生一个未决改派事项；
- 改派生成新 Authority Revision，旧 Revision 不能管理 Artifact 或裁决 Gate，历史 Decision Actor 保持不变；
- Project Membership 只提供基础查看权，Run 角色提供本 Run Artifact 管理权，Gate Decision 仅授予对应 Stage Assignee。

## 2. 候选生产接缝（尚未接入）

正式实现应在生产 Schema、事务 Service、Company/Project 授权、Resource API、Run Snapshot 和 UI 之间重新建立接缝。已删除的孤立模块只用于证明规则可以闭合，不是可复用生产实现。现有 `assets` 仍只是 Blob/附件元数据，现有 `folders` 仍只服务 Skill/Routine；本次没有为了统一概念而改写它们的产品语义。

## 3. 历史机器证据

```text
executions: 2
scenarios: 5 / 5
triggerModes: 4
resourceScenarios: 2
authorityScenarios: 2
stopRuleViolations: 0
verdict: validated
```

目标 Vitest：10/10 通过。

原始驱动器与命令已按可丢弃原型边界移除，以上输出只作为历史验证记录保留。

## 4. Stop Rule

两个停止条件均未触发：

1. Binding 不能被移动、重命名或删除破坏；File 内容替换仍保留稳定 ID 与既有 Binding。
2. Artifact 查看、Artifact 管理和 Gate Decision 使用不同授权分支；Project Membership 不能升级为 Run 管理或 Gate 权限。

## 5. 范围限制

本结论证明领域状态转换与权限分离方向充分，不等于 Resource Schema、REST API、Resources UI、保留调度器或完整 SOP Run 持久化已经生产就绪。后续正式实现必须让数据库事务和路由复用同一规则，并补充并发、故障恢复和迁移测试；不得把验证驱动器当作线上存储。
