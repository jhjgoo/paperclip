# 企业级多 Agent 协作驾驶舱：总需求大纲

状态：产品架构与研发灯塔验收边界已收口，具体灯塔样本待启动前登记\
日期：2026-07-26\
基础项目：Paperclip\
当前阶段：正式需求沉淀，不进入开发

Stage Execution Kernel 的 P0-P10 可丢弃原型已完成阶段性收口；核心状态语义可以进入产品规格，生产接入与真实模型消融仍保持独立验证项。详见 [Stage Execution Kernel 收口验证报告](./09-stage-kernel-closure-validation-report.md)。

TV-01 的受控 Provider、Paperclip 生产接缝与隔离真实 GitHub Canary 已连续两轮通过，当前为 `validated`。详见 [GitHub 双面 Connector 技术验证报告](./11-github-connector-validation-report.md)。

TV-02 的 SOP 不可变版本与发布漂移验证已经通过；Draft、Validation Snapshot、Release、Execution Definition Revision、Binding Revision、Run Pin、六类漂移、并发单赢家、回滚和历史恢复均在两套全新 scratch PostgreSQL 上闭环。详见 [SOP 不可变版本与发布漂移技术验证报告](./12-sop-versioning-validation-report.md)。

TV-03 的 Agent 能力继承、Stage exact-ID 收窄、短期 Token 与即时撤权协议已经通过；Connection-backed Tool 和 Extension Tool 共用同一授权链，Policy/Approval/缓存/Connection Token/Secret 均不能绕过能力上限。详见 [Agent 能力继承、Stage 收窄与撤权技术验证报告](./13-capability-narrowing-validation-report.md)。

TV-04 的独立 Worker、固定并发 Sandbox、部门公平调度、Session/Fencing 与 Workspace 隔离恢复已经通过；两套真实 Docker 执行均保持峰值 2 个 Sandbox、零容量超卖、零跨 Run 读取和零容器泄漏。详见 [独立 Worker、并发 Sandbox 与 Workspace 技术验证报告](./14-worker-runtime-validation-report.md)。

TV-05 的 Heartbeat claimed-run 接缝、真实 Docker Receipt、P8/P9/P10 持久恢复组合与 `gpt-5.6-sol` 四组 Fresh-context 消融已经通过；R2 Recovery Envelope 在受控任务上安全、下一动作正确并由独立测试完成，不依赖旧 Provider Session。详见 [Stage Kernel 生产接缝与真实模型恢复消融技术验证报告](./15-stage-kernel-production-seam-validation-report.md)。

TV-01～TV-05 的保留证据、47 个源码摘要、7 条依赖边和五类身份接缝已经完成 Gate A 兼容性审计；两轮 Compatibility Digest 一致，Gate A 为 `validated`，允许进入最小生产纵切。详见 [Gate A 跨包证据兼容性技术验证报告](./20-gate-a-evidence-compatibility-report.md)。

TV-08 的第一阶段机械 Campaign 状态已经通过固定合成 Case 验证：冻结上下文、单变量候选、预算/漂移、Late Fact/Reopen、效果报告和人工精确 Digest 晋升均可机械表达；完整 TV-08 仍需真实 L1 与真实 Candidate 运行，因此保持 `inconclusive`。详见 [Improvement Campaign 机械状态技术验证报告](./18-improvement-campaign-validation-report.md)。

当前文档基线以 [决策与验证台账](./00-decision-and-validation-register.md) 中的 DEC-001 至 DEC-125 为准。早期研究中的 `SOP Run = Pipeline Case`、`Stage = Pipeline Stage`、`stage_loop Pipeline Automation`、通用 Context Item、每 Run 选择 Connector、把 Workspace 与文件资源库统一成同一物理存储、由 Server 进程直接执行 Agent，以及把持续优化简化成单一人工 Candidate 的方案已经被后续已确认 DEC 替代，不得作为后续实现依据；P0-P10 原型只提供可行性证据，不拥有改写产品决策的权限。

技术验证的问题、结果、Digest、依赖与分层 Go/No-Go 已收口到本目录的验证报告；可丢弃原型和历史执行计划未纳入正式开发基线，后续不得依赖已删除命令恢复实验路径。Gate A 已满足；Gate B 目前只有孤立领域契约原型与兼容矩阵证据，缺少生产 Schema/API/UI/运行链路，状态为 `inconclusive / No-Go`。MoonTV throwaway 只验证 Heartbeat 投递与机械 Kernel 推进的窄问题，不授权启动真实研发灯塔，也不能直接开发目标仓库。

本文所称“最小生产纵切”，是贯穿生产 Schema、持久事务、正式 Service/Route/API、实际授权和最小 UI/操作入口的一条最窄端到端路径，不等于完整生产版本。孤立原型证明规则在受控 Runner 中可行；最小生产纵切用于证明同一规则进入 Paperclip 权威数据与调用链后仍然成立。

