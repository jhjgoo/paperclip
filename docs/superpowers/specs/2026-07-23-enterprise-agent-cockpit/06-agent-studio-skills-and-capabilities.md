# 子需求 06：Agent Studio、Skill、能力与双面连接器

状态：产品操作模型已确认；权限、Connector 与 Worker 原型已验证，物理 Schema、生产集成与交互原型未验证\
日期：2026-07-26\
依赖：子需求 01、02、03、04、05\
关联决策：DEC-008、DEC-087、DEC-094 至 DEC-115、DEC-128、DEC-130\
关联验证：VAL-006、VAL-012、VAL-018、VAL-019

## 1. 目标与边界

本子需求定义企业基础 AI 能力如何进入平台、部门如何完成本地配置、Agent 如何获得明确能力，以及 SOP Stage 如何在不提权的前提下绑定 Agent。

责任链固定为：

```text
企业管理员供给基础能力
→ 部门管理员配置部门实例与私有能力
→ Agent Studio 绑定具体能力并完成真实测试
→ SOP Stage 绑定既有 Agent，按需精确收窄
→ Run 固定已验证快照，不临时装配能力
```

首期不建设统一 Marketplace、通用 Capability 父实体、通用“添加能力”入口、复杂供应链安全中心、跨部门 Agent 共享或 Agent 升级体系。

## 2. Agent 的产品定义

Agent 是部门管理员持续创建、编辑、测试、启用和停用的稳定业务角色，不是可安装、发布或升级的软件包。

Agent Studio 至少维护：

- 名称、角色说明与责任边界；
- 精确 Agent Adapter Version；
- 精确 Model Deployment；
- Adapter-specific Config；
- 企业开放或部门私有的精确 Skill Version；
- 具体 Connection ID/Alias 与显式 Tool Selection；
- 不需要外部 Connection 身份的来源限定 Extension Agent Tool；
- 最近真实测试结果与失效原因。

Agent 不拥有 Project Env、业务执行 Environment、Project Workspace 或 SOP。真实测试必须选择一个 Project 或隔离测试运行上下文；选择 Project 时使用其 Project Env，但不得把这些变量复制进 Agent 配置。

## 3. Agent Configuration Snapshot

系统必须在 Agent 配置通过测试并被 SOP 采用时保存不可变 Agent Configuration Snapshot。Snapshot 用于固定发布和运行事实，不在产品中表现为“Agent Version”。

部门管理员后续维护同一 Agent 不得改变既有 SOP Release。SOP Studio 只提示绑定 Agent 的当前配置已经变化；SOP 负责人显式同步、重新执行 Validation Run 并创建新 Binding Revision 后，未来 Run 才采用新 Snapshot。

Department Skill 候选被 Improvement Campaign 接受后，也只会创建新的不可变 Department Skill Version，不会自动替换 Agent 当前配置。部门管理员必须显式更新并真实测试 Agent，SOP 负责人再同步 Binding、执行 Validation Run 并发布新 SOP Release，未来 Run 才会采用该 Skill Version。

Snapshot 至少固定：

- Adapter Version；
- Model Deployment ID 与当时的 Provider Model ID；
- Skill Version 集合；
- Connection ID/Alias、系统生成的 Connection Configuration Revision 与其中固定的 Connector Version、Endpoint、稳定 Credential Reference、结构化配置、Tool Catalog Contract 和 Platform Integration Contract；
- Agent 对每条 Connection 显式选择的稳定 Tool ID 集合；
- Agent 直接选择的 Extension Agent Tool Namespaced ID、Extension Package Version、Contribution Revision 与 Tool Contract Digest 集合；
- Adapter-specific Config 的非 Secret 配置摘要；
- 测试结果、时间和所用 Project/Test Runtime Context；
- 可审计配置指纹。

Snapshot 不保存明文 Secret，也不阻止凭证在保持同一稳定身份时轮换。Credential Secret 原地轮换不创建新的 Connection Configuration Revision；每次实际 Invocation 记录所解析的 Credential Version。

