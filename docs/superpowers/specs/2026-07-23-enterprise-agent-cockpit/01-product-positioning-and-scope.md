# 子需求 01：产品定位、目标与范围

状态：产品目标与范围已确认，量化指标待灯塔基线\
依赖：无\
关联决策：DEC-001 至 DEC-005、DEC-009、DEC-010、DEC-013、DEC-016 至 DEC-018、DEC-034、DEC-086 至 DEC-124

## 1. 目的

本子需求定义企业级多 Agent 协作驾驶舱的产品定位、目标用户、核心问题、价值主张、产品边界和阶段性成功标准。后续所有子需求不得与本文件冲突。

## 2. 背景与问题

一线业务团队已经能使用多个 AI 工具完成局部任务，但缺少跨 Agent、跨工具、跨系统的统一交付机制，主要表现为：

1. Agent、模型、Skill、MCP、Connector 和 Connection 分散配置；
2. 工作过程存在于多个对话和工具中，负责人无法获得统一进度；
3. Agent 自报完成，缺少基于外部事实和工件的独立验收；
4. 失败后依赖人工重新解释上下文，容易重复工作和产生副作用；
5. 权限、凭据、成本、审批和风险缺乏统一治理；
6. 团队 SOP 多为文档或隐性经验，无法直接运行；
7. 多次运行后的经验不能稳定反馈到 SOP 和 Skill 版本。

## 3. 产品定位

### POS-001

产品必须定位为 AI 交付控制舱，而不是通用聊天应用、Agent IDE 或传统 BPM 工作流平台。

### POS-002

产品必须以业务目标、交付进度、待处理事项和最终工件为主要用户心智；Agent、模型和工具是支撑资源。

### POS-003

产品必须基于 Paperclip 现有控制面演进，保持“控制面不替代执行面”的架构原则。

### POS-004

产品必须允许外部专业系统继续作为其领域事实源，例如 Git、CI/CD、Jira、CRM、ERP 和云平台。

## 4. 第一目标用户

### USR-001：一线业务团队

产品必须优先服务有明确业务目标、可描述工作方法、需要多个 Agent 与外部系统协作的团队。

### USR-002：部门负责人 / SOP 负责人

产品必须支持其搭建、发布、运行、观察和优化部门 SOP，并能够解释速度、质量、成本和风险变化。

### USR-003：团队能力管理员

产品必须支持其创建、测试和维护具体 Agent，配置 Adapter、Model Deployment、Skill、Connection 与 Tool，并维护部门私有 Skill、Connection 和 Project Env。

### USR-004：企业管理员

产品必须支持其治理企业 AI 基础设施、健康、成本、风险、合规和审计，但不得默认授予部门业务内容访问权。

## 5. 核心用户任务

### JOB-001

业务成员能够发起一个目标，选择或进入合适 SOP，补充必要输入，并持续看到当前进度、风险、待办和成果。

### JOB-002

SOP 负责人能够把文档或隐性工作方法转化为包含阶段、角色、工件、验收、Loop 和审批的运行契约。

### JOB-003

团队管理员能够为 Agent 配置长期能力，并在 SOP 绑定时看到能力匹配与缺口。

### JOB-004

负责人能够在 Agent 阻塞、超预算、需要审批或外部系统异常时暂停、处理并从持久化状态恢复。

### JOB-005

负责人能够查看多次 Run 的质量、周期、成本和失败模式，并将改进形成候选版本。

### JOB-006

企业管理员能够在不读取业务内容的前提下查看部门健康、平台成本、能力风险和合规异常。

## 6. 核心价值

### VALU-001：统一能力

平台必须统一管理 Agent、Adapter、Model Deployment、Skill、MCP、Connector、Connection 和 Tool 的可用关系：企业治理可供给定义，部门完成本地配置，Agent 获得明确绑定，SOP 只能继承或收窄。Project Env 继续承载项目级变量与 Secret Reference，不属于企业能力供给或执行后端选择。

### VALU-002：过程可控

平台必须提供版本固定、权限检查、预算、审批、暂停、恢复、工件和审计能力。

### VALU-003：交付可验证

阶段完成必须基于 Artifact、Verifier、外部状态和人工决策，不得仅依赖 Agent 自报。

### VALU-004：局部动态

SOP 必须允许 Stage 内 Planner、Agent、Verifier 动态纠偏，同时保持跨 Stage 的责任、门禁和允许路径稳定。

### VALU-005：持续改善

平台必须区分运行内纠偏与跨运行优化，并支持从真实轨迹发起有界 Improvement Campaign：冻结基线和评价条件，由 Agent 在明确修改边界内连续提出隔离候选，经独立验证后由人决定是否晋升为只影响未来 Run 的新版本。

## 7. 产品成功结果

### OUT-001：可搭建

部门能够在不直接编写底层运行代码的情况下，定义并试运行一套真实业务 SOP。

### OUT-002：可解释