DISC-001 至 DISC-008 已全部收口，当前没有待确认的产品阻塞项。研发灯塔验收边界由 DEC-116 至 DEC-124 固定；具体仓库与真实需求属于启动准备。产品决策已确认不等于相关生产验证已经完成，完整状态以决策与验证台账为准。

2026-07-26 已完成一轮 01 至 10 子需求的职责、事实源、权限、生命周期、版本固定和 MVP 边界一致性审计。审计修正只收紧既有决策，没有新增业务配置实体；剩余问题均保留为技术验证或启动准备项。

## 1. 文档目的

本目录将“基于 Paperclip 建设企业级多 Agent 协作驾驶舱”的需求拆成一份总纲和多份可独立评审的子需求。

总纲负责：

- 说明产品目标、边界和整体架构；
- 记录已经确认的跨模块决策；
- 管理子需求之间的依赖；
- 标明哪些结论已经确认，哪些仍需代码研究或原型验证；
- 避免在不同子需求中重复设计同一概念。

子需求负责：

- 定义一个边界清晰的产品子系统；
- 给出用户、场景、领域模型、交互、权限、异常与验收要求；
- 引用验证台账中的证据，不把推测写成确定性规格；
- 保持与 Paperclip 现有构件的映射关系。

本需求包不包含实现计划、开发任务和工期承诺。

### 1.1 子需求职责与冲突裁决

| 子需求 | 唯一主责 | 不得反向拥有 |
| --- | --- | --- |
| 01 | 产品目标、范围、原则与顶层成功标准 | 具体页面、状态机或能力生命周期 |
| 02 | Instance/Company Scope、身份、授权来源与临时访问 | 业务 SOP 权限或企业治理字段内容 |
| 03 | 页面层级、导航入口、读模型组合与信息优先级 | Agent/Connector 生命周期、Kernel 状态或治理 DTO 字段定义 |
| 04 | SOP 设计期契约、Validation Snapshot/Run 与发布生命周期 | 运行状态转换或企业能力安装 |
| 05 | SOP Runtime、Stage Kernel、Executor、恢复与副作用控制 | Studio 交互或业务 Outcome 定义 |
| 06 | Agent 配置、企业/部门能力供给与 Connector/Connection 生命周期 | SOP Run 临时授权或企业治理聚合 |
| 07 | Run/Stage 驾驶交互、Attention 投影、人工操作与恢复入口 | 复制 Kernel 状态机、审批状态机或 Artifact 事实 |
| 08 | 跨 Run 的 Improvement Campaign、候选评价与人工晋升 | 修改运行中 SOP、Agent 权限或自动采用 Skill |
| 09 | 内容盲企业治理投影、平台动作、健康、成本与审计 | 部门业务内容、Agent 组装或 SOP 语义 |
| 10 | 研发灯塔启动条件、故障演练与验收证据 | 新增通用产品语义或研发专用硬编码 |

出现表述冲突时，先以 `CONTEXT.md` 的领域词义和 `00` 决策台账为基线，再由上表的主责子需求解释具体行为。03、07、09 中的跨模块展示要求只是读模型和操作入口，不得覆盖 04 至 06 的写模型或状态所有权；10 只能验证 01 至 09，不能借灯塔样本创建新的通用契约。

## 2. 产品定义

> 面向一线业务团队的 AI 交付控制舱：团队围绕业务目标组织 Agent、SOP、Skill、工具和工件；平台负责执行、观察、治理与持续优化。

产品首先解决：

1. AI 工具、模型、Skill、MCP、Connector 和 Agent 配置碎片化；
2. 多 Agent 协作过程不可观察、不可暂停、不可恢复；
3. 交付周期长、质量不稳定、失败后重复返工；
4. 团队方法隐性存在，难以沉淀为可运行的 SOP；
5. SOP 和 Skill 缺少基于真实运行数据的持续优化闭环。

## 3. 目标用户

### 3.1 一线业务成员

发起业务目标、补充信息、处理决策、查看交付进度和获取最终工件。

### 3.2 部门负责人 / SOP 负责人

搭建、发布、运行和优化本部门 SOP，关注交付速度、质量、成本、风险和人工介入。

### 3.3 团队能力管理员

创建、测试和维护 Agent，配置其 Adapter、Model Deployment、Skill、Connection 与 Tool；维护部门私有 Skill、Connection 和 Project Env。

### 3.4 企业管理员 / 审计人员

管理企业 AI 基础设施、部门空间、平台健康、成本、风险、合规和审计；默认不读取部门业务内容。

## 4. 总体架构决策

### 4.1 组织作用域

```text
Paperclip Instance = 企业 AI 平台
Paperclip Company  = 部门 / 业务团队空间
Project            = 部门内的业务域或交付项目
SOP                = 部门内可运行、可版本化的业务方法
SOP Run            = 一次具体业务交付
```

一个 Instance 只承载一家企业并部署于客户自有服务器或私有云；它同时是企业数据、凭证、审计和治理边界。不同环境使用不同 Instance，不在 Company 之上新增 Enterprise/Tenant 层，也不在首期承载多企业共享 SaaS。

