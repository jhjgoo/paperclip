# 子需求 07：Run Cockpit、Attention、失败与恢复

状态：产品模型已确认；Attention、Authority 与恢复原型已验证，生产事务、生产投影与 UI 原型未验证
日期：2026-07-26
依赖：子需求 02、03、04、05、06
关联决策：DEC-014、DEC-019、DEC-025、DEC-029 至 DEC-032、DEC-063 至 DEC-068、DEC-073 至 DEC-085、DEC-089
关联验证：VAL-004、VAL-005、VAL-010、VAL-016、VAL-017、VAL-018

## 1. 目标与边界

SOP Run Cockpit 驾驶一个具体 SOP Run，回答目标、当前状态、停止原因、责任人、待处理动作、过程证据、业务结果和安全可用操作。它不是跨 Run 列表、SOP Definition 编辑器、Task Detail 或原始 Transcript 查看器。

SOP Run、Stage 与 Invocation 各自维护权威状态，不创建隐藏 Task/Issue。Discussion、Attachment、Document Revision、Activity、Heartbeat/Adapter、Transcript 和 Cost 通过共享能力复用；Issue Status、层级、阻塞、单 Assignee 和 Work Product 不成为 SOP 运行真相。

## 2. 页面入口与层级

同一套 SOP Runs 列表和 Run Cockpit 从三个入口复用：

```text
Dashboard Active Runs ─┐
Department SOP Runs ───┼──→ SOP Run Cockpit ──→ Stage Detail
Project / SOP Runs ────┘
```

- Dashboard 只展示 Active/Attention 摘要；
- Department SOP Runs 是跨 Project 完整列表；
- Project SOP Runs 固定 Project Filter；
- Stage Detail 属于当前 Run，可返回 Cockpit 或切换本 Run 相邻 Stage。

## 3. Run Cockpit

Run Header 展示 Goal、Project、SOP Release、Run Owner、Current Stage、SLA，以及三条互不替代的状态轴：

- Control State：Kernel 持久化的执行控制真相及结构化等待、暂停、阻塞或失败原因；
- Health/Attention：由 SLA、风险、异常和当前用户责任派生，不驱动状态转换；
- Business Outcome：来自 Outcome Contract，`completed` 只代表执行闭环。

Stage Map 展示 Stage 的 Control State、Iteration、Acceptance、未解决 Finding 与 Gate/Attention，不用完成节点数制造进度百分比。Invocation 只展示技术执行与 Provider Attempt 状态。

## 4. Stage Detail

桌面端采用双栏：

- 左侧 Stage Execution Thread：按时间连续呈现 Agent 对外 Thinking Summary/Plan、消息、Tool Call、Command、Diff、关键执行步骤与人工往来；
- 右侧 Stage Information Board：承载 Stage Contract、状态与停止原因、Agent Binding、Input/Output、Artifact/Evidence/Finding、Acceptance/Human Gate、Iteration、预算、时间和 Workspace 摘要。

Iteration、Producer/Verifier Invocation 和 Stage Epoch 只是左侧连续过程链中的分组，不拆成 Tab。关键内容默认展开；stdout、stderr、系统噪声和 Raw Transcript 默认折叠。Finding、Evidence 与 Gate 的完整对象留在右侧，左侧只显示轻量因果标记和深链。

## 5. 人员与权限

首期不建设逐 Run 自定义 ACL。所有权限先固定在一个 `runId` 内，再由角色派生：

- Project 授权成员拥有该 Project 的 Run、Stage 过程与 Artifact 基础查看和协作权，但不因此获得 Artifact 管理、Run 控制或 Gate 决策权；
- Run Creator 记录创建事实，并可在自己创建的当前 Run 内向任意 Stage 补充输入，但没有永久生命周期控制权；
- Run Owner 负责本 Run 全生命周期监控、协调和 Run 级控制，可向本 Run 任意 Stage 补充输入，但不能裁决未分配给自己的 Gate；
- Human Gate Assignee 只在本 Run 中获授权 Stage 操作、回复 Input Request，并只裁决自己的 Gate；
- SOP Owner 与 Department Admin 处理人员失效、显式改派和应急控制，不能绕过职责分离代批；
- Agent 使用 Run-scoped Token；Enterprise Admin 只读取内容盲治理摘要。

Run Owner 与本 Run 全部 Human Gate Assignee 额外获得本 Run 全部 Artifact 的派生查看管理权；两类权限取并集。Run 角色失效或改派只撤销派生权，Actor 如果仍是 Project 授权成员，则保留 Project 基础查看权。任何 Run 角色都不能传播到其他 Run。Artifact 发布到资源库仍需独立资源发布权限。

首期运行操作矩阵固定如下，所有动作提交时仍需重新校验 Membership、Authority Revision、当前 Control State 和具体安全条件：

| Actor Basis | 常规运行控制 | 输入与协作 | Human Gate |
| --- | --- | --- | --- |
| Project 授权成员 | 无 | 查看本 Project 的 Run/Stage/Artifact 与协作消息 | 无 |
| Run Creator | 无；除非同时具有其他角色 | 本 Run 任意 Stage 的 Supplemental Input/Input Response | 无；除非同时是对应 Gate Assignee |
| Run Owner | Pause、Resume、Cancel、Retry Stage 和故障允许的 Recovery Action | 本 Run 任意 Stage 的 Supplemental Input/Input Response | 无；除非同时是对应 Gate Assignee |
| Human Gate Assignee | 不因 Gate 身份获得 Run 控制 | 仅本 Run 获授权 Stage 的 Input Response 与协作 | 仅裁决分配给自己的 Gate |
| SOP Owner / Department Admin | 人员失效、Owner 不可用或明确安全事件下的改派、Pause 及带原因的应急 Run 控制 | 不因此获得额外业务输入权 | 不得代批或绕过职责分离 |

