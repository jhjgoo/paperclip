# 子需求 03：页面信息架构、企业控制台与部门驾驶舱

状态：已确认信息骨架，视觉与详细交互待后续原型\
依赖：子需求 01、子需求 02\
关联决策：DEC-009 至 DEC-014、DEC-021、DEC-034、DEC-035、DEC-043、DEC-058 至 DEC-064、DEC-069 至 DEC-071、DEC-091 至 DEC-115、DEC-126\
关联验证：VAL-008、VAL-014 已验证；VAL-013、VAL-016 孤立原型已验证、生产集成未验证；VAL-019、VAL-020 计划中

## 1. 目的

本子需求定义公共产品 Shell、企业控制台、部门工作空间和部门 Dashboard 的信息架构。目标是让一线业务团队首先看到交付结果、风险和待处理事项，同时让企业管理员在不读取部门业务内容的前提下治理平台基础设施。

本文件固定信息层级、作用域和导航责任，不固定视觉样式、组件布局或最终路由名称。

本文件只拥有页面层级、导航入口、信息优先级和读模型组合。Agent、Connector、Connection 与 Skill 的写模型和生命周期以子需求 06 为准；Run/Stage 控制状态以子需求 05 为准；企业 Governance DTO、披露边界和治理动作以子需求 09 为准。下文为保证页面可用而重复的跨模块摘要不得反向覆盖这些主责契约。

## 2. 信息架构原则

### IA-001

业务成员的第一层信息必须是业务目标、SOP Run、当前 Stage、风险、下一动作、成果和推进证据，不得以 Agent 数量、Heartbeat、Task 数量或 Transcript 作为首屏主叙事。

### IA-002

企业控制台和部门工作空间必须共享同一个产品 Shell，但使用独立 Scope、导航树、查询缓存和实时订阅。

### IA-003

同一部门 Dashboard 使用“我的 / 团队”视角过滤适配不同角色，不为业务成员、负责人和能力管理员复制多套首页。

### IA-004

Task 继续作为一次性单责任工作的业务入口；底层 Issue、Routine、Pipeline、Heartbeat 和 Agent Run 继续保留，但应进入 SOP Run、SOP Studio 或高级运维上下文，不能与业务入口平铺竞争。SOP Stage 和 Invocation 不得作为普通 Task 出现在 Task 列表中。

Task 是唯一对外产品术语。现有 `Issue` 仅作为数据库、共享类型、服务和 API 的内部兼容名称；页面、帮助文档、Copilot 和业务契约不得把 Issue 描述成 Task 之外的另一种工作对象。首期不因此重命名全部内部实现。

SOP Run、Stage 和 Invocation 不创建隐藏 Issue。评论、附件、文档修订、活动流、Heartbeat/Adapter、Transcript 与 Cost 等成熟能力应深化为可同时服务 Task 与 SOP 的共享模块；Issue Status、父子/阻塞关系、单 Assignee 和 Work Product 不得成为 SOP 状态、Stage Graph、Finding/Gate、人员职责或 Artifact 的第二事实源。

### IA-005

原始 Transcript 和 Tool Call 属于调查证据。默认页面必须先提供人类可读的状态、工件和决策摘要，再按需逐层展开运行细节。

## 3. 公共产品 Shell

### SHELL-001

公共 Shell 只承载跨 Scope 能力：

```text
Scope Switcher
Scope Search
Personal Attention / Notifications
Account
```

### SHELL-002

Scope Switcher 必须遵守子需求 02 的 Workspace Scope 契约：

- Enterprise Scope 只对 Instance Admin 展示；
- Company Scope 只展示 Active Membership 或 Active Break-glass Company；
- URL 是当前标签页 Scope 的 Source of Truth；
- 切换 Scope 不得把企业权限静默带入部门空间。

### SHELL-003

跨 Scope 搜索必须按当前授权上下文查询。Enterprise Scope 不得返回 SOP 名称、业务目标、Artifact 内容、Prompt、Transcript 或其他部门业务内容。

## 4. 部门工作空间

### DEPT-001：目标导航

```text
工作台
├── 我的待办
├── Active Runs
├── Input Requests
└── Human Gates

交付
├── Projects
├── Tasks
├── SOP Runs
└── Artifacts（进入 Project 范围）

构建
├── SOP Studio
├── Agent Studio
├── Knowledge
├── Skills
└── Connections / Apps

触达
├── Channels
├── Triggers
└── Schedules

部门设置
```

「我的待办」可以先作为工作台行动区存在，待 Attention 使用频率和信息密度证明需要后再拆成独立页面。

以上分区是 Company Scope 内的导航投影，不新增持久化 Scope、部门层级或权限模型。「工作台」组合现有 Attention、Run、Input Request 和 Human Gate 读模型；「构建」和「触达」的写模型分别由子需求 04、06、13、14 拥有。

### DEPT-002

“发起一次交付”必须是部门首页的主要动作。它创建或进入 SOP Run，不应要求普通业务成员先理解 Pipeline、Routine、Issue 或 Agent 配置。

SOP Studio 管理部门级 SOP Definition。SOP Definition 不绑定单个 Project，可以被同部门的多个 Project 复用；每次创建 SOP Run 时必须通过 `in [Project]` 选择并固定一个 Project，未指定 Project 时不得启动 Run。

### DEPT-003

能力配置页面服务部门负责人和团队能力管理员。普通业务成员可以查看与当前 Run 相关的责任 Agent 和能力摘要，但不默认暴露 Secret、完整 Adapter 配置或无关工具清单。