任意 Run 都能够回答：为什么运行、当前在哪个 Stage、谁在负责、使用了什么能力、产生了什么工件、依据什么推进、花费多少、为何失败或阻塞。

### OUT-003：可恢复

Agent 进程或上下文结束后，平台能够依靠版本化状态、工件、外部事实和恢复点继续运行。

### OUT-004：可治理

部门和企业管理员能够在各自职责边界内控制权限、成本、风险和审计，不相互侵入。

### OUT-005：可优化

团队能够基于多个 Run 发现高频问题，形成候选版本，并在发布前完成可解释的验证和对比。

定量目标需要结合灯塔团队基线数据确定，登记在验证台账，不在缺少基线时预设数字。

## 8. 产品边界

### IN-001：当前范围

- Instance 与 Company 两级工作空间；
- 部门 Dashboard；
- SOP Draft、Release、Binding 和 Run；
- Stage Contract 与有界 Loop；
- Agent、Skill、Connection、Tool 与 Project Env 配置；
- Run Cockpit、Artifact、Evidence 和 Attention；
- 部门级质量、成本，以及受控自治 Candidate Experiment 与人工晋升；
- 企业级基础设施、健康、成本、风险、审批、合规和审计视图，以及组织/额度、能力生命周期、Worker 和受限恢复操作；
- 部门管理员从空白 Draft 自主搭建、试跑、发布和运行 SOP 的完整链路；
- 企业管理员供给基础 AI 能力、部门管理员自主创建和测试 Agent 的最小 Agent Studio；
- 支持纯业务 Project 以及零到多个 Git Root、Project Env、Preflight 和隔离 Run 派生的最小 Project Workspace；
- 包含完整核心驾驶、人工介入、失败恢复与 Project Artifact 检查发布的 Run Cockpit；
- 以研发灯塔 SOP 作为测试环境交付验收样本。

### OUT-OF-SCOPE-001：当前不做

- 独立 SOP Engine；
- 通用聊天产品；
- Git、Jira、CI/CD、CRM 或 ERP 替代品；
- 生产部署灯塔原型；
- 企业 SOP 仓库与市场；
- 跨部门 SOP 打包和传播；
- 生产 SOP 原地自修改、候选自动发布，以及自动演化 SOP 拓扑；
- Policy Studio、模型权重训练和自动优化 Evaluator；
- 企业管理员对业务 SOP 的策略覆盖；
- 默认跨部门业务内容访问；
- 一开始建设复杂企业 RBAC。
- 随产品交付预置业务 SOP 或把研发流程硬编码为平台标准。
- Agent Marketplace、跨部门 Agent 共享、复杂升级编排和插件生态运营。
- 远程开发环境、云 IDE、跨 Worker Workspace 迁移、共享存储和 Kubernetes 调度。
- 自定义 Cockpit、复杂跨 Run 对比、Artifact 批量操作、高级全文检索和通用报表设计器。
- 自定义合规规则、DLP、SIEM、风险文件识别、复杂告警编排、通用策略引擎和复杂企业 RBAC。
- 多企业共享 SaaS、Enterprise/Tenant 业务层、跨企业运营后台和 Tenant Billing。
- SAML、LDAP、SCIM、多身份提供商、IdP Group 自动映射部门/角色和完整企业目录同步。

## 9. 产品约束

### CON-001

所有部门业务实体必须保持 Company-scoped，Agent API Key 不得访问其他 Company。

### CON-002

必须保留 standalone Task/Issue 的单负责人和原子 Checkout，以及跨 Task/SOP 共用的预算硬停止、受控审批和变更审计等 Paperclip 不变量；SOP Run、Stage 与 Invocation 不因此创建隐藏 Issue。

### CON-003

生产 SOP Run 必须固定 SOP Release、Execution Definition Revision、Binding Revision、Agent Configuration Snapshot Set、Adapter Version Set、Model Deployment ID Set、Skill Version Set、Connection Configuration Revision Set、SOP Resource Snapshot Set 与 Project Env Resolution Snapshot；Validation Run 必须固定不可变 Validation Snapshot，不能执行可变 Draft。

### CON-004

企业平台护栏只能约束基础设施、资源和高风险能力调用，不得修改 SOP 的业务阶段、工件、验收和返工语义。

### CON-005

SOP 只能检查和收窄 Agent 能力，不得通过 Role Slot、Stage 或 Planner 临时扩大 Agent 权限。

### CON-006

外部副作用必须支持幂等键、事实查询或明确的不可重试处理，不能依赖盲目重放。

### CON-007

一个 Paperclip Instance 只能属于一家企业；Company 只表示该企业内部部门，不能被重新解释为外部客户租户。不同部署环境必须使用独立 Instance 隔离数据、凭证、Worker 与审计。

## 10. 灯塔场景

研发 SOP 原型采用一个真实、低风险、可独立验收的功能需求，边界为：

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

该场景用于验证平台的通用 SOP 能力。`start/build/verify/review/fix/ship` 等研发术语不得硬编码为平台通用枚举。

