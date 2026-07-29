# 子需求 05：SOP Runtime、Stage Execution Kernel 与 Executor 协议

状态：产品运行契约已确认；核心状态与恢复语义已验证，生产接入和物理模型待验证\
依赖：子需求 01；子需求 04 的版本模型\
关联决策：DEC-004、DEC-014、DEC-015、DEC-020、DEC-022 至 DEC-033、DEC-044 至 DEC-057、DEC-087、DEC-094、DEC-095、DEC-114、DEC-115\
关联验证：VAL-002、VAL-003、VAL-005；受 VAL-001、VAL-004、VAL-006、VAL-007、VAL-017、VAL-018 约束

## 1. 目的

本子需求定义 SOP 从不可变执行契约到实际 Agent Invocation 的运行边界，重点覆盖：

- Stage Execution Kernel 的状态所有权；
- 可插拔 Stage Executor 的职责；
- Planner、Worker、Verifier 和人工决策的统一运行协议；
- Artifact、Evidence、Finding、Checkpoint、Wait 和 Recovery；
- Provider 重试与 SOP 业务循环的分层；
- 机械 Completion Gate 和受限 Stage Transition。

本文件不冻结生产表名、API 路径或 UI 设计，也不把隔离原型等同于生产实现完成。

## 2. 架构边界

### ARC-001：四层运行架构

```text
SOP Release（生产）/ Validation Snapshot（校验）
→ Execution Definition Revision
→ SOP Run + Stage Execution Kernel
→ Stage Executor
→ Routine / Issue / Heartbeat / Adapter / Connector
```

### ARC-002

SOP Release 是不可变生产业务契约，Validation Snapshot 是发布前校验运行的不可变基线，Execution Definition Revision 是无损编译得到的不可变执行 IR。生产 SOP Run 固定 Release、Execution Definition Revision 与 Binding Revision；Validation Run 固定 Validation Snapshot 及其中的候选 Revision。两种模式都不能在运行过程中读取可变 Draft 或 live Pipeline 配置解释未来行为。

### ARC-003

Stage Execution Kernel 是 SOP Stage 控制状态的唯一所有者。它不是 LLM Agent，不保存隐式会话记忆，也不把状态藏在 Prompt、Issue 描述或 Transcript 中。

### ARC-004

现有 Pipeline 不是 SOP 编译目标。Pipeline 可以继续服务普通工作流，或作为从 Execution Definition 生成的可重建兼容视图，但不得拥有 SOP Stage 的权威契约或 Kernel 状态。

### ARC-005

Paperclip 继续作为控制面。SOP Run、Stage 和 Invocation 保持独立权威状态，不创建隐藏 Issue；Kernel 复用并深化 Task/Issue 背后的 Discussion、Attachment/Asset、Document Revision、Activity、Heartbeat、Adapter、Connector、Approval、Interaction、Transcript、Cost 和 Audit 等共享能力，不复制通用 Agent Runtime 或外部系统。Task Work Product 与 SOP Artifact 保持独立来源模型。

### ARC-006

Run Request 与 Stage I/O 使用不同契约。Run Request 表达动态 Goal / Instruction 与类型化 Arguments；本次上传文件也是 Contract 声明的 `file` Argument，不存在无类型材料袋。Stage 通过 `Consumes / Produces` 与 Data Binding 精确消费 `run.goal`、Run Argument、SOP Resource 或上游 Stage Output。Trigger 只创建同一种 Run Request 并映射 Argument，不是 Argument Type。

### ARC-007：控制面与执行面隔离

Paperclip Server 与 Agent Execution Worker 必须是独立部署单元和故障域。Server 拥有 API、权限校验、预算、SOP Kernel、Command 创建、状态裁决和审计；它不挂载 Execution Workspace，也不直接启动 Agent Adapter。Worker 负责领取 Command、实现 Workspace、启动 Adapter 与 Workspace Runtime Service，并只通过结构化 Event/Receipt 提交执行事实。

首期单节点 Docker 只部署一个 Worker，但仍使用 PostgreSQL 持久 Claim、Lease 和单调 Fencing Token，不允许用 Server 内函数调用或内存队列形成第二套执行路径。Redis、Kafka、Kubernetes 和多 Worker 容量调度不进入首期。

### ARC-008：Worker Control API

Worker 必须主动向 Server 建立出站控制连接，不开放供 Server 推送任务的入站执行端口，也不直接访问业务数据库。Server 在 PostgreSQL 内完成 Execution Command 的原子 Claim、Lease、Fencing 和 Receipt 去重，并通过受控 API 返回当前 Worker 可执行的短期 Command。

首期控制协议至少包含 `register`、`heartbeat`、`claim`、`renew-lease`、`append-events`、`submit-receipt` 和 `release`。Worker 与 Server 失联时不得领取新任务；已领取任务可在有效 Lease 和本地安全边界内继续，未送达的 Event/Receipt 应短暂落盘并在重连后补交。无法证明副作用结果的执行必须进入 Reconciliation，不得自动重放。