部门使用的 Model Deployment、Connector/MCP 与 Adapter 只允许从 Enterprise Catalog 已批准且对本部门可用的条目中选择。用户操作顺序为“添加到部门 → 按需配置 Connection → 健康测试 → 绑定到 Agent”；Connector/MCP 仅在其 Definition 要求时显示 Connection。Skill 是例外：部门既可以使用企业 Skill 仓库明确向其开放的 Skill，也可以在本部门创建、维护和测试私有 Skill。Project Env 只是 Project Configuration 中的变量与 Secret 引用编辑区，不属于企业能力目录或 Agent Binding。界面使用“企业可用、部门已配置、Agent 已绑定”状态，不暴露 Installation、Grant 或 Entitlement 作为独立业务入口。

Agent Detail 是能力组装的唯一主要入口：部门管理员维护角色说明、Adapter、Model Deployment、Skill、Connector/MCP、Connection/Tool 与测试结果。Agent 不绑定执行 Environment；执行真实测试时显式选择一个 Project 或测试运行上下文，选中 Project 时继承其 Project Env。SOP Studio 和 Run Composer 不复制这些配置；Stage 绑定已有 Agent，并只在高级设置中按稳定能力 ID 进一步收窄。

Agent Detail 添加 Connection 时必须先选具体 Connection ID/Alias，再从实时 Tool Catalog 中显式勾选稳定 Tool ID；选择 Connection 不自动勾选全部 Tool。“全选”是可见的批量动作，保存后固化到 Agent Configuration Snapshot；Connector 更新新增的 Tool 保持未选择，删除、停用或超出 Credential Scope 的 Tool 将 Binding 标记为需处理。Tool Profile 可以预填一组选择，但用户仍能看到最终 Tool 清单，且不把 Profile 变成新增权限层。

Platform Extension 如果贡献不需要外部业务系统身份的独立 Agent Tool，企业向部门开放后只在 Agent Detail 的“平台工具”分组中展示具体 Tool，不展示或绑定 Extension Package。部门管理员按来源限定的 Namespaced Tool ID 显式选择；需要外部账号、租户或账套身份的 Tool 不得走该捷径，必须归入 Connector/Connection。两类 Tool 复用同一 Agent Tool Binding、Stage Allowlist 和审计链，界面不新增 Plugin Grant/Entitlement 配置中心。

`Connections / Apps` 以外部业务系统为中心展示 Connector。部门为 Connector 配置一次 Connection 后，其 Agent-facing MCP Tool 与 Platform-facing Event/Webhook/Sync/External Object 共享同一外部身份，不得要求用户分别安装或授权两套能力。独立通用 MCP Server 可以在同一入口作为 Tool Provider 展示，但必须明确标识为“仅工具”，不伪装成具备平台同步面的 Connector。

同一部门可以为同一 Connector 或独立 MCP Server 创建多个命名 Connection。列表以 Connector、Connection Name/Alias、Provider Tenant/Organization、Endpoint、Tool Health、Sync Health、绑定 Agent 数和状态为主要信息；创建、编辑、重连、健康测试与停用都在部门 `Connections / Apps` 中完成。Agent Studio 只选择已有且健康的具体 Connection ID，不在 Agent 表单中复制 Connection 配置。多个同类 Connection 被同一 Agent 使用时必须显示并校验稳定 Alias；产品不提供隐式部门默认 Connection。

Connection Detail 分为基础连接、Agent Tools 和 Platform Integration 三个信息区。基础连接维护 Endpoint、Credential Reference 与 Provider Tenant；Agent Tools 展示 Tool Catalog、Tool Health 与 Agent Binding；Platform Integration 只显示 Connector Definition 声明支持的 Event、Webhook、Sync 和 External Object，并由部门分别填写必要参数和显式启用。创建 Connection 不自动打开全部平台能力，Tool Selection 与 Platform Integration 互不改变；入站事件和 External Object 通过 Connection ID、Provider Tenant 和 External Identity 精确归属。

Connection Identity 必须稳定。Display Name 可编辑；Credential 轮换和同一 Provider Tenant 下的 Endpoint 修复可以保留 Connection ID，Endpoint 或结构化配置变化在重新测试通过后生成新的 Connection Configuration Revision；Provider Tenant、Organization、Site 或账套变化时引导创建新 Connection。稳定 Alias 已被 Agent 使用时，修改前必须展示影响并要求处理冲突，不能静默改变工具或 External Object 命名空间。

Connection Detail 提供可恢复的 `Disable`，不在停用时删除 Agent Binding 或改写 SOP Release。停用后阻止新 Tool 调用和 Platform Integration 动作，依赖它的活跃 Stage 显示结构化 Blocked/Attention；重连并测试成功后允许恢复。Delete 只对无当前 Agent Binding、无已发布 SOP Release 引用的 Connection 开放；历史 Run 保留 Identity Snapshot 和调用审计但不永久锁定，删除也不级联 Connector、Extension 或共享 Credential。

Connections / Apps 默认使用 5 步向导：选择应用、填写连接、测试连接、发现 Tool/Event/Webhook、选择能力并完成。Profile、Gateway、Policy、Grant 和 Runtime Slot 只在高级设置出现。Probe 的结果必须展示目标、Schema、风险、副作用和证据状态；未通过 Worker/Sandbox Probe 的草稿不能显示为健康 Connection。

Knowledge 页面只展示 Resource Revision 的处理状态、派生索引、Citation、检索预览和 Capability Draft Review Queue。它不复制 Resources 文件树，也不提供直接发布按钮。Channels 页面只管理渠道连接、外部身份绑定、入站健康、失败投递和深链；普通用户仍从工作台查看由渠道创建的 Run 或待办，不进入第二套会话列表。

### DEPT-004：文件资源库重名交互

Resources 是部门唯一文件资源库的内容入口，不创建个人或 Project 独立存储根。上传文件时按目标 Folder 与 File Name 判断冲突：

