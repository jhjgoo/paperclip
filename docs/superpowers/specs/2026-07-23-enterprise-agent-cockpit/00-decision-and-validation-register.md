# 决策与验证台账

状态：持续维护\
用途：管理跨子需求决策、假设、验证方法与落地证据

> 归档规则（2026-07-28）：可丢弃原型源码、临时生产接缝和验证执行计划未纳入正式开发基线。台账保留其问题、结论、Digest、范围限制与对应验证报告；“已验证”只表示报告声明的协议/原型范围，不表示当前 HEAD 已实现生产能力。

## 1. 状态定义

| 状态 | 含义 |
| --- | --- |
| 已确认 | 产品方向已经由用户确认，但仍可能需要技术验证 |
| 已验证 | 已有代码、测试、原型或权威资料证明可落地 |
| 待验证 | 已明确问题、方法和证据要求，尚未完成验证 |
| 延后 | 当前阶段不设计或不实现，满足进入条件后重新评估 |
| 否决 | 已明确不采用，并记录原因 |

### 1.1 决策冻结与变更权限

- DEC 与已确认子需求正文构成冻结产品基线；原型、测试和技术验证不得自行改写其产品语义。
- 验证可以更新 EVD/VAL、适用范围、证据强度、实现缺口和 Gate 状态。
- 验证若否定某项 DEC 的前提，只能登记 Reopen Proposal，说明冲突证据、影响范围和建议选项；须经用户重新确认后，才可修改 DEC 或子需求正文。
- “代码位于生产目录”不等于生产能力成立。没有生产 Schema、Route/Service 调用链、持久存储和 UI/操作入口的孤立模块，只能记录为声明范围内的领域契约原型。

## 2. 已确认的产品决策