### ARC-009：Worker 服务身份

Worker Control API 必须要求独立服务身份，Docker Network 只提供网络可达性，不构成认证。首期由 Docker Secret 向 Server 和 Worker 注入实例级 Worker Service Credential，Worker 启动后用其换取短期 Worker Session Token；凭证必须支持轮换和吊销，Server 必须把 Claim、Lease、Event 和 Receipt 关联到具体 Worker Session。

Worker Session Token 只能访问 Worker Control API。Agent 子进程不得读取该 Token，必须继续使用当前 Invocation 的 Run-scoped Agent JWT 访问 MCP、Connector 和其他 Agent-facing 能力。跨主机部署出现前不建设 Enrollment UI、mTLS 或企业证书体系。

### ARC-010：并发与 Execution Sandbox

Worker 是节点级 Supervisor，可以在声明的容量上限内并发管理多个 Execution Sandbox，不与单个 Run 一一对应。首期生产模式为每个活跃 SOP Run 或需要执行的 standalone Task 创建一个 Docker Execution Sandbox；同一 SOP Run 跨 Stage 复用 Sandbox 和主 Execution Workspace，运行中的 Agent Invocation 是 Sandbox 内的独立进程。

不同 Run 的 Sandbox 必须隔离文件系统、进程、网络和 CPU/内存/进程数资源。Sandbox 生命周期与 Workspace 分离：Sandbox 可以停止、销毁和重建，Execution Workspace 根据 Run 状态与保留策略持久化。需要并行试验或危险变更时，必须派生 Scratch Execution Workspace 并使用独立 Sandbox，不得绕过主 Workspace 的单 Writer Lease。`local_process` 只作为开发、调试或显式可信任务模式，不是企业生产默认执行路径。

### ARC-011：首期固定容量槽位

首期 Worker 使用企业管理员配置的固定 `maxConcurrentSandboxes`，并为每个 Sandbox 应用统一的 CPU、内存、PID 和必要磁盘保护上限。业务用户、SOP Definition、Stage Contract 和 Run Request 均不承载基础设施资源请求；不同资源规格、动态装箱和负载预测在真实容量数据证明必要前不进入产品模型。

Server 以当前 Worker 的有效 Sandbox Lease 数原子计算可用槽位，没有容量时不得 Claim Command。Worker 在创建 Sandbox 前必须依据本地真实状态执行二次校验，拒绝任何突破硬上限的派发。进入 `waiting_human`、`paused` 或长期 `blocked` 的 Run 应释放 Sandbox Slot，并在固定 Checkpoint 后停止或销毁 Sandbox；Execution Workspace、持久事实和恢复意图继续保留，恢复时重新竞争 Slot 并重建环境。

### ARC-012：部门公平排队

当多个 Company（部门）存在可执行 Command 而 Worker Slot 有限时，Server 必须先执行非抢占式部门公平选择，再允许 Worker Claim。跨部门优先选择当前有效 Sandbox Lease 占用较少的部门；占用相同时，选择最久未获得调度的部门。部门内部优先使用已经权威持久化的业务优先级，未声明时视为 Normal，同优先级按 `queuedAt` 排序。

新进入的高优先级 Command 不得中断已运行 Sandbox。首期所有部门等权，不支持权重、固定保留 Slot、专属 Worker Pool 或业务用户修改基础设施调度份额；Agent `maxConcurrentRuns`、Worker Slot 和 Workspace Writer Lease 仍作为独立的全部必需约束。

### ARC-013：Worker Identity 与 Session

Worker 使用跨重启稳定的 `workerId` 和每次进程启动唯一的 `workerSessionId`。首次启动生成 `workerId` 并保存到 Worker 独立状态卷；重启复用该 ID，Server 为新进程创建 Session 并递增 `sessionEpoch`。`workerId` 承载配置、长期健康历史和管理员动作；Hostname 与 displayName 只用于展示。

同一 `workerId` 同时只能存在一个可领取任务的权威 Session。新 Session 建立后，旧 Session 不得继续 Claim、Renew 或提交权威 Receipt；所有控制操作必须同时校验 `workerId`、`workerSessionId`、`sessionEpoch`，涉及具体 Command 时还必须校验其 Fencing Token。丢失 Worker 状态卷应注册为新 Worker，不能仅凭同名 Hostname 自动接管旧 Workspace。

### ARC-014：Worker 健康与维护状态

Worker 状态必须拆成三个正交维度：管理员控制的管理状态 `enabled/draining/disabled`，由 Heartbeat 新鲜度推导的连接状态 `online/stale/offline`，以及由 Docker、Workspace、磁盘、版本和凭证自检产生的就绪状态 `ready/not_ready(reason)`。`available/full` 由 `maxConcurrentSandboxes` 与有效 Sandbox Lease 派生，不得作为健康状态。