- 目标 Folder 没有同名文件时直接保存；
- 其他 Folder 中的同名文件不构成冲突；
- 目标 Folder 已有同名文件时提示“替换”或“同时保留”；
- “同时保留”自动在扩展名前追加下一个可用数字后缀，例如 `fileA(1).pdf`；
- “替换”保留 Resource File ID，只改变其当前承载的内容；不生成新的逻辑文件，也不把 SHA-256、Blob 或引用计数暴露给用户。

产品层只呈现 Folder、Resource File 和引用关系。内容寻址、重复内容复用、引用计数与垃圾回收属于独立存储实现；即使两个 Resource File 复用同一底层内容，移动、重命名、授权和引用仍按各自的 Resource File 处理。

底层重复内容复用必须对产品行为透明。Blob 永不可原地修改；替换或编辑一个 Resource File 时采用 Copy-on-Write，只更新该 Resource File 的内容引用，其他引用相同 Blob 的文件保持原内容不变。引用计数只用于判断无人引用的 Blob 是否可回收。

资源列表和详情必须清晰展示“正在被 SOP 使用”的状态，并可进入引用清单查看使用它的 SOP。只要存在有效 SOP Binding：

- 禁止删除、移动或重命名被绑定的 Resource File/Folder，并引导用户先解除引用；
- 允许在明确提示“影响后续 Run、不影响已启动 Run”后替换 Resource File 内容；Resource File ID 与已有 SOP Binding 均保持不变，无需提示用户同步更新绑定；
- Folder Binding 保护 Folder 自身，但不禁止向其中添加、移出或删除普通子项，否则无法承载动态待处理目录；某个子项被 SOP 单独绑定时，再对该子项应用相同保护。

历史 Run 对内容快照的保留不应伪装成当前 SOP 使用状态，也不应永久锁住逻辑文件；其内容留存由独立保留策略处理。

首期资源权限保持简单：部门成员可以浏览、下载、上传并管理自己的未绑定资源；部门管理员或资源管理员可以管理全部资源；Agent 只能通过 SOP Binding 或 Run 授权访问。Resources 页面不提供 Folder ACL 或逐文件分享配置。

### DEPT-005：Project 工作上下文

Project 是 SOP Run 的必需业务上下文，也是持续业务目标下 Task、工作空间和工作资产的组织入口。目标 Project 详情至少预留以下分栏：

```text
Overview
Tasks
SOP Runs
Artifacts
Workspaces
Configuration
Budget
```

独立 Task 可以不指定 Project；没有 Project 的 Task 不得隐式继承任意 Project 的 Codebase、Project Env、Project Workspace 或工作资产。

Project `Artifacts` 是该 Project 的统一成果清单，而不是第三种成果实体：

- Task 产生的成果保持为 Task Work Product；
- SOP Run 产生的成果保持为 SOP Artifact；
- 二者在 Project 清单中保留来源类型，并可深链回原 Task、SOP Run、Stage 或 Invocation；
- 无 Project 的 standalone Task Work Product 只在 Task Detail 展示；
- 输入附件、参考资料、任意 Workspace 文件和普通过程文档不会因为位于 Project 中而自动成为成果。

部门导航不再提供独立全局 Artifacts 入口，也不把不同 Project 的成果混合为无边界的部门级浏览页。

文件 Artifact 可以来源于 Execution Workspace，但登记时必须固化来源 Checkpoint、内容哈希和不可变内容快照，不能只保存 Workspace 路径。Workspace 后续修改、回收或重建不得改变已登记 Artifact。Artifact 与 Resource File 保持不同的产品身份和生命周期；用户执行“发布到资源库”时创建新的 Resource File ID 与 Folder/File Name，底层允许复用同一不可变 Content Blob，不要求复制第二份物理内容。

Project A 的 Run、Agent 凭证和普通成果查询不得读取 Project B 的 Artifact 或 Workspace。同一 SOP Run 内的 Stage 通过稳定 Output Slot 引用上游动态 Artifact，由 Kernel 在运行时解析本次实例；SOP Definition 不绑定未来的具体 Artifact ID。需要跨 Run 或跨 Project 复用的成果必须先经人工检查并发布到部门资源库，再由 SOP Resource Binding 引用稳定 Resource File/Folder ID。

Project Workspace 保存 Project 持久的零到多个工作根、代码库和可选 Workspace Runtime Service 状态，只作为隔离运行现场的派生基线，不作为 Task 或 SOP Run 默认直接写入的共享目录。Workspace Runtime Service 是与工作目录绑定的开发服务器、测试服务或健康检查目标等本地辅助进程，不选择镜像、Worker、Sandbox Provider 或执行集群，也不形成 Project Environment。研发 Project 通常包含一个或多个代码库 Workspace；不依赖文件系统的业务 Project 可以没有 Project Workspace。Project Env 属于 Project 配置而不是 Workspace 或容器定义。

MVP 必须让部门管理员在 Project 中配置并验证这条基线，而不是依靠运维预先创建宿主机目录。首期 Workspace Root 只需支持单节点 Docker 下的本地持久 Git Provider，配置 Repo、默认 Ref/Branch 与凭证引用；SOP 发布与 Run 启动前执行 Workspace 与 Project Env Preflight。远程开发环境、云 IDE、跨 Worker 迁移、共享存储和 Kubernetes 调度不进入首期产品面。

有 Project 的 Agent Task 和每个 SOP Run 使用从 Project 基线派生的独立 Execution Workspace；同一 SOP Run 默认跨 Stage 复用一个主 Execution Workspace。Project 没有文件基线时，Run 可以创建空白 Root；SOP Release 或 Stage 声明需要 Codebase、Project Env Key 或 Workspace Runtime Service 时，Validation Run 与启动 Preflight 必须验证目标 Project 提供对应能力或有效绑定。

