# 子需求 10：研发灯塔 SOP 原型验证规格

状态：产品验收边界已确认，具体仓库与真实需求待启动前登记\
日期：2026-07-26\
依赖：子需求 01 至 09\
关联决策：DEC-022 至 DEC-027、DEC-035 至 DEC-057、DEC-065 至 DEC-068、DEC-076 至 DEC-090、DEC-094 至 DEC-124\
关联验证：VAL-001 至 VAL-007、VAL-010 至 VAL-018

## 1. 目的

本规格定义首个研发灯塔如何证明企业级多 Agent 驾驶舱能够承载一条真实研发交付链路，而不是规定平台必须内置研发 SOP。

灯塔必须回答三个问题：

1. 一线团队能否从空白 Draft 搭建并发布可运行 SOP；
2. 平台能否在真实代码、CI/CD、人工等待和外部故障下保持控制正确；
3. 一次真实交付完成后，平台能否基于不可变运行事实验证一个受控改进候选。

本规格不定义生产实现计划、数据库表或开发工期。

## 2. 验证边界

灯塔只使用一个真实、低风险、可独立验收的功能需求。该需求通过 Paperclip 原生 Run Request 发起，使用真实 GitHub 仓库、GitHub Actions、固定 Docker 测试环境和实际人工验收。

灯塔里程碑使用 `L0/L1/L2`，避免与 Stage Execution Kernel 已有的 `P0–P10` 原型阶段混淆：

```text
L0  CI Artifact
    真实构建、自动测试、不可变制品

L1  Test Delivery
    真实需求、Pull Request、Review、Merge、测试环境部署、Run Owner 验收

L2  Improvement
    基于 L1 不可变事实的独立 Improvement Campaign 与人工晋升决定
```

`L0/L1/L2` 只是本验证规格的里程碑名称，不是新的产品实体或 SOP Stage 类型。

## 3. 启动登记与准入

具体仓库和需求不需要在产品设计阶段确定，但灯塔启动前必须完成一份检查清单。该清单是验证材料，不新增 Lighthouse Project 等产品实体。

### 3.1 目标仓库

候选仓库必须满足：

- 企业已有并真实使用，不能是新建示例仓库；
- 托管在 GitHub；
- 已有可运行的自动测试；
- 已有 Docker 构建能力；
- 可以部署到固定测试环境；
- 允许创建 Branch、Commit、Pull Request，执行 Review、Merge 和 GitHub Actions；
- 失败可回滚，不依赖生产数据或生产流量；
- 本次需求不要求跨多个代码仓库协同修改。

首轮不使用 Paperclip 自身仓库。Paperclip Dogfooding 属于后续验证。

### 3.2 真实需求

启动材料至少登记：

- 需求正文、业务目标和可选外部需求链接；
- 明确的验收条件；
- 允许修改的代码范围；
- 已知测试命令和测试环境验收方式；
- Run Creator、Run Owner、SOP Owner 和各 Human Gate Assignee；
- 风险说明、回滚路径和禁止动作；
- 成本、时间、重试和人工升级上限。

需求必须低风险、边界明确、可独立验收。破坏性数据库迁移、不可逆外部副作用和生产发布不得进入首轮样本。

### 3.3 平台准备

启动前必须完成：

- 创建部门 Project，并配置 GitHub Repository、Project Workspace、Project Env 和必要 Secret Reference；
- 企业开放 GitHub Connector、Agent Adapter、Model Deployment 和所需 Enterprise Skill；
- 部门创建 GitHub Connection，启用必要 Platform Integration，并为各 Agent 显式选择 Tool；
- 部门管理员创建并真实测试 Planner、Developer、Verifier/Reviewer 等 Agent；
- 从空白 Draft 搭建 SOP，完成 Stage Contract、Data Binding、Agent Binding、Verifier、Human Gate、预算和恢复设置；
- 从 Draft 生成不可变 Validation Snapshot，使用模拟输入或受控历史输入完成绑定该快照的 Validation Run；全部 Binding 和 Preflight 通过、且 Draft 未漂移后，才能把同一已验证基线发布为 SOP Release；
- GitHub Actions 已具备 L0 构建/测试/制品工作流，以及 L1 固定测试环境部署和健康检查工作流。

不得通过直接修改数据库、隐藏配置文件或平台外脚本补齐产品界面无法完成的配置。

## 4. Run Request 与输入

首轮由 Paperclip 原生 Run Request 接收：

- 需求 Goal 或命令；
- 需求正文及动态业务参数；
- 可选外部需求链接；
- 必填 Project；
- 必填 Run Owner；
- SOP Contract 声明的其他类型化动态 Argument；本次文件只能通过已声明的 `file` Argument 上传。

