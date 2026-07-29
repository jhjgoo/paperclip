# 子需求 02：组织作用域、身份、权限与工作区切换

状态：产品契约已确认；Scope/内容隔离边界已验证，Run 人员派生权限的孤立原型已验证、生产集成未验证
依赖：子需求 01
关联决策：DEC-009 至 DEC-011、DEC-013、DEC-058、DEC-059、DEC-065 至 DEC-069、DEC-092、DEC-093
关联验证：VAL-008、VAL-009 已验证；VAL-017 孤立原型已验证、生产集成与并发恢复未验证

## 1. 目的

本子需求定义企业平台、部门空间、用户身份、授权来源、工作区切换和临时紧急访问的产品契约。它必须保证同一账号可以承担企业与部门双重职责，同时阻止企业管理员身份静默穿透部门业务边界。

## 2. 组织与作用域模型

Paperclip Instance 是单一企业的部署、数据与治理边界，由客户部署在自有服务器或私有云；不新增 Enterprise/Tenant 业务实体。Company 仅表示该企业内部部门空间，不承载外部客户租户语义。开发、测试、预发和生产必须使用彼此独立的 Instance。

### ORG-001

Paperclip Instance 必须表示一个企业 AI 平台；现有 Company 必须表示部门或业务团队空间。

### ORG-002

产品不得新增 Department 数据层。所有部门业务实体继续以 `company_id` 隔离。

### ORG-003

Project 只表示部门内业务域或交付项目，不承担企业或部门组织层级职责。

### ORG-004

产品必须提供两种显式 Workspace Scope：

```text
WorkspaceScope
├── enterprise
└── company(companyId)
```

任意页面、查询、实时订阅和用户操作在执行时都必须属于其中一个 Scope，不允许依赖“当前大概选中了哪个 Company”的隐式上下文。

## 3. 身份认证与同一账号的多重职责

### AUTH-001

首次部署必须创建一个本地 Bootstrap Owner，用于完成 Instance 初始化和 OIDC Provider 配置。该账号属于恢复面，不代表普通成员的默认登录方式。

### AUTH-002

首期支持配置一个通用 OIDC Provider。启用 SSO 后，普通成员默认通过 OIDC 登录；本地密码登录只允许显式标记的少量恢复管理员使用，其成功、失败、凭证变更和恢复操作必须进入安全审计。

### AUTH-003

外部身份必须使用 OIDC `issuer + subject` 作为稳定绑定键。Email、Display Name 和头像只是可更新 Profile 属性，不得单独用于登录时认领或合并既有账号。账号绑定、解绑和冲突处理必须是显式且可审计的管理员动作。

### AUTH-004

首次 OIDC 登录可以 JIT 创建平台 User，但新 User 默认没有 Instance Admin Role、Company Membership、Principal Grant 或可进入的 Workspace。认证成功只证明“你是谁”，不能自动推导“你能访问什么”；所有企业和部门授权仍须由管理员显式授予。

### AUTH-005

企业管理员可以停用平台 User 并撤销其全部 Session。Instance Role、Company Membership 或 Principal Grant 失效后，现有标签页、API 请求和实时连接必须按本文件的权限变化协议立即重新鉴权；IdP 侧停用但尚未同步到平台的账号最迟在平台 Session 到期后失去登录能力，管理员可提前执行平台停用和全 Session 撤销。

### AUTH-006

首期不建设 SAML、LDAP、SCIM、多 OIDC Provider、IdP Group 到 Instance Role/Company Membership 的自动映射或完整企业目录同步。缺少目录同步不得通过 Email Domain 自动授予部门权限来补偿。

### IDN-001

一个用户账号可以同时持有 Instance Admin Role 和零个或多个 Company Membership，不需要切换账号或重新登录。

### IDN-002

Instance Admin Role 与 Company Membership 必须是相互独立的授权来源：

- Instance Admin Role 只在 Enterprise Scope 生效；
- Company Membership 只在对应 Company Scope 生效；
- Instance Admin 进入自己所属部门后，必须使用该部门的 Membership Role 和显式 Grant；
- 企业身份不得叠加为部门内的隐式超级权限。

### IDN-003

首期继续使用现有 `owner`、`admin`、`operator`、`viewer` Company Membership Role，不建设复杂企业 RBAC。

### IDN-004

Agent 身份始终绑定单一 Company。Scope Switcher 是人类用户界面能力，不允许 Agent 使用企业身份跨 Company 运行。

## 4. 进入依据与权限来源

### ACS-001

进入一个 Workspace 和在 Workspace 内执行动作必须分别校验：

