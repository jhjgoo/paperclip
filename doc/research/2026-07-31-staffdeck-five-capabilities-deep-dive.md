# StaffDeck 五项能力源码深挖与企业驾驶舱调整建议

日期：2026-07-31  
比较基线：`jhjgoo/StaffDeck` [`480478de63d73677cd7847f60814ad10a7a87ca8`](https://github.com/jhjgoo/StaffDeck/commit/480478de63d73677cd7847f60814ad10a7a87ca8)  
证据范围：该提交的前后端源码、测试、README 与 CI。本文没有把 OpenBMB 上游后续提交混入基线，也不把 UI 文案或路线图当成已实现能力。

## 结论先行

StaffDeck 最值得 Paperclip 学习的不是其 Python Agent Loop，而是五个已经形成闭环的产品机制：按用户任务分区的双工作面；可观察、可取消的知识入库流水线；“自然语言生成—结构校验—局部改写—反思—人工发布”的 SOP 编辑体验；连接探测与 MCP 工具发现；以及将 IM 入站、身份、路由、出站和人工接管持久化的渠道边界。

其中必须纠正一个容易被界面造成的误解：**StaffDeck 的知识入库确实自动发现状态机 Skill/SOP 草稿和 HTTP Tool 草案，但不会从知识自动生成通用 `SKILL.md` 技能包，也不会自动发布任何能力。**知识发现只产出 `pending` 建议；工具只有原文包含 URL、方法或参数时才允许生成；Skill 必须通过图结构校验，之后仍要人工确认。所谓“SOP”和“场景化 Skill”在这条链路里是同一个 `SkillCard` 状态机对象，不是两套独立产物。[发现提示词](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/llm/prompts/knowledge_discovery_prompt.md#L1-L14) [发现与入队](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/service.py#L968-L1053) [人工确认创建](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/service.py#L1209-L1260)

对企业驾驶舱的总调整方向是：保留现有不可变 Release、Stage Kernel、Evidence、Worker/Sandbox 和治理边界；在这些严谨内核之上补一层更亲和的 **Department Workbench**，并新增三个清晰的深模块边界：`Knowledge Processing`、`Capability Drafting`、`Channel Gateway`。不要复制 StaffDeck 的内置 Agent Loop、进程内线程池或本机代码 Runner。

## 1. 产品分区、导航、交互状态与数据获取

### 真实代码链

前端首先分成“使用数字员工”的聊天工作面和“运营数字员工”的管理工作面。管理侧再按任务分为：开放广场/员工/渠道，员工档案，知识/技能/SOP/工具，以及账号/模型系统设置；同一个侧栏会根据管理员身份和当前员工作用域改变入口。[侧栏分区](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/src/components/AppSidebar.tsx#L53-L86) 路由进一步把列表、创建、编辑、测试拆成稳定页面，例如知识库、SOP、通用技能、HTTP Tool、MCP Server 与 Tool Test 均有独立 URL。[管理路由](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/src/App.tsx#L531-L755)

数据层并未使用 TanStack Query 一类缓存框架，而是页面内 `useEffect/useState` 配合薄 `fetch` Client；Client 统一附加 Bearer Token，将非 2xx 转为包含状态码和响应体的 `ApiError`。[API Client](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/src/api/client.ts#L16-L47) 各页面自行维护 `loading/error/rows/modal`，知识页并行拉取 Document 与 KnowledgeBase，工具页并行拉取 Tool 与 MCP Server；长任务则切换为 job + 轮询或 SSE。后端 route 再进入领域 Service，最终写入 SQLModel 对象。错误大多通过 Toast 和页面空态上浮，局部请求失败不会被全局状态机统一协调。

### 可借鉴机制、耦合与风险

可借鉴的是“使用面/构建面/治理面”分开，以及“资源列表—创建—编辑—测试—运行记录”稳定心智模型。隐含耦合是页面同时承担查询、缓存失效、并发请求和业务编排；大量局部状态令跨页一致性、请求竞态和恢复复杂。默认 `TENANT_ID` 也说明其桌面单租户体验优先于严格的多企业前端上下文。[Client 默认租户](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/src/api/client.ts#L3-L14)

### Paperclip 最合适的 seam 与调整

现有驾驶舱已经正确拆分 Department Console、Project、SOP Run Cockpit 与内容盲 Enterprise Console，不应改回 StaffDeck 式“一套后台”。建议在部门侧重排一级信息架构：

1. `工作台`：我的待办、Active Run、Input Request、Human Gate、失败恢复；
2. `交付`：Projects、SOP Runs、Artifacts；
3. `构建`：SOP Studio、Agent Studio、Knowledge、Skills、Connections；
4. `触达`：Channels、Triggers、Schedules；
5. `部门设置`：成员、额度、审计入口。

同一对象保留列表、详情、测试和版本深链，但服务端投影继续是唯一事实源。前端复用 Paperclip 已有 Query Client，不复制页面自管缓存。可在现有[页面与工作区规格](../../docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/03-page-information-architecture-and-workspaces.md)增加 `Department Workbench Projection`，聚合 Attention、Run、Gate 和 Channel Intake 摘要，但绝不能由前端拼接 Agent 自报状态。

## 2. 知识摄取、分层索引、检索与能力发现

### 真实代码链

前端知识页上传文件后调用 `/api/enterprise/knowledge/documents/upload`，route 创建或解析 KnowledgeBase/Version，并把文件内容以 base64 放入 `KnowledgeIngestJob`；后台 job 进入 `KnowledgeService._run_ingest_job`。[上传入口](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/api/knowledge.py#L80-L128) 解析器支持 txt/Markdown/HTML/PDF/docx；旧 `.doc` 明确拒绝，PDF 用 `pypdf`，docx 优先 `python-docx`、失败后读取 ZIP/XML。[解析器](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/parser.py#L10-L109)

入库不是“切块后向量化”一条线，而是持久阶段：解析、规范化、Source Document、章节树、Wiki Bucket、引用 Chunk、PageIndex/OKF Concept、能力发现。Job 保存阶段、进度、统计、错误和取消状态；取消请求在阶段安全点检查，异常会把 Document 与 Job 一并标成 failed，并清除内嵌原文。[阶段定义](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/service.py#L59-L100) [入库主链](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/service.py#L288-L474)

检索按 Concept → Document → Bucket → Section → Chunk → Evidence Pack 逐层收窄。前两级可以用 LLM 路由，失败则词法评分降级；Chunk 仍做本地排序和相邻片段扩展，最终返回 route trace、引用和 evidence，而不是只返回一段生成文本。[检索主链](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/service.py#L476-L746) 数据落在 `KnowledgeBase/Version/Document/Bucket/Chunk/Concept/IngestJob/DiscoverySuggestion` 等分立模型中，而不是一个通用 JSON 资源。[知识模型](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L153-L326)

能力发现是入库末段的可失败增强：没有默认模型或模型调用失败会直接跳过，不影响知识 ready；只接受 `skill/tool/warning`。Skill 草稿必须字段白名单、Pydantic Schema、全节点可达且都能通向终点；合法建议写入待确认队列。Tool 确认时创建 HTTP Tool；Skill 确认时创建 `draft` Skill。[Skill 图校验](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/service.py#L125-L205) [发现容错](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/knowledge/service.py#L968-L1053)

### 已实现与未实现边界

- 已实现：文档摄取、章节/主题/引用分层索引、带降级的检索、可审阅的 SOP/Tool 发现。
- 未实现：知识直接生成并发布生产 SOP；从知识生成通用 `SKILL.md` 包；从模糊文字猜测可执行 API；自动验证工具凭据和副作用；从多文档持续自动重写已发布 SOP。
- “会话蒸馏”是另一条 `/skills/distill` 路径，输入原始流程文本并生成 `SkillCard`，不是知识库自动提取；通用 Skill 则从 Markdown/ZIP/SkillHub 导入，仍是第三条独立路径。[通用 Skill 导入](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/api/general_skills.py#L104-L317)

### Paperclip 最合适的 seam 与调整

不要在 `Resource File` 上直接挂向量和生成状态。新增 `Knowledge Processing` 深模块：`Knowledge Source Revision → Processing Job → Derived Index Revision → Citation`；索引是可重建派生物，原 Resource Revision 才是权威来源。再新增独立 `Capability Drafting`：输入固定 Resource Revision/Citation 集，输出 `SOP Draft Candidate`、`Connection Draft Candidate` 或 `Skill Draft Candidate`，均保存来源、模型、Schema 版本、风险和验证状态。

Candidate 只能进入现有 SOP Studio/Connection/Skill 的草稿入口；不得直接创建 Release、写 Secret、启用 Tool 或改变运行中 Run。确认 SOP Candidate 后仍需结构校验、Agent Binding、Validation Run、Evidence 和人工发布；工具 Candidate 只允许生成无凭据 Connection Draft，并强制 Probe、风险分级与审批。这与驾驶舱现有“候选只影响未来不可变版本”的[质量改进规格](../../docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/08-quality-improvement-loop-engineering.md)一致。

Ponytail 取舍：首期只支持 Markdown/PDF/docx、词法检索加可选 LLM 路由，不先建设向量数据库、知识图谱编辑器或自动本体；当真实召回评测证明需要时再增加 embedding。

## 3. SOP 构建器、状态机、版本与优化

### 真实代码链

StaffDeck 前端把 SOP 称为 Skill：列表页进入持久化的 DistillPage；用户可粘贴/上传流程文本，经 `/api/enterprise/skills/distill` 或可恢复的 job/SSE 生成草稿，也可对已有 `skill_id` 调用 rewrite。后端将可用 Tool 目录注入生成请求。[Distill/Rewrite API](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/api/skills.py#L623-L757)

生成器先尝试整图生成与 Pydantic 校验；失败后最多两次修复，再降级为“大纲—逐节点扩写—最终复核”，仍失败则给最小可运行草稿。它会移除未配置 Tool Action，并强制闭环回复、自适应推进和有副作用前确认。[生成与降级](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/skills/skill_distiller.py#L19-L135) 编辑器支持限定 `target_paths` 的 patch/merge，避免一次自然语言改写覆盖整图。[局部改写](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/skills/skill_editor.py#L54-L194)

每次生成/改写之后最多三轮 Reflection，按来源一致性、闭环、自适应、工具依据、调用格式、副作用确认和中断恢复打 rubric；模型未返回合法修订时保留当前草稿并告警。[反思链](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/skills/skill_reflection.py#L12-L180) 发布后写 `SkillVersion`；员工私有演化走 `AgentSkillBranchVersion`，支持版本查看和 rollback。这里的版本主要是可变主记录加快照/分支投影，不具备 Paperclip 规划中 Release 绑定全量执行依赖的严格不可变性。[版本与回滚](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/api/skills.py#L540-L620)

### 风险与 Paperclip 调整

体验优秀，但 Reflection 仍是同一模型体系自评，不是机械 Verifier；内存 `stream_jobs` 与 daemon thread 在进程重启后无法恢复；自动 fallback 草稿可能“结构合法但业务错误”；分支会带来同步和归属复杂度。

驾驶舱应借 UI 流程，不借运行真相：在现有 [SOP Studio 与契约规格](../../docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/04-sop-studio-run-request-stage-contract.md)前增加 `Generate Draft` 与 `Copilot Patch`，展示 Diff、来源引用、Changed Paths、Warnings 与未解析能力；保存仍只是 Draft Revision。发布继续创建不可变 SOP Release，并冻结 Execution Definition、Bindings、Resource Snapshot、Skill/Connection/Agent 版本。把 LLM Reflection 定位为 lint 建议；机械 Schema、图可达性、权限、资源、Secret、Workspace Preflight 和 Validation Run 才是 Gate。首期不复制通用分支模型；用 Draft Revision + Published Release + “从旧 Release 新建草稿”已足够。

## 4. HTTP、MCP 与通用 Skill 工具

### 真实代码链

HTTP Tool 表单保存 method、URL、headers、auth、输入/输出 Schema、允许 Skill 和 timeout；`/probe` 可在保存前真实调用样例并推断输出 Schema，保存后 `/test` 复用生产 `ToolExecutor`。[创建与 Probe](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/api/tools.py#L129-L261) [Test](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/api/tools.py#L386-L401) MCP Server 支持 builtin、stdio、streamable HTTP 和 SSE；先 initialize，再 `tools/list` 发现，再同步成独立 Tool 记录；运行时 Tool 通过 `mcp_server_id` 回查连接配置。[MCP transport 与发现](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/tools/mcp_client.py#L29-L110) [MCP 会话](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/tools/mcp_client.py#L135-L163)

执行器检查 tenant、enabled、员工可见性和 allowed skill；HTTP 用 `httpx`，`${secret.ENV_NAME}` 从进程环境替换，策略只有 1–300 秒 timeout，没有重试、幂等、出站域名策略、审批或响应体上限。[ToolExecutor](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/tools/tool_executor.py#L21-L131) stdio MCP 直接以服务进程环境、可配置 cwd 启动任意 command。[stdio MCP](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/tools/mcp_client.py#L183-L243)

通用 Skill 更高风险：导入的 `SKILL.md`/ZIP 由模型生成 Python 或 Bash Runner，最多反思重试十次，然后在本机临时目录用继承后的进程环境启动 subprocess；数据库虽保存 `permissions={network:true, python:true}`，执行链未以 Sandbox 强制这些权限。[Runner 计划](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/general_skills/runner.py#L35-L75) [本机执行](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/general_skills/runner.py#L603-L744)

### Paperclip 最合适的 seam 与调整

借“连接向导—发现—选择—Probe—保存—绑定—Test”的产品流程；底层落在现有 Connection Configuration Revision、MCP/Tool Catalog、Agent Tool Binding 与审批对象。Probe 必须由 Worker 在临时 Sandbox 执行，使用短期 scoped Secret，记录请求摘要、响应 Schema、网络目标、成本和审计事件；写操作默认 dry-run，不支持时要求 Human Gate。MCP stdio、外部 Skill 与 generated code 一律走 Worker/Sandbox，不进入 Server 主进程。把 timeout、network allowlist、最大响应、幂等策略、重试分类和副作用等级纳入不可变 Connection Revision。这里现有[Agent/Skill/Capability 规格](../../docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/06-agent-studio-skills-and-capabilities.md)无需推翻，只需补“配置向导”和“真实 Probe Evidence”。

## 5. IM 渠道、身份、路由、恢复与真人接管

### 真实代码链

各渠道 Adapter 只负责 normalize、send 和 ingress 生命周期，统一输出 `ChannelInbound`；注册表按 channel 查找实现，并用能力探测而非渠道名判断 reaction 支持。[Adapter 协议与 Registry](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/adapters/base.py#L11-L121) WeChat、WeCom、Feishu、DingTalk 分别实现适配器。

入站先按 `(binding,event_id)` 落 `ChannelInboundEvent`，唯一约束冲突即视为 duplicate；之后原子从 received claim 为 processing。每个进程有 generation id，启动恢复时只接管旧 generation 的 processing 事件；同会话用进程锁串行，消息还以 `client_turn_id` 二次去重。[原子 claim 与进程代](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/service_intake.py#L53-L185) [消息二次去重](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/service_intake.py#L262-L336)

身份键显式包含 tenant、channel、外部账号 scope 与外部用户；未知用户懒建 member，绑定码可把外部身份迁移到 Web 账号，并迁移对应会话/记忆；并发创建用唯一约束回查。[身份解析](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/service_identity.py#L94-L227) 一个 Binding 可挂多个员工；`/切换` 写会话路由指针并设置十分钟 manual pin，自动意图路由不得覆盖。[路由状态](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/service_routing.py#L68-L179) [手动切换](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/service_routing.py#L186-L226)

回复不在请求线程直接发，而是随主事务写 `ChannelDelivery` Outbox，目标和 idempotency key 固定；Worker 原子 claim，失败按 `2^attempts` 最多 300 秒退避，超过次数进入 failed，启动时重置卡死 sending。部分渠道远端状态不可确定时停止重试，避免重复发送。[Outbox 登记与 claim](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/service_outbox.py#L129-L282) [投递与退避](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/channels/service_outbox.py#L400-L539)

真人接管并非简单“转客服”消息：`HumanHandoffRequest` 固定触发 Skill/Step、上下文摘要、待答问题和 resume payload；重复请求复用未决记录。运营端有待回答 Inbox，回复后后台重新进入 Agent Loop，失败会持久化。[接管创建](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/core/human_handoff_service.py#L20-L98)

### 风险与 Paperclip 调整

优点是入站/身份/路由/出站/接管边界完整。风险是线程、锁、失败限流与 worker 都是进程内实现，SQLite/单节点假设明显；渠道配置包含高权限凭据；自动路由错误可能把消息送给错误 Agent；“至少一次”投递仍依赖 provider 的幂等能力；IM 自由文本不适合作为审批或运行状态修改命令。

新增独立 `Channel Gateway` seam：`Channel Connection Revision`、`External Identity Binding`、`Inbound Event`、`Conversation Route`、`Delivery Outbox` 五类事实；Gateway 只做验证、归一化、去重和投递，不运行 Agent。归一化请求进入 `Intake Router`：只能创建 Run Request、补充现有 Input Request，或发普通协作消息。任何 Human Gate、Secret、预算、取消/恢复必须跳转到有认证的 Web 决策页，不能凭 IM 文本直接批准。IM 与 Web 共享同一个持久 `Input Request/Human Gate/Attention` 对象，因此 StaffDeck 的 handoff inbox 可直接启发驾驶舱现有 [Run Cockpit 恢复模型](../../docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/07-run-cockpit-attention-failure-recovery.md)，但不能另建一套会话状态机。

首期只接一个企业 IM 渠道和一种触发：私聊创建 Run Request；群聊、LLM 自动选 SOP、跨员工自由切换和渠道内审批延后。先验证事件幂等、身份绑定、错误重放、Outbox、权限和审计，再扩渠道。

## 建议写回企业驾驶舱规格的变更清单

1. 在产品定位中加入“业务成员可通过 Workbench 或受控 Channel 发起请求；Run/Stage 仍是唯一运行真相”。
2. 在信息架构中加入 Department Workbench、Knowledge 和 Channels 分区，保持 Enterprise Console 内容盲。
3. 在 Resource 规格中新增派生的 Knowledge Processing Job/Index Revision/Citation，不改变 Resource Revision 权威性。
4. 在 SOP Studio 中加入带引用的 Generate Draft、局部 Copilot Patch、Diff、Warning 和未解析能力面板；LLM Reflection 只算 lint。
5. 在 Capability 规格中加入 Candidate Review Queue，明确 Knowledge → SOP Draft、HTTP Tool Draft 的真实边界；通用 Skill 不自动生成。
6. 在 Connection 规格中加入 Wizard、Discover、Probe、Schema Preview 和 Test Evidence；执行全部落 Worker/Sandbox。
7. 新增 Channel Gateway 子规格，明确 inbox/outbox、身份 scope、路由 pin、provider 幂等与死信恢复。
8. 将渠道请求映射到 Run Request/Input Response/Discussion，不创建平行 Chat Work Model；IM 不执行 Human Gate。
9. 保持现有不可变 Release、Stage Kernel、Evidence、Lease/Fencing、Sandbox、预算和治理设计，不引入 StaffDeck 单进程 Agent Loop。

推荐顺序是先做两条端到端 tracer bullet，而不是同时复制五套页面：第一条“Resource 上传 → Knowledge Job → 带引用 SOP Candidate → Studio Diff → Validation Run”；第二条“IM 入站 → 身份/去重 → Run Request → Outbox 回执 → Web Gate 深链”。它们分别验证知识到交付、渠道到控制面的核心 seam，之后再决定是否扩展知识图谱、更多渠道和自动优化。