应急 Run 控制必须记录原因和 Actor，不得提供“强制完成”、篡改 Outcome 或绕过 Reconciliation 的动作。SOP Owner/Department Admin 不能仅凭管理身份读取其没有 Project/Run 内容权限的 Transcript；其操作界面只能在已有 Company 内容访问依据下打开，或通过内容最小化的应急动作入口执行。

## 6. 协作消息、补充输入与人工决定

左侧 Composer 明确区分三种动作：

1. Stage Collaboration Message：讨论、备注和追问，不进入 Agent Context、不解除 Wait、不改变契约或状态；
2. Supplemental Input：用户主动提交的结构化、版本化运行输入；
3. Input Response：针对持久 Input Request 的结构化不可变答复。

Input Request 不创建独立 Assignee。Kernel 先用 `request.runId` 固定授权边界，再校验 Actor 在本 Run 的角色、Stage 范围、Membership、Authority Revision 与请求状态。Run Creator/Run Owner 可回复本 Run 任意 Stage；Gate Assignee 只可回复本 Run 中自己获授权的 Stage。

未决 Input Request 在右侧展示字段/文件、原因、可回复角色、期限和 Stage Epoch。主动补充输入提交前必须预告可能造成的 Output、Evidence、Finding、Gate 或下游失效；实际影响由 Kernel 按依赖机械裁决。

Human Gate 使用独立 Decision Card，固定 Stage Epoch、Evidence/Finding、动作与权限快照。Input Response 不能隐式批准、拒绝或完成 Gate。Input Response 与 Gate Decision 提交后都只在左侧追加审计标记与深链。

## 7. 运行控制与失败恢复

- Pause、Resume、Cancel 只作用于整个 Run；
- Pause 创建持久 Hold，阻止新 Invocation，并请求活跃执行在安全点停止；
- Resume 在释放 Hold 前重新校验版本、绑定、人员、能力、预算、Workspace、Artifact/Evidence 与外部事实；
- Cancel 是不可恢复终态，不伪装回滚；结果未知的外部 Effect 进入 Reconciliation；
- Retry 只作用于 Stage，并创建新 Stage Epoch、Iteration 和 Invocation，保留旧事实；
- Recovery Action 只针对具体故障展示有限安全选项；
- 首期不提供通用 Stage Pause、Cancel 或 Skip，可跳过路径必须在 SOP Definition 中声明。

Provider Delivery Retry 留在原 Invocation 内，不得与 Stage Retry 混用。

## 8. Attention 与持久等待

Input Request、Human Decision Request 和 External Wait 都必须持久化；Attention 只是这些领域事实的行动投影，不是新的事实源。等待期间 Agent 进程和 Sandbox 可以释放，Execution Workspace、Checkpoint、Continuation Intent 与审计事实保留。

恢复前必须重新校验 Stage Epoch、Release、Authority/Capability Revision、Artifact/Evidence、预算、外部事实与 Wait Contract。人员失效时暂停 Run，并产生唯一的改派 Attention；显式改派生成新 Authority Revision，历史 Actor 与已完成 Decision 不被改写。

## 9. Artifact 与成果入口

Project 授权成员按 Project Membership 查看该 Project 的 Run 与 Artifact；Run Owner 与本 Run 全部 Gate Assignee 通过 Run 角色获得本 Run Artifact 的派生查看、下载、比较、标注和 Review 权。两类权限取并集，改派或角色失效只撤销派生部分；Artifact 本身不可原地修改。Project `Artifacts` 统一列出 SOP Artifact 与 Task Work Product，并保留来源深链；二者不相互转换。跨 Run 或跨 Project 复用必须先将 Artifact 人工发布为 Resource File。

## 10. 首期非目标与验证缺口

MVP 必须交付第 2 至第 9 节描述的核心闭环，包括 SOP Runs 入口、Run Header/三轴状态/Attention/Stage Map、双栏 Stage Detail、结构化人工操作、Run/Stage 控制，以及 Project Artifact 浏览、预览、下载、溯源和人工发布资源库。

首期不建设：

- 逐 Run 自定义成员 ACL；
- 隐藏 Task/Issue 承载 Stage 或 Invocation；
- 通用 Stage Skip/Pause/Cancel；
- 用普通聊天隐式改变 Agent Context、Input、Gate 或 Control State；
- Enterprise Admin 读取业务内容。
- 自定义 Cockpit 看板、复杂跨 Run 对比、Artifact 批量操作、高级全文检索或通用报表设计器。

VAL-004、VAL-005、VAL-010、VAL-016、VAL-017、VAL-018 已在各自原型或隔离真实 Provider 范围验证核心协议。仍需在最小生产纵切证明生产事务幂等、非幂等外部动作恢复、Attention 持久投影、人员失效与改派、状态重建和真实 UI 可用性；这些是落地证据缺口，不再是产品模型待选项。