不新增 Department 数据层。现有 `company_id` 继续作为部门业务数据的隔离键。

### 4.2 产品作用域

```text
企业控制台
├── 组织与部门空间
├── AI 基础设施
├── 平台运营
└── 安全、风险、合规与审计

部门工作空间
├── 结果与行动 Dashboard
├── Projects（包括 Project `Artifacts`）
├── Tasks 与 SOP Runs
├── SOP Studio
├── Agent、Skills 与 Connections
├── Run Cockpit（包括 Stage 人工介入）
├── Resources
└── 质量与持续优化
```

### 4.3 技术演进方向

SOP 不复制 Paperclip 的通用 Agent 执行基础设施，也不把现有 Pipeline 数据结构作为 SOP 的长期编译目标。目标架构分为 4 层：

```text
Business SOP Definition
→ Validation Snapshot / Validation Run（发布前固定校验基线）
→ SOP Release（不可变生产业务契约）
→ Execution Definition Revision（不可变执行 IR）
→ SOP Run + Stage Execution Kernel（持久化运行状态）
→ Stage Executor / Routine / Heartbeat / Adapter / Connector（可插拔执行能力）
```

| 层级 | 权威职责 | 复用或新增 |
| --- | --- | --- |
| SOP Draft / Validation Snapshot / Release | 业务目标、Stage、责任、交付、评估、预算和允许路径；发布采用已通过且未漂移的契约与 Revision，并保留校验上下文证据 | SOP 产品层新增 |
| Execution Definition Revision | 无损编译后的不可变执行契约 | 共享契约内核新增 |
| SOP Run / Stage Execution Kernel | Stage Epoch、状态转换、预算、Checkpoint、Finding、Wait、Recovery 和 Completion Gate | 独立持久状态内核新增 |
| Stage Executor | 在执行契约内实现 Planner、Worker、Verifier 等可替换策略 | 版本化、可插拔 |
| Invocation | 单责任 Agent 的一次语义工作；一个 Invocation 可包含多个 Provider Delivery Attempt | 独立持久记录，引用 exact Routine Revision、Heartbeat 与 Adapter；不创建隐藏 Issue |
| Artifact / Evidence / External Fact | 交付工件、推进证据和外部事实 | 复用并扩展 Work Product、External Object 和 Connector |
| Human Decision / Attention | 持久化人工裁决与行动投影 | 复用 Approval、Interaction、Recovery Action 并统一协议 |
| 成本与审计 | 运行消耗、变更和副作用审计 | 复用 Cost Event、Activity Log 和 Tool Audit |

部署边界从首期即拆为控制面和执行面：

```text
paperclip-server
→ 创建持久 Execution Command
→ Server 在 PostgreSQL 中执行 Claim / Lease / Fencing
→ Worker 通过出站 Worker Control API 领取
→ paperclip-worker 准备 Execution Workspace 并运行 Adapter
→ 结构化 Event / Receipt
→ Server / SOP Kernel 校验并裁决下一状态
```

`paperclip-server` 不挂载 Execution Workspace，也不直接运行 Agent。`paperclip-worker` 是独立容器和故障域，只通过主动出站的 Worker Control API 注册、心跳、领取、续租和提交 Event/Receipt，不直接访问业务数据库。控制通道使用独立 Worker Service Credential 和短期 Session Token；Agent 子进程只能获得 Run-scoped Agent JWT，不能继承 Worker 权限。

每个逻辑 Worker 使用跨重启稳定的 `workerId`，每次 Worker 进程启动创建新的 `workerSessionId` 与单调 `sessionEpoch`。节点配置和长期历史绑定 `workerId`；Heartbeat、Claim、Lease 与 Receipt 同时绑定当前 Session 和 Command Fencing Token，旧进程的迟到消息不能进入新运行周期。

单节点 Docker 首期只运行一个 Worker，但 Worker 可以在固定 `maxConcurrentSandboxes` 容量内同时管理多个 Docker Execution Sandbox。每个 Sandbox 使用企业管理员配置的 CPU、内存和 PID 硬上限；业务用户、SOP 和 Stage 不填写基础设施资源请求。每个活跃 SOP Run 或需要执行的 standalone Task 默认对应一个 Sandbox；同一 SOP Run 跨 Stage 复用 Sandbox 与 Execution Workspace，不同运行之间隔离文件系统、进程、网络和资源。Sandbox 可销毁重建，Workspace 独立持久化；等待人工、暂停和长期阻塞时释放 Sandbox Slot。首期不为此额外引入 Redis、Kafka 或 Kubernetes。

Workspace 物理数据保存在 Docker 持久 Volume 或显式配置的宿主持久目录中，而不是 Worker 容器的临时文件层。唯一 Worker 挂载完整 Workspace Root；Worker 创建的并列 Sandbox 容器只挂载本 Run 目录；Server 不挂载 Workspace。首期不新增 Workspace Placement、跨 Worker 迁移或共享存储调度模型。