样本必须使用真实代码仓库、自动测试、代码评审和测试环境。不得用合成需求或示例仓库替代，也不在首轮同时运行多个需求。生产发布和不可接受的生产副作用不进入首轮；失败、返工和人工等待必须真实经过 SOP Kernel，不能由人员在平台外补齐流程。

首轮由 Paperclip 原生 Run Request 接收需求正文、动态参数和可选外部需求链接；不强制接入 Jira、禅道等需求系统。Git 分支/提交、代码评审请求、评审、合并、CI/CD 流水线、部署与测试环境状态必须来自真实外部系统事实，不能通过模拟接口或人工回填替代。

首轮真实 Provider 选择 GitHub + GitHub Actions，覆盖 Branch、Commit、Pull Request、Review、Merge、Workflow/Job 与部署事实。该选择不得进入 SOP 或 Kernel 的通用枚举；GitHub 专有字段由 Connector 和 External Fact 适配，SOP 只引用稳定业务能力。首轮不同时兼容 GitLab/JiHuLab。

测试环境交付分两步验证：L0 先完成真实构建、自动测试和不可变镜像/制品发布，验证 CI、Artifact Digest 与失败回传，但不视为灯塔完成；L1 再由 GitHub Actions 将同一 Digest 部署到固定单节点 Docker 测试服务器，回传 Environment URL、部署状态和健康证据。只有 L1 与 Run Owner 验收完成后才算端到端成功。Agent 不直接 SSH 操作服务器；每 PR 临时 Preview Environment 延后。

灯塔必须同时通过三层验收：交付层完成代码、测试、Pull Request、Review、Merge、制品、L1 部署和 Run Owner 验收；控制层至少覆盖一次验证失败返工、一次持久人工等待/恢复、一次外部状态查询或超时 Reconcile，并证明不重复创建 Pull Request、合并或部署；产品层由部门管理员从空白 Draft 完成搭建、试跑、发布和运行，Run Owner 无需查看原始 Provider Transcript 即可判断进度、停止原因、责任、证据与结果。首轮只采集周期、成本、返工和人工介入基线，不预设效率提升百分比。

目标仓库从企业已有且真实使用的 GitHub 业务服务中选择，必须已有自动测试、Docker 构建和可部署测试环境，需求边界明确、低风险、失败可回滚。具体仓库和需求在灯塔启动前通过检查清单登记，不进入通用产品实体或 SOP 契约。首轮不使用 Paperclip 自身仓库，也不新建示例仓库；Paperclip Dogfooding 留作后续验证。

同一灯塔计划分为 L0/L1/L2：L0 验证 CI、测试与制品；L1 验证真实需求到固定测试环境和 Run Owner 验收，只有 L1 交付、三层成功判据和同期受控故障 Validation Run 全部通过，才可判定研发交付灯塔成功；L2 使用 L1 的不可变运行事实、返工轨迹、Stage Finding 和补充的固定验证 Case 发起独立 Improvement Campaign，只优化一个 Stage Instruction 或一个 Department Skill 内容版本，并由人决定是否晋升。Enterprise Skill 对部门只读，不由部门 Campaign 修改。L2 不属于原 SOP Run，也不修改 L1 历史，但仍阻塞首期完整产品切面完成。

控制正确性使用正式 L1 Run 与受控 Validation Run 共同验证。Validation Run 固定后来被 L1 SOP Release 采用的同一份已验证 Validation Snapshot，并复用相同 Project、Connector、Connection 与权限边界；它不直接执行或冒充生产 Release。复用真实能力契约不代表复用 L1 外部业务对象：Validation Run 必须使用由 Validation Run ID 派生的动作键、专用 Branch/PR/Workflow 输入和非生产目标，不得写入受保护默认 Branch、复用 L1 的 Pull Request/Artifact/Deployment 身份或触碰生产环境；历史回放绝对禁止 dispatch 外部 Effect。演练通过可重复故障开关覆盖测试失败后的局部返工、GitHub 动作已成功但响应超时后的 Reconcile、Human Gate 延迟与进程退出后恢复，以及部署 Workflow 失败后禁止误报成功，并经过真实 Kernel、Connector、GitHub/GitHub Actions 和持久状态；Mock、单元测试或人工叙述不能代替端到端证据。

平台不向部门预置这套 SOP。验收时应由部门管理员从空白 Draft 自主完成 Stage、契约、Agent Binding、Data Binding、验证与人工关卡配置，经模拟试跑成功后发布并创建 Run；样本定义只用于测试产品是否通用可用。

## 11. 验收方式

本子需求在满足以下条件时可视为稳定：

1. 后续子需求均能映射回本文件的目标、用户任务或约束；
2. 未出现新的顶层产品对象与现有范围冲突；
3. 研发灯塔原型能够覆盖 JOB-001 至 JOB-005；
4. 企业治理设计能够覆盖 JOB-006 且不违反 CON-004；
5. 所有定量成功指标均有真实基线或验证计划，不使用无依据数字。