## 4. 企业能力入口

Enterprise Console 中以下能力各自拥有独立导航、列表、详情和类型专属动作：

```text
Models & Credentials
Connectors
MCP Servers
Adapters
Skills Registry
Platform Extensions
```

跨类型 AI Infrastructure Catalog 只能是联邦式治理读模型，用于搜索 Type、Source、Enterprise Status、Department Availability、Health 和 Impact，并深链到专属详情。它不承载安装、授权、升级或编辑，也不创建通用 Capability 写模型。

首期优先打通添加或安装、配置、基础测试、部门开放、停用、影响查看和审计。统一信任评分、包签名、Publisher Trust、漏洞扫描和复杂准入工作流延后。

## 5. 双面 Connector

Connector 是 Paperclip 与一个外部业务系统之间的单一集成契约：

```text
Agent-facing
└── 通过 MCP 暴露 Tool

Platform-facing
├── Event
├── Webhook
├── Sync
└── External Object
```

两面共享同一个 Connector Definition、外部系统身份和关联语义。MCP Runtime 与 Platform Extension Contribution 只是底层实现引用，不能形成需要重复安装、授权或维护的第二个 Connector。

Connector Detail 作为唯一产品详情，集中展示版本、配置 Schema、两面 Capability、实现来源、部门开放范围、健康和影响。安装或更新必须在一个流程中展示 Tool 与 Event/Webhook/Sync/External Object Diff。

## 6. Connection 与 Agent Tool Binding

Connection 是部门为 Connector 或需要配置的独立 MCP Server 建立的稳定命名外部身份。同一部门可以为同一 Definition 创建多个 Connection；不存在隐式部门默认 Connection。

Connection 至少包含：

- 稳定 ID、名称与 Alias；
- Connector/MCP Definition 与精确版本；
- Endpoint、Credential Reference；
- Provider Tenant、Organization、Site 或账套身份；
- Tool Health 与 Platform Integration Health；
- Agent、SOP Release 和活跃 Run 影响。

Agent Tool Binding 只接受两类明确来源的 Tool：

- `Connection-backed Tool`：需要外部业务系统身份，通过具体 Connection ID 与稳定 Tool ID 绑定；
- `Connectionless Extension Agent Tool`：不需要外部 Connection 身份，通过来源限定的 Namespaced Tool ID 绑定，在 Agent Studio 中显示为“平台工具”。

任何需要外部业务系统身份、租户、账套或 Credential 的 Tool 都必须归入 Connector/Connection，不能伪装为 Connectionless Tool 绕过 Connection 生命周期。绑定 Connection 不自动授予全部 Tool；“全选”只能是可见批量动作；Connector 或 Extension 新增 Tool 都不得自动进入既有 Agent Binding。

```text
来源能力边界
∩ Agent Tool Binding
∩ Optional Stage Allowlist
∩ 当前授权与撤权状态
= Invocation 有效 Tool 集合
```

两类 Tool 共用同一个 Agent Tool Binding、Stage Allowlist、短期能力凭证、Tool Gateway 和审计链。Connection-backed Tool 的来源能力边界包含 Connection/Credential Scope；Extension Tool 的来源能力边界包含 Extension 启用状态、部门开放范围、Contribution Version 和 Tool Contract。Tool Profile 只可预填一组选择，不成为必经配置层或新的授权层。

### 6.1 Connection 配置向导与 Probe

默认流程固定为：

```text
选择应用
→ 填写 Endpoint、外部身份和 Credential Reference
→ 在 Worker 临时 Sandbox 中测试连接
→ 发现 Tool / Event / Webhook / External Object
→ 预览 Schema、风险和副作用
→ 选择能力并保存 Connection Configuration Revision
```