无 Project 的 standalone Task 只有在需要文件操作时才创建 Temporary Execution Workspace；纯文本或 Human-only Task 不强制创建。该 Workspace 不继承任何 Project 的 Codebase、Project Env、Workspace Runtime Service 或工作资产，完成后按较短 TTL 清理。需要稳定项目变量、代码基线或长期上下文时必须先选择或创建 Project。Temporary Execution Workspace 是 standalone Task 的主工作现场；Scratch Execution Workspace 则从已有主 Workspace 的固定 Checkpoint 派生，用于隔离试验，二者不得混称。

### DEPT-006：SOP 运行入口、Run Cockpit 与 Stage Detail

SOP Run 使用一套列表与详情能力，并从三种业务上下文进入：

```text
Dashboard Active Runs ─┐
Department SOP Runs ───┼──→ SOP Run Cockpit ──→ Stage Detail
Project / SOP Runs ────┘
```

Dashboard 只展示需要关注的 Active Run 摘要与行动入口；部门一级 `SOP Runs` 提供跨 Project 完整列表；Project `SOP Runs` 分栏复用同一列表并固定 Project Filter。列表以 Goal、Project、SOP、当前 Stage、Run 状态、Run Owner、Attention、SLA/更新时间为主要信息，不以 Agent 数量、Heartbeat 或 Transcript 作为业务主列。

SOP Run Cockpit 只驾驶一个具体 Run，集中回答当前目标、进度、停止原因、待处理动作、成果证据和允许操作。Stage Map 是 Run 内的过程导航；点击 Stage 进入可深链的 Stage Detail，并保留返回 Run Cockpit 和切换相邻 Stage 的上下文。

Stage Detail 借鉴 Task Detail 的双栏体验但不复用 Task 实体：桌面端左侧呈现 Agent 对外思考摘要、消息、工具调用、命令、文件变更、执行步骤与人工往来的可审计过程链；右侧信息看板承载 Stage Contract、状态、责任 Agent、Iteration、Input/Output、Artifact/Evidence/Finding、Acceptance/Human Gate、时间预算和 Workspace 摘要。结构化业务事件不能挤占左侧过程链的主叙事；原始 Provider Transcript 仍需与平台生成的审计事件明确区分。

左侧 Stage Execution Thread 使用单一时间顺序，Iteration、Producer/Verifier Invocation 和 Stage Epoch 作为带明确身份的分组，不拆成 Tab 或独立页面。Invocation 分组至少展示 Role、Agent、模型、Iteration/Epoch、开始结束时间、状态、成本、Fresh/Resume 与重试摘要。Agent 消息、Thinking Summary/Plan、关键 Tool Call、Command 和 Diff 默认展开；stdout、stderr、系统噪声和 Raw Transcript 默认折叠但保持可审计。Finding、Evidence、Gate 等完整对象只在右侧看板展开，左侧以轻量事件标记和深链保留因果顺序。

SOP 运行页面不得把执行状态、健康度和业务结果压缩成一个 Badge：

- Control State 是 Kernel 持久化的唯一执行控制状态，并展示结构化等待、暂停、阻塞或失败原因；
- Health/Attention 从 SLA、风险、异常和当前用户责任派生，只回答是否需要关注，不驱动状态转换；
- Business Outcome 来自 SOP Outcome Contract，`completed` 只表示执行闭环，不表示业务成功。

Run Header 同时展示 Control State、Health/Attention、Business Outcome、Project、SOP Release、Current Stage、Run Owner 与 SLA。Stage Map 展示各节点的 Control State、Iteration、Acceptance、未解决 Finding 和 Gate/Attention；首期不以完成节点数生成百分比。Invocation 只展示 queued/running/succeeded/failed/cancelled、Provider Attempt 和 Retry 等技术状态，不承担 Stage 或业务 Outcome。

SOP Run 首期不提供逐 Run 自定义成员 ACL。Project 授权成员获得该 Project Run 与 Artifact 的基础查看权和协作权，但不因此获得 Artifact 标注/Review、运行控制或 Gate 决策权；Run Creator 只作为创建事实，除非同时具有其他角色，不获得永久控制权；Run Owner 负责监控、协调和运行生命周期控制，并获得本 Run 全部 Artifact 的查看管理权，但不能裁决未分配给自己的 Human Gate；Gate Assignee 只裁决自己的 Gate，也获得本 Run 全部 Artifact 的查看管理权。Run 派生权与 Project 基础权取并集，角色失效只撤销派生部分。SOP Owner 与 Department Admin 只负责人员失效、显式改派和应急运行控制，不得绕过职责分离直接代批。Agent 使用 Run-scoped Token，Enterprise Admin 只能读取内容盲治理摘要。发布 Artifact 到资源库仍需独立资源发布权限。

Cockpit 运行控制动作不得在 Run、Stage 和 Invocation 三层重复提供：Pause、Resume 与 Cancel 只在 Run 级出现；Pause 创建持久 Hold 并请求活跃 Invocation 在安全点停止，Resume 必须重校验后继续，Cancel 是不可恢复终态。Stage Detail 可以在符合权限与安全条件时提供 Retry Stage，它创建新的 Epoch、Iteration 与 Invocation，并保留旧过程和产物；不能重播最后一次 Provider 请求。Recovery Action 只在具体故障出现时展示系统允许的有限动作。首期不提供普通 Stage Pause、Cancel 或 Skip，业务可跳过路径由 SOP Definition 明确声明。

Stage Detail 的左侧输入区不能用一个无语义的聊天框同时承担协作与运行控制。首期采用双语义输入：默认发送“协作消息”，用于讨论、备注和追问，不改变 Stage Contract、Agent Context 或 Control State；用户显式切换到“补充输入”或从未决 Input Request 进入“回复请求”后，提交内容才成为带 Actor、时间、Schema 与版本的运行输入。普通消息不得通过自然语言猜测被升级为补充输入、契约修改或续跑命令。