| 编号 | 决策 | 状态 |
| --- | --- | --- |
| DEC-001 | 第一目标用户是一线业务团队 | 已确认 |
| DEC-002 | 研发团队“需求到测试环境验收”作为灯塔场景 | 已确认 |
| DEC-003 | 产品定位为 AI 交付控制舱 | 已确认 |
| DEC-004 | SOP 采用固定契约骨架与阶段内动态 Loop | 已确认 |
| DEC-005 | SOP 复用 Paperclip 的 Routine Revision、Heartbeat、Adapter、Connector、治理基础及 Task/Issue 背后的共享协作能力，但不复用 Issue 记录或状态机；现有 Pipeline 不是 SOP 编译目标 | 已确认 |
| DEC-006 | 采用双面连接器：Agent-facing MCP 与 Platform-facing 状态/事件同步 | 已确认 |
| DEC-007 | Agent 是具体权限主体，Role 不是运行时授权主体 | 已确认 |
| DEC-008 | 能力长期授权给具体 Agent，Tool Profile 用于复用；SOP 不临时提权 | 已确认 |
| DEC-009 | Paperclip Instance 表示企业平台，Company 表示部门/业务团队空间 | 已确认 |
| DEC-010 | 部门默认隔离，企业管理员默认不读取业务内容 | 已确认 |
| DEC-011 | 企业控制台与部门空间使用统一 Scope Switcher 和 URL 作用域 | 已确认 |
| DEC-012 | 部门 Dashboard 以结果、风险和待处理事项为中心 | 已确认 |
| DEC-013 | 企业治理只约束平台资源与高风险能力，不覆盖 SOP 业务语义 | 已确认 |
| DEC-014 | SOP Run 聚合执行事实，Attention Item 聚合人工介入 | 已确认 |
| DEC-015 | Planner 可以提议 Stage 转换，但只能选择 SOP 声明的边，由平台裁决 | 已确认 |
| DEC-016 | 跨运行优化只能生成候选版本，经回放、灰度和部门负责人批准发布 | 已确认 |
| DEC-017 | 企业 SOP 仓库、打包和跨部门传播延后 | 已确认 |
| DEC-018 | 研发原型暂不包含生产环境部署 | 已确认 |
| DEC-019 | Attention 采用 Source Adapter、Attention Signal 与 Incident 聚合；底层领域对象仍是唯一事实源 | 已确认 |
| DEC-020 | 外部动作按副作用等级执行恢复策略；Connector 声明能力，平台执行安全下限，SOP 只能收紧不能放宽 | 已确认 |
| DEC-021 | 部门 Dashboard 采用交付组合看板主骨架、个人行动区和运维异常上浮；角色差异使用“我的/团队”视角过滤 | 已确认 |
| DEC-022 | SOP 采用共享不可变 Execution Definition Revision 内核：SOP Release 是业务真相，编译目标不是现有 Pipeline 组件；Pipeline 可作为兼容视图，Routine Revision、Heartbeat 及 Task/Issue 背后的能力模块继续作为共享执行构件，但 Issue 本身不承载 SOP 语义 | 已确认 |
| DEC-023 | Execution Definition 采用“契约稳定、策略可替换”边界：IR 固定不可违反的执行契约，版本化 Stage Executor/Routine/Skill 在契约内实现 Planner、Worker、Verifier 策略 | 已确认 |
| DEC-024 | SOP 执行模型采用三层架构：Execution Definition 只承载不可变契约，Runtime Protocol 统一 Activity、Invocation、Decision、Command、Fact/Effect、Artifact/Evidence、Checkpoint 和 Attention，领域差异通过可版本化 Extension 类型扩展 | 已确认 |
| DEC-025 | SOP Run 的通用控制状态与领域业务 Outcome 分离；`completed` 只表示执行闭环，不代表业务成功，执行失败不得伪装成业务不通过 | 已确认 |
| DEC-026 | Runtime Protocol 增加 Finding/Assessment 作为 Evidence 与 Decision 之间的结构化判断层；Stage Contract 可固定引用领域 Rule Set Revision，人工例外产生 Decision，不篡改原 Finding | 已确认 |
| DEC-027 | 首期采用 Agent-first SOP，不建设 Policy Studio 或通用业务规则引擎；平台只机械执行版本、权限、预算、转换、证据、审批和副作用等控制不变量，待运行证据证明 Agent 不稳定或规则化有明确收益后再引入 | 已确认 |
| DEC-028 | Stage Contract 使用 Assessment Coverage Contract 声明必须回答的评估问题；Agent 必须为每项提交显式 Verdict，缺少 Finding 不能被解释为已检查且通过 | 已确认 |
| DEC-029 | Runtime Protocol 支持持久化 Input Request；Attention 只是其行动投影。Run 可在等待外部输入时退出执行，并通过持久化 Continuation Intent、权限重校验和新 Stage Epoch 恢复 | 已确认 |
| DEC-030 | Finding 固定其评估依据的 Evidence Set Revision；关键输入变化产生新 Evidence Revision 和新 Finding，历史 Finding 只可被解决或替代，不得原地改写 | 已确认 |
| DEC-031 | Runtime Protocol 统一 Human Decision Request；Stage Contract 声明 Decision Authority 与职责分离要求，人工裁决固定请求签发时的 Stage Epoch、Evidence Set、Finding Set 和动作参数快照。恢复产生新 Stage Epoch 时，已经被平台接受且其快照、Authority Revision 与 Continuation Intent 仍合法的 Decision 可由新 Epoch 显式消费；Stage Retry、关键内容或权限变化使旧请求/决定失效 | 已确认 |
| DEC-032 | Runtime Protocol 记录 Assessment Conflict；必需 Assessment 的未解决冲突阻止自动完成并转人工复核，不使用 Confidence 比较、多数投票或隐式 Verifier 优先；Verifier 首期至少使用独立 Invocation、Fresh Context 和独立评估 | 已确认 |
| DEC-033 | SOP 复杂度按 Business SOP Definition、Compiler 生成的 Execution Definition 和 Runtime Protocol 三层归位；普通业务用户只定义目标、Stage、责任、交付、关键评估问题和人工介入条件，SOP Copilot 在业务模型稳定后作为辅助入口而非复杂协议遮蔽层 | 已确认 |
| DEC-034 | Project 定义为部门空间内的业务工作容器，用于聚合共同业务目标下的 Task、SOP Run 和工作资产；每个 SOP Run 必须归属一个 Project，独立 Task 可以不归属 Project。SOP Definition 归属部门并可跨 Project 复用；Project 不等于 SOP、代码库、Project Workspace、Execution Workspace 或 Worktree | 已确认 |
| DEC-035 | SOP Run 创建体验沿用 Paperclip Task 的 `in [Project]` 语法与紧凑 Composer，但 Project 为必填且必须在 Run 启动前固定；`+` 只补充 Run Request Contract 中尚未提供的类型化 Argument，文件上传也必须对应已声明的 `file` Argument，不存在绕过 Schema 和 Data Binding 的无类型临时材料袋；它不承担通用资源引用、Connector 或 Stage 工件配置 | 已确认 |
| DEC-036 | Stage Binding 首期只做 `Role Slot → Agent`；默认继承 Agent 已配置的全部 Skill、Connector 和工具，Stage 可在高级设置中用稳定能力 ID Allowlist 精确收窄，但不得通过自然语言、语义匹配、SOP Binding 或 SOP Run 增加能力 | 已确认 |
| DEC-037 | Run Request 与 Stage I/O 使用不同契约：Run Request 表达一次动态 Goal / Instruction 与类型化 Arguments；Stage 通过 `Consumes / Produces` 表达执行数据依赖，二者不得继续统称为同一种 Input。上传文件只是 `file` Argument 的取值，不形成第三种无类型输入 | 已确认 |
| DEC-038 | Trigger 与 Argument 类型正交；人工、API、Webhook 和定时触发只负责创建同一种 Run Request，并把载荷精确映射到 Argument Key，不产生 `trigger_payload` Argument 类型 | 已确认 |
| DEC-039 | SOP 跨 Run 复用的规则、模板、知识库和固定资源位置属于 `SOP Resources`，即 SOP Definition 中的稳定 Resource Binding 集合，不属于 Run Request，也不创建新的 Workspace、存储根或权限边界；运行时解析并固定本次 Resource Snapshot，读取结果再进入 Fact、Artifact 或 Evidence | 已确认 |
| DEC-040 | Stage Data Binding 只允许 `run.goal`、`run.arguments.*`、`sop.resources.*` 和 `stage.<id>.outputs.*` 等稳定 Slot 精确映射；发布前必须证明每条合法进入路径上的必需 Consume Slot 均有来源，不使用名称猜测、语义匹配或无类型材料袋 | 已确认 |
| DEC-041 | Stage `Produces` 首期覆盖 Value、Resource、Artifact、Fact、External Fact Handle、Evidence、Finding 和 Outcome；同轮结果固化为不可变 Stage Output Set Revision，JSON/XML 只是 Artifact 表现格式，不能替代结构化 Fact、Evidence、Finding 或 Outcome。普通 Fact 可以由 Agent 按明确 Schema 和来源提交；External Fact 只能由 Connector/Platform Observer 观察并经平台校验后固化，Stage 只登记其 Handle，Agent 只能请求、引用和消费，不能伪造 | 已确认 |
| DEC-042 | 每个 Stage 必须有 Acceptance Contract 并经过机械 Completion Gate；Agent Verifier 按需绑定、由 Kernel 在 Completion Candidate 后自动触发并驱动同 Stage 返工 Loop。Producer 提交不可变 Stage Output Set Revision，Verifier 只针对该精确 Revision 产生独立 Verification Result Revision；Verifier 的 Assessment、Finding 与 Evidence 必须保留评价来源，不能反向写入 Producer Output 或形成自证。只有验证本身构成独立业务责任或治理边界时才建 Verifier Stage | 已确认 |
| DEC-043 | 文件资源库与 Workspace 保持独立：资源库管理可组织、可引用的长期文件，Workspace 管理可执行、可写入的工作目录；两者只通过显式 Materialize 与 Publish 交换内容，不建设统一物理存储或自动双向同步 | 已确认 |
| DEC-044 | 一个 SOP Run 默认创建并跨 Stage 复用一个主 Execution Workspace，同一时刻只允许一个受 Lease 保护的权威写入者；临时目录用于轻量中间计算，Scratch Execution Workspace 用于需要文件系统、Branch 或 Environment 隔离的短期试验 | 已确认 |
| DEC-045 | Execution Workspace 是逻辑聚合，可包含多个 Workspace Root；有来源的 Root 从 Project Workspace 派生并独立固定 Repo、Ref、Branch、Checkpoint 与 Provider Ref，也允许 Project 没有文件基线时创建空白 Root，使多仓库或纯临时文件 Run 保持一个工作空间体验而不混合 Git 身份 | 已确认 |
| DEC-046 | Kubernetes 作为未来横向扩展模式时，每个 SOP Run 的主 Execution Workspace 默认使用一个持久 RWO PVC 承载全部 Workspace Root；Environment Lease 和 Agent Pod 可以释放或迁移，但 Workspace 在 Run 生命周期内持续存在。该目标不进入首期实现 | 已确认，延后实现 |
| DEC-047 | Execution Workspace 使用分层保留策略：运行、等待、暂停和阻塞期间保留工作现场并可释放计算；完成或失败后按部门默认 TTL 清理，Incident/人工 Pin 可阻止清理；删除前必须固定最终 Checkpoint 并确认 Git、Artifact 与 Evidence 已持久化 | 已确认 |
| DEC-048 | 首期部署优先支持单节点 Docker 模式；Kubernetes、多节点调度和横向扩展留到真实规模与性能需求出现后设计实现，首期只保留 Workspace Provider 等必要演进接缝，不提前建设 K8s 运行能力 | 已确认 |
| DEC-049 | Paperclip Server 与 Agent Execution Worker 从首期起作为独立部署单元：Server 拥有 API、权限、SOP Kernel、调度裁决和业务状态，不挂载 Execution Workspace、也不直接运行 Agent；Worker 通过持久 Command Claim、Lease 与 Fencing 领取执行，管理 Workspace、Adapter 和 Runtime，并以结构化 Event/Receipt 回报。单节点 Docker 首期只部署一个 Worker，但不得使用进程内执行捷径 | 已确认 |
| DEC-050 | Worker 采用主动出站的 Worker Control API 与 Server 通信；PostgreSQL 是 Execution Command、Claim、Lease、Fencing 和 Receipt 的权威存储，但只有 Server 执行原子状态操作，Worker 不直连业务数据库。首期接口覆盖注册、心跳、领取、续租、事件、回执和释放，不引入 Redis、Kafka 或其他消息中间件 | 已确认 |
| DEC-051 | Worker Control API 必须鉴别独立 Worker 服务身份，不能把 Docker Network 当作信任边界。首期使用 Docker Secret 注入的实例级 Worker Service Credential 换取短期 Worker Session Token；Worker Token 只访问控制接口，Agent 子进程继续使用独立的 Run-scoped Agent JWT。Enrollment UI、mTLS 和企业证书体系延后到跨主机或多节点阶段 | 已确认 |
| DEC-052 | 一个 Worker 是可并发管理多个执行环境的节点级 Supervisor，不与单个 Run 一一对应。首期生产默认每个活跃 SOP Run 或需要执行的 standalone Task 使用一个隔离 Docker Execution Sandbox，同一 SOP Run 跨 Stage 复用 Sandbox 与主 Execution Workspace 并遵守单 Writer Lease；Scratch Execution Workspace 使用独立 Sandbox。Sandbox 可销毁重建，Workspace 独立持久化；`local_process` 仅用于开发或可信任务 | 已确认 |
| DEC-053 | 首期 Worker 容量采用固定并发槽位：企业管理员配置 `maxConcurrentSandboxes` 及 Sandbox CPU、内存、PID 等硬上限，业务用户、SOP 和 Stage 不填写资源请求。Server 以有效 Sandbox Lease 计算可用槽位，Worker 在本地执行二次硬校验；无容量的 Command 保持排队。等待人工、暂停和长期阻塞释放 Sandbox Slot，但保留 Execution Workspace 与 Checkpoint | 已确认 |
| DEC-054 | 多部门竞争有限 Worker Slot 时采用非抢占式部门公平队列：Server 先在 Company（部门）之间优先选择当前占用较少、最久未获得调度的部门，再在部门内部按已持久化业务优先级和排队时间选择 Command。已运行 Sandbox 不因新高优先级任务被抢占；首期所有部门等权，不建设权重、保留 Slot 或专属 Worker Pool | 已确认 |
| DEC-055 | Worker 身份采用稳定 `workerId` 与临时 `workerSessionId` 双层模型：`workerId` 持久保存在 Worker 状态卷并承载配置、历史和管理动作；每次进程启动由 Server 创建新 Session 与单调 `sessionEpoch`，旧 Session 不得继续 Claim、Renew 或提交权威 Receipt。Hostname 和 displayName 只用于展示，不能作为身份 | 已确认 |
| DEC-056 | Worker 状态不压缩为单一枚举，而拆成管理状态 `enabled/draining/disabled`、连接状态 `online/stale/offline` 与就绪状态 `ready/not_ready(reason)`；容量 `available/full` 由 Slot 派生且不属于健康故障。只有 enabled、online、ready 且有空闲 Slot 的 Worker 可领取任务；优雅维护使用 draining，紧急处置使用 disabled 并撤销 Session | 已确认 |
| DEC-057 | 首期单节点 Docker 的 Workspace 使用本地持久 Volume 或显式持久目录：完整 Workspace Root 挂载给唯一 Worker，每个 Execution Sandbox 只挂载自己的 Run 目录，Server 不挂载 Workspace。Worker 或 Sandbox 容器重建不得删除 Workspace；Sandbox 由 Worker 管理但不是嵌套 Docker-in-Docker。首期不新增 Workspace Placement、迁移、共享存储调度或多 Worker 亲和性模型 | 已确认 |
| DEC-058 | 文件资源库以 Company（部门）为唯一内容归属边界：每个部门只有一个共享资源库，Folder 负责组织，Project、SOP 和 Run 只引用资源，不创建个人库或 Project 独立存储根；“我的上传”和“某 Project 使用”均是筛选视图 | 已确认 |
| DEC-059 | 企业管理员拥有部门文件资源的治理权而非内容访问权：企业控制台提供逐部门资源治理页面，可下发/收回额度，并对系统明确报告的存储故障执行重算用量、重试 Blob 回收等不需要选择业务文件的有限维护动作；不能列出或进入部门文件树、预览、下载、提取内容、选择具体 Resource File 执行删除/移动，或借治理动作获得 Company Access。逻辑文件管理仍由有内容权限的部门角色完成。治理接口与内容接口必须分别授权和审计；风险识别、隔离、定向删除与处置工作流不进入首期 | 已确认 |
| DEC-060 | 资源库产品层以 `Folder + File Name` 判定同目录重名：不同 Folder 可直接保存同名文件；同一 Folder 已存在同名文件时，用户选择“替换”或“同时保留”。“同时保留”由系统在扩展名前追加下一个可用数字后缀，例如 `fileA(1).pdf`；底层内容哈希不得改变这一交互语义 | 已确认 |
| DEC-061 | Resource File 是用户组织和引用的产品对象，底层 Content Blob、SHA-256 去重、引用计数和垃圾回收是独立存储架构。多个 Resource File 即使复用同一 Blob，产品层仍是不同文件；替换内容保留 Resource File ID，只更新其当前内容引用，旧物理内容仅在没有受保留引用时回收。首期是否实现内容去重另行验证，不把存储优化暴露为产品版本管理 | 已确认 |
| DEC-062 | SOP Resource Binding 必须指向稳定的 Resource File/Folder ID，不绑定 Path、File Name 或 Blob。资源库展示资源被哪些 SOP 使用；存在有效 SOP Binding 时禁止删除、移动或重命名该文件/文件夹，用户必须先解除引用。替换已引用文件的内容不生成新 Resource File ID、也不要求更新 SOP Binding，只在影响提示后更新后续 Run 使用的内容；已启动 Run 使用其已固定快照。Folder Binding 只保护 Folder 本身，不冻结其子项，除非子项另有直接 Binding | 已确认 |
| DEC-063 | SOP Artifact 是某次 SOP Run 产生的全部可检查中间或最终工件，动态、Run-scoped、带来源并通过 Run 归属 Project；它与 Task Work Product 保持不同来源模型，不自动成为部门稳定资料。Artifact 只有经过人工检查并显式发布后才创建 Resource File；Project 汇总、文件固化、隔离和引用方式由 DEC-073 至 DEC-075 固定 | 已确认 |
| DEC-064 | 底层 Content Blob 必须不可变并采用 Copy-on-Write 语义：多个 Resource File 可以引用同一 Blob，但替换或编辑其中一个文件时只能创建或复用新的 Blob，并原子更新目标 Resource File 的内容引用；其他 Resource File 继续引用原 Blob，绝不能联动修改。引用计数只决定 Blob 何时可回收，不参与传播内容变更 | 已确认 |
| DEC-065 | 每次 SOP Run 在开始前必须解析并固定一名具体 Run Owner；人工创建时可以默认创建人但必须清晰展示并可修改，API/Webhook/定时触发必须由调用或 Trigger 配置提供可解析负责人。Run Owner 对整个 Run 的检查、监控、Review 和人工协调负责，但不等同于 Agent Assignee，也不自动获得未分配给自己的 Human Gate 决策权 | 已确认 |
| DEC-066 | Stage 配置 Human Gate 时必须同时配置 Human Assignee Selector；首期只支持固定部门成员以及 `run.creator`、`run.owner`、`sop.owner` 等明确动态来源，不支持自然语言或运行时猜测。所有 Selector 在 Run 开始前解析并固定到具体有效部门成员；任一必需人员无法解析时 Run 不得开始，人员变化必须显式重新指派并审计 | 已确认 |
| DEC-067 | Run Owner 与本次 Run 已解析出的全部 Human Gate Assignee 必须拥有该 Run 全部 Artifact 的查看与管理权限。管理包括查看、下载、比较、标注和 Review，但不允许原地修改不可变 Artifact；每个 Gate Assignee 只能裁决分配给自己的 Gate，发布 Artifact 到资源库仍需满足部门资源发布权限。该访问从 Run 人员角色派生，不复制为永久文件授权；它与 Project Membership 提供的基础查看权取并集。人员角色失效时只撤销派生的管理权和越过 Project Membership 的访问权，Actor 若仍是 Project 授权成员则继续保留 Project 基础查看权 | 已确认 |
| DEC-068 | Run Owner 或任一 Human Gate Assignee 离职、退出部门、Membership 失效或失去对应资格时，SOP Run 必须暂停并产生人员改派 Attention，不得静默自动换人或继续进入新执行。人员改派只能由 SOP Owner 或部门管理员显式提交；Run Owner 可以监控、协调和请求改派，但不能凭运行控制权改变 Gate 或 Owner 的 Authority Revision。改派生成新 Authority Revision、撤销旧人员后续派生访问并重新投递未决请求；历史审阅和已完成 Decision 保留原 Actor，不因改派被改写 | 已确认 |
| DEC-069 | 文件资源库首期采用简单部门权限：普通成员可浏览、下载、上传，并管理自己上传且未被 SOP Binding 保护的资源；部门管理员或资源管理员可管理部门内全部资源；Agent 不得自由浏览资源库，只能通过 SOP Resource Binding 或明确 Run 授权访问。首期不建设 Folder ACL、逐文件分享或复杂继承权限 | 已确认 |
| DEC-070 | 文件资源库首期提供部门回收站：未受 SOP Binding 保护的 Resource File/Folder 删除后先逻辑移入回收站，在统一保留期内可恢复，到期后永久删除逻辑资源；不提供逐文件或逐目录保留策略。被绑定资源或包含被绑定后代的 Folder 禁止删除。物理 Blob 仅在没有 Resource File、Run、Artifact 或其他受保留引用时回收，现有 Run 快照不受资源进入回收站影响 | 已确认 |
| DEC-071 | 文件资源库首期只提供基础 Folder/File 管理：创建 Folder、任意层级嵌套、上传、重命名、移动、删除到回收站和恢复；所有重名场景复用 `Folder + File Name` 规则。移动或重命名 Folder 时，只要自身或任一后代受 SOP Binding 保护就阻止操作并展示引用来源。首期不建设快捷方式、软链接、挂载点、标签体系或其他网盘增强能力 | 已确认 |
| DEC-072 | Task 保留为对外的一等产品概念，只承载不经过 SOP、由一名人或 Agent 承担的一次性单责任工作；选择 SOP 时直接创建 SOP Run，Stage 与 Invocation 不创建或暴露用户可见 Task/隐藏 Issue。Invocation 可以引用 exact Routine Revision 及一个或多个 Heartbeat Run/Provider Attempt，但这些执行记录不得进入普通 Task 列表或成为 SOP 状态真相 | 已确认 |
| DEC-073 | Task Work Product 与 SOP Artifact 保持各自来源和归属，不因是否进入 Project 而互相转换或复制。Project `Artifacts` 分栏统一列出该 Project 下 Task Work Product 与 SOP Artifact，并保留来源深链；无 Project 的 standalone Task Work Product 只在 Task Detail 展示。部门侧不再提供独立全局 Artifacts 入口，输入附件、参考资料、任意 Workspace 文件和普通过程文档不得因存在于 Project 中自动进入成果清单 | 已确认 |
| DEC-074 | 文件 Artifact 的工作来源可以是 Execution Workspace 路径，但登记 Artifact 时必须固定来源 Checkpoint、内容哈希和不可变内容快照，不能只保存会变化或被 TTL 清理的路径。Artifact 内容与 Resource File 在产品身份、权限和生命周期上分离，但可复用同一不可变 Content Blob；“发布到资源库”创建新的 Resource File ID 与目录身份，不复制或转换 Artifact，底层无需强制生成第二份物理内容 | 已确认 |
| DEC-075 | Artifact 与 Workspace 默认按 Project 隔离：Project A 的 Run、Agent 凭证和普通查询不能读取 Project B 的 Artifact 或 Workspace。SOP Definition 不绑定未来的具体 Artifact ID；同一 SOP Run 内通过 `stage.<id>.outputs.<slot>` 在运行时解析具体 Artifact，跨 Run 或跨 Project 复用必须先由人工检查并发布为部门 Resource File，再通过 SOP Resource Binding 引用其稳定 ID | 已确认 |
| DEC-076 | Task 是唯一对外产品术语；Paperclip 现有 Issue 只是 Task 的内部表、类型、服务与 API 实现名，不形成第二个业务实体。Issue 现有的父子关系、阻塞、评论、附件、计划、负责人和 Work Product 均作为 Task 能力呈现；首期不为术语一致性大规模重命名内部代码，也不新增与 Issue 并行的 Task 数据模型 | 已确认 |
| DEC-077 | SOP Run、Stage 与 Invocation 独立建模并各自维护权威状态，不为 SOP Run 或 Invocation 创建隐藏 Issue。Task/Issue 背后的 Discussion Thread、Attachment/Asset、Document Revision、Activity Timeline、Heartbeat/Adapter、Transcript 和 Cost 等能力应通过共享模块供 Task 与 SOP 复用；Issue Status、父子/阻塞关系、单 Assignee 和 Work Product 不作为 SOP 状态、Stage Graph、Finding/Gate、人员职责或 Artifact 的替代模型 | 已确认 |
| DEC-078 | Project Workspace 是 Project 持久的零到多个工作根、代码库和运行默认基线，不是运行直接写入的共享目录。有 Project 的 Agent Task 与每个 SOP Run 从该基线派生隔离 Execution Workspace；同一 SOP Run 跨 Stage 复用一个主 Workspace。无 Project 的 standalone Task 仅在需要文件操作时按需创建不继承任何 Project 能力的 Temporary Execution Workspace，并使用短 TTL；稳定 Codebase、Project Env、Workspace Runtime Service 或长期成果管理需求必须通过 Project 承载。Workspace Runtime Service 只是与工作目录绑定的开发/测试辅助进程，不是 Project Environment 或执行后端选择。Temporary Execution Workspace 与从主 Workspace 派生的 Scratch Execution Workspace 是不同概念 | 已确认，Environment 术语由 DEC-115 修正 |
| DEC-079 | 部门导航按业务对象组织：Dashboard 只展示 Active Run 摘要与行动入口，顶层 `SOP Runs` 提供跨 Project 完整列表，Project `SOP Runs` 分栏复用同一列表并固定 Project Filter，三者进入同一 Run Cockpit。Stage Detail 属于 SOP Run 且不创建 Task 或隐藏 Issue；其桌面端借鉴 Task Detail 双栏体验，左侧呈现 Agent 对外思考摘要、消息、工具调用、命令、文件变更、执行步骤与人工往来的可审计过程链，右侧呈现 Stage 契约、状态、输入输出、Artifact/Evidence/Finding、Acceptance、Human Gate 和运行属性 | 已确认 |
| DEC-080 | Stage Detail 左侧使用单一连续 Stage Execution Thread，按时间呈现 Agent 对外 Thinking Summary/Plan、消息、Tool Call、Command、Diff、关键执行步骤与人工往来；Iteration、Producer/Verifier Invocation 和 Stage Epoch 以带身份、Agent、模型、状态、时间、成本、Fresh/Resume 与重试摘要的分组呈现，不拆成 Tab 或独立页面。关键内容默认展开，stdout/stderr、系统噪声与 Raw Transcript 默认折叠但可审计；Finding、Evidence、Gate 等完整结构留在右侧看板，左侧只保留轻量事件标记和深链 | 已确认 |
| DEC-081 | SOP Runs、Run Cockpit 与 Stage Detail 使用三轴状态表达：Kernel 持久化的 Control State 是唯一执行控制真相并附结构化等待/暂停/阻塞原因；Health/Attention 从 SLA、风险、异常与当前用户责任派生，只表示关注度；Business Outcome 由 SOP Outcome Contract 表达领域结果，`completed` 不等于业务成功。Stage Map 展示节点状态、Iteration、Acceptance、未解决 Finding 与 Gate/Attention，不用简单完成节点数计算误导性百分比；Invocation 只展示技术执行与 Provider Attempt 状态 | 已确认 |
| DEC-082 | SOP Run 首期不建设自定义成员 ACL，权限由 Project 访问权与固定 Run 角色派生：Project 授权成员获得基础可见与协作权；Run Creator 只记录创建事实，除非同时是 Run Owner 不形成永久控制权；Run Owner 管生命周期运营但不能裁决未分配给自己的 Gate；Human Gate Assignee 只裁决自己的 Gate并获得本 Run Artifact 查看管理权；SOP Owner 与 Department Admin 只处理人员失效、显式改派和应急运行控制，不能绕过职责分离直接代批；Agent 受 Run-scoped Token 限制；Enterprise Admin 保持业务内容盲。Artifact 发布仍独立检查部门资源发布权限 | 已确认 |
| DEC-083 | 首期运行控制动作固定作用域：Pause/Resume/Cancel 只作用于整个 SOP Run；Pause 创建持久 Hold、阻止新派发并请求活跃 Invocation 在安全点停止，Resume 释放 Hold 前完整重校验并复用合法 Continuation Intent，Cancel 进入不可恢复终态且结果未知的外部动作先 Reconcile。Retry 只作用于 Stage，创建新 Stage Epoch/Iteration/Invocation、保留旧事实并检查下游失效、预算与副作用；Recovery Action 只由具体故障生成有限安全选项。首期不提供通用 Stage Pause、Cancel 或 Skip；可跳过路径必须由 SOP Definition 声明 | 已确认 |
| DEC-084 | Stage Detail 采用“双语义输入区 + 右侧结构化动作”：左侧输入区必须明确区分不改变运行上下文的协作消息，以及会成为版本化运行输入的“补充输入/回复 Input Request”，普通聊天不得被 Agent 或 Kernel 隐式解释为契约修改或续跑信号。未决 Input Request 与 Human Gate 在右侧以结构化卡片展示字段、材料、可回复角色或 Gate Assignee、期限及固定快照；提交 Input Response 或 Gate Decision 后，左侧只追加轻量审计标记与深链。主动补充输入提交前必须预告其对当前 Stage Epoch、旧 Output/Evidence/Gate 及下游 Stage 的影响，并由 Kernel 机械决定继续、创建新 Epoch/Retry 或失效下游事实 | 已确认 |
| DEC-085 | Input Request 不建立独立 Assignee/ACL，回复资格继承当前 SOP Run 已有角色权限且严格限制在该 Run 内：某个 Run 的有效 Run Creator 与 Run Owner 可以查看并回复该 Run 下任意 Stage 的 Input Request，不因此获得其他 Run 的任何权限；Human Gate Assignee 只能在同一 Run 中自己被授权的 Stage 查看相应请求并操作或回复。提供 Input Response 只补足运行信息，不等于 Human Gate Decision；Gate Assignee 仍只能对分配给自己的 Gate 通过结构化 Decision Card 作出决定。自动触发使用的服务身份只记录创建来源，不因此获得人工回复能力；所有提交必须同时校验 `request.runId`、Actor 在该 Run 的角色、Stage 授权范围、当前成员资格、Authority Revision 和请求状态 | 已确认 |
| DEC-086 | MVP 不随产品预置任何业务 SOP；部门管理员必须能够从空白 Draft 自主搭建、绑定、模拟试跑、发布并运行本部门 SOP。研发“需求到测试环境验收”只是首期端到端验收样本，用于证明通用 SOP Studio 与 Runtime 能承载真实业务方法，不作为内置模板、硬编码流程或用户必须采用的标准 SOP | 已确认 |
| DEC-087 | MVP 必须提供最小可用 Agent Studio：企业管理员注册和治理模型凭证、MCP、Connector、Adapter 与企业 Skill 仓库等企业基础能力；部门管理员可以创建维护本部门 Agent 与私有 Skill，配置角色说明、Adapter、模型、Skill、Connector/Connection 与 Tool，并在选定 Project 或测试运行上下文中执行可用性测试。选定 Project 时使用其 Project Env，Agent 不绑定执行 Environment。SOP Studio 只把 Stage Role Slot 绑定到已有 Agent，可用 Stage Allowlist 精确收窄但不能创建工具、绑定新 Connection 或提权；Marketplace、跨部门 Agent 共享、复杂升级编排和插件生态运营不进入首期垂直切面 | 已确认，Environment 边界由 DEC-114、DEC-115 修正 |
| DEC-088 | MVP 的 Project 必须提供可运行的最小 Project Workspace，而不是只保存业务元数据：纯业务 Project 可以没有文件 Root；研发 Project 可配置一个或多个 Git Workspace Root，并固定仓库、默认 Ref/Branch 与凭证引用。Project Env 继续承载项目级变量和 Secret Reference。发布 SOP 与启动 Run 前执行 Workspace 与 Project Env Preflight，每个 Run 从该基线派生隔离 Execution Workspace。首期只实现单节点 Docker 下的本地持久 Workspace Provider；远程开发环境、云 IDE、跨 Worker 迁移、共享存储与 Kubernetes 调度延后 | 已确认，Environment 术语由 DEC-115 修正 |
| DEC-089 | MVP 必须交付完整的核心 Run Cockpit 与成果检查闭环：提供部门和 Project SOP Runs 入口、单 Run Header/三轴状态/Attention/Stage Map、双栏 Stage Detail、Run 级 Pause/Resume/Cancel、Stage Retry、故障限定 Recovery Action、Supplemental Input/Input Request/Human Gate，以及 Project `Artifacts` 中按 Run/Stage/来源/类型浏览、预览、下载、溯源和人工发布资源库。Task Work Product 与 SOP Artifact 保持来源隔离；自定义看板、复杂跨 Run 对比、批量操作、高级全文检索、通用报表设计器和部门全局 Artifact 入口延后 | 已确认 |
| DEC-090 | MVP 的跨 Run 持续优化采用“受控自治 Improvement Campaign、人工生产晋升”：一次 Campaign 必须冻结 Base Execution Variant、Evaluation Contract、验证 Case、SOP Resource Snapshot Set、Project Env Resolution Snapshot、权限与允许修改范围，并由 Improvement Kernel 持有预算、调度、暂停、恢复、停止和候选池事实；Researcher Agent 可在边界内连续提出多个隔离且不可变的 Candidate Revision，首期每个 Campaign 原则上只改变一个主要维度，并只开放单个 Stage Instruction 或单个 Department Skill 内容版本等低风险目标。Enterprise Skill 对部门只读，不能被部门 Campaign 原地修改；未来如需派生必须另行设计显式 Fork/发布流程。Candidate 不得修改用于评价自身的 Evaluator，也不得扩大 Base Agent 的有效能力上限；系统通过 Hard Gate、Primary Outcome、Guardrail、样本充分性以及 Replay、Curated/Hidden Validation、Shadow 或 Limited Trial 形成比较结论，并允许 `inconclusive`。部门负责人最终决定接受、拒绝或继续实验；Stage Instruction 候选被接受时从已验证 Digest 创建新的不可变 SOP Release，Department Skill 候选被接受时只创建新的不可变 Department Skill Version，后者仍须经 Agent 测试、Binding 同步、Validation Run 和新 SOP Release 才能被未来 Run 采用。任何接受都不得自动修改既有 Agent/SOP、原地覆盖生产定义、自动演化 SOP 拓扑、建设 Policy Studio 或训练模型权重 | 已确认 |
| DEC-091 | MVP 的企业治理采用“基础设施治理闭环”：Enterprise Console 首期包含企业/部门聚合总览、部门与额度管理、AI 基础设施目录、Worker/运行健康、平台级风险审批和审计。企业管理员可以创建或停用部门、维护组织成员关系、下发或收回成本/存储/并发额度，注册、授权、停用和轮换模型凭证、MCP、Connector、Adapter 与企业 Skill 仓库能力，查看其版本/安装/授权/健康，管理 Worker 的 `enable/drain/disable`，并对具体平台故障执行受限恢复动作；Instance/Worker/Docker 运行参数通过部署配置维护，不建设企业 Environment Catalog。企业管理员不能组装部门业务 Agent、配置或读取部门 Project Env、修改 SOP、裁决业务 Outcome，或读取部门 SOP、Run、Artifact、Prompt、Transcript、资源文件和任何部门私有 Skill列表、元数据或内容。所有页面只能消费独立 Governance DTO 与 Disclosure Manifest；基础设施审批、授权变更、凭证轮换、Worker 操作、外部工具调用和治理动作必须可筛选、导出并审计。已有到期、限范围、全审计的 Break-glass 契约保留但不扩大；自定义合规规则、DLP、SIEM、风险文件识别、复杂告警编排、通用策略引擎和复杂企业 RBAC 不进入首期 | 已确认，Environment 边界由 DEC-114、DEC-115 修正 |
| DEC-092 | 一个 Paperclip Instance 只服务一家企业，并由客户部署在自有服务器或私有云；Instance 本身就是企业级部署、数据和治理边界，不新增 Enterprise/Tenant 业务实体，现有 Company 继续表示该企业内部部门空间。首期交付单节点 Docker 部署，PostgreSQL、文件资源库、Workspace、Worker、凭证和审计数据均属于该实例；开发、测试、预发和生产使用独立 Instance 隔离。SaaS 多企业共享实例、跨企业运营后台、Tenant Billing 和跨企业数据面不进入首期；未来若提供托管服务，默认仍采用每企业独立 Instance，而不是把 Company 重新解释为企业租户 | 已确认 |
| DEC-093 | 首期人类身份采用“本地 Bootstrap Owner + 单一通用 OIDC Provider”：首次部署创建一个本地恢复管理员用于配置 Instance 和 IdP；启用 SSO 后，普通成员默认通过 OIDC 登录，本地密码登录只保留给显式恢复管理员并完整审计。外部身份必须以 `issuer + subject` 稳定绑定，不能仅用可变化或可复用的 Email 作为身份键；首次 OIDC 登录可以 JIT 创建平台 User，但默认不获得 Instance Role、Company Membership 或任何业务访问，所有企业和部门授权仍由管理员显式授予。企业管理员可以停用平台 User 并撤销其全部 Session；Membership 或 Instance Role 失效必须立即使相关 Scope 重新鉴权。首期只支持一个 OIDC Provider，不建设 SAML、LDAP、SCIM、多 IdP、IdP Group 到部门/角色的自动映射或完整目录同步 | 已确认 |
| DEC-094 | Agent/能力供给采用“企业供给基础能力、部门配置业务能力、Agent 绑定、Stage 只收窄”的责任链：企业管理员注册和治理 Model、MCP、Connector、Adapter 及企业 Skill 仓库，决定企业基础能力的可用版本、允许部门和停用状态；部门管理员从企业已开放能力中按需创建 Connection/Credential Reference并完成健康测试，同时可以创建和维护本部门私有 Skill，再在 Agent Studio 中把具体能力绑定到 Agent。Project Env 由部门在 Project 中维护变量和 Secret Reference，不属于 Agent 能力供给或执行后端选择。SOP Studio 仅绑定已有 Agent，Stage 默认继承其能力并可用稳定 ID Allowlist 收窄，SOP Run 不选择 Connector、安装能力或提权。底层可以保留 `Definition → Company-scoped Installation → Connection → Agent Binding` 等稳定引用关系，但产品界面只呈现“企业可用、部门已配置、Agent 已绑定”，不新增独立 Grant/Entitlement 配置中心；Skill 无需 Connection，Connector/MCP 按定义需要，Model 使用企业 Model Deployment | 已确认，Environment 边界由 DEC-114、DEC-115 修正 |
| DEC-095 | Agent 是由部门管理员持续创建、编辑、测试、启用和停用的稳定业务角色，不是可安装或可升级的软件包，产品中不出现“Agent 升级/回滚版本”。Agent Adapter、Connector Definition、企业或部门各自拥有的 Skill、平台托管的 MCP Runtime、Platform Extension 等可分发能力可以发布新版本；Project Env 随 Project 维护并在 Run 中记录实际解析快照，不作为 Agent 可升级能力。远程 MCP Endpoint、Connection、Credential、Model Deployment 和 Agent 本身分别使用配置/重连、重新授权、轮换/撤销、选择/更换和维护/测试语义。为保证已发布 SOP 不漂移，系统自动保存不可变 Agent Configuration Snapshot：SOP 发布时的 Binding 固定已验证快照，部门管理员后续维护同一 Agent 或创建新的 Department Skill Version 都不改变现有 SOP Release；SOP Studio 只提示“绑定 Agent 配置已有变化”，由 SOP 负责人显式同步当前配置并完成 Validation Run 后创建新 Binding Revision 与 SOP Release，只影响未来 Run。Snapshot 是审计和运行固定事实，不是用户管理的 Agent 版本 | 已确认，Environment 边界由 DEC-114、DEC-115 修正 |
| DEC-096 | Skill 使用企业仓库与部门私有空间严格分层：企业管理员只能管理 Enterprise Skill Repository，登记允许引入的 External Skill Repository，把外部 Skill 的特定版本安装或更新为企业仓库中的不可变版本，并决定哪些企业 Skill 暴露给哪些部门；企业管理员不能列出、搜索、查看元数据或读取任何 Department Skill，也不负责部门 Skill 的维护、版本、健康或影响分析。部门管理员可以创建、维护、测试和绑定本部门 Skill。部门 Skill 向企业仓库发布的 Submission/Approval 能力延后：未来只能由部门主动提交一个不可变快照，企业管理员仅查看该提交，批准后在企业仓库创建新的独立 Skill 身份与版本；原部门 Skill 不改归属，双方后续不自动同步 | 已确认 |
| DEC-097 | 现有通用 Plugin 在产品上定义为 `Platform Extension（平台扩展）`：企业管理员把可信 Extension Package 安装为 Instance-scoped Platform Extension，并治理安装、版本、Capability 审查、启停、健康和卸载；部门和 Agent 不直接安装、启用或绑定 Platform Extension，而只消费其 Contribution，例如 Connector Definition、Agent Tool、Sandbox Provider Driver、External Object Provider、Job、Webhook 或 UI。需要外部业务系统身份的 Tool 必须归入 Connector/Connection 链路；只有不需要 Connection 身份的独立 Agent Tool Contribution 才能在企业向部门开放后，以来源限定 Namespaced Tool ID 进入 Agent Studio。它与 Connection-backed Tool 复用同一 Agent Tool Binding、Stage Allowlist、短期能力凭证、Tool Gateway 和审计链，不新增 Plugin Grant/Entitlement 配置中心；Agent Configuration Snapshot 还必须固定贡献来源版本与 Tool Contract Digest，Extension 更新不得静默改变既有 SOP Release。Agent 与 SOP Stage 只绑定具体 Tool、Connection 或 Skill，永不绑定 Platform Extension 或 Environment。Sandbox Provider Driver 只供 Worker 物化运行现场，不形成业务 Environment。停用 Extension 会影响其全部 Contribution，执行前必须展示影响分析。首期不创建通用 Capability 父实体，不强迫 Adapter、Connector、MCP 或 Skill 继承自 Plugin，也不把 Platform Extension 做成统一能力市场 | 已确认，Environment 边界由 DEC-114 修正 |
| DEC-098 | Connector 是面向一个外部业务系统的双面集成契约，而 MCP 是 Agent 工具面的技术协议：同一 Connector 被 Agent 使用时只通过 MCP 暴露 Tool，被 Platform 使用时暴露 Event、Webhook、Sync 与 External Object；两面必须共享稳定的 Connector Definition/Version、部门 Connection、Provider Tenant、External Identity 和 Correlation 语义，不另建 `Connector Installation` 产品实体。独立 MCP Server 仍可作为不对应特定业务系统的通用工具能力存在，但不因此获得 Connector 的平台同步语义。企业治理 Connector Definition 与 MCP Runtime/Endpoint，部门按需创建 Company-scoped Connection 并绑定到 Agent；Agent/SOP Stage 绑定具体 Connection/Tool 能力，SOP Run 不选择 Connector、MCP 或 Connection。Enterprise Console 必须保留 Connectors 与 MCP Servers 两个独立维护入口；部门 `Connections / Apps` 可以在同一外部连接列表展示两者，但必须把独立 MCP 标识为“仅工具”，且不得让用户为同一个 Connector 重复安装、重复授权或创建两套 Connection | 已确认 |
| DEC-099 | 双面 Connector 以 `Connector Definition` 作为企业管理员唯一安装和维护的产品对象：Definition 统一声明基本信息、配置 Schema、版本、Agent-facing MCP Implementation、Platform-facing Extension Contributions，以及实际支持的 Tool、Event、Webhook、Sync 和 External Object 能力；各项能力可以按 Connector 需要缺省，不要求凑齐。Connector 可以由平台内置或由 Platform Extension 提供，但 MCP Runtime、Extension Worker 和 Contribution 只作为内部实现引用，不形成第二个 Connector，也不能要求管理员分别安装、授权或手工关联两面。企业批准并向部门开放 Definition，部门只创建一次 Connection，统一承载 Endpoint、Credential Reference 和 Provider Tenant。Connector 更新必须统一展示两面 Capability Diff 及受影响的部门、Connection、Agent 和 SOP Release；独立通用 MCP Server 继续走“仅工具”登记路径 | 已确认 |
| DEC-100 | Enterprise Console 采用“统一 AI Infrastructure Catalog 总览 + 分类型专属管理页”的联邦式治理模型。Catalog 只聚合 Type、Source、Current Version/Configuration、Enterprise Status、Department Availability、Health 和 Impact 等公共治理字段，提供跨类型搜索、筛选、异常发现和深链；它是可重建的 Governance Read Model，不创建通用 Capability 父实体，不拥有安装、授权、版本或运行状态。Model、Connector、MCP、Adapter、Enterprise Skill 与 Platform Extension 仍由各自领域模块维护专属写模型、详情、动作和健康语义；Project Env 不进入企业 Catalog。统一总览不得演变为 Marketplace，也不得把企业可用、部门已配置和 Agent 已绑定压缩成一个状态 | 已确认，Environment 边界由 DEC-114、DEC-115 修正 |
| DEC-101 | 首期 AI 基础能力供给以功能闭环优先，不建设通用信任等级、软件供应链安全中心、签名/证明体系、复杂 Capability 审批或按风险重新认证流程。MVP 只保留不妨碍使用的基本治理：仅企业管理员可以登记、安装、更新或停用企业能力；记录来源、当前版本或配置和操作审计；安装与向部门开放保持分离。更完整的包签名、不可变 Digest 强制、Publisher Trust、漏洞扫描、数据外发评估和复杂准入策略，待核心能力供给、部门配置、Agent 绑定与运行链路稳定后再设计 | 已确认，延后安全增强 |
| DEC-102 | Model & Credentials、Connectors、MCP Servers、Adapters、Enterprise Skills 和 Platform Extensions 在 Enterprise Console 中各自拥有独立导航入口、列表、详情以及新增/安装、配置、测试、更新、部门开放、停用等类型专属动作，不提供统一“添加能力”入口或通用创建向导。Project Env 只在部门 Project 中维护；Worker/Sandbox Runtime 只在平台运行健康中观察。AI Infrastructure Catalog 若保留，只是跨类型治理总览和深链入口，不能成为这些页面的上级业务容器，也不承载写操作 | 已确认，Environment 边界由 DEC-114、DEC-115 修正 |
| DEC-103 | Connector 采用 Connector-first 管理体验：企业管理员始终从 Connectors 页面新增、配置、测试、启停、更新和开放 Connector；内置 Connector 直接启用，需要代码实现的 Connector 由系统在同一流程中安装或复用提供该 Contribution 的 Extension Package，并解析其明确声明的 Agent-facing MCP 与 Platform-facing Extension 一层依赖。Platform Extensions 页面只负责底层扩展、Contribution 和运行健康治理，不要求管理员先跳转安装再返回 Connector。停用 Connector 只影响该 Connector；停用 Extension 影响其全部 Contributions 并必须展示清单；删除 Connector 不自动卸载仍被引用的 Extension。首期不新增 Connector Package 实体，也不建设通用递归依赖解析器 | 已确认 |
| DEC-104 | Connection 是 Company-scoped 的命名外部身份，同一部门可以为同一 Connector Definition 或独立 MCP Server 创建多个 Connection，以覆盖多个 Provider Tenant、Organization、Site、账套或 Endpoint。每个 Connection 独立保存 Name/Alias、Endpoint、Credential Reference、Provider Tenant、可用范围以及工具与同步健康；Agent 必须绑定具体 Connection ID，不能只绑定抽象 Connector。一个 Agent 绑定多个同类 Connection 时必须使用稳定且唯一的 Connection Alias 区分 Tool 与 External Object，不通过自然语言猜测目标；首期不设置隐式“部门默认 Connection”。Connection 由部门集中创建维护，不在每个 Agent 下复制，SOP Stage 继承 Agent Binding，SOP Run 不选择 Connection | 已确认 |
| DEC-105 | Agent 对 Connection 的运行授权采用显式 Tool Selection：部门管理员在 Agent Configuration 中先选择具体 Connection ID，再从其 MCP Tool Catalog 明确勾选允许该 Agent 调用的稳定 Tool ID；绑定 Connection 本身不自动授予全部工具。“全选”可以作为显式批量操作，但新版本 Connector 新增 Tool 时不得自动加入既有 Agent Binding。Credential Scope 是能力上限，Agent Tool Binding 是实际授权集合，Stage Allowlist 只能与该快照取交集，SOP Run 不得增加或切换 Tool。Tool 被删除、停用或不再满足 Credential Scope 时，Binding 标记失效并提示处理。Tool Profile 只作为可选复用模板，不成为必经配置层。Event、Webhook、Sync 与 External Object 属于 Connection 的 Platform-facing 能力，不受 Agent Tool Selection 控制 | 已确认 |
| DEC-106 | Connection Detail 将 Agent-facing 与 Platform-facing 配置分区：基础连接保存 Endpoint、Credential Reference 和 Provider Tenant；Agent Tools 展示 MCP Tool Catalog 与 Agent Bindings；Platform Integration 对 Connector Definition 已声明支持的 Event、Webhook、Sync 和 External Object 能力分别配置并显式启用。创建 Connection 不自动启动全部平台能力，每项只要求自身必要参数，例如同步对象范围、Webhook 状态和同步频率。Agent Tool Selection 与 Platform Integration 完全正交，任何一侧配置都不改变另一侧权限或启用状态。多个 Connection 的入站事件和外部对象必须通过 Connection ID、Provider Tenant 与 External Identity 精确归属；Tool Health 与 Platform Sync Health 分开展示 | 已确认 |
| DEC-107 | Connection 生命周期采用“稳定身份、可恢复停用、受引用保护删除”。Display Name 可修改；同一 Provider Tenant 下的 Credential 轮换和 Endpoint 修复可原地更新并重测，保持 Connection ID 与 Binding；Provider Tenant、Organization、Site 或账套等外部身份变化必须新建 Connection，稳定 Alias 被引用后不得无影响提示修改。停用 Connection 会阻止新 Tool 调用、Platform Sync 和外部动作，但保留配置、Agent Binding、SOP Release 引用和审计；依赖它的活跃 Stage 进入结构化 Blocked/Attention，修复并通过健康测试后可恢复。当前 Agent 或已发布 SOP Release 引用时禁止删除；历史 Run 不永久阻止删除，但保留不可变 Connection Identity Snapshot 与调用审计。删除不级联删除 Connector、Extension 或共享 Credential，首期不提供强制级联删除 | 已确认 |
| DEC-108 | Connector 更新采用“版本并存、Connection 显式迁移、运行契约固定”。企业安装新 Connector Version 后不替换既有 Connection，新建 Connection 默认选择最新可用版本；部门管理员从 Connection Detail 发起升级，先同时验证 Agent-facing Tools 与 Platform Integration，再确认迁移。新增 Tool 不进入既有 Agent Binding；删除 Tool、Schema 或 Platform Capability 变化必须展示 Diff，存在失效 Binding 时禁止完成迁移。每次迁移由系统自动创建不可变 `Connection Configuration Revision`，固定 Connector Version、结构化 Connection 配置与 Platform Integration 配置；Agent Configuration Snapshot、SOP Binding、活跃 Run 与 External Action Intent 精确引用该内部修订，不能只读取 Connection 当前值。Credential Secret 原地轮换不重写历史修订，Invocation 另行记录实际解析到的 Credential Version。该修订不作为用户维护的第二个 Connection 或“连接版本”暴露；同步最新 Agent Configuration 并完成 Validation Run 后创建的新 SOP Release 才使用新修订。仍被已发布 SOP Release 或活跃 Run 引用的旧 Connector Version 不能卸载。首期不做自动更新、灰度比例或复杂发布渠道，只做安装、测试、显式迁移与受引用保护卸载 | 已确认 |
| DEC-109 | 独立 MCP Servers 只提供 `Remote MCP` 与 `Managed MCP` 两种产品模式。Remote MCP 连接企业登记的 HTTP MCP Endpoint；企业维护名称、Endpoint/Credential Schema、部门开放范围、Tool Catalog 与健康，部门创建具体 Connection。Managed MCP 依据企业维护的 Runtime Template 运行，Template 声明版本、启动参数 Schema、环境变量和 Secret Slot，部门只填写允许的参数与 Credential Reference，不直接编辑任意 Command/Args。Managed MCP 最终由 Agent Execution Worker 运行，Paperclip Server 不执行本地 stdio Runtime。`mcp.json` 导入保留：Remote 条目生成 Draft，stdio 条目必须映射已有 Managed Runtime Template。Connector 内部 Agent-facing MCP 不进入独立 MCP Servers 列表；Connection、Agent Tool Selection、停用和引用保护复用 DEC-104 至 DEC-107，不增加第三种 MCP 产品模式 | 已确认 |
| DEC-110 | Remote MCP 与 Managed MCP 使用不同更新语义。Remote MCP 由外部系统运行，Paperclip 只定期发现并保存 Tool Catalog Revision、展示 Tool ID/Schema Diff 和远端自报版本，不把它伪装成可安装或可回滚的本地版本；新增 Tool 不自动授权，Tool 删除或 Schema 变化使相关 Binding 失效，SOP 发布与 Run 启动 Preflight 必须验证固定 Tool Contract 仍可用。Managed MCP 由平台运行，Runtime Template Version 不可变且允许并存；新版本不替换现有 Connection，部门显式迁移并测试，系统生成新的 Connection Configuration Revision，Agent Configuration Snapshot、SOP Release 和 Run 通过该修订固定精确 Runtime Version，旧版本按有效修订引用保护卸载。首期不承诺 Paperclip 能回滚外部 Remote MCP 的行为 | 已确认 |
| DEC-111 | Agent Adapter 是企业级、可版本化的独立 Agent Runtime Driver，不是 Agent、Connection、Connector 或 Platform Extension Contribution。企业管理员在 Adapters 页面管理 Built-in 与 External Adapter 的 Definition/Version、基础加载测试、启停、部门开放和影响；部门不能安装 Adapter，只能在 Agent Studio 中选择企业开放的精确 Adapter Version，并结合 Model Deployment、Adapter-specific Config 与选定 Project/Test Runtime Context 完成真实调用测试。Adapter-specific Config 由版本化 Schema 驱动。Agent Configuration Snapshot、SOP Release 与 Run 固定 Adapter Version；新版本不自动更新 Agent，旧版本有 Agent、已发布 SOP Release 或活跃 Run 引用时禁止卸载。目标架构由 Agent Execution Worker 加载执行 Adapter，Paperclip Server 只维护定义、版本、开放范围和运行事实；现有把 External Adapter 动态加载到 Server 主进程且用文件保存安装元数据的机制只能作为迁移起点 | 已确认，Environment 边界由 DEC-114 修正 |
| DEC-112 | Models & Credentials 采用 `Model Credential + Model Deployment` 两层模型。企业管理员维护 Model Credential 的 Provider、Endpoint 和 Secret Reference，并在其下登记具体 Model Deployment，固定 Credential Reference、Provider Model ID/Deployment Name、支持参数、成本元数据、健康和部门开放范围；一个 Credential 可被多个 Deployment 复用。部门 Agent Studio 只能选择企业开放且与 Adapter 兼容的 Model Deployment ID，不能读取 Secret、填写 API Key 或自由组合 Endpoint/Credential/Model ID。Credential 轮换保持 Deployment ID；Provider、Endpoint 身份或实际 Model ID 变化时创建新 Deployment，不能静默替换。Agent Configuration Snapshot 固定 Deployment ID 与当时 Provider Model ID。远端 Model 不伪装成平台可安装回滚版本，企业页做基础连通测试，真实调用仍由 Agent Studio 组合 Adapter 与选定 Project/Test Runtime Context 后验证 | 已确认，Environment 边界由 DEC-114 修正 |
| DEC-113 | Skills Registry 分为 `Enterprise Skills` 与 `External Repositories`。企业管理员可以直接创建 Enterprise Skill，或从已登记 External Skill Repository 发现并安装指定版本；外部仓库只作为来源，安装后生成企业仓库内独立、不可变的 Enterprise Skill Version，运行时不直接读取上游，也不自动跟随 latest。企业按具体 Skill Version 设置部门开放范围，并做结构、入口、依赖与运行材料校验；真实效果由部门在 Agent Studio 结合具体 Agent/Adapter/Model/Tools 测试。部门 Skills 页面明确分隔企业可用与部门私有，企业 Skill 只可采用不可修改；Agent Configuration 固定精确 Skill Version，新版本不自动更新 Agent，已发布 SOP Release 继续使用 Snapshot 版本，新 Release 经 Agent 测试与 Validation Run 后采用。企业管理员仍不能查看任何 Department Skill；Department Skill Publication Submission 继续延后 | 已确认 |
| DEC-114 | 首期不建设企业级 Environment Catalog，也不让 Agent 拥有业务执行 Environment。Instance、Server、Worker、Docker Provider、默认 Temporary Sandbox Image、数据库、存储和网络等运行参数属于 Instance Runtime Configuration，通过 `.env`、Docker Compose 或系统配置维护；Enterprise Console 只在 Runtime Health 中观察 Worker/Sandbox 健康与容量，不提供 Environment 新增、版本、部门开放或 Agent Binding 页面。现有全局 `environments`、`agents.default_environment_id`、`instance_settings.default_environment_id` 和 Company Environments 页面不能继续作为目标产品语义；实现迁移方案后续设计。Standalone Task 使用部署配置中的默认临时 Sandbox 运行上下文 | 已确认，原 Project Environment 扩展提议由 DEC-115 否决 |
| DEC-115 | 维持 Paperclip 原有 Project Env 与 Workspace Runtime Service 能力，不新增 `Project Environment` 或 `Project Runtime Profile` 产品实体。Project Env 仅保存项目级环境变量与 Secret Reference；属于该 Project 的 Task 或 SOP Run 在派发前解析绑定并注入 Agent Adapter 和 Workspace Runtime Service 运行配置，Run 记录所用变量键、Secret Binding/Version 与实际执行后端事实，但不持久化明文 Secret。Workspace Runtime Service 只是在 Project/Execution Workspace 中启动的开发、测试或健康检查辅助进程。Project、Agent、Stage 与 Workspace Runtime Service 均不通过 Project Env 选择镜像、Dockerfile、Worker、Sandbox Provider 或执行后端；首期执行基础设施统一服从 Instance 部署配置。只有未来出现不同 Project 必须使用不同镜像或执行集群的真实需求时，才另行设计 Project Runtime Profile | 已确认，纠正 DEC-114 的 Project Environment 扩展提议 |
| DEC-116 | 研发灯塔采用一个真实、低风险、可独立验收的功能需求作为唯一首轮样本，使用真实代码仓库、自动测试、代码评审和测试环境完成端到端交付；不得用合成需求或示例仓库替代真实业务样本，也不在首轮同时运行多个需求来混淆平台稳定性与任务差异。该需求不得包含生产发布或不可接受的生产副作用，失败、返工和人工等待必须真实经过 SOP Kernel 并保留运行事实，不能由人员在平台外补齐流程 | 已确认 |
| DEC-117 | 研发灯塔采用“Paperclip 原生 Run Request + 真实 Git/代码评审、CI/CD 与测试环境”的接入边界。真实需求正文及其动态参数可以由用户直接输入 Run Request，并允许附带外部需求链接；Jira、禅道等外部需求系统只作为可选来源或未来触发器，不是首轮硬依赖。代码分支、提交、代码评审请求、评审、合并、流水线、部署和测试环境状态必须来自真实外部系统事实，不能使用模拟接口、脚本假成功或人工回填替代。该取舍用于优先验证 SOP 交付闭环，不否定后续通过 Connector 接入需求系统 | 已确认 |
| DEC-118 | 研发灯塔首轮选择 GitHub + GitHub Actions 作为真实代码与 CI/CD Provider，验证仓库、Branch、Commit、Pull Request、Review、Merge、Workflow/Job 和部署状态的双面 Connector 链路。该选择只是灯塔 Provider，不进入 SOP、Stage Kernel 或通用 Connector 的领域枚举；SOP 契约只引用“创建代码评审、查询流水线、合并变更、部署测试环境、查询外部状态”等稳定业务能力，GitHub 专有字段由 Connector Contract 与 External Fact 适配。首轮不同时兼容 GitLab/JiHuLab，避免过早扩大 Provider 抽象和验证矩阵 | 已确认 |
| DEC-119 | 测试环境交付采用两个递进里程碑。L0（CI Artifact）先由 GitHub Actions 完成真实构建、自动测试和可部署镜像/制品发布，并把 Workflow、Job、Commit SHA、Artifact Digest 与失败事实回传 Paperclip；L0 只证明 CI 与制品链路，不得标记研发灯塔端到端通过。L1（Test Deployment）再由 GitHub Actions 把同一不可变 Digest 部署到固定单节点 Docker 测试服务器，执行健康检查并回传 Environment URL、Deployment Status 和 Health Evidence；只有 L1 与 Run Owner 测试环境验收完成后，灯塔才可判定端到端成功。Agent 不直接 SSH 操作服务器；每 PR 临时 Preview Environment 延后 | 已确认 |
| DEC-120 | 研发灯塔采用“交付结果 + 控制正确性 + 产品可用性”三层成功判据，三层均通过才算成功。交付层必须完成代码、自动测试、Pull Request、Review、Merge、不可变制品、L1 测试环境部署和 Run Owner 验收；控制层必须在同一真实样本的验证过程中覆盖至少一次验证失败后的有界返工、一次持久人工等待与恢复、一次外部状态查询或超时后的 Reconcile，并证明不会重复创建 Pull Request、重复合并或重复部署；产品层必须由部门管理员从空白 Draft 搭建、试跑、发布并运行 SOP，Run Owner 无需阅读原始 Provider Transcript 即可判断进度、停止原因、责任、证据和结果。首轮记录周期、成本、返工和人工介入作为基线，但不在缺少历史基线时设置效率提升百分比 | 已确认 |
| DEC-121 | 首个研发灯塔不直接使用 Paperclip 自身仓库，也不新建示例仓库；应从企业已有且真实使用的 GitHub 业务服务中选择一个目标仓库。候选仓库必须已有自动测试、Docker 构建和可部署测试环境，需求边界明确、低风险、失败可回滚，并允许创建 Branch、Pull Request、运行 GitHub Actions 和部署测试环境。具体仓库与需求可以在灯塔启动前再确定，作为子需求 10 的启动检查项登记，不写入通用 SOP 契约，也不新增 Lighthouse Project 等产品实体。Paperclip 自身 Dogfooding 留作后续验证 | 已确认 |
| DEC-122 | 同一研发灯塔计划拆为相互独立的 L0/L1/L2。L0 验证 CI、自动测试和不可变制品；L1 验证真实需求从 Run Request 到固定测试环境及 Run Owner 验收，只有 L1 交付、三层成功判据和同期受控故障 Validation Run 全部通过，才可判定“研发交付灯塔成功”；L2 在 L1 历史事实保持不可变的前提下，使用其返工轨迹、Stage Finding 和补充的固定验证 Case 发起独立 Improvement Campaign，只优化一个 Stage Instruction 或一个 Department Skill 内容版本，经独立评价后由人决定是否晋升。L2 不属于原 SOP Run，也不反向修改 L1，但仍是首期完整产品垂直切面的必过项；不得要求连续执行多个真实业务需求来证明 L1，也不得把持续优化无限延期 | 已确认 |
| DEC-123 | 控制正确性采用“正式 L1 Run + 固定同一已验证基线的受控 Validation Run”验证。正式 L1 Run 负责交付真实需求，不强制承担全部故障注入；Validation Run 固定后来被 L1 SOP Release 采用的同一份 Validation Snapshot，并复用相同 Project、Connector、Connection 与权限边界，但不直接执行或冒充生产 Release。复用真实能力契约、仓库和 Connection 不表示复用 L1 的外部业务对象。Validation Run 必须使用由 Validation Run ID 派生的独立动作键、专用 Branch/PR/Workflow 输入与非生产目标，禁止写入受保护默认 Branch、复用 L1 Pull Request/Artifact/Deployment 身份或触碰生产环境；允许副作用、清理方式和负责人必须在启动前固定并继续经过正常 Intent/Attempt、Human Gate 与审计。演练通过可重复故障开关覆盖自动测试失败后的局部返工、GitHub 外部动作已成功但响应超时后的 Reconcile、Human Gate 延迟处理与进程退出后恢复，以及部署 Workflow 失败后禁止误报交付成功。演练必须经过真实 Stage Kernel、Connector、GitHub/GitHub Actions 和持久状态，保留外部事实与审计，但不得破坏最终业务交付；历史回放绝对禁止 dispatch 外部 Effect，单元测试、Mock 接口或人工叙述不能替代端到端演练证据 | 已确认 |
| DEC-124 | 研发灯塔明确排除：生产环境、生产数据和生产流量；外部需求系统 Connector；GitLab/JiHuLab 兼容；单需求跨多个代码仓库协同修改；破坏性数据库迁移或不可逆外部副作用；每 PR Preview Environment；Kubernetes、多 Worker 与跨节点 Workspace；Agent 自主批准 Review、合并或发布；企业 SOP 仓库、打包与跨部门复用；L2 自动晋升、自动修改 SOP 拓扑或训练模型；多部门并发压力和完整企业安全合规验收；以及没有真实基线的效率提升商业结论。这些是首个灯塔的验收非目标，不代表产品永久不做，也不得阻止 L0/L1/L2 按已确认边界完成 | 已确认 |
| DEC-125 | 全站静态 UI 采用既有 i18next 单一 `translation` namespace，支持 `zh-CN` 与 `en`，默认 `zh-CN`；语言作为仅浏览器本地保存的个人偏好，入口为「账户菜单 → 个人设置 → 显示与语言」。所有既有及后续页面的静态文案、无障碍标签、前端错误和格式化必须双语覆盖并通过 Key 对等与硬编码门禁；用户、Agent、外部系统、文件、代码与原始日志内容保持原样 | 已确认 |
| DEC-126 | 部门工作空间按「工作台、交付、构建、触达、部门设置」组织一级导航。该分区只是 Company Scope 内的导航与读模型投影，不新增 Department Scope、权限层或第二套业务事实源 | 已确认 |
| DEC-127 | 知识处理采用 `Resource Revision → Knowledge Processing Job → Derived Index Revision → Citation`。Resource Revision 始终是权威来源，索引是可重建派生物；首期只支持 Markdown、PDF、docx，以及词法检索加可选 LLM 路由，不预先引入向量数据库或知识图谱编辑器 | 已确认 |
| DEC-128 | 知识能力发现只能生成带固定 Citation Set 的 `SOP Draft Candidate`、`Skill Draft Candidate` 或 `Connection / HTTP Tool Draft Candidate`。Candidate 必须记录来源、摘要、模型、Schema 版本、风险与验证状态；不得直接创建 Release、安装 Skill、写入 Secret、启用 Tool 或改变运行中的 Run。首期不声称能从知识自动生成通用 `SKILL.md` | 已确认 |
| DEC-129 | SOP Studio 增加带引用的 Generate Draft、限定 `target_paths` 的 Copilot Patch、Diff、Warning 和未解析能力面板。LLM Reflection 只产生 lint 建议；发布仍由 Schema、图可达性、能力权限、Resource/Secret/Workspace Preflight、Validation Run、Evidence 和人工发布机械门禁控制。首期不新增通用分支模型 | 已确认 |
| DEC-130 | Connections / Apps 使用「选择应用 → 填写连接 → 测试连接 → 自动发现 Tool/Event/Webhook → 选择能力」的默认向导；Profile、Gateway、Policy、Grant、Runtime Slot 进入高级页面。所有 Probe 必须在 Worker 临时 Sandbox 中使用 scoped Secret，并受网络、超时、响应大小、副作用、审计和 Human Gate 约束 | 已确认 |
| DEC-131 | IM 接入新增独立 Channel Gateway，权威事实至少包括 Channel Connection Revision、External Identity Binding、Inbound Event、Conversation Route 和 Delivery Outbox。Gateway 只做验证、归一化、去重与投递，Intake Router 只映射到既有 Run Request、Input Response 或 Discussion Message；不得复用 `BoardChat` 或创建平行 Chat Work Model | 已确认 |
| DEC-132 | 首期渠道范围固定为已绑定的企业内部成员、单一企业 IM 渠道和私聊创建 Run Request。IM 自由文本不能批准 Human Gate、读取或提交 Secret、修改预算或执行高风险控制动作；相关操作只返回已认证 Web 深链。群聊、LLM 自动选 SOP、多渠道和渠道内审批延后 | 已确认 |