部门用户不需要在默认流程理解 Profile、Gateway、Policy、Grant 或 Runtime Slot；这些对象只在诊断和高级设置中展示。Probe 必须使用短期 scoped Secret，限制网络目标、超时和响应大小，并记录请求摘要、响应 Schema、风险、副作用和审计证据。写操作优先使用 Provider dry-run；不支持 dry-run 时必须经过 Human Gate。Probe、stdio MCP、外部 Skill 和生成代码均由 Worker/Sandbox 执行，不能进入 Server 主进程。

Knowledge Processing 可以生成不含 Secret 的 `Connection / HTTP Tool Draft Candidate`。接受 Candidate 只预填向导，不能创建健康 Connection、绑定 Agent 或启用 Tool；来源不明确、缺少精确 URL/Method/参数或风险无法判断时，只生成 Warning，不猜测可执行接口。

## 7. Platform Integration

部门在 Connection Detail 中单独启用 Connector 声明支持的 Event、Webhook、Sync 与 External Object。Definition 只声明能力，Connection 才承载具体外部身份和启用配置。

Platform Integration 与 Agent Tool Binding 正交：

- 选择或取消 Agent Tool 不改变后台 Sync；
- 启用 Webhook 或 External Object 不向 Agent 授权 Tool；
- Tool Health 与 Sync Health 分别展示；
- SOP Run 不选择 Connector、Connection 或 Platform Integration。

## 8. Connection 与 Connector 生命周期

Connection 保持稳定身份：Display Name 可修改；同一外部身份下的 Credential Secret 可以原地轮换；Endpoint、Connector Version、结构化 Connection 配置或 Platform Integration 配置变化时，仍使用同一 Connection，但系统在重测通过后创建新的不可变 Connection Configuration Revision。Provider Tenant、Organization、Site 或账套变化必须创建新 Connection。

停用 Connection 可恢复，不删除 Agent Binding 或改写 SOP Release。停用后阻止新 Tool 调用、Platform Sync 和外部动作，并把依赖它的活跃 Stage 转为结构化 Blocked/Attention。

存在当前 Agent 或已发布 SOP Release 引用时禁止删除。历史 Run 不永久阻止删除，但必须保留 Connection Identity Snapshot 和调用审计。

Connector Version 可以并存。安装新版本不迁移 Connection；部门管理员在 Connection Detail 中显式执行升级、查看两面 Diff、处理失效 Tool Binding、完成测试后确认迁移。迁移只更新 Connection 的当前配置指针并生成新的内部 Connection Configuration Revision；旧 Agent Configuration Snapshot、SOP Release、活跃 Run 与 External Action Intent 继续引用原修订，不能读取新的 Endpoint、Schema 或 Platform Integration 配置。该内部修订不作为用户需要维护的第二个 Connection 或“连接版本”展示。旧 Connector Version 仍有有效修订引用时禁止卸载。

## 9. 独立 MCP Server

独立 MCP Server 只提供两种模式：

- `Remote MCP`：连接企业登记的 HTTP Endpoint，保存 Tool Catalog Revision 并检测远端变化；
- `Managed MCP`：依据企业维护的不可变 Runtime Template Version，由 Agent Execution Worker 启动和管理。

Remote MCP 的远端版本不受 Paperclip 控制，产品不得提供虚假的回滚。Managed MCP Runtime Template 可以版本并存，Connection 显式迁移。

Connector 内部 Agent-facing MCP 不进入独立 MCP Servers 列表。`mcp.json` 的 Remote 条目生成待配置 Draft；stdio 条目必须映射已有 Managed Runtime Template，部门不得直接保存任意 Command/Args。

## 10. Agent Adapter

Agent Adapter 是企业级、可版本化的 Runtime Driver，不是 Agent、Connection、Connector 或 Platform Extension Contribution。

企业管理员管理 Built-in 与 External Adapter Definition/Version、Schema、基础加载测试、部门开放、停用和受引用保护卸载。部门只能在 Agent Studio 选择企业开放的精确版本。