| Scope | 进入依据 | 动作权限来源 |
| --- | --- | --- |
| Enterprise | Instance Admin Role | 企业治理权限 |
| Company | Active Membership | Membership Role + Principal Grant |
| Company 临时访问 | Active Break-glass Session | Session Permission Scope |

### ACS-002

Instance Admin 可以发现企业中的所有部门及其治理投影，但不得仅凭 Instance Admin Role 读取任意 Company 的 Issue、SOP、Run、Artifact、Agent 配置、Prompt、Skill 内容、Secret 或业务活动。

### ACS-003

现有 Company 内容 API 必须统一要求 Active Membership 或 Active Break-glass Session。`allow_instance_admin` 不得作为 Company 内容访问结果。

### ACS-004

企业治理投影必须通过独立 Instance API 提供，不得通过放宽 Company API 权限实现。

### ACS-005

“可以看到部门存在”不得被解释为“可以进入部门空间”。企业目录与工作区列表必须使用不同数据源和返回契约。

## 5. Workspace Scope Switcher

### SWT-001

产品 Shell 必须提供统一 Scope Switcher，按以下分组展示：

```text
企业
└── 企业控制台（仅 Instance Admin 可见）

我的部门
├── Active Membership Company
└── Active Break-glass Company（显式临时标识与到期时间）
```

### SWT-002

企业管理员没有 Membership 的部门不得出现在“我的部门”中。其部门目录和治理状态只能从企业控制台查看。

### SWT-003

用户主动切换 Scope 时，系统优先恢复该 Scope 最近一次成功访问的有效页面；没有记录或页面已失效时进入该 Scope 默认首页。

### SWT-004

最近访问记录只是导航便利信息，不能授予权限，也不能覆盖当前标签页 URL。

### SWT-005

切换到 Break-glass Company 前必须再次显示临时访问原因、权限范围和到期时间，禁止静默进入。

## 6. URL 与导航状态

### NAV-001

浏览器 URL 必须是当前标签页 Scope 的 Source of Truth：

```text
/enterprise/*       → Enterprise Scope
/:companyPrefix/*   → Company Scope
```

API 继续使用稳定 ID，不以可变 Prefix 作为授权键。

### NAV-002

深链必须保留 Path、Query 和 Hash。打开深链时先校验目标 Scope 权限，再加载页面数据。

### NAV-003

多个浏览器标签页可以处于不同 Scope。一个标签页中的手工切换不得强制其他标签页跳转。

### NAV-004

跨标签页共享的 Membership、Instance Role 和 Break-glass 变更必须触发各标签页独立重新校验，但标签页 URL 和导航历史保持独立。

### NAV-005

用户访问无权进入的 Company 深链时，产品必须进入通用 Access Denied 状态，不加载或短暂闪现旧业务内容，也不得通过错误差异泄露资源是否存在。

## 7. 服务端授权边界

### SRV-001

服务端必须根据经过认证的 Actor、API 资源所属 Company 和持久化授权关系计算权限。客户端 Scope、菜单状态或请求 Header 不得作为独立授权依据。

### SRV-002

`/api/companies` 必须只返回当前用户可进入的 Company，即 Active Membership 或 Active Break-glass Company；不得因为用户是 Instance Admin 返回全部 Company。

### SRV-003

企业部门目录必须使用独立的治理投影契约。首期至少区分：

- Workspace Directory Entry；
- Governance Health/Cost/Risk Projection；
- Company Business Content。

前两者可由企业管理员访问，第三者必须经过 Company Access 校验。

### SRV-004

授权实现必须收敛到公共入口，至少同时覆盖：

- Company Route Guard；
- Authorization Service；
- WebSocket/SSE 握手和重连；
- 文件、图片、导出和插件静态资源；
- 后台 Job 和异步回调。

禁止只在页面路由或主 REST Handler 中校验。

### SRV-005

Company Prefix 只用于人类可读路由。服务端必须解析到 Company ID 后再校验，且请求内资源 ID 必须与 Company ID 一致。

### SRV-006：文件内容权与企业治理权分离

部门文件资源库的目录、文件详情、预览、下载、内容提取和引用解析均属于 Company Business Content，必须经过 Company Access 校验。企业管理员身份本身不得访问这些接口。

企业管理员只能通过独立 Resource Governance Projection 查看部门级容量、用量、存储健康与治理动作状态，并通过独立治理 Service 下发/收回额度，或对系统明确报告的存储故障执行重算用量、重试 Blob 回收等不需要选择业务文件的有限维护动作。首期企业治理不能选择具体 Resource File/Folder 执行删除、移动、恢复或永久清除；这些逻辑文件动作仍由具有 Company 内容权限的部门角色完成。治理动作不得返回文件内容、创建隐式 Membership、打开部门空间或绕过 Break-glass；读取投影和执行动作均进入企业级安全审计。本阶段不定义风险识别、文件隔离、定向删除或风险处置流程。