## 3. 产品讨论项

以下问题已经逐项讨论并形成 DEC。它们与第 5、6 节的技术验证项分开管理：讨论项记录产品取舍，验证项记录仍需代码、原型或运行证据证明的结论。

| 编号 | 问题 | 需要明确的边界 | 主要影响对象 | 状态 |
| --- | --- | --- | --- | --- |
| DISC-001 | 文件资源库的产品模型 | 已确认资源库与 Workspace 分离、部门级唯一归属、企业内容盲治理、基础 Folder/File 管理、同目录重名交互、产品文件与存储对象分层、Copy-on-Write、SOP ID Binding/引用保护、首期部门权限、回收站，以及 Artifact 经人工检查后显式发布为 Resource File | 子需求 02、03、04、07、09 | 已收口 |
| DISC-002 | 首期产品垂直切面 | 已确认首期形成一条完整而非演示性的产品切面：不预置业务 SOP，部门管理员可从空白 Draft 搭建、试跑、发布和运行；企业供给、部门组装和测试 Agent；Project Workspace 提供真实基线与隔离派生；Run Cockpit、Stage Detail、人工操作与 Project Artifact 检查发布形成交付闭环；受控自治 Improvement Campaign 与人工晋升形成改进闭环；Enterprise Console 形成内容盲的基础设施治理闭环。高级分析、复杂企业治理、生态与横向扩展能力延后 | 总纲、子需求 06–10 | 已收口 |
| DISC-003 | 首期部署与企业身份假设 | 已确认单企业单 Instance、客户自有服务器或私有云部署、不新增 Enterprise/Tenant 实体，首期使用单节点 Docker，不同环境使用独立 Instance；身份采用本地 Bootstrap Owner 与单一通用 OIDC Provider，`issuer + subject` 稳定绑定，JIT User 默认零权限，企业/部门授权仍显式授予，平台用户停用可撤销全部 Session。多企业共享 SaaS、SAML、LDAP、SCIM、多 IdP、Group 自动映射和完整目录同步延后 | 子需求 02、09、10 | 已收口 |
| DISC-004 | Agent Studio 与双面连接器的产品操作模型 | 已确认企业供给、部门配置、Agent 绑定、Stage 只收窄的责任链，Agent 维护与能力升级分离，Platform Extension、Connector、Connection、Tool Selection、Platform Integration、独立 MCP、Agent Adapter、Model Credential/Deployment、Enterprise Skill Registry，以及 Environment 边界：不建企业 Environment Catalog，不由 Agent、Stage 或 Project 绑定执行 Environment；维持原有 Project Env 变量与 Secret 引用能力，Instance/Worker/Docker 参数留在部署配置，企业只看 Runtime Health。首期明确功能优先，复杂来源信任、安全准入和供应链治理延后 | 子需求 06 | 已收口 |
| DISC-005 | Run Cockpit、Artifact、Human Role 与 Attention 的操作模型 | 已确认 standalone Task 与 SOP Run 并列、Stage/Invocation 不暴露为 Task、SOP Definition 部门级复用、SOP Run 必须归属 Project、Project 统一成果清单、文件 Artifact 不可变固化、Project 隔离、同 Run Slot Binding/跨 Run 资源库复用、SOP 独立状态模型复用共享能力、Workspace 边界、Run/Stage 控制动作、协作消息/运行输入/Human Gate 的交互分层，以及严格按 Run 隔离的 Input Request 回复权限；产品模型已收口，生产事务与 UI 可用性仍按 VAL-004、VAL-005、VAL-010、VAL-016 至 VAL-018 验证 | 子需求 07 | 已收口 |
| DISC-006 | 持续优化闭环的首期自动化程度 | 已确认候选空间内受控自治、生产空间人工晋升：Campaign 冻结 Base Execution Variant、Evaluator、Cases、资源/Project Env 快照、权限和变更边界，Kernel 控制有界实验，Agent 可连续生成多个隔离 Candidate Revision；首期一次只优化单个 Stage Instruction 或单个 Department Skill 内容版本，Enterprise Skill 不可由部门 Campaign 修改；支持多目标比较与 `inconclusive`，经 Replay/Validation/Shadow 或 Limited Trial 后由部门负责人决定是否接受。Stage Instruction 接受后创建新 SOP Release；Department Skill 接受后只创建新 Skill Version，仍需 Agent 测试、Binding 同步、Validation Run 和新 SOP Release 才能采用；自动发布、Skill Fork/企业发布、拓扑演化、Policy Studio 和模型训练延后 | 子需求 08 | 已收口 |
| DISC-007 | 企业治理首期最小产品面 | 已确认 Enterprise Console 提供聚合总览、部门/额度、AI 基础设施目录、Worker/运行健康、平台审批与审计五类闭环；允许组织与额度、能力供给/授权/停用/轮换、Worker `enable/drain/disable`、受限故障恢复、筛选与导出，全部基于内容盲 Governance DTO。保留既有最小 Break-glass；自定义合规、DLP、SIEM、风险文件识别、复杂告警、策略引擎和复杂 RBAC 延后 | 子需求 09 | 已收口 |
| DISC-008 | 研发灯塔原型的验收边界 | 已确认使用企业已有的真实 GitHub 业务服务，具体仓库与需求启动前登记；采用原生 Run Request、GitHub + GitHub Actions、L0/L1 研发交付、受控故障 Validation Run 与独立 L2 Improvement Campaign，并使用三层成功判据；生产发布、多 Provider、多仓库、Preview/Kubernetes、自动晋升和无基线效率结论等明确延后 | 子需求 10 | 已收口 |