完整可用性必须在 Agent Studio 中组合 Model Deployment、Adapter-specific Config 与选定 Project/Test Runtime Context 进行真实调用测试。目标架构由 Agent Execution Worker 加载 Adapter，Paperclip Server 只管理定义、版本、开放范围和运行事实。

## 11. Models & Credentials

模型能力使用两层结构：

```text
Model Credential
└── Model Deployment[]
```

Model Credential 由企业管理员维护 Provider、Endpoint 和 Secret Reference。Model Deployment 固定 Credential Reference、Provider Model ID/Deployment Name、支持参数、成本元数据、兼容 Adapter、健康和部门开放范围。

部门 Agent 只选择合法 Model Deployment ID，不能读取 Secret、填写 API Key 或自由拼接 Endpoint/Credential/Model ID。Credential 轮换保持 Deployment ID；Provider、Endpoint 身份或实际 Model ID 变化必须创建新 Deployment。

## 12. Skills Registry

Skills Registry 分为：

- `Enterprise Skills`：企业管理员直接创建或从外部仓库安装后形成的企业 Skill；
- `External Repositories`：用于发现外部 Skill 与版本的来源仓库。

外部 Skill 的指定版本安装后，必须成为企业仓库内独立、不可变的 Enterprise Skill Version；运行时不直接读取上游，也不自动跟随 `latest`。企业按具体版本向部门开放。

部门 Skills 页面分隔“企业可用”和“部门私有”。企业 Skill 只能采用，不能在部门侧修改；Department Skill 由部门自行创建、测试和版本化。企业管理员不能列出、搜索或读取任何 Department Skill。部门主动提交发布快照进入企业审批属于后续能力。

## 13. Platform Extension

Platform Extension 是 Instance 级可信代码安装，不是统一 Marketplace。企业管理员治理 Extension Package 来源、版本、Capability、启停、健康、卸载和 Contribution 影响；部门、Agent 与 SOP 不直接安装或绑定 Extension。

Extension 可以贡献 Connector Definition、Agent Tool、Sandbox Provider Driver、External Object Provider、Job、Webhook 或 UI。每种 Contribution 按自身领域规则决定部门可用性和配置；停用 Extension 前必须展示全部受影响 Contribution。

需要外部业务系统身份的 Agent Tool Contribution 必须作为 Connector/Connection 能力进入 Agent Studio；只有不需要 Connection 的独立 Agent Tool Contribution 才进入“平台工具”。部门管理员绑定的是具体 Tool，不是 Extension Package；SOP 绑定的是 Agent，最多再用稳定 Tool Key 收窄，不能安装或选择 Extension。

Extension Agent Tool 复用现有 Agent Tool Binding 与 Tool Policy，不创建 Extension 专用 Grant。Agent Configuration Snapshot 必须固定其 Extension Package Version、Contribution Revision 与 Tool Contract Digest；Extension 更新、停用或重新安装不得静默改变既有 SOP Release 与活跃 Run 的能力解释。

Adapter、Connector、MCP 和 Skill 不强制继承自 Platform Extension，也不因底层代码由 Extension 提供就改变各自产品身份。

## 14. Project Env 与执行基础设施

维持 Paperclip 原有 Project Env：只保存项目级环境变量与 Secret Reference，并在属于该 Project 的 Task 或 SOP Run 派发前解析注入 Agent Adapter 运行配置。

不新增 Project Environment 或 Project Runtime Profile。Project、Agent 和 Stage 均不通过 Project Env 选择镜像、Dockerfile、Worker、Sandbox Provider 或执行后端。Instance、Worker、Docker/Sandbox、数据库、存储和网络参数通过 `.env`、Docker Compose 或系统配置维护；Enterprise Console 只观察 Runtime Health。

Run 记录所用变量键、Secret Binding/Version 与实际执行后端事实，不持久化明文 Secret。

## 15. SOP 与 Run 边界