多个部门竞争 Slot 时，Server 使用非抢占式部门公平队列：跨部门优先调度当前占用较少且最久未获得调度的部门，部门内部再按已持久化业务优先级和排队时间排序。首期所有部门等权，不提供权重、保留 Slot 或专属 Worker Pool。

Worker 运行状态按三个正交维度管理：管理员设置 `enabled/draining/disabled`，Heartbeat 推导 `online/stale/offline`，运行自检产生 `ready/not_ready(reason)`；`available/full` 只表示剩余 Slot。只有 `enabled + online + ready + available` 才能参与 Claim，避免把满载误报为故障，或把在线但 Docker/Workspace 不可用的节点误认为可执行。

Pipeline 可以保留为普通工作流能力，或作为从 Execution Definition 生成的可重建兼容投影，但不得成为 SOP 语义容器、运行时权威定义或不可变发布的替代品。Stage Execution Kernel 独占 SOP Stage 的控制状态；Agent Runtime 只能通过受限协议提出 Decision、Command、Completion Candidate 或 Transition Proposal。

## 5. 核心产品原则

1. 业务目标和交付结果优先，Agent 状态是支撑信息。
2. SOP 是版本化契约，不是大 Prompt、聊天记录或固定脚本。
3. Agent 提议和执行动作，平台校验权限、预算、证据和状态转换。
4. Agent 的 `done` 不是完成事实，阶段推进必须有验证证据。
5. 每次 Invocation 只有一个责任 Agent；standalone Task/Issue 继续保持单负责人和原子 Checkout。SOP Run、Stage 与 Invocation 不创建隐藏 Issue。
6. Agent 能力由部门管理员长期授权，SOP 只能检查和收窄，不能临时提权。
7. 企业管理基础设施和平台风险，部门管理业务方法，SOP 管理交付过程。
8. 部门默认隔离；企业管理员默认只能查看治理投影。
9. 运行内 Delivery Loop 与跨运行 Improvement Loop 共享 Evidence 语言但拥有独立状态机；Agent 反思或 Stage 重试不等于 SOP/Skill 自我升级。
10. 持续优化在冻结的 Base、Evaluator、Cases、环境、权限和修改边界内运行；Kernel 掌握循环和预算，Agent 只在候选空间内自治。
11. 生产 SOP Release 不可变；多个隔离 Candidate 经验证后仍由部门负责人决定是否创建新版本，不自动发布。Department Skill 候选被接受后仍须完成 Agent 测试、Binding 同步和新 SOP Release，不能静默进入未来 Run。
12. 外部专业系统保留业务事实，Paperclip 负责组织、编排、观察、治理和审计。
13. 所有循环都有预算、终止条件和升级路径。
14. 外部动作按副作用等级恢复；Connector 声明 Provider 能力，平台执行安全下限，SOP 只能收紧不能放宽。
15. State Reconstruction 是恢复正确性的基础；Session Resume 和 Handoff 只能作为性能与体验优化。
16. SOP Run 的控制终态与业务 Outcome 分离；`completed` 不自动表示业务成功。
17. 文件资源库归部门所有；企业管理员首期只治理容量、用量、存储健康和系统声明的非内容维护动作，不能选择具体文件执行删除或移动，治理权限也不授予文件内容访问权。
18. 资源库按 Folder 与 File Name 处理重名；Resource File 是产品对象，内容去重与引用计数是独立存储优化，不得混为用户可见的版本机制。
19. SOP 通过稳定资源 ID 绑定文件或文件夹；资源库展示反向使用关系并保护被绑定资源，Run 启动时固定本次内容快照。
20. Artifact 属于产生它的 Run，包含中间和最终产物；经人工检查并显式发布后才成为可复用 Resource File。
21. 内容去重必须采用不可变 Blob 与 Copy-on-Write；共享底层内容绝不能导致多个 Resource File 联动修改。
22. 每次 SOP Run 必须有具体 Run Owner；每个 Human Gate 必须通过明确 Selector 解析到具体成员。
23. Run Owner 与全部 Gate Assignee 都能查看和管理本次 Run 的 Artifact，但只有对应 Gate Assignee 能作该 Gate 的人工决定；这组 Run 派生权与 Project 成员的基础查看权并存，角色失效不撤销 Actor 仍持有的 Project 基础权限。
24. 必需 Run 人员失效时立即暂停并显式改派；系统不得静默换人，历史责任记录不得改写。
25. 资源库首期使用简单部门权限；Agent 只通过 SOP Binding 或 Run 授权访问，不建设 Folder ACL 和逐文件分享。
26. 资源删除先进入部门回收站；逻辑资源删除与底层 Blob 回收分离，SOP Binding 和历史 Run 引用必须受到保护。
27. 资源库首期只做基础 Folder/File 管理，不扩张为带快捷方式、挂载点或标签体系的复杂企业网盘。
28. Stage 协作消息与运行输入严格分离；补充输入、Input Response 和 Human Gate Decision 必须显式、结构化、版本化并由 Kernel 裁决影响范围。
29. Input Request 不新增权限模型且严格按 Run 隔离；Run Creator 与 Run Owner 只可回复本 Run 的任意 Stage，Human Gate Assignee 只可回复本 Run 中其授权 Stage，输入回复不能替代人工关卡决定。
30. MVP 不预置业务 SOP；部门管理员必须能从空白 Draft 自主搭建、试跑、发布和运行，灯塔 SOP 只作为验收样本。
31. MVP 提供最小 Agent Studio：企业管理员供给基础能力，部门管理员组装和测试本部门 Agent；SOP 只绑定既有 Agent，不在运行时装配工具或提权。
32. 能力配置 UI 只呈现“企业可用、部门已配置、Agent 已绑定”；底层授权引用不能变成一套要求部门管理员理解的 Grant/Entitlement 配置中心。
33. Agent 由部门管理员维护而不“升级”；系统自动保存配置快照固定已发布 SOP 和 Run，可安装升级的是 Adapter、Connector、Skill、托管 MCP Runtime、Platform Extension 等分发能力。Project Env 只是项目级变量与 Secret 引用，不是企业分发能力或执行后端。
34. 企业管理员只管理企业 Skill 仓库及外部 Skill 仓库来源，决定企业 Skill 对部门的暴露；部门私有 Skill 对企业管理员不可见，未来只有部门主动提交的发布快照才能进入企业审批。
35. Platform Extension 是企业管理员治理的 Instance 级可信代码安装；部门和 Agent 不直接绑定它，只按各自领域规则使用其具体 Contribution。需要外部业务系统身份的 Tool 必须进入 Connector/Connection；不需要 Connection 的独立 Agent Tool 只以来源限定 Tool 身份进入既有 Agent Tool Binding，并固定贡献版本和 Contract Digest，不另建 Plugin Grant。Plugin、Connector、MCP、Adapter 与 Skill 不建立统一继承树。
36. Connector 是外部业务系统的双面集成：Agent-facing 面通过 MCP 暴露工具，Platform-facing 面暴露事件、Webhook、同步和 External Object；独立通用 MCP 可以存在，但不重复创建 Connector 身份和 Connection。
37. 双面 Connector 只形成一个 Connector Definition：MCP 和 Platform Extension Contribution 是内部实现引用，企业只安装维护一次，部门只创建一条 Connection，并在更新时统一查看两面能力变化和影响。
38. 企业 AI 基础设施采用联邦式治理目录：总览统一搜索来源、状态、部门范围、健康与影响，Model、Connector、MCP、Adapter、Skill 和 Platform Extension 仍由各自模块维护，不创建通用 Capability 写模型；Project Env 是部门 Project 配置，不进入企业目录。
39. 首期能力供给先打通添加、配置、测试、部门开放、Agent 绑定和运行，不建设通用信任分级或复杂软件供应链安全体系；仅保留企业管理员操作、来源/版本记录和审计等基本治理。
40. 每种企业能力都有独立导航、列表、详情和类型专属维护动作；不提供统一“添加能力”入口。跨类型 Catalog 只做治理总览和深链，不成为写操作容器。
41. Connector 采用 Connector-first 操作：管理员在 Connectors 页面完成完整维护，系统处理其声明的一层 MCP/Extension 实现依赖；Platform Extensions 页面只治理底层扩展，不新增 Connector Package 或通用依赖解析器。
42. Connection 是部门级命名外部身份；同一 Connector 可有多个 Connection，Agent 绑定具体 ID，多个同类连接用稳定 Alias 区分，不设置隐式部门默认值，也不在 Agent 或 Run 下重复创建。
43. Agent 必须显式选择 Tool：Connection-backed Tool 使用 Connection ID + Tool ID，独立 Extension Tool 使用来源限定 Namespaced Tool ID。来源能力边界是上限、Agent Binding 是实际集合、Stage 只能取交集；两类 Tool 共用能力凭证、Gateway 和审计。全选必须显式，新 Tool 不自动授权，Tool Profile 仅为可选复用模板。
44. Connection 的 Platform Integration 独立配置 Event、Webhook、Sync 与 External Object；Definition 只声明支持能力，部门显式启用实际需要项。它与 Agent Tool Binding 正交，并分别展示 Tool Health 和 Sync Health。
45. Connection 保持稳定外部身份：凭证轮换可原地更新，Provider Tenant 等身份变化必须新建；停用可恢复且不破坏 Binding，有效 Agent/SOP Release 引用保护删除，历史 Run 只保留身份快照。
46. Connector Version 可以并存；安装新版本不覆盖现有 Connection，部门显式迁移并测试。系统为迁移后的结构化 Connection 与 Platform Integration 配置生成不可变 Connection Configuration Revision，Agent Configuration Snapshot、SOP Release、活跃 Run 和 External Action Intent 精确固定该内部修订；它不作为用户维护的第二个 Connection 暴露，旧 Connector Version 按有效修订引用保留。
47. 独立 MCP 只有 Remote 和 Managed 两种模式：Remote 连接 HTTP Endpoint，Managed 使用企业 Runtime Template 并由 Agent Execution Worker 执行；Connector 内部 MCP 不重复登记，部门不编辑任意 stdio Command。
48. Remote MCP 只保存 Tool Catalog Revision 并检测变化，不伪造平台可控版本；Managed MCP Runtime Template 正式版本化、允许并存，Connection 显式迁移，SOP/Run 通过内部 Connection Configuration Revision 固定精确版本。
49. Agent Adapter 是独立的企业级 Runtime Driver；企业管理精确版本并向部门开放，部门在 Agent Studio 组合 Model Deployment、Adapter-specific Config，并选择 Project 或测试运行上下文完成测试；Worker 加载执行，Agent/SOP/Run 固定 Adapter 版本。
50. 企业以 Model Credential 维护 Provider/Endpoint/Secret，以 Model Deployment 暴露合法可调用模型组合；部门 Agent 只选择 Deployment，不读取 Secret 或自由拼接模型配置。
51. Enterprise Skill 可以企业创建或从外部仓库安装指定版本；外部仓库不作为运行源，企业版本不可变并按版本向部门开放，Agent/SOP 显式固定，新版本不自动采用，企业仍不可见 Department Skill。
52. 首期不建设企业 Environment Catalog，Agent、Stage 和 Project 都不绑定业务执行 Environment；维持 Paperclip 原有 Project Env 与 Workspace Runtime Service。前者只保存项目级变量与 Secret 引用，后者只是与工作目录绑定的开发/测试辅助进程，两者都不选择镜像、Worker、Sandbox Provider 或执行集群。Instance/Worker/Docker/Sandbox 参数留在 `.env`、Compose 或系统配置，企业控制台只观察 Runtime Health。
53. MVP 的 Project Workspace 必须可配置和 Preflight：纯业务 Project 可无文件 Root，研发 Project 支持零到多个 Git Root 并为每个 Run 派生隔离 Workspace；首期只做单节点本地持久 Provider。
54. MVP 必须交付完整核心 Run Cockpit、Stage Detail、人工操作、失败恢复和 Project Artifact 检查发布闭环；自定义看板与高级跨 Run 分析延后。
55. MVP 必须验证至少一个受控自治 Improvement Campaign：单次只优化一个低风险目标，保留多个候选与独立评价证据，并由人决定是否晋升。
56. MVP 的 Enterprise Console 必须形成内容盲的基础设施治理闭环：企业管理员可治理部门与额度、AI 基础能力、Worker/容量、平台审批和审计，但不能因此进入部门业务内容或修改业务 SOP。