外部 Jira、禅道等需求系统不是首轮硬依赖。Run Request 不选择 Connector、Skill、MCP、Tool 或权限，也不重新上传 SOP Resources 已固定的资料；不存在绕过 Run Request Contract 的无类型临时材料入口。

## 5. 验证用研发流程

部门管理员应能用通用 Stage、Slot、Verifier 和 Human Gate 表达以下样本流程：

```text
已确认需求
→ 技术方案
→ 开发实现
→ 自动测试
→ 代码评审
→ 人工合并关卡
→ L0 不可变制品
→ L1 测试环境部署与健康检查
→ Run Owner 验收
```

这只是验收时搭建的 SOP，不是产品预置模板。平台不得硬编码 `plan / code / test / review / merge / deploy` 等研发专用 Stage 类型、状态或转换。

Stage 内可以使用 Planner、Producer、Verifier 和有界返工 Loop；Stage 之间只按发布后的 Data Binding、Transition、Evidence、Finding 和 Human Gate 推进。

## 6. GitHub 双面 Connector 验收

GitHub + GitHub Actions 是首轮真实 Provider，但不得进入 SOP 或 Kernel 的通用领域枚举。

### 6.1 Agent-facing 能力

按 Agent Binding 和 Tool Selection，Connector 至少能够承载：

- 查询仓库、Branch、Commit 和 Pull Request；
- 创建或更新 Branch、Commit 和 Pull Request；
- 读取 Review、Check、Workflow、Job、Artifact 与 Deployment 状态；
- 在已有授权和 Human Gate 满足后执行 Merge 或触发部署 Workflow；
- 以稳定外部动作键查询或恢复可能已成功的副作用。

Agent 不得直接获得 GitHub Connection 的全部工具，也不得直接 SSH 操作测试服务器。

### 6.2 Platform-facing 能力

Connector 至少能够将以下事实归一到对应 Connection、Project、Run、Stage 和外部对象：

- Pull Request、Review 与 Merge 状态变化；
- Workflow/Job 开始、成功、失败和取消；
- Artifact Digest 与来源 Commit SHA；
- Deployment 状态、Environment URL 和健康证据；
- 重复、乱序或迟到事件的去重与 Reconcile 结果。

GitHub 专有字段只存在于 Connector Contract 和 External Fact 适配层。SOP 只使用“创建代码评审、查询流水线、合并变更、部署测试环境、查询外部状态”等稳定业务能力。

## 7. L0：CI Artifact

L0 必须证明：

1. GitHub Actions 对目标 Commit 执行真实构建和自动测试；
2. 失败 Workflow/Job 形成结构化 Finding，不能被记录为业务通过；
3. 成功后产生可部署的不可变镜像或制品；
4. Paperclip 保存 Commit SHA、Workflow/Job 身份、Artifact Digest、状态和证据深链；
5. 重试不能把不同 Commit 或不同 Artifact Digest 混为同一结果。

L0 通过只代表 CI 与制品链路成立，不能把研发灯塔标记为端到端成功。

## 8. L1：真实测试环境交付

L1 必须从同一个真实 Run Request 完成：

1. 创建隔离 Execution Workspace 和 Branch；
2. 生成技术方案、代码修改和自动测试证据；
3. 创建 Pull Request，并形成 Agent Verifier/Reviewer 结果；
4. 等待指定 Human Gate Assignee 完成 Review/合并决定；
5. 合并经过批准且 Check 通过的精确 Commit；
6. 使用 L0 的同一 Artifact Digest 部署到固定单节点 Docker 测试服务器；
7. 获取 Environment URL、Deployment Status 和 Health Evidence；
8. 由 Run Owner 在测试环境完成最终验收并提交结构化决定；
9. 形成最终 Outcome、Artifact、Evidence、Finding 处置、成本和审计记录。

只有 L1 交付、三层成功判据和同期受控故障 Validation Run 全部通过，才可以声明“研发交付灯塔成功”。它不代表 L2 已完成，也不代表首期完整产品垂直切面已经验收完毕。

## 9. 控制正确性 Validation Run

正式 L1 Run 负责真实业务交付，不强制承担所有故障注入。控制正确性使用固定后来被 L1 SOP Release 采用的同一份已验证 Validation Snapshot、相同 Project、Connector、Connection 和权限边界的受控 Validation Run 验证；Validation Run 不直接执行或冒充生产 Release。这里复用的是能力契约，不是 L1 或生产 Run 的外部业务对象：每个 Validation Run 必须使用由 Validation Run ID 派生的动作键、专用 Branch/PR/Workflow 输入和非生产 Environment，并明确允许副作用、负责人和清理方式。不得写入受保护默认 Branch、复用 L1 的 Pull Request/Artifact/Deployment 身份或触碰生产环境。历史回放绝对禁止 dispatch 外部 Effect。