### SRV-007：Run 人员角色与 Artifact 派生访问

Run Owner 和 Human Gate Assignee 必须是目标 Company 的有效成员。其 Artifact 访问权从本次 Run 的权威人员角色派生，不创建永久 Resource File Grant，也不扩大到其他 Run、部门资源库或部门管理能力。

Run Owner 与本次 Run 已解析的全部 Human Gate Assignee 可以查看、下载、比较、标注和 Review 本次 Run 的全部 Artifact。该派生权限与 Actor 通过 Project Membership 获得的基础查看权取并集：Run 角色可以让未持有 Project 基础权限的责任人只访问本 Run，也可以补足管理动作；Project 授权成员仍按 Project 权限查看该 Project 的 Run 与 Artifact，但不因此获得 Run Artifact 管理或 Gate 决策权。Artifact 内容保持不可变；Human Gate Assignee 只能裁决分配给自己的 Gate；发布 Artifact 到资源库仍须单独校验部门资源发布权限。

人员被改派、Membership 失效或权限撤销时，后续请求必须重新鉴权并撤销其由 Run 人员角色派生的后续访问；若 Actor 仍是 Project 授权成员，则只保留 Project 基础权限。任一必需 Run 人员失效会暂停 Run 并产生改派 Attention；系统不得静默选取替代人。历史审阅与已完成决策记录保留原 Actor，不因改派而改写。

### SRV-008：首期部门资源权限

普通部门成员可以浏览、下载和上传资源，并管理自己上传且未受 SOP Binding 保护的 Resource File。部门管理员或显式资源管理员可以管理部门内全部 Folder 与 Resource File，但仍须遵守 SOP Binding 的删除、移动和重命名保护。

Agent 不继承人类成员的资源库浏览能力，只能访问 SOP Resource Binding 或本次 Run 明确授权的资源。首期不提供 Folder ACL、逐文件分享链接或复杂权限继承。

删除资源只会把有权管理且未受 Binding 保护的逻辑资源移入部门回收站。恢复与永久清除继续校验当前部门权限；企业管理员的内容盲治理权限不能借回收站读取文件内容。

## 8. Break-glass 临时访问

### BRK-001

Break-glass 必须是独立、显式、限时、可撤销的 Company Access Session，不得通过创建临时 Membership 或永久 Principal Grant 模拟。

### BRK-002

申请至少包含：目标 Company、业务原因、期望权限范围、有效期和关联事件/工单。系统必须记录申请人、审批人或事件模式授权人。

### BRK-003

普通 Break-glass 必须经过目标 Company Owner/Admin 或企业定义的独立审批人批准。紧急事件模式可以绕过事前审批，但必须要求单独的高权限能力、强制原因、最短可用有效期、即时通知和事后复核。

### BRK-004

Break-glass 默认只读。任何写操作必须在 Session Permission Scope 中逐项声明并单独获批；Session 不得授予部门 Owner 身份、Secret 明文读取、凭据导出或权限管理能力。

### BRK-005

每个 Company 请求都必须由服务端重新校验 Session 的 `startsAt`、`expiresAt`、`revokedAt` 和 Permission Scope。前端倒计时仅用于提示。

### BRK-006

Break-glass 状态必须在所有 Company 页面持续可见，包含访问依据、剩余时间和退出操作；不得伪装成普通 Membership。

### BRK-007

Session 到期、撤销或权限收窄后，所有相关标签页必须立即停止加载数据、关闭实时连接、取消请求、清理 Company Cache 并进入 Access Denied。

## 9. 缓存与实时更新隔离

### ISO-001

Query Key、客户端 Store、Background Job 和实时连接必须包含明确 Scope Partition，Company 数据至少以 `companyId` 分区，Enterprise 数据使用独立分区。

### ISO-002

Enterprise Scope 只能连接治理事件流，不得订阅 Company 业务事件流。Company Scope 只能连接当前被授权 Company 的事件流。

### ISO-003

切换 Scope 时必须先停止旧 Scope 的订阅和在途请求，再激活新 Scope。旧缓存可以保留用于正常切回，但权限撤销时必须删除，不得仅标记为 stale。

### ISO-004

WebSocket/SSE 重连必须重新执行服务端授权，不能依赖首次握手时的历史权限。

## 10. 权限变化与异常处理

### ERR-001

Membership 被归档、Role 被降级、Instance Admin 被撤销或 Break-glass 到期时，系统必须产生授权变更事件并使相关 Session 重新校验。