只有 `enabled + online + ready + available` 的当前权威 Session 可以 Claim。进入 `draining` 后停止领取新任务但允许现有 Sandbox 正常结束，归零后可安全停机；进入 `stale` 或 `not_ready` 后立即停止新 Claim，现有 Command 按 Lease 与故障类型继续、暂停或进入 Reconciliation；`offline` 后由 Lease 到期恢复流程接管。紧急 `disabled` 必须撤销 Session，未完成 Command 不得伪装为正常结束。

### ARC-015：单节点 Workspace 物理布局

首期 Workspace 数据必须保存在 Docker 持久 Volume 或显式配置的宿主持久目录中，不能保存在 Worker 容器的临时可写层。唯一 Worker 挂载完整 Workspace Root，负责创建、检查、Checkpoint 和清理；每个 Execution Sandbox 只读写自己 SOP Run 或 standalone Task 的目录，不能访问其他 Run。Paperclip Server 不挂载 Workspace。

Sandbox 是由 Worker 通过容器运行时管理的并列执行容器，不采用嵌套 Docker-in-Docker。销毁或重建 Worker/Sandbox 容器不得隐式删除 Workspace Volume。首期只有一个 Worker，因此不新增 Workspace Placement、跨 Worker 迁移、共享存储调度或亲和性实体；这些能力只在多节点目标重新进入范围后设计。

## 3. 职责划分

| 构件 | 唯一职责 | 不负责 |
| --- | --- | --- |
| SOP Release | 业务目标、Stage、责任、交付、评估、预算和允许路径 | 保存动态运行状态 |
| Execution Definition Revision | 固定跨领域执行不变量和可解释版本 | 保存具体 Secret 或动态计划 |
| Binding Revision | 把 Role Slot 绑定到具体 Agent，并固定可选的稳定能力 ID Allowlist | 绑定 Connector/Secret、修改业务契约或授予新权限 |
| SOP Run | 聚合一次业务交付的版本、Stage、Outcome 和运行事实 | 修改 Release |
| Stage Execution Kernel | 状态转换、Epoch、预算、协议校验、去重、恢复和 Completion Gate | 产生业务方案或执行外部工作 |
| Stage Executor | 在契约内解释当前事实并提出下一步 Decision/Command | 直接改写 Kernel 状态或绕过 Gate |
| Agent Execution Worker | Claim 受 Lease 保护的 Command，准备 Execution Workspace，运行 Adapter/Workspace Runtime Service，并上报结构化 Event/Receipt | 裁决 SOP 状态、修改业务契约或自行扩大 Agent 权限 |
| Execution Sandbox | 隔离一个活跃 SOP Run 或需要执行的 standalone Task 的进程、文件系统、网络与计算资源，并承载其 Invocation 或 Agent 执行 | 保存权威 Workspace、拥有 Worker 身份或裁决业务状态 |
| Routine / Issue 背后的共享执行模块 / Heartbeat | 承载单责任 Agent 的具体执行和 Provider Delivery；Issue 记录只用于 Task 路径，SOP Invocation 不创建隐藏 Issue | 裁决 Stage 完成 |
| Connector | 读取 External Fact、执行 Effect 并提供恢复能力声明 | 决定 SOP 业务路径 |
| Attention | 投影需要人类行动的状态 | 成为审批、输入或恢复事实源 |

## 4. 运行版本固定

### VER-001

生产 SOP Run 创建时至少固定：

- SOP Release；
- Execution Definition Revision；
- Binding Revision；
- Agent Configuration Snapshot Set；
- Adapter Version Set；
- Model Deployment ID Set；
- Skill Version Set；
- Connection Configuration Revision Set；
- SOP Resource Snapshot Set；
- Project Env Resolution Snapshot；
- Stage Executor / Routine Revision；
- 运行时能力摘要和编译器版本。

Validation Run 使用同一 Kernel，但必须固定由 Draft 原子生成的 Validation Snapshot。该快照覆盖上述候选契约、Binding、Agent/Connection、资源与 Project Env 解析事实；它不需要伪造一个生产 SOP Release。发布只能采用其中已经通过且未发生漂移的契约与 Revision，并保留资源/Project Env 快照作为校验证据；未来生产 Run 仍分别解析自己的资源与 Project Env 快照。

### VER-002

版本固定保证可解释性，不提供永久授权豁免。Connection Configuration Revision 固定 Connector Version、结构化 Connection 配置与 Platform Integration 配置，但不冻结 Credential Secret；每次 Invocation 前必须重新校验 Agent 状态、授权、预算、Connection、Secret Grant 和 Capability Revision，并记录实际解析到的 Credential Version。

### VER-003

VAL-001、VAL-007 已在孤立原型中验证不可变版本、并发发布和 Run Pin 语义；具体物理表、Migration 与 exact Routine Revision 生产派发接口仍须在最小生产纵切落地，且不得自行退回 live Pipeline 或 latest Routine 语义。

## 5. Stage Execution Kernel

### KRN-001：最小持久状态

Kernel 的持久状态至少覆盖：