## 6. 子需求目录

| 编号 | 子需求 | 当前状态 | 主要前置验证 |
| --- | --- | --- | --- |
| 00 | [决策与验证台账](./00-decision-and-validation-register.md) | 已建立，持续维护 | 无 |
| 01 | [产品定位、目标与范围](./01-product-positioning-and-scope.md) | 产品目标与范围已确认 | 量化指标待灯塔基线 |
| 02 | [组织作用域、身份、权限与工作区切换](./02-organization-scope-identity-access.md) | 产品契约已确认 | VAL-008、VAL-009 已验证；VAL-017 孤立原型已验证，生产集成未验证 |
| 03 | [页面信息架构、企业控制台与部门驾驶舱](./03-page-information-architecture-and-workspaces.md) | 已确认信息骨架 | VAL-008、VAL-014 已验证；VAL-013、VAL-016 孤立原型已验证，生产集成未验证 |
| 04 | [SOP Studio、Run Request、Stage I/O 与版本生命周期](./04-sop-studio-run-request-stage-contract.md) | 核心产品契约已确认 | VAL-001、VAL-007 已验证；VAL-016、VAL-017 孤立原型已验证，Schema Registry、生产集成与 UI 原型未验证 |
| 05 | [SOP Runtime、Stage Execution Kernel 与 Executor 协议](./05-sop-runtime-stage-execution-kernel.md) | 产品运行契约已确认 | Gate A 原型协议与接缝已验证；生产 Schema、事务、Worker/Connector 接入与运营验证未完成 |
| 06 | [Agent Studio、Skill、能力与双面连接器](./06-agent-studio-skills-and-capabilities.md) | 产品操作模型已确认 | VAL-006、VAL-012、VAL-018 原型已验证；物理 Schema、生产集成与交互原型未完成 |
| 07 | [Run Cockpit、Attention、失败与恢复](./07-run-cockpit-attention-failure-recovery.md) | 产品模型已确认 | 关联协议原型已验证；生产事务、持久投影、真实 UI 与 Gate B 纵切未完成 |
| 08 | [质量评估、改进候选与 Loop Engineering](./08-quality-improvement-loop-engineering.md) | 产品模型已确认 | VAL-011、VAL-015 |
| 09 | [企业平台治理、健康、成本、风险与审计](./09-enterprise-governance-runtime-health-and-audit.md) | 最小产品面已确认 | VAL-009 已验证；VAL-013、VAL-018 原型已验证，生产治理纵切未完成 |
| 10 | [研发灯塔 SOP 原型验证规格](./10-development-lighthouse-prototype-acceptance.md) | 产品验收边界已确认 | 汇总首期关键验证项 |
| 11 | 企业 SOP 仓库与跨部门复用 | 延后 | SOP 模型稳定后重新设计 |
| 12 | [全站国际化与中文化](./24-ui-internationalization-and-chinese-localization.md) | 产品规格已确认，待拆分实现 | 无 |