未决 Input Request 在右侧信息看板显示所需字段/文件、请求原因、可回复角色、期限和当前 Stage Epoch；它不再创建一套独立 Assignee。某个 Run 的有效 Run Creator 与 Run Owner 可以回复该 Run 下任意 Stage，但该资格绝不跨越 Run 边界；Human Gate Assignee 只能在同一 Run 中自己被授权的 Stage 查看相应请求并操作或回复。提交后生成不可变 Input Response，并在左侧过程链追加轻量事件标记和深链。自动 Trigger 的服务身份只作为创建来源，不获得人工回复能力。用户主动补充输入时，界面必须先预告输入变化可能造成的 Output/Evidence/Finding/Gate 失效、Stage Retry 或下游重算，实际影响由 Kernel 根据依赖关系机械裁决，不能由聊天界面直接修改状态。

Human Gate 同样留在右侧结构化 Decision Card 中，固定其 Stage Epoch、Evidence/Finding、待批准动作与权限快照，只允许当前 Gate Assignee 提交契约允许的决定。决定结果在左侧只作为可审计因果标记出现，完整证据与操作仍从右侧卡片查看；自由聊天不能替代 Gate Decision。

“回复 Input Request”和“作出 Human Gate Decision”必须是两个明确动作：前者提供事实、参数或文件，后者承担批准、拒绝或要求返工等业务责任。Run Creator 或 Run Owner 可以补充自己负责 Run 下任何 Stage 的输入，但除非同时是该 Gate Assignee，不能借此提交或改变 Gate Decision；该角色不会传播到其他 Run，Gate Assignee 也不会因为能回复自己 Stage 的请求而获得同一 Run 其他 Stage 的权限。

Resources 提供部门回收站。删除未绑定 Resource File/Folder 时先移入回收站，在统一保留期内允许恢复；到期后永久删除逻辑资源。被 SOP Binding 保护的资源不能进入回收站；删除 Folder 时只要任一后代受保护，就阻止整个操作并展示引用来源。恢复到已出现同名资源的位置时复用既有同目录重名处理，不引入另一套命名规则。

回收站管理逻辑资源生命周期，不等于物理 Blob 列表。Blob 只有在不存在 Resource File、Run、Artifact 或其他受保留引用后才可回收；已启动 Run 的固定快照不因资源被删除而失效。

首期 Folder/File 操作只覆盖创建 Folder、任意层级嵌套、上传、重命名、移动、删除到回收站和恢复。移动或重命名 Folder 时，只要自身或任一后代存在 SOP Binding 就阻止操作并展示引用来源。快捷方式、软链接、挂载点、标签体系和其他网盘增强能力不进入首期。

## 5. 部门 Dashboard

### DASH-001：信息骨架

部门 Dashboard 采用“交付组合看板主骨架 + 个人行动区 + 运维异常上浮”：

```text
结果摘要
→ 进行中的 SOP Run
→ 需要我处理
→ 最近交付与工件
→ 质量、周期、返工和成本趋势
→ 运行异常（仅异常时上浮）
```

### DASH-002：信息优先级

| 优先级 | 信息 |
| --- | --- |
| P0 | 需要当前用户立即处理的 Attention |
| P0 | Active SOP Run 的目标、Stage、健康、SLA、风险和下一动作 |
| P1 | 最近完成的 Outcome、Artifact 和 Evidence |
| P1 | 交付周期、质量、返工和成本趋势 |
| P2 | Agent、模型、Connector、Worker 和 Sandbox 健康；正常时降级，异常时上浮 |
| P2 | Activity、Invocation、Tool Call 和 Transcript；进入 Run 后按需查看 |

### DASH-003：最小读模型

```text
DepartmentDashboard
├── outcomeSummary
├── activeSopRuns[]
├── attentionSummary
├── topAttention[]
├── recentOutcomes[]
├── deliveryTrends
└── operationalExceptions[]
```

`activeSopRuns[]` 至少需要提供：

- Run 标识和业务目标摘要；
- SOP Release；
- 当前 Stage、总体控制状态和健康度；
- 负责人、开始时间和 SLA；
- 下一动作和最高风险；
- Artifact、Evidence 和未解决 Finding 摘要；
- Run Cockpit 跳转地址。

### DASH-004

Dashboard 不得通过逐个拼接 Agent 自报结果构造交付状态。`SOP Run Summary` 必须由持久化 Run、Stage、Artifact、Evidence、Finding、Attention 和外部事实生成。

### DASH-005

用户应当无需读取 Transcript 即可回答：

1. 当前做到哪里；
2. 最大风险是什么；
3. 现在需要谁做什么；
4. 已经产生哪些成果；
5. 依据什么进入当前阶段或等待验收。

## 6. 企业控制台

### ENT-001：目标导航

```text
总览
├── Enterprise Overview
└── Departments

AI 基础设施
├── Models & Credentials
├── Connectors
├── MCP Servers
├── Skills Registry
├── Adapters
└── Platform Extensions

平台运营
├── Runtime Health
├── Capacity & Incidents
└── Cost

治理
├── Risk & Approvals
├── Resource Governance
├── Compliance
├── Audit
└── Access

设置
└── Instance Settings
```

### ENT-002

企业控制台服务部门目录、平台健康、成本、风险、审批、合规、审计和 AI 基础设施治理，不承担 SOP Studio、业务 Run 管理或部门交付管理。

Model & Credentials、Connectors、MCP Servers、Adapters、Skills Registry 和 Platform Extensions 都是 `AI 基础设施` 下可直接进入的独立管理入口，各自提供列表、详情及类型专属的新增或安装、配置、测试、更新、部门开放和停用动作。不得在它们之上增加统一“添加能力”按钮、通用创建向导或要求管理员先进入 Catalog 才能维护能力。Project Env 不出现在 Enterprise Console，只在部门 Project 中维护。