```text
identity
  sopRunId / executionDefinitionRevisionId
  stageId / stageEpoch
  bindingRevisionId / authorityRevision / capabilityRevision

control
  status / optimisticVersion
  currentActivity / pendingDecision / pendingCommand
  completionCandidate / transitionProposal

budget
  invocation / iteration / token / cost / wallClock ceilings
  consumed and reserved counters

evidence
  resolvedStageInputSet / stageOutputSetRevision
  artifactRevisions / facts / externalFactHandles / evidenceSetRevision
  findings / assessments / conflicts / outcomeCandidate
  verificationResults

recovery
  checkpoint / recoveryEnvelope
  continuationIntent / pauseHold / deliveryReceipt
```

### KRN-002：控制状态

通用控制状态至少区分：

```text
created
running
waiting_input
waiting_human
waiting_external
blocked_budget
blocked_infrastructure
completed_candidate
completed
failed
cancelled
superseded
```

控制状态不得编码领域业务结果。`completed` 只表示执行闭环已经通过机械 Gate，业务 Outcome 由 SOP 契约单独定义。

### KRN-003：并发和去重

每次状态提交必须使用 Optimistic Version 或等价 CAS；所有可重放 Command、Decision、Continuation 和 Delivery 都必须具有稳定语义身份。重复 Wake、旧 Lease Owner、旧 Fencing Token、旧 Stage Epoch 和迟到 Provider 结果不得产生第二次语义副作用。

### KRN-004：Stage Epoch

Stage Epoch 是执行授权与 Fencing Generation，不等同于业务 Iteration。首次进入、失去执行权后的恢复、Stage Retry 或关键输入/契约变化必须产生新的 Stage Epoch；单纯重复 Wake 不递增。旧 Epoch 的 Token、Command、Result 和 Completion Candidate 只能保留审计，不得推进当前 Stage。

人工等待期间已经被平台接受的 Human Decision 或 Input Response 不因恢复递增 Epoch 自动失效：Kernel 必须先校验其固定 Request、Evidence/Input Revision、Authority Revision 与 Continuation Intent；仍合法时由新 Epoch 显式消费，关键内容或权限已变化时才标记失效。这样既隔离旧执行者，又不要求人工在隔日恢复时重复提交决定。

## 6. Stage Executor 协议

### EXE-001

Stage Executor 是版本化、可插拔的策略模块。Planner、Worker、Verifier 可以由同一种 Agent Runtime、不同 Adapter、Routine、确定性程序或未来领域扩展实现，但都必须遵守同一 Runtime Protocol。

### EXE-002：输入

Executor 每次只接收由平台构造的结构化上下文：

- 固定的 Execution Definition 与 Stage Contract；
- 当前 Stage Epoch 和预算；
- 允许的 Role、Command 和 Transition；
- 由 Data Binding 解析的 Stage Input Set，包括 `run.goal`、Run Argument、SOP Resource Handle 与上游 Output Revision；
- 当前 Stage Output Set Revision、Value Revision、Resource Handle Revision、Artifact Revision、Fact、External Fact Handle、Evidence Set、Finding、Outcome Candidate 和未决 Decision；
- 必要的 External Fact Handle；
- Recovery Envelope，以及按需取证能力。

Executor 不得把旧 Provider Session 或完整 Transcript 当作正确性前提。

其中 `file` Run Argument 必须解析为绑定 Argument Key 的不可变输入内容 Revision 与只读 Resource Handle；它不是 SOP Resource 或 Artifact。补充文件只能通过新的 Supplemental Input/Input Response Revision 进入依赖计算，不能覆盖已消费的旧输入。

### EXE-003：输出

Executor 只能返回受限类型，例如：

- `invoke_role`；
- `request_fact`；
- `request_effect`；
- `submit_artifact`；
- `submit_domain_fact` / `submit_stage_output_set`；
- `submit_evidence`；
- `record_finding` / `record_assessment`；
- `submit_verification_result`；
- `request_input` / `request_human_decision`；
- `wait`；
- `submit_completion_candidate`；
- `propose_transition`；
- `fail`。

自由文本可以作为解释，但不能替代结构化 Decision 或 Command。

`submit_domain_fact` 只能提交带 Agent、Artifact 或 Contract 允许来源的普通 Fact。External Fact 只能由 Connector/Platform Observer 返回观察草稿，并由平台校验 Connection、Provider Identity、来源和 Expected Postcondition 后固化；Executor 只能请求、引用或消费，不能用任何提交命令创建。

### EXE-004

Planner 只能在 Execution Definition 声明的 Stage、Role、能力、预算和 Transition 内提出工作。Verifier 只能提交独立 Assessment、Finding 和 Evidence 引用，不能直接把 Stage 标记为完成。

## 7. Invocation 与 Provider Delivery 分层

### INV-001