### ERR-002

如果用户失去当前 Enterprise Scope 权限：

- 有 Company Membership 时，显示权限变化说明并允许用户主动选择部门；
- 没有任何可进入 Scope 时，进入 No Workspace Access 页面；
- 系统不得自动选择一个可能泄露信息的部门深链。

### ERR-003

如果用户失去当前 Company Scope 权限，必须保留通用返回入口，但不得保留资源标题、工件预览、Transcript 或其他业务快照。

### ERR-004

Company 被归档时，现有成员可否查看历史内容由 Company 生命周期策略决定；归档状态本身不得自动等同于删除 Membership。

## 11. 最小数据与接口演进

### MOD-001：复用对象

- Better Auth `User / Account / Session`：平台用户、OIDC 外部身份绑定与人类登录会话；
- `instance_user_roles`：企业身份；
- `company_memberships`：部门长期关系；
- `principal_permission_grants`：部门内细粒度长期权限；
- `approvals`：Break-glass 申请与决策；
- `activity_log`：Company 侧审计。

### MOD-002：新增对象

目标模型至少需要一个不可与 Membership 混用的临时访问对象：

```text
CompanyAccessSession
├── id
├── companyId
├── userId
├── accessBasis = break_glass
├── approvalId / incidentOverrideId
├── permissionScope
├── reason
├── startsAt / expiresAt / revokedAt
└── createdByUserId / revokedByUserId
```

### MOD-003：运行时上下文

前后端统一使用以下逻辑上下文，但服务端必须自行计算：

```text
WorkspaceAccessContext
├── scope: enterprise | company(companyId)
├── accessBasis: instance_role | membership | break_glass
├── permissions
├── authorizationRevision
└── expiresAt?
```

## 12. 审计要求

### AUD-001

必须记录 Scope 相关安全事件：Membership 变更、Instance Role 变更、Break-glass 申请/批准/拒绝/启用/撤销/到期、权限拒绝和跨 Company 访问尝试。

### AUD-002

Break-glass 审计必须能回答谁、何时、为何、经谁批准、访问了哪个 Company、使用了哪些权限、执行了哪些写操作以及何时结束。

### AUD-003

企业管理员查看治理投影不应生成部门业务活动，但必须进入企业级安全审计。

## 13. 验收场景

1. 首次部署的 Bootstrap Owner 可以配置一个 OIDC Provider；启用后普通成员不能绕过 SSO 使用本地密码登录。
2. 用户首次通过 OIDC 登录后建立 `issuer + subject` 绑定，但在未授予任何 Role 或 Membership 时进入 No Workspace Access，不能看到企业或部门数据。
3. 同一用户作为 Instance Admin 和 ENG Operator，可在 `/enterprise/health` 与 `/ENG/dashboard` 间切换；在 ENG 内不具有 Owner 权限。
4. 该用户能在企业目录看到 SALES，但没有 Membership 时不能进入 `/SALES/*`，也不能调用 SALES Company API。
5. 两个标签页分别停留于 Enterprise 与 ENG，任一标签页导航不改变另一标签页。
6. ENG Membership 被撤销后，ENG 标签不再显示旧内容并关闭实时连接；Enterprise 标签仍可使用。
7. 企业管理员停用用户并撤销全部 Session 后，所有标签页、API 和实时连接停止访问；恢复账号不会自动恢复已撤销 Membership。
8. 用户通过有效 Break-glass 进入 SALES，页面持续显示临时访问状态；到期后服务端与前端同时拒绝继续访问。
9. Instance Admin 调用任一现有 Company 内容 GET API 且没有 Membership/Break-glass 时返回一致的拒绝结果。
10. Agent API Key 仍只能访问自身 Company，不受人类用户 Scope Switcher 影响。
11. 深链的 Query/Hash 在合法切换和刷新后保持；无权深链不泄露资源存在性。

## 14. 验证证据

- [Enterprise / Company 作用域与授权验证](../../../../doc/research/2026-07-23-enterprise-company-scope-authz.md)
- `ui/src/context/CompanyContext.tsx`
- `ui/src/components/Layout.tsx`
- `ui/src/lib/company-routes.ts`
- `ui/src/context/LiveUpdatesProvider.tsx`
- `server/src/middleware/auth.ts`
- `server/src/routes/authz.ts`
- `server/src/services/authorization.ts`
- `server/src/services/access.ts`

## 15. 当前不包含

- 企业控制台具体页面布局；
- 企业治理投影的完整字段清单；
- 复杂自定义企业 RBAC；
- 跨企业或跨 Instance 身份；
- 企业 SOP 仓库权限；
- 生产环境操作授权。