跨 Model、Connector、MCP、Adapter、Enterprise Skill 和 Platform Extension 的 Catalog 总览可以作为治理观察页存在，按 Type、Source、Enterprise Status、Department Availability、Health 和 Impact 搜索筛选并深链到专属详情。该总览只消费联邦式 Governance DTO，不提供安装、升级、授权或编辑动作，也不是各能力页面的上级业务容器。

### ENT-003

Enterprise Overview 只能消费独立治理投影。首期允许展示的字段范围由 VAL-013 的 Governance DTO 与 Disclosure Manifest 约束；孤立原型已验证字段边界，生产治理纵切完成前仍不得直接复用 Company 内容 API 拼装企业页面。

首期总览至少聚合部门数量与管理状态、活跃/排队运行数量、Worker 在线/就绪/容量、Sandbox 使用、模型/MCP/Connector 健康、企业与部门成本/额度，以及待处理的平台审批和基础设施异常。聚合卡片只能深链到对应治理页，不能借此进入业务 Run、SOP 或内容详情。

### ENT-004

企业管理员从部门目录进入没有 Membership 的部门时，只能查看该部门的最小治理投影或发起 Break-glass，不得跳入部门 Dashboard。

### ENT-005：部门资源治理

Resource Governance 提供逐部门的文件额度、实际用量、存储健康、系统维护状态和审计入口。企业管理员可以调整额度，并对系统明确报告的存储故障执行重算用量、重试 Blob 回收等不需要选择业务文件的有限动作；不能在企业页选择具体 Resource File/Folder 执行删除、移动、恢复或永久清除。页面不能复用部门文件浏览器，也不得展示文件内容、文件名、预览、下载、提取文本或可推断业务内容的详情字段。允许展示的治理字段继续受 VAL-013 的 Governance DTO 与 Disclosure Manifest 白名单约束；本阶段不设计风险文件识别、定向删除与处置界面。

### ENT-006：首期治理动作

企业控制台首期动作只覆盖形成基础设施治理闭环所必需的范围：

- 创建或停用部门、维护组织成员关系，下发或收回成本、存储和并发额度；
- 注册、授权、停用和轮换模型凭证、MCP、Connector、Adapter 与企业 Skill 仓库能力，并查看其版本、安装、部门授权和健康；
- 安装和治理 Instance 级 Platform Extension，审查其 Contributions、版本与运行健康，并在停用或卸载前查看受影响能力和部门；
- 查看 Worker Session、容量、排队和 Sandbox/Workspace 聚合健康，执行 `enable`、`drain`、`disable` 及具体故障允许的恢复动作；
- 审批企业基础能力安装、凭证使用和高风险平台动作；
- 按 Actor、部门、资源类型、动作、结果和时间筛选并导出治理审计。

这些动作不得创建或修改部门 Agent、SOP、Stage、Run、Artifact、Business Outcome 或业务审批。平台级恢复必须由具体故障生成有限动作，不提供可绕过业务状态机的通用“强制成功”或任意数据编辑器。

### ENT-007：首期治理边界

首期保留子需求 02 已定义的到期、限范围、全审计 Break-glass Session，但不因企业控制台扩展其权限。自定义合规规则、DLP、SIEM、风险文件识别、复杂告警编排、通用策略引擎和复杂企业 RBAC 均不进入本期；Compliance 与 Risk 首期只呈现已有治理事实、审批状态和审计结果，不主动解释部门业务语义。

企业 `Skills Registry` 只展示 Enterprise Skill Repository 及其 External Skill Repository 来源、已安装版本、部门暴露范围和企业仓库运行健康。它不得查询、聚合或展示 Department Skill 的列表、名称、元数据、内容或使用关系。部门向企业仓库提交 Skill 的发布审批属于后续能力；未来审批页只可读取部门主动提交的不可变快照，不能借此浏览其余部门 Skill。

`Skills Registry` 内分为 Enterprise Skills 与 External Repositories。Enterprise Skills 提供企业创建、不可变 Version、内容与元数据查看、结构/入口/依赖/运行材料校验、部门开放、更新提示、停用和 Agent/SOP Release 影响；External Repositories 只管理仓库来源、可发现 Skill/Version 和“安装指定版本”动作。安装后复制为企业仓库独立版本，运行时不直接读取上游，也不自动跟随 latest。

部门 Skills 页面明确分隔“企业可用”和“部门私有”。企业 Skill 只能按具体版本采用，不能在部门侧修改；Department Skill 继续由部门独立创建、测试和版本化。Agent Configuration 固定精确 Skill Version，新版本必须由部门管理员显式更新 Agent、完成真实运行测试，并通过新 SOP Release 的 Validation Run 后采用。企业管理员只做结构与运行材料校验，不假设其能替代部门业务效果测试。

`Platform Extensions` 是可信代码安装与运行治理页面，不是统一 Marketplace，也不取代 Connectors、MCP Servers、Adapters 或 Skills Registry 的能力目录。企业管理员在这里管理 Extension Package 来源、安装版本、Capability 审查、启停、健康、卸载和 Contribution 影响；某个 Contribution 是否向部门开放，仍回到其所属能力页面按自身规则管理。部门页面和 Agent Studio 不展示或选择 Platform Extension，只展示可实际配置或绑定的 Connector、MCP、Tool、Skill 或 Adapter。Sandbox Provider Driver 即使由 Extension 提供，也只供 Worker 物化运行环境，不形成企业 Environment 目录或 Agent Binding。