Invocation 是一次具有业务语义、单一责任 Agent 和固定输入输出契约的工作。SOP Invocation 可以复用 exact Routine Revision、Heartbeat 与 Adapter 执行能力，但不得创建隐藏 Issue；Task 的执行路径仍可复用同一底层模块。

### INV-002

一个 Invocation 可以因为 502、硬超时、断流或进程重启产生多个 Provider Delivery Attempt。Provider 重试不得增加 SOP Iteration 或 Invocation 业务预算，但必须独立记录 Attempt、已知/未知成本和最终分类。

### INV-003

每条 Retry Chain 必须具有数据库唯一语义身份和冲突回读。当前生产 `scheduleBoundedRetry` 已被 P7 证明可能产生分叉；在 P8 目标修正进入生产 Schema 和 Service 前，不得把现有通用重试视为可靠单链。

### INV-004

Provider-neutral Error Family 至少需要区分可重试基础设施故障、配额等待、执行超时、输出无进展、业务失败、取消和结果未知。Adapter 的原始错误字符串不得直接驱动 SOP 状态转换。

## 8. Stage Output、Verifier 与 Completion

### EVD-001

Artifact 必须使用不可变 Revision 或内容摘要；Evidence 必须引用其评估时看到的精确 Artifact、Fact、External Fact 和执行结果版本。普通 Fact 与 External Fact 使用不同来源类型：前者可由 Agent 按 Stage Contract 提交，后者必须由 Connector/Platform Observer 观察并经平台校验固化。

同一轮 Producer 按 `Produces` 提交的 Value、Resource Handle、Artifact、Fact、External Fact Handle、Evidence、Finding 和 Outcome Candidate 必须固化为不可变 Stage Output Set Revision，并保留 Producer 来源。Verifier 与 Completion Gate 必须引用同一个 Revision；Verifier 的 Assessment、Finding、Evidence 引用与解释固化为独立 Verification Result Revision，不得追加或反写 Producer Output Set。任何关键 Producer 输出变化都产生新 Revision，旧验证结果不能推进新 Revision。

### EVD-002

每个必需 Assessment 必须产生显式 Verdict。缺少 Finding 不得被解释为已经检查通过，`not_evaluated` 和未解决 Assessment Conflict 不得通过自动 Completion Gate。

### EVD-003

Finding 固定 Evidence Set Revision、Subject、Source Role、Evaluator/Rule Revision、Verdict 和 Severity。Producer 业务 Finding 与 Verifier 评价 Finding 必须可区分；输入变化产生新 Evidence Revision 和新 Finding，历史 Finding 只能被解决或替代，不得原地改写。

### EVD-004

Agent 或 Executor 只能提交 Completion Candidate。Kernel 的机械 Completion Gate 必须校验：

- 必需 Artifact 和 Evidence 是否齐全；
- 必需 Assessment 是否有合法 Verdict；
- 是否存在阻断性 Finding 或 Conflict；
- 人工 Decision 是否有效且未因关键内容变化失效；
- 当前 Stage Epoch、版本、权限和预算是否仍有效；
- 是否只选择 Execution Definition 声明的 Transition。

### EVD-005

每个 Stage 都必须有 Acceptance Contract 和 Mechanical Completion Gate，但 Agent Verifier 按需配置。Producer 提交 Stage Output Set Revision 和 Completion Candidate 后，由 Kernel 根据不可变契约自动触发 Verifier Invocation；Planner、Worker 或 Verifier 均不能跳过、取消或自行完成 Gate。

### EVD-006

Verifier 只能读取固定 Output Set Revision，并提交引用它的不可变 Verification Result Revision，其中包含逐 `criterionId` 的 Verdict、Evidence 引用、Finding 和解释。Verifier 不得修改被验证输出、把评价结果伪装为 Producer Output 或直接改变 Stage 状态。验证失败产生绑定当前 Revision 且带 Verifier 来源的 Finding，并在同一 Stage 内触发有预算的返工；新 Revision 必须重新验证。

### EVD-007

Verifier 默认是 Stage 内 Activity，不是业务 Stage。只有验证导致责任主体、独立业务决定、交付物或治理边界变化时，SOP Studio 才把它建模为独立 Stage，避免业务画布膨胀和 Verifier Stage 递归。

## 9. 持久等待与恢复

### REC-001

Input Request、Human Decision Request 和 External Wait 必须持久化。进入等待后，活跃 Agent 进程可以退出，不得依赖内存回调或旧 Session 保持可恢复性。

### REC-002

人工 Source Object 是决策事实源；Continuation Intent、Delivery Journal 和 Reconciler 保证决策提交后最终触发且只触发一次合法续跑。

### REC-003

恢复前必须重新校验 Stage Epoch、版本、Artifact、Authority Revision、Capability Revision、Actor 权限、预算、Wait Contract 和外部事实。事实漂移时应 invalidated、继续等待或创建新 Decision，不得盲目恢复旧命令。

### REC-004

Recovery Envelope 是恢复正确性的基础，至少固定 Release、Execution Definition、Stage、Epoch、版本、Artifact/Evidence、Finding、预算、允许动作和未决 Decision。Session Resume、Handoff 和选定 Transcript 只能作为优化或调查证据。