## 7. 子需求编写顺序

按依赖关系逐步编写，但已经验证的章节不再等待所有关联验证完成后才沉淀：

```text
产品定位与范围
→ 组织作用域与权限
→ 页面与工作区架构
→ SOP 领域模型
→ SOP Runtime
→ Agent 与能力
→ Run Cockpit
→ 评估与持续优化
→ 企业治理
→ 研发灯塔原型验证规格
```

某个子需求遇到未决问题时：

1. 在验证台账登记问题；
2. 选择代码审计、外部研究或可丢弃原型；
3. 明确能证明结论的证据；
4. 将已确认方向写入对应子需求，并明确尚缺证据；
5. 完成验证后回填结果，只有获得证据的部分才能标记为“已验证”。

## 8. 首期研发灯塔场景

首个原型只覆盖一个真实、低风险、可独立验收的功能需求，并完成测试环境交付：

```text
已确认需求
→ 技术方案
→ 开发实现
→ 自动测试
→ 代码评审
→ 合并代码
→ 部署测试环境
→ 验收完成
```

暂不包含生产环境发布。

样本必须使用真实代码仓库、自动测试、代码评审和测试环境。不得用合成需求或示例仓库替代，也不在首轮同时运行多个需求。失败、返工和人工等待必须进入 SOP Kernel 的权威状态与审计链，不能由人员在平台外补齐后伪装成端到端成功。