Stage Binding 只做 `Role Slot → Agent`。未配置 Stage Allowlist 时继承固定 Agent Configuration Snapshot 的有效能力；配置时只按 Skill Version ID、Connection ID 和来源限定 Tool Key 等稳定标识取交集。Stage 可以按 Connection ID 收窄外部身份范围，但不绑定底层 Connector 或 Extension Package 实现。

SOP Studio、SOP Run、Planner 和 Executor 均不得：

- 新建或切换 Connection；
- 安装 Connector、MCP、Adapter 或 Skill；
- 选择新的 Tool 或 Secret；
- 用自然语言或语义匹配解释权限；
- 扩大 Agent 已有能力。

## 16. 验收场景

1. 企业开放 Adapter、Model Deployment、Connector Version 和 Enterprise Skill Version；部门创建 Connection、选择 Tool、组装 Agent 并完成真实测试。
2. 同一 Connector 同时提供 MCP Tool 与 Webhook/Sync，企业只维护一个 Definition，部门只创建一条 Connection 身份链。
3. Connector 新版本新增 Tool 后，既有 Agent 不自动获得；删除 Tool 时相关 Binding 和发布检查明确失败。
4. 部门轮换同一外部账号凭证时 Connection ID 与 Configuration Revision 保持不变，但 Invocation 记录新的 Credential Version；切换账套时必须创建新 Connection。
5. 部门管理员维护 Agent 或把 Connection 从 Connector V1 迁移到 V2 后，既有 SOP Release、活跃 Run 和 Intent 仍精确引用旧 Connection Configuration Revision；同步配置、Validation Run 和新 Binding Revision 后未来 Run 才采用新修订。
6. 企业管理员无法查看 Department Skill；部门只能采用企业开放的精确 Enterprise Skill Version。
7. Agent 在 Project 中测试时获得 Project Env，但 Agent 配置中不存在执行 Environment 或项目变量副本。
8. SOP Run Composer 不出现 Connector、MCP、Skill、Tool 或权限选择器。
9. Agent Studio 可分别绑定 Connection-backed Tool 与“平台工具”，两者经过同一 Tool Gateway 和授权链；需要外部账号的 Tool 不能绕过 Connection。
10. Extension 发布新版本或修改 Tool Contract 后，既有 Agent Configuration Snapshot、SOP Release 和活跃 Run 仍解析旧来源版本与 Contract Digest，直到部门显式重绑、测试、Validation 和发布。
11. 用户通过默认向导完成一个 Connection，无需配置底层 Grant/Runtime Slot；发现的新 Tool 默认未选择。
12. HTTP Tool Candidate 不含 Secret，Probe 在临时 Sandbox 中执行并留下 Evidence；写操作没有 dry-run 或 Human Gate 时不能完成测试。

## 17. 验证状态与缺口

已在原型范围验证：

- VAL-006：两类 Tool 的稳定 ID Allowlist、统一授权链、短期凭证、授权撤销、旧 Token 失效与 Extension Tool 版本固定；
- VAL-012：双面 Connector Definition、Connection、Agent Tool 与 Platform Integration 的实际覆盖，以及隔离真实 GitHub Provider 链路；
- VAL-018：Managed MCP 与 Adapter 在独立 Worker、Sandbox 和 Workspace 隔离模型下的执行边界。

仍需验证：

- Connector Version、Connection Configuration Revision、Tool Catalog Revision、Extension Contribution Revision、Tool Contract Digest、引用保护删除和迁移事务的物理 Schema；
- 上述能力通过正式 Connection、Tool Gateway、Worker、Secret 与审计链的最小生产纵切；
- Agent Studio 的真实测试、失效提示和配置同步交互原型。
- Connection 向导、发现、Probe、Schema Preview、风险提示与 Test Evidence 的交互原型；
- Knowledge-derived Capability Draft Review Queue 到 Connection/Skill 草稿入口的来源固定、过期和拒绝行为。

这些是生产证据和实现设计缺口，不再是产品责任链或操作模型待选项。