### REC-005

P10 已证明确定性状态可以在内存 Store 被销毁后，仅凭 PostgreSQL 快照和 Recovery Envelope 重建完整返工 Loop。该证据不证明 Fresh Context 与 Session Resume 在真实模型质量、Token 和时延上等价。

### REC-006

Run 开始前必须固定 Run Owner 与全部 Human Gate Assignee Resolution。Human Decision Request 只能投递给当前解析并仍有资格的 Gate Assignee；Run Owner 可以监控、Review 和协调，但只有在其同时是该 Gate Assignee 时才能裁决。人员改派必须产生新 Authority Revision，使旧 Human Decision Request 失效并重新投递，不能沿用旧授权继续执行。

Kernel 在派发新执行、恢复和提交 Human Decision 前都必须重新校验 Run Owner 与全部必需 Gate Assignee 的 Membership 和资格。任一人员失效时原子阻止后续派发、把 Run 置为暂停并创建唯一的人员改派 Attention；重复检测不得产生多个未决改派事项。改派完成后依据新 Authority Revision 重建未决 Human Decision Request，再按正常恢复流程重新竞争执行容量。

### REC-007

Stage Collaboration Message、Supplemental Input 和 Input Response 是三种不同事实。Collaboration Message 只进入 Discussion Thread，不得自动写入 Agent Context、满足 Consume Slot、解除 Wait 或触发 Invocation；Supplemental Input 与 Input Response 必须显式提交、按 Schema 校验并形成不可变版本化记录，Kernel 才能据此计算恢复或失效影响。

### REC-008

关键 Supplemental Input 或 Input Response 变化时，Kernel 必须根据固定依赖关系判断当前 Stage Epoch、Output Set、Evidence、Finding、Human Decision Request 与下游 Stage 是否仍有效。需要返工时创建新 Stage Epoch/Iteration/Invocation 并保留旧事实；Human Gate Decision 必须通过结构化 Human Decision Request 提交，自由文本消息永远不能替代有效 Decision。

### REC-009

Input Request 不产生独立 Assignee 或授权来源。Kernel 接受 Input Response 时必须先以 `request.runId` 固定授权边界，再按当前 Authority Revision 校验 Actor 在同一 Run 内的角色：该 Run 的有效 Run Creator 或 Run Owner 可回复该 Run 的任意 Stage；Human Gate Assignee 只可回复同一 Run 内其已授权 Stage。任何 Run 角色都不得传播到其他 Run。自动触发的服务身份不能作为人工回复 Actor。Input Response 与 Human Gate Decision 使用不同命令和校验路径，前者不得隐式完成、批准或拒绝 Gate；并发响应只允许一个请求版本原子生效，迟到响应保留审计结果但不得覆盖已接受事实。

## 10. 能力与外部副作用边界

### CAP-001

有效能力必须满足：

```text
固定 Agent Configuration Snapshot 中的来源能力边界
∩ 固定 Agent Tool Binding
∩ Optional Stage Allowlist
∩ 当前授权与撤权状态
= Invocation 有效 Tool 集合
```

Skill 不进入 Tool Grant 或 Tool Gateway。Invocation 使用固定 Agent Configuration Snapshot 中的 Skill Version Set；Stage 如果配置 Skill Allowlist，也只能按稳定 Skill Version ID 进一步取交集，不能增加 Agent 未绑定的 Skill。

Connection-backed Tool 与不需要 Connection 的 Extension Agent Tool 使用同一类稳定 Tool Key 进入 Agent Tool Binding、Stage Allowlist、短期凭证、Tool Gateway 和审计链。SOP 只引用稳定能力身份；需要外部身份时可以按 Connection ID 收窄，但不绑定底层 Connector 或 Extension Package 实现，也不建立第三套授权模型。

Stage Binding 只做 `Role Slot → Agent`。SOP、SOP Run、Role Slot、Planner 或 Executor 不得绑定新 Connector、Connection、Platform Extension、Secret 或临时扩大 Agent 权限；Stage Allowlist 只能引用平台中的稳定能力 ID，禁止用自然语言或语义匹配解释权限边界。

### CAP-002

首期不把 AgentEntitlementAnchor、RunCapabilityEnvelope 或资源级 Scope Contract 建成用户可见产品实体。短期凭证、逐次授权与撤权失效仍受 VAL-006 约束；本子需求固定“默认继承、可选精确收窄、绝不提权”的原则。

### EFF-001

外部 Effect 必须使用 Effect-aware Intent/Attempt Journal、Provider Idempotency/Marker 和 Reconcile-first。结果未知时进入 Reconciliation，不得把 Transport Failure 当作业务失败或直接盲重试。

