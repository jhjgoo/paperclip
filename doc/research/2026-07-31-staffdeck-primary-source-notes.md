# StaffDeck 一手来源研究底稿

日期：2026-07-31  
研究对象：`jhjgoo/StaffDeck`，固定于提交 [`480478de63d73677cd7847f60814ad10a7a87ca8`](https://github.com/jhjgoo/StaffDeck/commit/480478de63d73677cd7847f60814ad10a7a87ca8)。以下只采用该仓库 README、源码、依赖清单与 CI 配置；“未见”均仅指此提交的公开实现，不代表项目方未来规划。

## 一句话定位与目标用户

StaffDeck 是“企业数字员工构建与管理平台”，核心不是管理外部编码 Agent 的工作队列，而是把专业员工的经验、业务流程和判断标准产品化为可复用、可迭代、可追溯的数字员工。目标用户是希望把 AI 从个人助手升级为组织生产力的企业与机构；典型场景包括 HR、财务、法务、IT、行政等高频问答与事务办理。[README 定位](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L28-L37)

其主流程是：创建数字员工 → 绑定/复制知识、通用技能、SOP、工具 → 发起会话 → 在 Trace 中观察检索/技能/工具执行 → 必要时取消或转人工 → 用记忆、反馈、日志和定时任务持续运营。[核心流程](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L203-L210)

## 产品与信息架构

产品明显分成两套工作面：面向最终使用者的“数字员工广场 + 员工会话”，以及面向运营者的管理端。管理端一级结构包括开放广场、我的数字员工、渠道接入；员工档案下有定时任务、记忆、对话日志；能力层包含知识库、技能、SOP、工具；系统层包含账号与模型配置。[侧栏定义](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/src/components/AppSidebar.tsx#L55-L81) [路由表](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/src/App.tsx#L531-L755) [会话端路由](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/src/App.tsx#L933-L947)

差异化功能集中在四处：自然语言生成并可视化编辑、版本化和分支演化的状态机 SOP；按文档/章节/页面/摘要逐层导航并带引用的知识检索；HTTP、MCP、通用技能 Runner 与定时任务；长期记忆、完整事件 Trace、反馈分析和真人接管闭环。[能力总览](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L32-L37) 数据模型也为技能与知识分别设置版本和“员工私有分支”，支持从广场模板复制后独立演化。[技能分支模型](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L57-L130) [知识模型](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L153-L255)

IM 渠道是一项产品强项：一个微信/企微账号可挂多个员工，通过指令或 LLM 意图分类分发；支持手动切换保护窗、身份合并、入站幂等、崩溃恢复和出站重试。[渠道说明](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L212-L241) 对应模型显式保存“渠道账号—员工集合”“当前员工路由指针”“入站事件”“幂等投递”。[渠道数据模型](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L550-L725)

## Agent 执行与编排模型

StaffDeck 是单次会话内的分阶段 Agent Loop。`AgentLoop` 组合 Router、状态机 SkillRuntime、StepAgent、ReflectionAgent、ResponseGenerator、通用技能选择/Runner、工具执行、知识、记忆和事件日志；每轮限制最多 6 个工具动作，反思上限为 5。[运行时组合与限制](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/core/agent_loop.py#L113-L201) 会话持久化当前技能/步骤、槽位、技能栈、待处理任务、待回答字段、知识上下文和摘要，因此 SOP 可以挂起、切换并恢复。[会话状态](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L519-L547)

它支持同步与流式轮次、多个待办的继续执行、定时任务模式、执行后异步提取记忆，并把 Router/Step/Tool 结果作为结构化响应返回。[轮次主循环](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/core/agent_loop.py#L239-L454) 真人接管是正式领域对象，记录触发技能/步骤、上下文摘要、待答问题、处理人和恢复载荷。[接管模型](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L728-L747) 这更接近“面向业务会话的单员工运行时”，而非跨 Agent 的目标—任务—依赖图、自治派工或公司经营控制面。

## 治理、权限与多租户

所有主要实体均带 `tenant_id`，用户在租户内唯一；认证令牌携带 tenant/user/expiry 并以应用密钥 HMAC 签名，接口显式拒绝 tenant mismatch。[租户与用户模型](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L19-L41) [认证实现](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/security/auth.py#L20-L98)

角色只有 `admin` 与 `member` 两级。管理员管理租户设置、账号和全局员工；普通成员可查看全局/已发布员工，创建者可管理自己的员工。资源可标记为 `open_gallery` 或 `agent_private`，并通过员工—资源绑定隔离。[权限规则](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/security/permissions.py#L10-L82) [资源作用域](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/agents/branching.py#L35-L51) [作用域写入](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/agents/branching.py#L157-L197)

治理短板也很明确：路线图仍把“高风险工具动作的细粒度审批策略”列为未完成项；当前没有 Paperclip 式的预算硬停、目标/问题工作图、治理动作审批对象或跨员工组织层级。[路线图](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L277-L283) 当前安全建议主要依赖最小权限凭据、人工审批与监督；README 明示外部工具和 Runner 可能产生真实副作用。[风险说明](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L317-L324)

## 技术栈、数据与扩展

后端是 Python 3.11、FastAPI、Pydantic/SQLModel、Uvicorn、httpx，模型层同时依赖 OpenAI 与 Anthropic SDK；默认数据库为本地 SQLite，启用 WAL 和 30 秒 busy timeout，并通过启动期 `create_all` 加手写 SQLite 迁移演进。[后端清单](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/pyproject.toml#L1-L42) [数据库配置](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/database.py#L14-L80) 这有利于桌面单机部署，但相较正式迁移框架与服务端数据库，对大规模并发和集群运维的准备较弱。

前端为 React 18 + TypeScript + Vite 8 + React Router 7 + Tailwind 4/Radix，使用 Vitest。[前端清单](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/frontend-enterprise/package.json#L1-L46)

扩展面包括：OpenAI Chat Completions 兼容模型配置；HTTP 工具；MCP 的 stdio、streamable HTTP、SSE 和 builtin 四种 transport；包含 `SKILL.md` 与文件包的通用技能；渠道适配器；以及一套可封存、快照化、带契约版本和 provider deployment identity 的 Capability Registry。[模型配置](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L327-L358) [工具与 MCP 模型](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/db/models.py#L446-L496) [Capability Registry](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/capabilities/registry.py#L13-L164) 不过 Registry 的注释明确说明注册发生在启动配置期，不是运行时热插拔。

## 部署运维与成熟度

开发部署要求 Python 3.11+、Node 20+ 和 OpenAI 兼容模型服务；构建后的前端由同一个 FastAPI 进程在 5173 端口提供，默认管理员是 `admin/admin`。[快速开始](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L90-L169) 单端口服务直接挂载 Vite 静态资源和 SPA 路由。[单端口实现](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/single_port_app.py#L142-L192) 发布流水线用 PyInstaller/平台脚本构建 macOS arm64/x64、Linux、Windows 安装包，支持 macOS 签名/公证并执行 Windows smoke test。[发布工作流](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/.github/workflows/release.yml#L13-L188)

项目自述于 2026-07-15 正式开源，当前应用版本仍为 `0.1.0`；研究提交日期为 2026-07-30，代码仍在快速迭代。[开源日期](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/README.zh.md#L24-L30) [应用版本](https://github.com/jhjgoo/StaffDeck/blob/480478de63d73677cd7847f60814ad10a7a87ca8/backend/app/main.py#L34-L42) 仓库已有大量后端测试与跨平台发布工程，说明不是纯原型；但开源时间短、版本早、默认 SQLite/默认弱口令、细粒度审批尚未完成，都表明其生产成熟度仍需按实际规模和风险场景验证。

## 横向比较时最值得抓住的结论

- **StaffDeck 的优势**：数字员工“构建—使用—运营”闭环更完整；SOP 状态机、层级知识检索、会话记忆/Trace/反馈、人机接管和国内 IM 渠道更贴近企业业务服务台。
- **StaffDeck 的边界**：核心对象是数字员工、能力资源和会话，不是公司、目标、项目、Issue、预算和审批；多员工协作仍在路线图中，当前多员工能力主要是渠道路由而非协同执行。
- **技术取向**：StaffDeck 优先本地桌面化、单端口和 Python Agent Runtime；Paperclip 横向比较应重点看“业务 Agent 应用平台”与“多 Agent 公司控制平面”两种产品范式，而不只比较功能数量。