必须覆盖以下演练：

| 场景 | 注入方式 | 必需结果 |
| --- | --- | --- |
| 自动测试失败 | 受控测试失败开关 | 只返工受影响的开发/测试路径，旧 Output Set 保留审计且不能推进 |
| GitHub 动作已成功但响应超时 | 在 Provider 接受动作后丢弃响应 | Reconcile 复用外部事实，不重复创建 Pull Request、Merge 或其他副作用 |
| Human Gate 延迟 | Gate 保持未决并结束 Agent 进程 | Run 持久等待；处理后从新 Invocation 恢复，不依赖旧 Session |
| 部署 Workflow 失败 | 受控部署失败开关 | Stage 保持失败或阻塞，不能生成成功 Environment Outcome |

演练必须经过真实 Stage Kernel、Connector、GitHub/GitHub Actions、PostgreSQL 持久状态和审计链。Mock API、单元测试或人工叙述不能替代端到端证据。

## 10. L2：独立 Improvement Campaign

L2 在 L1 历史 Run 保持不可变后启动。它不是原 SOP Run 的继续，也不能修改 L1 的 Release、Binding 或运行事实。

L2 必须：

1. 从 L1 与 Validation Run 的返工轨迹、Stage Finding 和结果中选择一个明确改进信号；
2. 冻结 Base Execution Variant，包括 SOP Release、Execution Definition Revision、Binding Revision、Agent Configuration Snapshot Set、Adapter Version Set、Model Deployment ID Set、Skill Version Set、Connection Configuration Revision Set、Evaluator、Validation Cases、SOP Resource Snapshot Set、权限、Project Env Resolution Snapshot 和实际执行后端事实；
3. 只允许修改一个 Stage Instruction 或一个 Department Skill 内容版本；Enterprise Skill 不可由本 Campaign 修改；
4. 生成多个隔离、不可变 Candidate Revision；
5. 使用相同 Evaluation Contract 和固定 Case 完成 Replay/Validation；
6. 保留 Hard Gate、Primary Outcome、Guardrail、样本充分性和 `inconclusive`；
7. 生成 Effect Report；
8. 由部门负责人接受、拒绝、继续实验或以 `inconclusive` 关闭；
9. 接受 Stage Instruction 候选时创建只影响未来 Run 的新 Release；接受 Department Skill 候选时只创建新的 Skill Version，仍须完成 Agent 测试、Binding 同步、Validation Run 和新 Release 才会被未来 Run 采用；两者都不自动改写历史。

L2 通过后，首期完整产品垂直切面的持续改进部分才算完成。

## 11. 三层成功判据

### 11.1 交付结果

- 真实需求验收条件满足；
- 自动测试与 GitHub Check 通过；
- Pull Request 经真实 Review 和 Human Gate 后合并；
- L0 Artifact Digest 与 L1 部署 Digest 一致；
- 固定测试环境健康且可访问；
- Run Owner 完成结构化验收；
- 未解决 Hard Finding、必需 Evidence 缺失或失败 Deployment 时不得完成。

### 11.2 控制正确性

- Agent 自报 `done` 或 Verifier 自报 `pass` 不能绕过 Completion Gate；
- Validation Run 的四类故障演练全部产生预期状态；
- Pull Request、Merge、Workflow 和 Deployment 不产生重复副作用；
- 进程退出、Session 丢失或人工延迟后可以从持久状态恢复；
- Stage 只使用 Agent Configuration Snapshot 内能力，并受稳定 ID Allowlist 收窄；
- Run、Stage、Invocation、Artifact、Evidence、External Fact、Cost 和 Audit 能形成完整因果链。

### 11.3 产品可用性

- 部门管理员只通过产品能力从空白 Draft 完成 SOP 搭建、Validation Run 和发布；
- Run Creator 能用原生 Composer 发起真实目标并补充动态输入；
- Run Owner 无需阅读原始 Provider Transcript，即可判断当前 Stage、停止原因、负责人、待办、证据和最终结果；
- Human Gate Assignee 只能在授权 Stage 操作，Run Creator/Run Owner 的输入权限不跨 Run；
- Project `Artifacts` 能查看 Task Work Product 与 SOP Artifact 的来源隔离、预览、溯源和发布资源库入口；
- 企业管理员只能看到内容盲的健康、容量、成本和审计投影。

三层必须全部通过。首轮记录周期、成本、返工次数和人工介入作为基线，不设置没有真实历史依据的效率提升百分比。

## 12. 必需验收证据包

灯塔验收包至少包含：