首轮由 Paperclip 原生 Run Request 接收需求正文、动态参数和可选外部需求链接；不强制接入 Jira、禅道等需求系统。Git 分支/提交、代码评审请求、评审、合并、CI/CD 流水线、部署与测试环境状态必须来自真实外部系统事实，不能通过模拟接口或人工回填替代。

首轮真实 Provider 选择 GitHub + GitHub Actions，覆盖 Branch、Commit、Pull Request、Review、Merge、Workflow/Job 与部署事实。该选择不得进入 SOP 或 Kernel 的通用枚举；GitHub 专有字段由 Connector 和 External Fact 适配，SOP 只引用稳定业务能力。首轮不同时兼容 GitLab/JiHuLab。

测试环境交付分两步验证：L0 先完成真实构建、自动测试和不可变镜像/制品发布，验证 CI、Artifact Digest 与失败回传，但不视为灯塔完成；L1 再由 GitHub Actions 将同一 Digest 部署到固定单节点 Docker 测试服务器，回传 Environment URL、部署状态和健康证据。只有 L1 与 Run Owner 验收完成后才算端到端成功。Agent 不直接 SSH 操作服务器；每 PR 临时 Preview Environment 延后。

灯塔必须同时通过三层验收：交付层完成代码、测试、Pull Request、Review、Merge、制品、L1 部署和 Run Owner 验收；控制层至少覆盖一次验证失败返工、一次持久人工等待/恢复、一次外部状态查询或超时 Reconcile，并证明不重复创建 Pull Request、合并或部署；产品层由部门管理员从空白 Draft 完成搭建、试跑、发布和运行，Run Owner 无需查看原始 Provider Transcript 即可判断进度、停止原因、责任、证据与结果。首轮只采集周期、成本、返工和人工介入基线，不预设效率提升百分比。

目标仓库从企业已有且真实使用的 GitHub 业务服务中选择，必须已有自动测试、Docker 构建和可部署测试环境，需求边界明确、低风险、失败可回滚。具体仓库和需求在灯塔启动前通过检查清单登记，不进入通用产品实体或 SOP 契约。首轮不使用 Paperclip 自身仓库，也不新建示例仓库；Paperclip Dogfooding 留作后续验证。

同一灯塔计划分为 L0/L1/L2：L0 验证 CI、测试与制品；L1 验证真实需求到固定测试环境和 Run Owner 验收，只有 L1 交付、三层成功判据和同期受控故障 Validation Run 全部通过，才可判定研发交付灯塔成功；L2 使用 L1 的不可变运行事实、返工轨迹、Stage Finding 和补充的固定验证 Case 发起独立 Improvement Campaign，只优化一个 Stage Instruction 或一个 Department Skill 内容版本，并由人决定是否晋升。Enterprise Skill 对部门只读，不由部门 Campaign 修改。L2 不属于原 SOP Run，也不修改 L1 历史，但仍阻塞首期完整产品切面完成。