Stage Kernel 必须在 Provider Dispatch 前为业务上的一次外部动作分配稳定的 External Effect Occurrence；它是运行时内部身份，不增加 SOP 作者需要配置的 Stage 槽位。Stage Retry、恢复和传输重试重访同一业务动作时继续引用该 Occurrence；只有业务契约确实要求第二次动作时才创建新的 Occurrence。

External Action Intent 表示该 Occurrence 的稳定逻辑副作用请求，必须固定 Company、Project、SOP Run、Connection、Connection Configuration Revision、逻辑 Stage、Effect Occurrence、Operation Key 和参数摘要；不能只在执行时读取 Connection 当前配置。Operation Key 由 `Company + Connection Configuration Revision + SOP Run + Logical Stage + Effect Occurrence + Action Kind` 派生，Parameter Digest 独立保存；相同 Operation Key 携带不同 Parameter Digest 必须冲突。Stage Epoch、Invocation、Tool Invocation 和 Fencing Token 属于实际执行身份，必须记录在 External Action Attempt 上，不能固定在会跨 Stage Retry 复用的 Intent 上。

`unknown` 不能直接创建新 Attempt，Provider 查询暂时返回 `not_found` 也不等于安全重试。只有请求被权威证明尚未离开平台，或 Connector Recovery Descriptor 生成了绑定最新 Attempt、满足 Provider 一致性窗口且可审计的 `safe_to_retry` 证明时，Coordinator 才能签发下一次 Attempt Permit；其余情况保持 Reconciliation 或进入人工核实。Recovery Descriptor 必须通过稳定 Strategy/Evaluator Key 精确解析到 Connector 实现，禁止依赖自然语言或 LLM 语义匹配决定恢复和重试。Provider 返回 2xx、202/204 或客户端收到响应也不能单独把 Intent 标记为成功，必须先固化满足 Expected Postcondition 的 External Fact。

External Fact 是 Connection-scoped、append-only 的 Provider 观察证据，只能由 Connector/Platform Observer 提交观察草稿并由平台校验后固化；External Object 只是由这些事实和主动查询计算出的稳定对象身份及当前状态投影。Fact Attribution 通过 Intent 关联回逻辑 Project/SOP Run/Stage，不绑定某个 Retry Epoch；当前 Stage Epoch 的 Postcondition Consumption 再显式引用它实际消费的 Fact。Stage Retry 可以新增 Consumption 并复用同一 Intent 已确认的 Fact，但不得改写事实的原始观察、归因或 Attempt 身份。不能把 Agent 提交的普通 Fact、External Object 的“当前看起来成功”、任意同类 Workflow 成功或 Tool Call 的返回状态当成本次动作证据。

### EFF-002

VAL-004 已通过确定性原型和隔离真实 GitHub Canary 验证非幂等动作协议；创建 MR、合并、部署和通知仍须通过生产 Connector、持久 Intent/Attempt/Fact 与正式授权链接入最小生产纵切。Kernel 只能依据已经确认的 External Fact/Postcondition 推进 Stage。

## 11. 暂停、预算与失败

### CTL-001

所有 Loop 必须具有 Invocation、Iteration、Token、成本、时间和失败预算。预算耗尽必须在派发前硬停止，形成结构化 Blocked 状态或 Attention，不允许依赖 Prompt 提醒 Agent 自觉停止。

### CTL-002

Pause 必须持久化为 Hold。Hold 释放后由 Reconciler 重新校验并恢复同一个合法 Continuation Intent，不得丢弃已经提交的人类 Decision，也不得创建重复 Invocation。

首期 Pause、Resume 与 Cancel 只允许作用于整个 SOP Run，不提供通用 Stage Pause/Cancel/Skip。Pause 后不得派发新 Invocation，活跃 Invocation 请求在安全点停止并固定 Checkpoint；Cancel 进入不可恢复终态，外部结果未知时必须先 Reconcile。Stage Retry 是新的业务尝试，必须创建新 Stage Epoch、Iteration 和 Invocation，保留旧事实并重新校验输入、预算、下游失效与外部副作用；Provider Delivery Retry 仍留在原 Invocation 内，不得与 Stage Retry 混用。Recovery Action 只能由具体故障及其 Capability 声明产生有限安全动作。

### CTL-003

必须区分：

- 领域业务未通过；
- Stage Contract 未满足；
- Agent/Executor 失败；
- Provider/基础设施失败；
- Connector 结果未知；
- 权限或预算阻塞；
- 人工取消。

这些结果不得压缩为单一 `failed` 文本或伪装成业务 Outcome。

## 12. 已验证边界

P0-P10 原型已经为以下目标架构提供证据：

- 独立 Kernel 和 Runtime-neutral Executor Decision；
- Optimistic Version、claim、lease、fencing 和 receipt reconciliation；
- 确定性 Planner / Worker / Verifier 返工 Loop；
- Invocation 预算硬停止；
- 持久 Human Decision、Continuation Intent 和跨进程恢复；
- Provider Retry Chain 与业务 Invocation 分层；
- Retry Attempt 唯一身份的最小修正方向；
- Resume 前事实漂移、权限、能力、预算和过期矩阵；
- 仅凭持久快照和 Recovery Envelope 的完整 Loop 重建；
- 独立机械 Completion Gate。