- 目标仓库与真实需求启动检查清单；
- SOP Draft、Validation Snapshot、Validation Run、Release、Execution Definition 与 Binding Revision 身份及“发布内容与已验证基线一致”的证明；
- Agent Configuration Snapshot Set 与实际 Adapter Version Set、Model Deployment ID Set、Skill Version Set、Connection Configuration Revision Set、Agent Tool Binding Set；
- Run Request、Run Owner 和 Human Gate Assignee Resolution；
- Branch、Commit、Pull Request、Review、Merge、Workflow/Job、Artifact Digest 和 Deployment External Fact；
- Stage Output Set、Artifact、Evidence、Finding、Human Decision 与 Outcome；
- 四类受控故障演练记录；
- Workspace/Sandbox、Checkpoint、Recovery 与 Continuation 记录；
- 成本、预算、重试、人工介入和端到端时间基线；
- L2 Candidate、Validation Result、Effect Report 和 Promotion Decision；
- 失败、跳过或 `inconclusive` 项的原因与影响。

原始 Transcript 可以作为调查证据，但不能成为唯一验收材料。

## 13. 失败、停止与判定

出现以下任一情况，L1 不得判定成功：

- 目标需求只在平台外完成，Paperclip 事后补录状态；
- 使用模拟 GitHub、假 Workflow 或人工回填 Deployment 成功；
- 未经 Human Gate 自动 Review、合并或部署；
- 测试失败、Artifact Digest 不一致或健康检查失败仍进入完成；
- 外部超时后重复创建 Pull Request、Merge 或 Deployment；
- Agent 进程退出后无法从持久状态恢复；
- Run Owner 必须阅读原始 Transcript 才能理解结果；
- 部门管理员必须修改代码、数据库或隐藏配置才能搭建 SOP。

L0、L1、Validation Run 和 L2 分别记录 `passed / failed / blocked / inconclusive`。L0 失败阻止 L1；L1 失败不启动 L2；Validation Run 未通过时不得宣称控制正确性通过；L2 可以得到 `inconclusive`，但必须完整保留证据和人工决定。

## 14. 明确非目标

首个研发灯塔不包含：

- 生产环境、生产数据或生产流量；
- 外部需求系统 Connector；
- GitLab/JiHuLab Provider 兼容；
- 一个需求跨多个代码仓库协同修改；
- 破坏性数据库迁移或不可逆外部副作用；
- 每 Pull Request Preview Environment；
- Kubernetes、多 Worker 或跨节点 Workspace；
- Agent 自主批准 Review、合并或发布；
- 企业 SOP 仓库、打包和跨部门复用；
- L2 自动晋升、自动修改 SOP 拓扑或训练模型；
- 多部门并发压力和完整企业安全合规验收；
- 没有真实基线的效率提升商业结论。

这些只是首个灯塔的非目标，不代表产品永久不做。

## 15. 与技术验证项的关系

本灯塔聚合已有技术验证项，但不把“产品方向已确认”误写为“生产实现已验证”：

- VAL-001、VAL-007：Release、Execution Definition、Binding 与历史恢复；
- VAL-002、VAL-003、VAL-005：Stage Kernel、fresh context 和持久人工恢复；
- VAL-004、VAL-012：GitHub Connector 非幂等副作用与双面链路；
- VAL-006：Agent 能力继承、Allowlist 与授权撤销；
- VAL-010：Attention Signal、Incident 和动作路由；
- VAL-011、VAL-015：L2 归因、Candidate 与人工晋升；
- VAL-016、VAL-017：资源引用、Artifact 权限和人员改派；
- VAL-018：独立 Worker、Sandbox 与 Workspace 执行面；
- VAL-013：企业内容盲治理投影。

无法在灯塔启动前满足的验证项必须明确标记为 Blocker，不能通过缩小验收证据或改用人工补录绕过。

## 16. 完成定义

### 研发交付灯塔成功

满足以下全部条件：

- L0 通过；
- 正式 L1 Run 的交付结果、控制正确性和产品可用性三层判据通过；
- 四类受控 Validation Run 演练通过；
- 验收证据包完整；
- 没有平台外补流程或重复副作用。

### 首期完整产品垂直切面通过

在“研发交付灯塔成功”基础上：

- L2 Improvement Campaign 完成；
- 人工 Promotion Decision 有完整证据；
- 若接受 Stage Instruction 候选，新 Release 只影响未来 Run；若接受 Department Skill 候选，新 Skill Version 在完成 Agent 测试、Binding 同步、Validation Run 和新 Release 前不影响任何 Run；
- 企业内容盲治理投影能够观察本次运行健康、成本和审计，而不泄露业务内容。

具体仓库和需求尚未登记不会使本产品规格重新变成待讨论；它只表示灯塔尚未满足启动条件。