控制正确性使用正式 L1 Run 与受控 Validation Run 共同验证。Validation Run 固定后来被 L1 SOP Release 采用的同一份已验证 Validation Snapshot，并复用相同 Project、Connector、Connection 与权限边界；它不直接执行或冒充生产 Release。复用真实能力契约不表示复用 L1 外部业务对象：Validation Run 必须使用由 Validation Run ID 派生的独立动作键、专用 Branch/PR/Workflow 输入和非生产目标，不得写入受保护默认 Branch、复用 L1 外部对象或触碰生产环境。演练通过可重复故障开关覆盖测试失败后的局部返工、GitHub 动作已成功但响应超时后的 Reconcile、Human Gate 延迟与进程退出后恢复，以及部署 Workflow 失败后禁止误报成功，并经过真实 Kernel、Connector、GitHub/GitHub Actions 和持久状态；Mock、单元测试或人工叙述不能代替端到端证据。

该流程不是产品预置 SOP。验证时由部门管理员从空白 Draft 搭建并发布，用来证明平台没有依赖研发专用硬编码。

原型重点验证：

- Planner-first 调度；
- fresh context 恢复；
- 结构化工件交接；
- 有界 test/fix/review Loop；
- 证据驱动阶段推进；
- 持久化人工中断与隔日恢复；
- Agent 权限不可由 SOP 提升；
- 局部失败只返工必要阶段；
- 外部动作的幂等与事实查询。

## 9. 当前明确延后的范围

- 企业 SOP 仓库；
- SOP 打包、跨部门采用、派生和贡献回源；
- 公共市场；
- Kubernetes、多节点调度和横向扩展；
- 生产环境部署原型；
- Policy Studio 或通用业务规则引擎；
- SOP Copilot；
- Artifact 的高级类型分类、复杂跨版本比较、批量 Review 与高级检索；MVP 的 Project 汇总、基础预览/下载/溯源/Review、standalone Task Work Product、文件固化与跨 Project 复用边界已经确认，不再属于延后决策；
- 自动修改生产 SOP 或 Skill；
- 通用聊天平台；
- 替代 Git、Jira、CI/CD、CRM 或 ERP；
- 新建独立 SOP Engine；
- 复杂企业角色体系；
- 通用能力信任等级、包签名与证明、Publisher Trust、漏洞扫描、数据外发评估和复杂软件供应链准入；
- 企业管理员默认读取部门业务内容。

## 10. 参考资料

- [研究资料状态与权威顺序](../../../../doc/research/README.md)
- [Paperclip GOAL](../../../../doc/GOAL.md)
- [Paperclip PRODUCT](../../../../doc/PRODUCT.md)
- [Paperclip V1 实现规格](../../../../doc/SPEC-implementation.md)
- [Loop Engineering 预研](../../../../doc/research/2026-07-23-loop-engineering.md)
- [Enterprise / Company 作用域与授权验证](../../../../doc/research/2026-07-23-enterprise-company-scope-authz.md)
- [页面信息架构与部门 Dashboard 预研](../../../../doc/research/2026-07-23-page-ia-and-department-dashboard.md)
- [SOP Release 与 Paperclip Runtime 映射研究](../../../../doc/research/2026-07-23-sop-release-runtime-mapping.md)
- [SOP Stage 能力收窄与运行时授权研究](../../../../doc/research/2026-07-23-sop-stage-capability-narrowing.md)
- [双面连接器覆盖度与统一安装契约研究](../../../../doc/research/2026-07-23-dual-sided-connector-coverage.md)
- [Stage Loop Controller 早期边界研究（方案已被后续决策替代）](../../../../doc/research/2026-07-23-stage-loop-controller-boundary.md)
- [Attention 聚合读模型与动作边界研究](../../../../doc/research/2026-07-23-attention-aggregation-read-model.md)
- [企业治理投影字段最小化研究](../../../../doc/research/2026-07-23-enterprise-governance-projection-fields.md)
- [SOP 版本效果归因与实验单元研究](../../../../doc/research/2026-07-23-sop-version-effect-attribution.md)
- [改进候选最小可用闭环研究](../../../../doc/research/2026-07-23-improvement-candidate-minimum-loop.md)
- [Paperclip Plugin 与能力架构研究](../../../../doc/research/2026-07-25-paperclip-plugin-capability-architecture.md)
- [Karpathy autoresearch 与 Two-Layer Loop 深度研究](../../../../doc/research/2026-07-25-karpathy-autoresearch-two-layer-loop.md)
- [Self-improving Agent Loop 横向研究](../../../../doc/research/2026-07-25-self-improving-agent-loop-landscape.md)
- [非幂等外部动作的重试与恢复研究](../../../../doc/research/2026-07-23-non-idempotent-external-action-recovery.md)
- [Fresh Context 恢复充分性研究](../../../../doc/research/2026-07-23-fresh-context-recovery-sufficiency.md)
- [持久化人工中断与隔日恢复研究](../../../../doc/research/2026-07-23-durable-human-wait-and-next-day-resume.md)
- 内部研发编排项目：`/Users/jianghongjian/Workspace/Code/Maycur/coding-agent-orchestrator`