Catalog 中的公共状态必须保持正交：`Enterprise Status` 表示企业准入或停用，`Department Availability` 表示开放范围，`Health` 表示最近运行检测，`Impact` 表示被 Connection、Agent、SOP Release 或执行节点引用的范围。界面不得把这些事实压缩为一个含义不明的“已安装/可用”状态，也不得因为公共字段一致就在数据库中创建通用 Capability 所有权或生命周期。

首期 Catalog 与各能力详情以功能可用为先，只记录来源、当前版本或配置、操作者和审计事实，不建设统一信任评分、包签名中心、Publisher Trust、漏洞扫描或复杂供应链审批页面。企业管理员安装能力和把能力开放给部门仍是两个明确动作，但不在二者之间增加一套通用安全评审工作流。

企业 `Connectors` 与 `MCP Servers` 使用独立入口：Connector 以外部业务系统及其双面能力为单位治理；MCP Servers 只登记不对应具体业务系统的通用工具端点。Connector 的 Agent-facing MCP 实现仍收在 Connector Detail 内部，不会因为导航拆分而在 MCP Servers 中形成第二条登记。一个 Connector 即使同时使用 MCP Runtime 与 Platform Extension，也只能形成一个 Connector Definition 和一条部门 Connection 身份链，不能在目录中拆成两个需要重复授权的产品。

`MCP Servers` 列表只展示独立通用工具服务，并标明 `Remote` 或 `Managed`。Remote MCP Detail 维护 HTTP Endpoint/Credential Schema、部门开放范围、Tool Catalog、Connection 使用和远程健康；Managed MCP Detail 维护 Runtime Template、版本、参数 Schema、环境变量/Secret Slot、部门开放范围、Tool Catalog 和 Worker Runtime Health。Connector 内部 MCP 只在对应 Connector Detail 的实现区查看。

企业可以导入 `mcp.json`：Remote 条目生成待配置 Draft；stdio 条目必须选择已有 Managed Runtime Template，不能直接保存任意 Command/Args 为可用企业能力。部门创建 Remote 或 Managed MCP Connection 时只填写 Definition/Template 允许的配置与 Credential Reference，后续 Agent Tool Selection 和 Connection 生命周期复用 Connector 已确认规则。

当前 Paperclip 的 Local stdio Runtime Supervisor 属于过渡实现。目标架构中 Managed MCP 由 Agent Execution Worker 承载和报告健康，Paperclip Server 只管理 Definition、Template、Connection、授权与运行事实，不执行 MCP 子进程。

Remote MCP Detail 展示历次 Tool Catalog Revision 和最近 Diff，但不提供“回滚远端版本”动作；新增 Tool 保持未授权，删除 Tool 或参数 Schema 变化时标出失效 Agent Binding，并在 SOP 发布与 Run Preflight 阻断不再成立的固定 Tool Contract。远端自报 Server Version 只作为诊断字段。

Managed MCP Detail 提供不可变 Runtime Template Version 列表。安装新版本不迁移现有 Connection；升级流程复用 Connector 的显式迁移、Tool Diff、健康测试、内部 Connection Configuration Revision 固定和受引用保护卸载。首期不把 Remote MCP 与 Managed MCP 的不同更新事实压缩成一个通用 Version 操作。

`Adapters` 是 Agent Runtime Driver 的独立企业入口，列表区分 Built-in 与 External Adapter，并展示已安装版本、部门开放范围、Worker 可用性、引用 Agent/SOP Release 数和状态。Adapter Detail 提供 Definition、不可变 Version、Adapter-specific Config Schema、基础加载测试、部门开放、更新、停用和受引用保护卸载；不得把 Adapter 收进 Platform Extensions 或 Connection 页面。

部门 Agent Studio 选择企业开放的精确 Adapter Version，再组合 Model Deployment、Adapter-specific Config，并选择 Project 或测试运行上下文完成真实调用测试。企业 Adapter 页只证明包可加载、Schema 可读取且 Worker 可使用，不能在缺少部门实际配置时声称 Agent 可运行。Agent Configuration Snapshot、SOP Release 和 Run 固定 Adapter Version；新版本不自动迁移 Agent。

目标架构中 Built-in 与 External Adapter 都由 Agent Execution Worker 加载执行。现有 External Adapter 动态加载进 Server 主进程、安装元数据文件化的实现只作为迁移起点；Paperclip Server 最终只管理 Adapter Definition/Version、部门开放范围和运行事实。

`Models & Credentials` 以 Model Credential 和 Model Deployment 两层展示。Credential Detail 维护 Provider、Endpoint、Secret Reference、基础连通健康、轮换和引用 Deployment；Deployment Detail 维护 Provider Model ID/Deployment Name、支持参数、成本元数据、兼容 Adapter、部门开放范围、健康和受影响 Agent/SOP Release。Secret 值永不向部门页面返回。

部门 Agent Studio 先选择 Adapter Version，再只展示与其兼容且对本部门开放的 Model Deployment。Agent 绑定 Deployment ID，不分别选择 Credential、Endpoint 或自由填写 Model ID。Credential 轮换不改变 Deployment；Provider、Endpoint 身份或实际 Model ID 变化时创建新 Deployment，并通过 Agent 配置更新、测试和新 SOP Release 显式采用。

企业 Model Deployment 页只执行基础 Provider 连通测试。完整可用性必须在 Agent Studio 中结合 Adapter Version、Agent-specific Config，以及选定 Project 或测试运行上下文发起真实调用测试。远端模型自报版本或模型 ID 作为运行事实记录，不提供虚假的平台回滚操作。