DISC-001 至 DISC-008 已全部收口。首期垂直切面已经覆盖单企业自托管部署、企业身份、基础能力供给、部门自主搭建、Project 执行上下文、运行驾驶与成果检查、受控故障恢复、持续改进和企业内容盲治理。当前没有待确认的产品阻塞项；具体灯塔仓库和真实需求属于启动准备，剩余 VAL 项属于实现前技术验证。

## 4. 已有技术证据

| 编号 | 结论 | 证据 | 状态 |
| --- | --- | --- | --- |
| EVD-001 | Agent 已是独立配置和授权主体 | `packages/db/src/schema/agents.ts`、`server/src/services/authorization.ts` | 已验证 |
| EVD-002 | Tool Profile 已支持 company、agent、project、routine、issue、gateway 等作用域 | `packages/shared/src/constants.ts`、`server/src/services/tool-access-policy.ts` | 已验证 |
| EVD-003 | Heartbeat 会计算有效工具配置、注入 MCP 并签发短期运行令牌 | `server/src/services/heartbeat.ts` | 已验证 |
| EVD-004 | Routine 已支持触发、变量、版本快照、恢复和审计 | `packages/db/src/schema/routines.ts`、`server/src/services/routines.ts` | 已验证 |
| EVD-005 | Pipeline 已支持 Stage、Transition、Case、Automation、Retry、Review 和 Liveness | `packages/db/src/schema/pipelines.ts`、`server/src/services/pipelines.ts` | 已验证 |
| EVD-006 | Work Product 可承载外部工件引用，External Object 可承载 Provider 对象的当前状态投影；二者都不能替代 Connection-scoped、append-only 的 External Fact | `packages/shared/src/types/work-product.ts`、`packages/db/src/schema/external_objects.ts` | 已验证 |
| EVD-007 | Paperclip 已存在 Instance Admin 与 Company Membership 两级访问模型 | `server/src/services/access.ts`、`server/src/services/company-member-roles.ts` | 已验证 |
| EVD-008 | Connections v3 已引入 AppDefinition、稳定 UID、主体授权和 Connection Grant | `releases/v2026.722.0.md`、`server/src/services/tool-access.ts` | 已验证 |
| EVD-009 | Run-bound Secret Access 已支持按 Agent Grant 读取、no-store 与审计 | `releases/v2026.722.0.md`、`server/src/services/secrets.ts` | 已验证 |
| EVD-010 | 内部研发项目已验证 planner-first、结构化 Invocation、有界循环和人工阻塞协议 | `coding-agent-orchestrator/src/orchestration/planner-first.ts` 及设计文档 | 已验证 |
| EVD-011 | Company Prefix、路由同步、深链与 WebSocket 生命周期可演进为 Enterprise/Company 双作用域 | `doc/research/2026-07-23-enterprise-company-scope-authz.md` | 已验证 |
| EVD-012 | 当前 Instance Admin 存在 Company 全局提升，目标隔离需收紧公共授权入口并拆出治理投影 | `authorization.decideBase`、`assertCompanyAccess`、Company GET Route 盘点 | 已验证 |
| EVD-013 | Membership/Break-glass 撤销时同步失效内容、缓存和实时订阅的状态模型可行 | Enterprise/Company 作用域可丢弃原型及验证记录 | 已验证 |
| EVD-014 | 当前 Dashboard 以 Agent/Task/成本为中心，Attention 已具备统一行动读模型，但缺少 SOP Run 结果与进度聚合 | `doc/research/2026-07-23-page-ia-and-department-dashboard.md` | 已验证 |
| EVD-015 | Paperclip 已分别具备 Agent 工具面和 Plugin 平台同步面，但缺少统一 Connector Definition/Version 到 Company-scoped Connection 的双面关联、可靠同步和端到端归因契约 | `doc/research/2026-07-23-dual-sided-connector-coverage.md` | 已验证 |
| EVD-016 | Pipeline Automation 是 Stage Entry 的事务化幂等触发缝隙；Routine/Issue 适合单 Invocation，但当前没有 Stage 内多 Invocation 的持久化 Loop 状态 | `doc/research/2026-07-23-stage-loop-controller-boundary.md` | 已验证 |
| EVD-017 | 当前 Attention 已聚合主要人工介入来源并保持底层对象为事实源，但缺少跨来源 Incident、责任归属、SOP Run Scope、动作注册和强制事项视图策略 | `doc/research/2026-07-23-attention-aggregation-read-model.md` | 已验证 |
| EVD-018 | 现有 Run、Cost、Budget、MCP Runtime、Connection、Secret Provider、Recovery、Tool Audit 和 Backup 数据足以支撑首期企业治理投影；缺口是独立 Instance API、字段披露白名单、受控分类和新鲜度/完整性契约 | `doc/research/2026-07-23-enterprise-governance-projection-fields.md` | 已验证 |
| EVD-019 | Invocation 层已有 Routine Revision、Agent Config Revision、Skill Version、有效配置指纹、模型/成本/重试和反馈事实，但 Pipeline Case 未固定定义版本，尚无 SOP Run 级 Execution Variant、Outcome Contract 和实验分配 | `doc/research/2026-07-23-sop-version-effect-attribution.md` | 已验证 |
| EVD-020 | Skill Test 已能固定输入、Skill Version、Agent Config 并保存输出/成本；Routine/Agent 回滚会生成新 Revision；Feedback、Decision Training、Recovery 和 Productivity Review 可提供改进证据，但尚无候选隔离、Evaluator、Trial 和 Release Decision | `doc/research/2026-07-23-improvement-candidate-minimum-loop.md` | 已验证 |
| EVD-021 | Tool Gateway 已有本地副作用幂等键、参数签名、审批快照和单次执行 Claim，但 Remote MCP 使用随机请求 ID，超时统一记 Failed；Plugin Job/Webhook 也缺稳定执行键、Lease 和数据库级 Delivery 去重；External Object 只能作为当前状态投影与 Reconcile 查询入口，不能替代 Connection-scoped External Fact | `doc/research/2026-07-23-non-idempotent-external-action-recovery.md` | 已验证 |
| EVD-022 | Paperclip 已有 Task Markdown、Wake Payload、Heartbeat Context、Continuation Summary、Session Rotation 和 MCP 按需读取，但正常续跑仍优先依赖 Provider Session；当前摘要缺少 SOP 执行身份、权威 Checkpoint、统一证据清单和恢复完整性声明 | `doc/research/2026-07-23-fresh-context-recovery-sufficiency.md` | 已验证 |
| EVD-023 | Interaction、Approval、Recovery、Pause Hold、Wake 与 Run 均已持久化，且服务启动会恢复 Queue 并执行多类 Reconciler；但人工对象解决与 Wake 分步提交，普通 Wake 幂等键无数据库唯一约束，Hold 会终结性 Skip Wake，尚无统一的欠交付 Continuation Intent | `doc/research/2026-07-23-durable-human-wait-and-next-day-resume.md` | 已验证 |
| EVD-024 | 当前 Pipeline Case 仅引用可变 Pipeline/Stage；核心转换会读取 live Stage、Transition、Review Gate 和 Automation。将 SOP 直接投影到现有 Pipeline 会产生语义压缩和运行解释漂移，不能作为长期编译目标 | `doc/research/2026-07-23-sop-release-runtime-mapping.md`、`pipeline_cases.ts`、`pipelines.transitionCaseInTransaction`、`routines.dispatchRoutineRun` | 已验证 |
| EVD-025 | 当前 Paperclip 没有独立 Agent Execution Worker：Heartbeat 在 Server 内 Claim Run 后直接调用 `executeRun`，并在同一进程负责 Workspace、Workspace Runtime Service、Adapter 子进程和运行状态；Plugin Worker 与 Sandbox Provider 分别是插件隔离和受控执行环境，均不是自主注册、领取 Invocation 的通用 Worker 节点 | `server/src/services/heartbeat.ts`、`server/src/index.ts`、`server/src/services/plugin-worker-manager.ts`、`packages/plugins/sandbox-providers/` | 已验证 |
| EVD-026 | Paperclip 已有 Company-scoped Storage/Asset、Task Attachment、Work Product、Workspace File Browser 和 Skill/Routine Folder，但分别只承担对象存储、任务附件、运行产出、执行目录浏览和能力组织，现有任一实体都不能单独表达部门共享、可组织、可引用的长期业务文件资源库 | `server/src/storage/service.ts`、`packages/db/src/schema/assets.ts`、`server/src/services/workspace-file-resources.ts`、`server/src/services/folders.ts`、`packages/shared/src/types/work-product.ts` | 已验证 |
| EVD-027 | Paperclip 当前每次 `putFile` 都生成新的 UUID Object Key；Asset 虽记录 SHA-256，但没有内容唯一约束或去重，Task Attachment 也没有通用文件版本关系。现有 Document Revision 只覆盖文本 Document，并为每个 Revision 保存完整 Body，不能直接代表通用文件资源库的版本与存储优化方案 | `server/src/storage/service.ts`、`packages/db/src/schema/assets.ts`、`packages/db/src/schema/issue_attachments.ts`、`packages/db/src/schema/document_revisions.ts` | 已验证 |
| EVD-028 | Paperclip 当前 Issue 已有 `assigneeUserId` 与 `responsibleUserId`，Routine、Routine Revision 和 Routine Run 也已有 `responsibleUserId`，可作为人类责任归属的演进接缝；但尚未形成 SOP Run 必填 Owner、Human Gate 动态人员解析和由 Run 人员角色派生 Artifact 权限的统一契约 | `packages/db/src/schema/issues.ts`、`packages/db/src/schema/routines.ts` | 已验证 |
| EVD-029 | Paperclip 当前并非一套统一插件体系：通用 Plugin 是 Instance 级受信任扩展包和子进程宿主，Tool Connection/Grant 是 Company 级工具授权底座，External Agent Adapter 动态加载到 Server 主进程，Company Skills 是部门级内容与版本系统；通用 Plugin 升级的 Capability Approval 分支当前存在实现断链，Worker 也不是 OS 安全沙箱，不能把 4 类能力强行统一成 Plugin | `doc/research/2026-07-25-paperclip-plugin-capability-architecture.md` | 已验证 |
| EVD-030 | 当前 Plugin Manifest 的 `tools` 会注册为来源限定的 Namespaced Agent Tool，并进入与 Built-in Tool 共用的 Tool Gateway；Policy Input 允许 `connectionId=null`，显式 `tools:use` Grant 可按 `tool:<namespacedName>` 匹配，因此 Connectionless Extension Tool 可以复用现有 Agent/Tool Policy 链，不需要第三套授权模型。但现有 Agent Tool Descriptor 只含 `pluginId` 与 Tool Name，没有可供历史 SOP 固定的 Extension Version/Contribution Revision，版本固定仍需 VAL-006 验证 | `server/src/services/plugin-tool-registry.ts`、`server/src/services/plugin-tool-dispatcher.ts`、`server/src/services/tool-gateway.ts`、`server/src/services/tool-access-policy.ts` | 已验证 |
| EVD-031 | TV-02 在两套全新 scratch PostgreSQL 上连续通过 8 个版本证伪场景，语义基数均为 14 Snapshot、5 Release、5 Production Run、3 Effect Audit；证明不可变 Validation Snapshot/Release/Execution Definition/Binding、六类发布漂移检测、并发单赢家、未来 Run 回滚、历史恢复、Resource Content Revision 固定与 Replay Effect 禁止可以组成闭合版本契约 | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/12-sop-versioning-validation-report.md` | 已验证 |
| EVD-032 | TV-03 在当前 Heartbeat 接缝上重新执行，两套全新 scratch PostgreSQL 均通过 9 个授权证伪场景，语义基数保持 4 个 Snapshot/Manifest、5 个当前能力状态、39 条审计和 4 次合法 Dispatch；21 次拒绝与 1 次待审批均未 Dispatch。Evidence Digest：`24f0ad87c755d61b78169add367372d2345b5575b34aecfed28308cf1d5a7b0f` | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/13-capability-narrowing-validation-report.md` | 已验证 |
| EVD-033 | TV-04 消费重新封口的 TV-03 证据，在两套全新 scratch PostgreSQL、Worker State 与 Workspace Root 上连续执行真实 Docker Control Server、Worker 和 Sandbox；语义基数均为 7 场景、1 稳定 Worker、4 Session、8 Command/Event/Receipt，峰值恰好 2 个 Sandbox，容器泄漏为 0。Evidence Digest：`6b1b698f41a8352445d1b55069288751925eebe9eaf6c8f675ef514b56d4f0f7` | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/14-worker-runtime-validation-report.md` | 已验证 |
| EVD-034 | TV-05 消费重新封口的 TV-03/TV-04 证据，在两套全新生产 Schema overlay 上连续验证 Heartbeat 外置执行接缝、单 Command/Retry Identity、真实 Docker Receipt、旧 Fence/Epoch 拒绝、Receipt 去重、独立 Verifier、机械 Completion Gate 与 Recovery Envelope 重建；两轮均为 5 场景、4 Snapshot、1 Command/Receipt/Retry/Envelope、4 Audit、0 本地 Adapter 回退/容器泄漏，Envelope Digest 均为 `482e79ac…e27833a`。真实 `gpt-5.6-sol` 四组消融均安全、下一动作正确并通过独立测试。Evidence Digest：`d44b40b947daa9f0d6b005aafc250e07eb8af38a07edec4c6656f2c325a46ef0` | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/15-stage-kernel-production-seam-validation-report.md` | 已验证 |
| EVD-035 | Gate A 首次跨包探针取回 TV-01～TV-05 的 5 个精确 Evidence，校验 44 个当前源码摘要、7 条无环依赖边、5 类身份接缝和 5 个故意破坏反例；当时 TV-01 真实 GitHub Canary 仍为 `inconclusive`，因此历史 Gate A 结论为非 Go。该结论已被 EVD-038 的新证据链取代 | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/20-gate-a-evidence-compatibility-report.md` | 已验证（历史） |
| EVD-036 | TV-08 阶段一用固定合成 Case 连续两轮通过 10 个机械 Campaign 证伪场景，覆盖 17 个冻结身份维度、8 个负向拒绝和 0 个生产晋升副作用；单变量、Hard Gate、预算、漂移、Retry 样本合并、样本/Case Mix、Late Fact/Reopen、序列化恢复、人工精确 Digest 晋升与多目标 `inconclusive` 均闭环。Mechanical Digest：`751c5dab…1ab0f8`；完整 TV-08 因未使用真实 L1/Researcher/Trial 仍为 `inconclusive` | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/18-improvement-campaign-validation-report.md` | 阶段一已验证 |
| EVD-037 | TV-01 在专用 GitHub Canary 仓库连续两次完整执行均为 `validated`：PR #9/#10 的 Create/Merge/Workflow Mutation 各为 1，真实 Workflow Artifact、Deployment Status、Signed Webhook、Receipt 后崩溃恢复和 replay 均闭环；Receipt=1、Fact=1、三个 Provider Version 相等，外部资源精确清理且无 Secret 泄露。当前 Evidence Digest：`ae7cfaba…8ed7` | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/11-github-connector-validation-report.md` | 已验证 |
| EVD-038 | TV-05 以新 TV-01 Digest 重新执行生产接缝与四组真实模型消融并通过，Evidence Digest 为 `562f7780…a50`；Gate A 随后两轮校验 5 包、47 个源码摘要、7 条无环依赖边、5 类身份接缝和 5 个反例，Compatibility Digest 均为 `9d514f18…f2ae7`，Gate A Verdict 为 `validated`、Blocker 为 null | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/20-gate-a-evidence-compatibility-report.md` | 已验证；Gate A Go |
| EVD-039 | TV-06 的孤立 Resource Library/Run Authority 领域契约原型连续两轮执行 5 个否证场景，覆盖稳定 Resource ID、COW、Run Snapshot、Binding/Trash/GC、四类 Trigger、唯一改派、Authority Revision fencing、Project 基础查看回退、历史 Actor 保留及 Artifact/Gate 权限分离；两轮语义基数一致，Stop Rule 命中 0。收口重跑 Evidence Digest：`5a0ef48f…5e41`。相关模块当前没有生产 Schema、Route/Service 调用链、持久存储或 UI 接入 | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/16-resource-authority-validation-report.md` | 孤立领域契约原型已验证；生产集成未验证 |
| EVD-040 | TV-07 的孤立 Attention Projection 领域契约原型连续两轮执行 5 个否证场景，覆盖 7 类 Source Adapter、重复/乱序/漏事件、部分关闭、Stage Epoch、全量重建、Required Dismiss 限制和动作回源重新鉴权；兼容矩阵又发现并修复 Run 级无 Epoch 改派被错误过滤的问题。收口重跑 Evidence Digest：`0761ed2f…e58a`，精确依赖本轮 TV-06 `5a0ef48f…5e41`。相关模块当前没有生产事实源、Route/Service 调用链、持久存储或 UI 接入 | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/17-attention-projection-validation-report.md` | 孤立领域契约原型已验证；生产集成未验证 |
| EVD-041 | TV-09 的孤立 Governance Projection 领域契约原型连续两轮执行 4 个否证场景；44 个 DTO 叶子与 Manifest 精确对应，G3/G4 允许字段为 0；六类 Canary 在六个原型输出面命中均为 0，Company 内容 API 调用 0。收口重跑 Evidence Digest：`3f63fb7b…a3cfb`。相关模块当前没有生产治理数据源、Route/Service 调用链、持久存储或 UI 接入 | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/19-governance-projection-validation-report.md` | 孤立领域契约原型已验证；生产集成未验证 |
| EVD-042 | Gate B 收口 Runner 在一次命令中按依赖顺序重新生成 TV-06/TV-07/TV-09 当前 Evidence，再执行两轮兼容矩阵；17 个源码摘要无漂移，3 条依赖边和 4 个反例通过，两轮 Compatibility Digest 均为 `db7f0af5…d372`。机器输出已区分 `contractCompatibility=validated` 与 `gateBVerdict=inconclusive`；该证据只证明孤立原型之间的契约兼容，不证明生产 Schema/API/UI/运行链路闭环 | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/21-gate-b-evidence-compatibility-report.md` | 原型兼容矩阵已验证；Gate B inconclusive / No-Go |
| EVD-043 | MoonTV throwaway 在全新隔离 worktree 上通过真实 Paperclip Heartbeat 顺序执行 Planner、Developer、固定 Acceptance 与独立 Verifier；Baseline 4 suites/28 tests、Candidate 6 suites/42 tests 均通过，Verifier 六项均为 `passed`，Kernel 在 Epoch 1 直接进入 `waiting_human_gate`，Finding 为 0、没有第二次 Developer。首次关闭尝试暴露 Developer 600 秒终态预算不足；写入型预算提高到 900 秒后全新重跑通过。原始 MoonTV checkout 未改变且没有 commit、PR 或外部副作用 | `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/23-moontv-sop-throwaway-prototype-report.md` | Heartbeat + 机械 Kernel 窄问题已验证；不代表生产 SOP、Gate B 或 L1 |

## 5. 待验证问题

### VAL-001：SOP Release 到 Pipeline/Routine 的映射边界

- 问题：哪些 SOP 语义可以直接映射现有 Pipeline/Routine，哪些需要新增持久化对象？
- 方法：代码级字段映射审计，加一个最小研发 SOP 数据建模原型。
- 必需证据：完整字段映射表；无法映射项；最小新增模型；一次创建、发布和恢复演示。
- 阻塞：子需求 04、05、10。
- 当前证据：已完成 Pipeline、Routine、Issue、Heartbeat 的字段映射、现有版本语义审计和 A/C/D 方案比较；TV-02 进一步用 disposable PostgreSQL overlay 验证了独立 Release/Execution Definition/Binding/Run Pin 模型。Pipeline 是可变定义，原始 Pipeline Projection 会把 SOP 语义压缩到现有 Stage/Config 能力上限；Routine Revision 与 Routine Run 的 Revision 引用可作为 exact executable strategy 接缝，但不是完整 Business SOP Release。
- 已确认方向：采用“不可变 SOP Release + Binding Revision + 共享不可变 Execution Definition Revision + exact Routine Revision”。现有 Pipeline 不是 SOP 编译目标；可保留的 Pipeline Projection 只能是可重建的兼容视图，不能承载 SOP 语义。
- 原型证据：编译失败原子回滚；Snapshot 不读取后续 Draft；并发发布单赢家；Draft、Binding、Agent、Connection、Resource、Project Env 六类漂移分别阻止发布；Run 固定 Release/Execution Definition/Binding 与引用修订；回滚只影响未来 Run；历史 Release 只派生新 Draft。
- 证据：`doc/research/2026-07-23-sop-release-runtime-mapping.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/12-sop-versioning-validation-report.md`。
- 状态：最小版本与映射边界已验证；生产 Schema/API/UI 待正式开发。

### VAL-002：Stage Execution Kernel 的最小接口

- 问题：Loop Controller 应作为 Pipeline Automation 类型、Routine 扩展还是独立服务？
- 方法：比较三种集成方式；实现不进入主干的可丢弃原型。
- 必需证据：接口复杂度、状态所有权、恢复语义、审计覆盖和失败模式对比。
- 阻塞：子需求 05、10。
- 当前证据：P0 已验证不可变 Decision、Command 去重、持久快照恢复、Stage Epoch 隔离和机械 Completion Gate；P1 已通过真实 `codex_local`、Heartbeat 与 PostgreSQL 验证“Command 已提交但 Run 关联未回写”的 receipt reconciliation，并证明现有 Heartbeat `idempotencyKey` 只是关联数据而非唯一性保证；P2 已用真实 PostgreSQL 并发 CAS 验证单 Winner claim、lease 接管、单调 fencing token、旧写入隔离和单 receipt/Run，并用真实 `codex_local`、`claude_local` 验证同一 Runtime-neutral `ExecutorDecision` 契约；P3-A 已验证 9 次 Invocation 的确定性返工与 5 次额度下派发前 `blocked_budget` 硬停，P3-B 已用 9 个真实 `codex_local` Heartbeat Run 验证共享工件上的 Planner/Worker/Verifier 返工、Artifact Revision 绑定、Finding 解决和独立 Completion Gate。
- 已确认方向；原型提供可行性证据：采用独立 Stage Execution Kernel + 可插拔 Stage Executor。Kernel 独占状态转换、claim/lease/fencing、receipt reconciliation、协议语义校验和 Completion Gate；Agent Runtime 只提出 Decision，Runtime 差异留在 Adapter 配置。Paperclip Heartbeat 可复用为单次 Invocation 传输，但 Pipeline Automation 或 Routine 扩展都不应成为 Loop 状态内核。
- 收口证据：P4/P5 已覆盖持久人工中断与跨进程交付；P10 在第一次失败 Verifier 后销毁内存状态，仅凭 PostgreSQL 的校验快照和固定 Recovery Envelope 重建完整 P3 返工 Loop，最终保持 9 个 Invocation、11 个 Snapshot、9 个唯一 Receipt，由 Revision-2 Evidence 解决旧 Finding 并通过独立 Completion Gate；旧 Receipt 被去重，旧 Epoch 结果被拒绝。
- TV-05 证据：生产 Heartbeat 在 Run Claim 后可通过可选窄接缝交给外部执行所有者；两轮真实 Docker Receipt + durable Kernel 闭环没有本地 Adapter 回退、旧 Fence/Epoch 推进或重复 Receipt；真实 `gpt-5.6-sol` R2 Fresh Envelope 安全、下一动作正确并由独立测试完成。单受控任务只证明方向充分性，不证明跨任务/模型统计等价。
- 尚缺证据：生产级 lease scheduler、正式 Kernel/Worker Schema/API、真实非注入式复杂任务，以及 Adapter/Heartbeat 统一 structured output 字段。Claude `--json-schema` 探索中曾出现仅 fenced Markdown summary，不能把 CLI schema 参数视为强交付保证。
- 证据：`doc/research/2026-07-23-stage-loop-controller-boundary.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/09-stage-kernel-closure-validation-report.md`。
- 状态：核心状态语义、生产执行接缝方向与单任务真实模型消融已验证；正式生产纵切和灯塔复杂任务待后续开发验证。

### VAL-003：fresh context 恢复充分性

- 问题：新 Invocation 只读取 SOP、Stage、工件、Git 和结构化进度时，能否可靠继续？
- 方法：在同一真实需求上执行多轮新上下文测试，逐步减少 Transcript 输入。
- 必需证据：恢复成功率、缺失事实、上下文 Token、失败原因。
- 阻塞：子需求 05、10。
- 当前证据：Paperclip 可向新 Session 注入 Issue、祖先、Wake Delta、Recovery、Execution Stage 和 Continuation Summary，并通过 MCP 按需读取 Issue、Comment、Document、Approval 与 Workspace；但正常路径优先 Resume Provider Session，Fresh 与 Resume Prompt 不等价。当前 Continuation Summary 主要从 Run 文本结果推断，详细命令仍只在 Transcript 中，且没有统一固定 SOP Release、Stage Epoch、Checkpoint、证据版本和恢复完整性。
- 已确认目标方向：采用“结构化 Recovery Envelope + 按需 MCP 取证”；State Reconstruction 是正确性基础，Session Resume/Handoff 只是优化，Transcript 只作为调查证据。
- 原型证据：TV-05 对同一可运行代码任务执行 R0 Session Resume、R1 当前 Summary、R2 Recovery Envelope、R3 Envelope + Selected Transcript；四组 Fixture Digest 相同，均只修改允许实现文件并由独立测试完成。R2 完全 Fresh，安全/正确下一动作/完成均通过且不低于 R0；R3 未增加完成率。Input Token 含本机指令/Skill 环境，样本只有一个，不作统计外推。
- 尚缺证据：多任务、多切断点、其他 Adapter 和长时间运营样本；这些属于灯塔验证，不再阻碍 Recovery Envelope 进入正式纵切设计。
- 证据：`doc/research/2026-07-23-fresh-context-recovery-sufficiency.md`；EVD-034；`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/15-stage-kernel-production-seam-validation-report.md`。
- 状态：目标架构、确定性状态重建与单任务真实模型方向性充分性已验证；统计推广待灯塔样本。

### VAL-004：非幂等外部动作的重试与恢复

- 问题：创建 MR、合并、部署、通知等动作如何避免重复副作用？
- 方法：为研发连接器设计 correlation key、先查后写和外部事实恢复实验。
- 必需证据：超时、重复回调和进程崩溃场景下无重复副作用。
- 阻塞：子需求 05、07、10。
- 当前证据：Tool Gateway 已用 Company + Side-effect Idempotency Key 唯一约束 Invocation，高风险动作固定参数签名、Approval Snapshot，并通过 `approved → executing` 条件更新防止并发重复；但 Remote MCP 每次生成随机 Request ID，执行异常统一标 Failed，后续匹配不包含 Failed，存在“外部已成功、响应丢失、重试重复”的风险。Plugin Job Run 无稳定触发键/Lease，Webhook `externalId` 无唯一约束；External Object 已有 Company-scoped Provider External Identity 唯一键，但身份不含 Connection，只能作为投影 Fit/Gap 基线。
- 已确认目标方案：采用“Effect-aware External Action Intent/Attempt Journal + Provider Idempotency/Marker + Reconcile-first”；Stage Kernel 为一次逻辑外部动作提供跨 Stage Retry 稳定的 Effect Occurrence，Intent 固定逻辑 Run/Stage/Connection/参数，实际 Stage Epoch、Invocation 与 Tool Invocation 记录在 Attempt。Transport Ambiguous Outcome 进入 Unknown/Reconciliation，单次 `not_found` 不是安全重试证明；只有确认请求未离开平台，或 Connector Recovery Descriptor 通过稳定 Strategy/Evaluator Key 对最新 Attempt 产生满足 Provider 一致性条件的 `safe_to_retry` 证明时，才能签发新 Attempt。External Fact 归因到逻辑 Run/Stage/Intent，具体 Stage Epoch 另行记录 Fact Consumption；SOP Stage 只依据 External Fact/Postcondition 推进。
- 原型证据：TV-01 已用生产 Schema scratch PostgreSQL、真实 Tool Gateway Route/Policy/Approval/Tool Invocation、可删除 Remote Dispatch Seam、Coordinator、签名 Attempt Envelope、远程 Connector MCP Runtime、正常 Plugin Loader 与 Plugin Worker RPC 完成确定性闭环。连续两次完整运行均为 3 个 Intent、3 个 Provider PR、8 个 Platform Worker Observation；受控故障矩阵覆盖未派发、Provider 接受后响应丢失、响应后本地提交失败、Unknown/Reconcile、Webhook 乱序/漏失、Cursor 补偿、旧 Epoch/Fence、通知转人工和双 Connection 隔离。
- 真实 Provider 证据：专用 GitHub Canary 仓库连续两次完整验证均通过，覆盖 PR、Merge、固定 Workflow、唯一 Envelope Artifact、Deployment/Status、Signed Ping/Webhook、Provider 接受后响应丢失、Receipt 后崩溃、fresh 实例轮询恢复、replay 幂等和精确清理；当前 Evidence Digest 为 `ae7cfaba…8ed7`。
- 证据：`doc/research/2026-07-23-non-idempotent-external-action-recovery.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/11-github-connector-validation-report.md`。
- 状态：`validated`；确定性协议、生产接缝与隔离真实 GitHub Canary 均通过。

### VAL-005：持久化人工中断与隔日恢复

- 问题：Agent 进程退出后，审批或问题隔日处理能否从同一状态恢复？
- 方法：基于现有 Approval、Interaction 和 Recovery 构件做状态恢复原型。
- 必需证据：序列化状态、恢复点、权限重新校验、过期处理和审计记录。
- 阻塞：子需求 07、10。
- 当前证据：Interaction、Approval、Recovery Action、Issue Tree Hold、Wake Request 和 Run 都会持久化，服务启动及周期任务会恢复 Queued Run 并执行多类 Liveness Reconciler；但 Interaction/Approval 均先提交人工决定再异步 Wake，进程崩溃可能留下“已解决但未唤醒”的永久静默。普通 Wake 的 Idempotency Key 无数据库唯一约束；Active Hold 会将 Wake 记为 Skipped，Release 不会统一重建；Recovery Action 解决也没有通用续跑交付契约。
- 已确认目标方案：采用“Stage Wait Contract + Transactional Continuation Intent + 持久 Delivery Journal + Reconciler”；人工 Source Object 保持唯一事实源，Resume 前重新校验 Stage Epoch、目标版本、权限、预算、能力、外部事实和 Recovery Envelope。
- 原型证据：P4 用独立 scratch PostgreSQL 表验证了 `waiting_human` 全状态重建、Human Decision 与 Intent 同事务提交、提交后/claim 前崩溃恢复、lease + fencing 接管、Invocation 预算预占、稳定 receipt 对账、重复 callback/tick 去重、旧 owner 拒绝和不含旧 Session 的 Recovery Envelope。两轮运行均最终只产生一个 Human Decision、Intent、Invocation 和 delivered receipt，并由 Revision-3 Evidence + Completion Gate 完成 Stage。
- Heartbeat 证据：P5 将 Interaction、Approval、Recovery Action 归一为同一 Human Decision/Intent，使用生产 Heartbeat Service 和真实 Wake Request/Run 表，分别验证 Wake 前崩溃、Wake 后/receipt 链回前崩溃、terminal 后/consume 前崩溃。两轮确定性运行均恰有 3 个 completed Wake、3 个 succeeded Run、3 个 consumed Intent；旧 fencing token 被拒绝，重复 consume 幂等，所有 Run 无旧 Session 身份。核心使用 `process` Adapter 隔离 Provider 抖动；两次 `codex_local` canary 因超时和上游 502 失败，不计为成功证据。
- Provider Retry Chain 证据：P6 用 scratch PostgreSQL 和确定性 502、硬超时、断流 fixture 验证了“一个语义 Invocation 对应多个 Delivery Run”的分层模型。两轮均为 4 个 Invocation、4 个 Root Run、9 个 Delivery Run；502 与超时在 Generation 2 成功，断流在第 3 次 Attempt 后进入 `blocked_infrastructure` 并只生成 1 条 `executor_unavailable` Finding，Store 重建找回未链接的 Generation 2，迟到 Generation 1 结果被拒绝。每个 Invocation 的语义预算保持 1，Attempt、已知成本和未知成本独立累计。该证据验证目标契约，不代表生产 Codex 硬超时已经输出稳定 Error Family。
- 生产 Retry 接缝反证：P7 使用生产 Heartbeat Service 和真实生产表，在同一 Root Run 上顺序调用两次通用 `scheduleBoundedRetry`，实际生成 2 个不同的 Attempt-1 子 Run和 2 个 `idempotencyKey = null` 的 Wake Request；`promoteDueScheduledRetries` 又将两者全部晋升为 `queued`。代码路径断言同时确认 Codex 硬超时只返回 `timedOut = true`，不满足当前自动 transient recovery classifier。结论是 P6 分层方向保留，但现有通用 Scheduled Retry 不能不加改造直接作为可靠单链。
- 收口证据：P8 在生产表 scratch 副本上验证 Retry Attempt 唯一身份 + 唯一冲突回读，顺序重放和 4 路并发均只留下 1 个子 Run、1 个 Wake、1 次晋升且无孤儿 Wake。P9 用 10 个持久 Intent 覆盖事实未漂移、Pause Hold/释放、Epoch/版本/Artifact 漂移、权限与能力撤销、预算耗尽和过期；只有合法场景创建 Invocation，Hold 释放跨 Store 重建并复用同一 Intent/Invocation。
- TV-05 证据：P8 单 Retry Identity、P9 Resume Eligibility、P10 Recovery Envelope 与真实 Docker Receipt 已在完整生产 Schema + disposable overlay 的同一闭环组合；Heartbeat Claim 可交给外部执行接缝，旧 Fence/Epoch/Receipt 重放不能推进，Store 重建得到相同 Envelope Digest。
- 尚缺证据：将目标落入正式 production migration/Service；生产 Source Route 事务接入；生产硬超时/输出无进展 Error Family；生产 Hold 释放 Reconciler 和真实跨日运营矩阵。
- 证据：`doc/research/2026-07-23-durable-human-wait-and-next-day-resume.md`；历史原型设计（未纳入基线）；历史原型设计（未纳入基线）；历史原型设计（未纳入基线）；历史原型设计（未纳入基线）；`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/09-stage-kernel-closure-validation-report.md`；历史可丢弃原型（源码未纳入基线）；历史可丢弃原型（源码未纳入基线）；历史可丢弃原型（源码未纳入基线）；历史可丢弃原型（源码未纳入基线）；历史可丢弃原型（源码未纳入基线）；历史可丢弃原型（源码未纳入基线）；历史可丢弃原型（源码未纳入基线）。
- 状态：原型状态、恢复语义与生产接缝方向已验证；正式 Migration/Service 和跨日运营待后续开发验证。

### VAL-006：Agent Tool Binding、SOP 能力收窄与撤权

- 问题：Connection-backed Tool 与 Connectionless Extension Tool 能否复用同一 Agent Tool Binding/Policy 链，并可靠表达“默认继承 Agent 能力，配置时按稳定 ID Allowlist 精确收窄”？
- 方法：审计 `tool-profile-binding-precedence` 和 `tool-access-policy`，补充最小能力集合原型。
- 必需证据：两类 Tool 均以来源限定稳定 ID 显式绑定且不产生第三套 Grant；Agent Configuration Snapshot 能固定 Extension Tool 来源版本与 Contract Digest；未配置 Allowlist 时与 Agent 能力一致，配置后只能取 Agent 能力与稳定 ID Allowlist 的交集；Agent 缺失能力、Extension/Connection 停用、授权撤销和旧 Stage Epoch 均被拒绝。
- 阻塞：子需求 05、06、10。
- 当前证据：已确认 Tool Profile 使用最窄作用域覆盖而非多层交集；Allow Policy、Trust Rule 和显式 Grant 可以先于 Profile 放行；Heartbeat、Connection Token 和 Secret Access 已具备 Run-bound、短期凭证与审计基础。TV-03 已用 exact-ID 授权核、签名短期 Token、scratch PostgreSQL 当前状态与不可变审计验证目标交集协议。
- 已确认目标方向：Stage Binding 只绑定 Agent，不绑定 Connector、Connection、Secret、Environment、Platform Extension 或 Tool Grant。Connection-backed Tool 与不需要外部身份的 Extension Agent Tool 都进入同一个 Agent Tool Binding；前者以 Connection ID + Tool ID、后者以来源限定 Namespaced Tool ID 固定，SOP 不感知 Tool 来源实现。未配置 Stage Allowlist 时直接继承固定 Agent Configuration Snapshot 的能力；配置时按 Skill Version ID、Connection ID 和 Tool Key 等稳定标识做集合交集，不使用描述或语义匹配。Project Env 由 Run 所属 Project 提供变量和 Secret 引用，不参与 Agent 能力集合、执行后端选择或 Stage Allowlist。复杂的 `AgentEntitlementAnchor`、用户可见 `RunCapabilityEnvelope` 和资源级 Scope Contract 不进入首期产品模型。
- 原型证据：默认继承与 restricted 交集、Connection/Extension Tool 统一路径、同名伪造拒绝、Policy/Approval/缓存不可绕过、Connection Token Scope 子集、Secret Path、Grant/Connection/Extension 即时撤权、Stage Epoch、过期/篡改 Token、Worker Identity 隔离与 Extension V2 显式采用均已通过两轮确定性执行。
- 尚缺证据：把已验证 evaluator 接到生产 Tool Gateway、Connection Token 与 Secret Access 的共同前置接缝；这属于 Gate A 生产纵切验收，不否定授权协议。
- 证据：`doc/research/2026-07-23-sop-stage-capability-narrowing.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/13-capability-narrowing-validation-report.md`。
- 状态：授权协议与生产适配边界已验证；生产接入待开发。

### VAL-007：SOP Draft、Release 与 Binding 的最小版本模型

- 问题：如何在不复制 Pipeline/Routine 全量状态的前提下，保证 Release 不可变和 Run 可解释？
- 方法：数据模型设计审查和创建/发布/回滚/运行固定版本原型。
- 必需证据：版本身份、引用规则、快照范围、变更检测和回滚语义。
- 阻塞：子需求 04、10。
- 当前证据：已形成并在 TV-02 scratch PostgreSQL 原型中实际执行 Draft 可编辑、Validation Snapshot 不可变、Release 不可变、Binding Revision 不可变、生产 Run 固定 Release、回滚只影响未来 Run 的生命周期模型。
- 已确认方向：发布前由可变 Draft 原子生成不可变 Validation Snapshot，固定候选业务契约、Execution Definition、Binding、Agent Configuration Snapshot 与当次资源/Project Env 解析事实；Validation Run 只执行该快照。发布只能采用已通过且 Draft 未漂移的同一基线中的契约与 Revision，不能在试跑后重新编译近似内容；资源和 Project Env 快照作为发布证据保留，但不替代未来 Run 各自解析的运行快照。Release 承载生产业务契约，Binding Revision 承载具体 Agent 与能力收窄；历史恢复必须产生新 Draft / 新 Release；生产 Run 固定 Release、Execution Definition Revision 与 Binding Revision。
- 原型证据：Validation Snapshot/Release 等不可变 Trigger、生效前六类漂移检查、Snapshot 唯一发布约束、SOP 行锁、编译失败事务回滚、未来 Run 版本选择、历史 Draft 派生、Resource File 稳定 ID 与 Content Revision Pin、Historical Replay Effect Deny 均已通过两轮确定性执行。
- 尚缺证据：生产迁移、Company Scope/API 权限、Activity Log、规模与运营验证；这些属于正式实现验收，不否定版本模型结论。
- 证据：`doc/research/2026-07-23-sop-release-runtime-mapping.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/12-sop-versioning-validation-report.md`。
- 状态：最小版本模型已验证；生产实现待开发。

### VAL-008：Enterprise/Company Scope Context

- 问题：如何在保留现有 Company Prefix 路由和多标签页隔离的同时增加企业控制台？
- 方法：审计 `CompanyContext`、`Layout`、`SidebarCompanyMenu` 和路由；制作导航状态原型。
- 必需证据：多标签页、深链、权限失效、上次访问恢复、WebSocket 切换场景通过。
- 阻塞：子需求 02、03。
- 结论：URL 作为标签页 Scope Source of Truth；最近访问只用于主动切换；Cache 与实时订阅按 Scope 分区；权限撤销触发全部标签页重校验。
- 证据：`doc/research/2026-07-23-enterprise-company-scope-authz.md`。
- 状态：已验证。

### VAL-009：Instance Admin 与部门内容隔离

- 问题：当前 Instance Admin 在哪些 API 上可以读取 Company 内容，目标隔离需要哪些调整？
- 方法：枚举所有 Company-scoped 读 API，执行授权矩阵和安全审计。
- 必需证据：企业治理投影白名单；业务内容拒绝清单；Break-glass 审计模型。
- 阻塞：子需求 02、09。
- 结论：所有现有 Company 内容 API 统一要求 Membership 或 Break-glass；Instance Admin 仅访问独立、字段最小化的治理投影；临时访问使用独立到期 Session。
- 证据：`doc/research/2026-07-23-enterprise-company-scope-authz.md`。
- 状态：已验证。

### VAL-010：Attention 聚合读模型

- 问题：Approval、Interaction、Recovery Action、Blocked Issue 能否用一个产品读模型稳定聚合？
- 方法：枚举状态机、操作集合和恢复语义，使用真实样本做聚合原型。
- 必需证据：无状态丢失、无重复事项、操作能回到正确底层对象。
- 阻塞：子需求 07。
- 当前证据：当前 `AttentionItem` 已覆盖 Approval、Interaction、Join Request、Recovery Action、Review、Blocked、Failed Run、Budget 和 Agent Error，并具备 Company Scope、按用户 Dismiss/Snooze、来源更新后重现和同源去重；实际动作仍调用底层领域 Route/Service。TV-07 的孤立领域契约原型已连续两轮验证 7 类 Source Adapter、重复/乱序/漏事件、部分关闭、Stage Epoch、Required Item、全量重建和动作回源重新鉴权，但尚未接入生产事实源、持久存储、Route/API 或 UI。
- 已确认目标方案：采用“Source Adapter Registry + 可修复 Attention Signal Projection + Incident 聚合读模型”；底层对象保持唯一事实源，Attention Action Registry 只路由到现有领域 Service 并重新鉴权。
- 尚缺证据：在生产纵切中接入真实权威事实源、持久投影、Owner/Eligible Actor、刷新调度、Route/API、UI 动作和动作超时恢复，并证明重建不会形成第二事实源。
- 证据：`doc/research/2026-07-23-attention-aggregation-read-model.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/17-attention-projection-validation-report.md`。
- 状态：孤立领域契约原型已验证；生产集成未验证。

### VAL-011：SOP 版本效果归因

- 问题：如何区分 SOP、Skill、Agent、模型和项目差异对结果的影响？
- 方法：定义运行快照和实验维度，使用历史/合成数据验证对比口径。
- 必需证据：同版本聚合、单变量实验、样本量不足提示和回滚判定规则。
- 阻塞：子需求 08。
- 当前证据：Heartbeat 已记录运行、Usage、Provider/Model、Retry/Recovery 和 Effective Config Fingerprint；Routine Run 可关联不可变 Routine Revision；Agent Config 与 Skill 已有 Revision。TV-08 阶段一机械原型已固定完整 Base Variant/Evaluator/Case/能力/环境摘要，验证 Retry 合并、单变量、样本不足、Case Mix、Late Fact/Reopen、Hard Gate、多目标冲突和 Effect Report Revision。
- 已确认目标方向：采用“描述性趋势 + 分层匹配队列 + 单变量候选试运行”的三级证据模型，并用 `descriptive | associative | experimental` 明确归因强度；SOP Run 而非 Heartbeat Run 作为统计单元。
- 尚缺证据：使用真实 L1 的不可变 Execution Variant、真实 Outcome Window、Experiment Assignment、Case Mix 和外部 Evidence 完成归因，验证真实样本量、噪声和回滚。
- 证据：`doc/research/2026-07-23-sop-version-effect-attribution.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/18-improvement-campaign-validation-report.md`。
- 状态：机械归因契约已验证；真实 L1 归因仍为 `inconclusive`。

### VAL-012：Connections v3 对双面连接器的覆盖度

- 问题：现有 AppDefinition、Connection、Grant 和 Plugin Host 是否同时支持 Agent 工具面与平台同步面？
- 方法：代码审计，并以 Git Provider 完成工具调用、事件同步和外部状态读取实验。
- 必需证据：能力声明、授权、事件幂等、外部对象关联和审计链完整。
- 阻塞：子需求 06、10。
- 当前证据：已确认 Plugin Tool 进入统一 Tool Policy、Approval 和 Audit 链；Connection/Grant 具备 Company Scope；Plugin Host 已有 Webhook、Job、HTTP、Secret 和 External Object。但当前 `ToolRunContext` 只有 Agent、Heartbeat Run、Company 和 Project，没有 SOP Run/Stage/Epoch/Invocation；Tool Gateway 没有在已授权 Tool Invocation 与 Remote MCP Dispatch 之间的可注入拦截接缝；Plugin Webhook、Job 与 External Object RPC 也没有受信的 Connection/Connection Configuration Revision/Platform Integration 执行上下文。Webhook Delivery 没有 Connection-scoped Provider Delivery 唯一约束，External Object 身份不含 Connection，Event Bus 不是持久化可靠传输。
- 已确认目标方向：采用“企业安装统一 Connector Definition/Version、部门创建 Company-scoped Connection”的方向，不增加 Connector Installation 或第三套产品写模型。Agent-facing 面复用 Connection-scoped Tool Gateway + MCP Runtime，并在授权和权威 Tool Invocation 建立后进入 Effect-aware Remote Dispatch Hook；Platform-facing 面通过 Connection-aware Platform Bridge 把 Host 解析的同一 Connection Configuration Revision 交给 Plugin Worker。两者是同一 Connector Definition 的内部实现引用，共用稳定 Connection 与 Credential Reference，但授权、启停和健康正交，不要求运行在同一进程。
- 原型证据：TV-01 已证明一次 Connector-first Package 可由正常 Plugin Loader 解析为一个 Definition/Version，同时把 Agent-facing Tool 交给 Connection-scoped MCP Gateway，把 Webhook/Sync/External Object 经 Host-side Connection-aware Bridge 交给真实 Plugin Worker RPC。两面共用稳定 Connection、Configuration Revision、Connector Version 与 Credential Reference，但授权、启停和健康正交；同 Company 双 Connection 不串 Credential，Payload 不能决定 Connection，V2 显式迁移不改写旧 Intent 的 V1 固定关系。
- 生产 Fit/Gap：当前 SDK 尚无受信 `ConnectorPlatformExecutionContext`；现有 Plugin Webhook Route 不解析 Connection；Company-scoped External Object 会合并双 Connection 的同一 Provider Object，不能作为授权或 External Fact 事实源；Remote MCP Dispatch Interceptor 仍是临时可删除接缝。
- 真实 Provider 证据：Signed Ping/Webhook、PR/Merge/Workflow Artifact/Deployment、响应丢失恢复、Receipt/Poll 收敛和精确清理均已通过；Managed Connector MCP Runtime 的 Worker/Sandbox 生命周期由 TV-04/TV-05 的独立证据覆盖，生产 Schema/API 仍属于 Gate A 后的最小纵切。
- 证据：`doc/research/2026-07-23-dual-sided-connector-coverage.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/11-github-connector-validation-report.md`。
- 状态：`validated`；确定性双面接缝、真实 GitHub 与所依赖 Worker/Kernel 接缝证据已封口。

### VAL-013：企业治理投影的数据最小化

- 问题：企业管理员需要哪些聚合字段才能治理，又不会泄露业务内容？
- 方法：按健康、成本、风险、合规和审计场景设计字段级数据分类。
- 必需证据：每个字段的治理用途、来源、脱敏规则和访问测试。
- 阻塞：子需求 09。
- 当前证据：已完成 Directory、Health、Cost、Risk/Approval、Compliance/Audit 五类字段清单和 G0–G4 披露分级；TV-09 的孤立领域契约原型已连续两轮验证 44 个 DTO 叶子与 Disclosure Manifest、G3/G4 零暴露、六类敏感 Canary、聚合对账及 Freshness/Completeness 降级，但尚未接入生产治理数据源、持久存储、Route/API 或 Enterprise Console。
- 已确认目标方向：首期采用“独立 Instance Aggregate Query + 版本化 Governance DTO + Disclosure Manifest”，只允许 G0、G1 和受控 G2；未来规模化后可演进为事件驱动物化投影。
- 尚缺证据：在企业治理生产纵切中接入真实聚合数据源、Instance Admin 授权、持久投影、Route/API、搜索/导出/深链和 Enterprise Console，并重新执行字段 Allowlist、Canary 泄露、聚合对账及降级测试。
- 证据：`doc/research/2026-07-23-enterprise-governance-projection-fields.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/19-governance-projection-validation-report.md`。
- 状态：孤立领域契约原型已验证；生产集成未验证。

### VAL-014：部门 Dashboard 信息优先级

- 问题：结果、待处理、Run、工件、效能和健康的首屏排序是否符合真实一线团队使用习惯？
- 方法：低保真原型加研发团队任务走查。
- 必需证据：用户能在不查看 Transcript 的情况下回答进度、风险、待办和成果问题。
- 阻塞：子需求 03。
- 当前证据：已完成当前页面审计、三方案比较、低保真信息原型和研发灯塔任务走查。
- 已确认目标方案：采用“交付组合看板主骨架 + 个人行动区 + 运维异常上浮”；Agent/Task/成本不作为首屏第一信息层，业务成员通过同一 Dashboard 的“我的/团队”视角，在不阅读 Transcript 的情况下判断进度、风险、待办、成果和推进证据。
- 证据：`doc/research/2026-07-23-page-ia-and-department-dashboard.md`。
- 状态：已验证。

### VAL-015：改进候选的最小可用闭环

- 问题：首版需要做到何种程度，才能证明平台在持续改善 SOP/Skill，而不只是展示指标？
- 方法：选择一种高频失败模式，冻结 Base/Evaluator/Cases/环境和单一修改边界，由 Researcher Agent 在有界 Campaign 中连续产生最多若干隔离 Candidate Revision，完成回放、隐藏验证、有限试运行、比较、人工晋升和回滚演练。
- 必需证据：Kernel 而非 Prompt 持有循环与预算；Candidate 不能修改 Evaluator、扩大权限或污染生产 Head；多个候选和失败实验事实均可追溯；对比支持 Hard Gate、多目标与 `inconclusive`；发布需人工批准且生产运行不漂移。
- 阻塞：子需求 08、10。
- 当前证据：现有 Skill Test 已固定 Input Snapshot、Skill Version、Agent Config 和 Test Template。TV-08 阶段一机械原型已证明 Kernel 冻结 Campaign、拒绝错误维度和 Evaluator/权限/环境修改、执行 Candidate/Validation 预算硬停、从序列化状态恢复、维护不可变 Effect Report Revision，并只允许 Human 对精确已验证 Digest 产生未来版本提案。
- 已确认目标方向：采用“受控自治 Improvement Campaign、人工生产晋升”，分离 Delivery Loop 与 Improvement Loop；首期一次只优化单个 Stage Instruction 或单个 Department Skill 内容版本，Enterprise Skill 不可被部门 Campaign 修改；Campaign 固定完整 Base Execution Variant。Stage Instruction 接受后创建新 SOP Release；Department Skill 接受后只创建新 Skill Version，仍需 Agent 测试、Binding 同步、Validation Run 和新 SOP Release 才能采用。首个原型验证“缺失测试证据导致 Verifier 反复退回”的 Stage Instruction 改进。
- 尚缺证据：真实 L1 Signal、Researcher Agent 连续候选、真实 Candidate Workspace、Replay/Curated/Hidden Suite、Shadow/Limited Trial、生产版本服务人工晋升和未来 Binding 回滚的端到端验证。
- 证据：`doc/research/2026-07-23-improvement-candidate-minimum-loop.md`、`doc/research/2026-07-25-karpathy-autoresearch-two-layer-loop.md`、`doc/research/2026-07-25-self-improving-agent-loop-landscape.md`、`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/18-improvement-campaign-validation-report.md`。
- 状态：机械 Campaign 阶段已验证；完整 TV-08 仍为 `inconclusive`。

### VAL-016：文件资源库的引用完整性与存储隔离

- 问题：Resource File/Folder、Content Blob、SOP Binding、Run Snapshot 和回收站能否在替换、移动、删除、恢复、并发操作与垃圾回收中保持引用完整，并保证共享 Blob 不传播内容修改？
- 方法：实现最小数据模型和存储服务原型，执行并发替换、Copy-on-Write、Binding 保护、Folder 后代检查、回收站恢复和引用归零回收测试。
- 必需证据：稳定资源 ID 不随内容替换变化；已启动 Run 固定旧快照；共享 Blob 的文件互不联动；受 Binding 保护的资源不可移动或删除；物理内容只在全部受保留引用消失后回收。
- 阻塞：子需求 03、04、07、10，以及文件资源库生产实现。
- 当前证据：现有 Storage/Asset、Attachment、Work Product、Workspace File Browser 和 Document Revision 均不能直接满足部门共享资源库模型；现有 Asset 记录 SHA-256 但不去重，每次上传生成新 Object Key。TV-06 的孤立领域契约原型已连续两轮验证稳定 Resource ID、不可变 Blob、Copy-on-Write、Binding/Trash/GC 与 Run Snapshot，但尚未接入生产 Schema、对象存储事务、Route/API 或 Resources UI。
- 证据：EVD-026、EVD-027、EVD-039；`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/16-resource-authority-validation-report.md`；子需求 03、04 的 Resource Binding 契约。
- 状态：孤立领域契约原型已验证；生产集成与并发/恢复验证未完成。

### VAL-017：Run 人员解析、派生 Artifact 权限与失效改派

- 问题：Run Owner 和 Human Gate Assignee 的动态 Selector、Run 启动前固定、Artifact 派生访问、人员资格失效、暂停与显式改派能否在并发和恢复场景下保持一致？
- 方法：建立最小授权状态原型，覆盖人工/API/Webhook/定时触发、固定人员和动态 Selector、Membership 撤销、重复失效事件、改派与旧请求回执。
- 必需证据：必需人员无法解析时 Run 不启动；人员失效只产生一个未决改派 Attention 并阻止新执行；旧 Authority Revision 不能继续行使 Run 派生的 Artifact 管理权或裁决 Gate，Actor 只能保留仍由 Project Membership 独立授予的基础查看权；改派后历史 Actor 不被改写；Run Owner 和 Gate Assignee 的 Artifact 权限与 Gate 决策权限严格分离。
- 阻塞：子需求 02、04、07、10。
- 当前证据：Paperclip 已有 `assigneeUserId`、`responsibleUserId` 和 Company Membership 接缝，但没有统一的生产 SOP Run Owner、Gate Selector、派生 Artifact 权限和人员失效协议。TV-06 的孤立领域契约原型已连续两轮验证四类 Trigger、启动前人员解析、唯一改派 Attention、Authority Revision fencing、Project 基础查看回退、Artifact 管理与 Gate 裁决分离，但尚未接入生产 Membership、Run、Artifact、Human Decision 和持久事务链。
- 证据：EVD-028、EVD-039；`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/16-resource-authority-validation-report.md`；子需求 02、04、05 的人员责任与恢复契约。
- 状态：孤立领域契约原型已验证；生产集成与并发/恢复验证未完成。

### VAL-018：独立 Worker、Sandbox 与 Workspace 执行面

- 问题：首期单节点 Docker 下，独立 Worker 能否并发管理多个隔离 Sandbox，并在容量、部门公平、Worker 重启、失联接管和 Workspace 持久恢复时保持命令与数据一致性？
- 方法：实现最小 Worker Control API 和 Docker Sandbox 原型，执行 Command Claim/Lease/Fencing、固定槽位、部门公平队列、Session Epoch、资源限制、目录挂载隔离、容器重建和故障恢复测试。
- 必需证据：Server 不运行 Agent 且不挂载 Workspace；一个 Worker 可并发运行多个相互隔离的 Run；容量不超卖且等待释放 Slot；其他部门不被饿死；旧 Worker Session 和旧 Fencing Token 不能提交权威结果；Sandbox/Worker 重建不丢失 Workspace，也不能越权读取其他 Run 目录。
- 阻塞：子需求 05、07、09、10，以及 SOP Runtime 生产实现。
- 当前证据：TV-04 已用不同 Control Server/Worker 容器、出站 Control API、scratch PostgreSQL、真实 Docker Engine 和兄弟 Sandbox 完成固定双 Slot、Company 公平队列、Session Epoch、Command Fence、容器/cgroup/目录/凭证隔离、Worker 替换与 Workspace 恢复矩阵。当前 Paperclip 的 Heartbeat、Plugin Worker、Sandbox Provider 和 Workspace Runtime 可作为生产接缝来源，但均不能直接冒充 Agent Execution Worker。
- 证据：EVD-025、EVD-033；历史可丢弃原型（源码未纳入基线）；子需求 05 第 13、14 节。
- 状态：已验证；生产 Worker Schema/API/Compose 与 TV-05 端到端接入尚未实现。

### VAL-019：知识到 SOP 草稿的端到端 tracer bullet

- 问题：Resource Revision 能否经过可恢复知识处理，形成带精确引用的 SOP Candidate，并在不绕过 Studio 门禁的前提下进入 Diff、Validation Run 与人工发布链？
- 方法：实现最小纵切 `Resource Revision → Knowledge Processing Job → Derived Index Revision → Citation → SOP Draft Candidate → Studio Diff → Validation Run`，使用 Markdown、PDF、docx 固定样本和一组含冲突/缺失步骤的反例。
- 必需证据：索引可从原 Revision 重建；Citation 可定位到固定来源；取消、失败和重试不产生重复 Candidate；Candidate 不能创建 Release 或扩大能力；局部 Patch 只修改允许路径；来源变化使旧 Candidate/Validation 失效；Validation Run 仍执行既有机械门禁。
- 阻塞：子需求 04、06、13，以及知识处理生产实现。
- 验证合同：`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/27-knowledge-to-sop-tracer-bullet-validation-plan.md`。
- 状态：`planned / inconclusive / No-Go`；尚无运行原型证据。

### VAL-020：IM 请求进入控制面的端到端 tracer bullet

- 问题：企业 IM 私聊能否在身份、幂等、权限和审计成立的前提下创建唯一 Run Request，并可靠回执且不把自由文本升级为 Human Gate Decision？
- 方法：实现最小纵切 `IM Inbound → Signature/Identity/Dedup → Run Request → Delivery Outbox → Web Gate Deep Link`，注入重复、乱序、进程退出、出站超时、身份撤销和伪造审批文本。
- 必需证据：同一 Provider Event 只产生一个 Intake 结果；未知或失效身份不能创建 Run；Outbox 可恢复且不盲目重复发送；IM 文本不能批准 Gate、修改预算或读取 Secret；高风险动作进入已认证 Web 页面并重新鉴权；全链路保持 Company Scope 与审计。
- 阻塞：子需求 02、04、07、14，以及 Channel Gateway 生产实现。
- 验证合同：`docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/28-channel-intake-tracer-bullet-validation-plan.md`。
- 状态：`planned / inconclusive / No-Go`；尚无运行原型证据。

## 6. 规格沉淀与验证前沿

产品方向已经完成阶段性确认。后续不再把“用户确认”和“技术验证”混成一个阻塞状态：已确认的目标架构可以写入正式子需求，但必须同时保留尚缺证据和不得提前实现的边界。

| 阶段 | 验证项 | 当前所需动作 | 主要影响对象 |
| --- | --- | --- | --- |
| Gate A / TV-01 | VAL-004、VAL-012 | 已通过：确定性 Connector/生产接缝与隔离真实 GitHub PR、Merge、Workflow Artifact、Deploy、Signed Webhook、响应丢失恢复和精确清理 | 子需求 06、07、10 |
| Gate A / TV-02 | VAL-001、VAL-007 | 已通过：SOP Release、Execution Definition Revision、Binding、并发发布、漂移、历史恢复与 Run Pin 数据约束 | 子需求 04、05、10 |
| Gate A / TV-03 | VAL-006 | 已通过：Agent 能力继承、稳定 ID Allowlist、短期凭证、授权撤销与 Worker 身份隔离矩阵 | 子需求 05、06、10 |
| Gate A / TV-04 | VAL-018 | 已通过：独立 Worker、并发 Sandbox、容量与公平调度、Session/Fencing、Workspace 隔离恢复与精确清理 | 子需求 05、07、09、10 |
| Gate A / TV-05 | VAL-002、VAL-003、VAL-005 残余项 | 已通过：Heartbeat/Worker/Kernel 生产接缝、真实 Docker Receipt、P8/P9/P10 组合与真实模型 Fresh-context 消融 | 子需求 05、07、10 |
| Gate B / TV-06 | VAL-016、VAL-017 | 孤立领域契约原型已通过；仍须在生产纵切验证资源引用完整性、Copy-on-Write、Run 人员解析、派生权限和失效改派 | 子需求 02、03、04、07、10 |
| Gate B / TV-07 | VAL-010 | 孤立投影原型已通过；仍须在生产纵切验证 Attention Signal、Incident 聚合、动作路由和投影重建 | 子需求 07 |
| Gate B / TV-09 | VAL-013 | 孤立治理投影原型已通过；仍须在企业治理纵切验证 Governance DTO、Disclosure Manifest、字段白名单与泄露测试 | 子需求 09 |
| Gate C / TV-08 | VAL-011、VAL-015 | 使用真实 L1 事实验证效果归因数据模型和证据驱动 Improvement Campaign | 子需求 08、10 |
| Gate B / TV-10 | VAL-019 | 计划：验证知识处理、引用、SOP Candidate、Studio Diff 与 Validation Run 的最小生产纵切 | 子需求 04、06、13 |
| Gate B / TV-11 | VAL-020 | 计划：验证 IM 身份、入站幂等、Run Request、Outbox 与 Web Gate 深链的最小生产纵切 | 子需求 02、04、07、14 |

TV-01～TV-09 与 Gate A/B 的验证依赖、统一证据契约、停止规则和 Go/No-Go 门槛已经由对应验证报告收口。历史 Program 与执行级计划未纳入正式开发基线，后续不得依赖已删除的命令恢复原型；需要复验时应从正式 Ticket 的生产验收条件重新建立可运行计划。

以下内容已经解锁，不再列为产品确认阻碍：

- VAL-008、VAL-009 已写入子需求 02；
- VAL-014 已写入子需求 03；
- VAL-002、VAL-003、VAL-005 的已验证状态语义已写入子需求 05；
- Stage Execution Kernel 的生产接入缺口与真实模型消融继续作为实现前验证，不反向否定已确认架构。

## 7. 验证规则

1. 代码存在不等于产品能力成立，必须验证端到端状态和权限。
2. 单元测试不替代跨模块恢复、外部副作用和多角色授权验证。
3. LLM 输出不能作为自身正确性的唯一证据。
4. 需要用户体验判断的问题使用可丢弃原型，不通过长篇文字猜测。
5. 外部技术结论优先引用一手资料。
6. 每项验证必须记录输入、环境、观察结果、失败模式和结论适用范围。
7. 验证失败时记录被否证假设并提出 Reopen Proposal，不以扩大实现复杂度强行保留原方案；只有用户重新确认后才修改 DEC 或子需求正文。