权威证据见 [Stage Execution Kernel 收口验证报告](./09-stage-kernel-closure-validation-report.md)。

## 13. 原型证据与生产集成缺口

已在声明范围内验证：

- VAL-001、VAL-007 的 Validation Snapshot、不可变版本、并发发布与 Run Pin 数据约束；
- P6 至 P10 的 Error Family、Retry/Wake 身份、Resume Eligibility 和持久 Loop 重建；
- VAL-004 的非幂等 Connector 故障注入与隔离真实 GitHub Canary；
- VAL-006 的能力收窄、短期凭证、撤权与旧 Token 失效；
- VAL-018 的独立 Worker、并发 Sandbox、固定容量、部门公平、Session/Fencing、Workspace 隔离与恢复；
- TV-05 的 Heartbeat/Worker/Kernel 生产接缝探针、真实 Docker Receipt 和 Fresh Context/Resume/Transcript 真实模型消融。

这些证据允许开始最小生产纵切，但不等于 SOP Runtime 已经成为生产能力。仍须完成：

1. 将版本、Retry/Wake、Continuation Intent、Source Route、Pause Hold、Reconciler、Lease 与 Worker Command/Receipt 固化到生产 Schema、Migration、事务和正式 Service/API；
2. 将 Connector Intent/Attempt/External Fact、能力授权、短期凭证和实际 Adapter 派发接入同一生产调用链；
3. 提供独立 Worker 与 Sandbox 的 Compose、注册、健康、容量、恢复和 Workspace 持久化生产配置；
4. 在最小 UI/操作入口验证启动、暂停、恢复、人工等待、失败诊断和审计闭环；
5. 补充长时间跨日运行、真实 Provider 抖动、告警、指标和运营恢复验证；
6. 在生产集成完成后重新执行 Gate B 所需的 Resource/Authority、Attention 与 Governance 纵切验证。

## 14. 验收场景

1. 同一 Stage 在 Planner、Worker、Verifier 之间发生完整返工，旧 Evidence 和旧 Epoch 不能误推进 Stage。
2. Agent 进程退出后，人工隔日作出 Decision，平台从持久状态恢复且只创建一个合法 Invocation。
3. Provider 502 或超时只增加 Delivery Attempt，不消耗额外 SOP Invocation 预算；Retry Chain 不分叉。
4. Pause、权限撤销、预算耗尽、Artifact 漂移或 Wait 过期都会在派发前阻止非法恢复。
5. Agent 自报 `done` 或 Verifier 自报 `pass` 不能绕过 Artifact、Evidence、Finding、Decision 和 Transition Gate。
6. 正在运行的 SOP Run 不受 Draft、新 Release、Binding 更新或 Pipeline live 配置变化影响。
7. 外部动作响应丢失时进入 Reconciliation，未确认 External Fact 前不得继续业务 Stage。
8. Worker 进程或容器失联后，旧 Fencing Token 的迟到事件不能改写状态；新 Worker 可从持久 Command、Checkpoint 和 Receipt 安全接管。
9. 单 Worker 同时执行多个不同 SOP Run 时，每个 Run 只能访问自己的 Workspace、凭证和网络范围；一个 Sandbox 的资源耗尽或退出不能终止其他 Run。
10. Worker 满载时新 Command 保持排队；运行中的 Run 转入人工等待并释放 Sandbox 后，其他 Command 可以获得槽位，原 Run 恢复时能从持久 Workspace 和 Checkpoint 重建环境。
11. 一个部门持续提交高优先级任务时，其他存在可执行任务的部门仍能在后续释放的 Slot 上获得调度；部门内高优先级任务先于同部门普通任务，但不会抢占运行中任务。
12. Worker 重启后保留相同 `workerId` 并产生更高 `sessionEpoch`；旧进程迟到的续租和回执被拒绝，新 Session 可以根据持久状态完成恢复或 Reconciliation。
13. 满载 Worker 保持健康但不再 Claim；在线但 Docker 不可用的 Worker 标记 not_ready；draining Worker 完成现有 Sandbox 后归零，紧急 disabled Worker 撤销 Session 并触发未完成 Command 的恢复检查。
14. 重建 Worker 容器并挂载原 Volume 后可以恢复 Workspace；删除某个 Sandbox 不删除其 Workspace；两个并发 Sandbox 只能看到各自 Run 目录。

## 15. 当前不包含

- 生产表结构和 API 的最终命名；
- 通用 BPM/Workflow DSL；
- 把 Planner 策略固化进 Execution Definition；
- Policy Studio 或通用业务规则引擎；
- 自动修改正在运行或已发布的 SOP；
- 以 Pipeline Automation 或 Routine 承担 Kernel 状态；
- 以 Transcript、Provider Session 或 Agent 自报作为完成与恢复真相。