Connector Detail 以 Connector Definition 为唯一详情对象，集中呈现版本、配置 Schema、支持的双面 Capability、MCP 与 Extension 实现来源、部门开放范围、Connection/Agent/SOP Release 影响和健康。安装、更新、停用与卸载都从该详情发起；底层 MCP Runtime 或 Extension Contribution 只能深链到技术诊断页，不提供第二套 Connector 安装动作。更新确认页必须把 Agent-facing Tool Diff 与 Platform-facing Event/Webhook/Sync/External Object Diff 放在同一影响分析中。

新增 Connector 同样从 Connectors 页面发起。内置 Definition 可以直接启用；需要扩展代码的 Definition 由系统在该流程内安装或复用提供 Connector Contribution 的 Extension Package，并解析 Definition 明确声明的一层 MCP/Extension 实现依赖。产品不新增 Connector Package 概念，也不要求管理员先进入 Platform Extensions 手工安装依赖。依赖失败时停留在 Connector 流程中展示缺失项和修复动作，不静默创建半可用 Connector。

Connector 与底层 Extension 的动作范围必须分离：停用 Connector 只停止该 Definition 及其 Connection 使用；停用或卸载 Extension 前列出全部受影响 Contributions；删除 Connector 不自动删除仍被其他 Contribution 引用的 Extension。首期不处理递归依赖解析、自动冲突求解或复杂包管理。

Connector Detail 的 Versions 区允许多个已安装版本并存。安装新版本只生成待使用版本，不迁移现有 Connection；Connection Detail 提供“升级并测试”，在同一流程中展示 Tool、Schema、Event、Webhook、Sync 与 External Object Diff，验证两面后由部门管理员确认迁移。存在删除 Tool、Schema 不兼容或失效 Agent Binding 时必须先处理，不能强行切换。

Agent Configuration Snapshot、SOP Release 与 Run 固定系统生成的 Connection Configuration Revision，该修订包含精确 Connector Version 与结构化两面配置。部门迁移当前 Connection 只产生新修订，不改写已发布 SOP；SOP Studio 只有在同步更新后的 Agent Configuration 并完成 Validation Run 后才能创建使用新修订的 Release。Connector Version 详情展示经修订关联的 Connection、Agent、SOP Release 与 Active Run 引用，存在有效引用时禁止卸载。首期不提供自动更新、灰度比例和复杂发布渠道，也不向用户暴露需要手工维护的“连接版本”。

## 7. Attention 与行动入口

### ATN-001

Attention 是 Approval、Interaction、Recovery Action、Blocked、Budget 和运行异常的行动投影，底层领域对象仍是唯一事实源。

### ATN-002

Dashboard 行动只能路由到底层领域 Service，并在执行时重新鉴权。Attention 本身不得复制审批、恢复或业务决策状态机。

### ATN-003

VAL-010 已在孤立投影原型中验证跨来源 Incident 聚合、Required Item、投影重建、永久 Dismiss 限制和动作回源重新鉴权；这些规则接入生产事实源、持久投影、Owner/Eligible Actor、Route/API 和 UI 前，仍不得假定为已实现产品能力。

## 8. 路由、缓存与实时更新

### RTE-001

目标路由必须显式区分 Enterprise 与 Company Scope。具体路径可以演进，但不能继续把 Instance Settings 嵌入某个 Company 的授权上下文。

### RTE-002

Query Key、客户端 Store、实时订阅和后台请求必须按 Scope 分区。权限撤销时必须删除受影响的 Company Cache 并关闭实时连接，而不是只标记为 stale。

### RTE-003

多个标签页可以停留在不同 Scope。Membership、Instance Role 或 Break-glass 变化触发各标签页独立重校验，不强制同步导航位置。

## 9. 渐进演进约束

### MIG-001

可以复用当前 Dashboard Route、Skeleton、Query 生命周期、Live Updates 和 Widget Slot，但必须逐步替换以 Agent/Task 数量为中心的信息模型。

### MIG-002

现有技术对象页面不得先删除。应先建立 SOP Run 与能力入口，再根据真实导航使用数据决定合并、隐藏或降级。

### MIG-003

本子需求不授权绕过最小生产纵切直接拼装企业治理页面。VAL-013 孤立原型已经通过字段分类和泄露测试；生产接口只能使用同一 Governance DTO 与 Disclosure Manifest，并须在生产数据源和 Instance Admin 授权链上重新验证。

## 10. 验收场景

1. 业务成员进入部门 Dashboard，无需查看 Transcript 即可判断灯塔 Run 的进度、风险、待办、成果和推进证据。
2. 部门负责人切换“我的 / 团队”视角时，信息骨架保持一致，仅改变数据范围。
3. Agent 或 Connector 正常时不占据首屏主区域；发生阻断性交付异常时自动上浮。
4. Instance Admin 在 Enterprise Scope 可以查看部门治理摘要，但不能读取部门 SOP、Artifact 或 Transcript。
5. 同一用户在两个标签页分别停留于 Enterprise 和 Company Scope，导航、缓存和实时订阅互不污染。
6. Company Membership 被撤销后，页面立即停止显示旧业务内容；Enterprise Scope 的合法治理视图不受影响。

## 11. 验证证据与剩余缺口

已验证：

- [页面信息架构与部门 Dashboard 预研](../../../../doc/research/2026-07-23-page-ia-and-department-dashboard.md)；
- [Enterprise / Company 作用域与授权验证](../../../../doc/research/2026-07-23-enterprise-company-scope-authz.md)；
- VAL-008、VAL-014。

仍待验证：

- VAL-010：接入真实事实源、持久投影、Route/API 和 UI 的生产纵切；
- VAL-013：接入真实治理聚合源、Instance Admin 授权和 Enterprise Console 的生产纵切；
- VAL-016：接入生产 Resource Schema、事务、API 和 Resources UI 的生产纵切；
- Dashboard 视觉层级、响应式布局和高密度数据交互原型；
- SOP Run Summary 的生产查询性能与实时更新策略。
