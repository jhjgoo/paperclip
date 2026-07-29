# 子需求 04：SOP Studio、Run Request、Stage I/O 与版本生命周期

状态：核心产品契约已确认，物理 Schema 与交互原型待验证\
日期：2026-07-26\
依赖：子需求 01、02、03\
关联决策：DEC-004、DEC-022 至 DEC-048、DEC-058、DEC-062 至 DEC-068、DEC-087、DEC-094、DEC-095、DEC-115\
关联验证：VAL-001、VAL-006、VAL-007、VAL-016、VAL-017

## 1. 目标与边界

本子需求定义业务人员在 SOP Studio 中可以理解和维护的 SOP 契约，并与 SOP Run、Stage Execution Kernel 的运行边界对齐。

MVP 的默认入口是空白 SOP Draft，不提供平台预置业务 SOP。部门管理员必须能自行完成定义、绑定、Validation Run 与发布；研发灯塔流程只作为验收样本，不进入平台通用枚举或默认模板。

SOP Studio 不承担 Agent 或工具装配。部门管理员先在 Agent Studio 中创建并测试本部门 Agent，再将 Stage Role Slot 绑定到已有 Agent；Stage 只能继承或精确收窄该 Agent 的能力，不能在 SOP 编辑或 Run 创建时新增 Connector、Connection、Skill、Secret 或权限。

首期必须解决：

- Run Request 与 Stage I/O 的语义分离；
- 动态 Argument、SOP Resources 与运行工件的边界；
- Stage `Consumes / Produces` 与流程 Data Binding；
- Fact、Evidence、Finding 和 Outcome 作为一等 Stage Output；
- Acceptance Contract、Verifier 与同 Stage 返工 Loop；
- Draft、Validation Run 与不可变 Release 生命周期。

本子需求不建设：

- 自定义表单设计器；
- 通用业务规则引擎或 Policy Studio；
- 每 Run 的 Connector、MCP、Skill 或权限装配；
- 将每个 Verifier 强制建成独立业务 Stage；
- 企业 SOP 仓库、打包和跨部门传播。

## 2. 核心领域模型

```text
SOP
├── Draft
│   ├── Run Request Contract
│   ├── SOP Resources
│   ├── Stage Graph
│   │   ├── Stage I/O Contract
│   │   ├── Data Binding
│   │   ├── Acceptance Contract
│   │   └── Optional Verifier Binding
│   └── Stage Binding
├── Validation Snapshot
│   └── Validation Run
└── Release（采用已验证契约并关联 Validation Snapshot 证据）
    └── Execution Definition Revision

SOP Run
├── Run Request
├── Trigger Context
├── Stage Execution
│   ├── Resolved Stage Input Set
│   ├── Stage Output Set Revision
│   └── Verification Result Revision
└── Run Outcome
```

SOP Draft 是业务编辑面，Validation Snapshot 是系统生成的不可变发布前校验基线，Release 是不可变生产业务契约，Execution Definition Revision 是无损编译结果。生产 SOP Run 固定引用 Release、Execution Definition Revision 与 Binding Revision；Validation Run 固定引用 Validation Snapshot。两者都不得读取可变 Draft 解释后续行为。

Validation Snapshot 不是用户需要维护的新版本入口。它必须原子固定本次待验证的业务契约、候选 Execution Definition Revision、Binding Revision、Agent Configuration Snapshot Set、Connection Configuration Revision Set、SOP Resource Snapshot Set 与 Project Env Resolution Snapshot。Draft 在校验后发生任何影响行为的变化时，旧 Validation Run 结果不得用于发布；系统必须生成新快照并重新校验。

发布采用 Validation Snapshot 中已验证的业务契约、Execution Definition 与 Binding 身份，并保留资源和 Project Env 快照作为发布证据；它不会把本次资料内容或项目变量解析结果永久写死到所有未来 Run。Release 仍绑定稳定 SOP Resource ID，每个生产 Run 继续解析自己的 SOP Resource Snapshot Set 与 Project Env Resolution Snapshot。

## 3. Run Request Contract

Run Request 表达一次具体业务目标，不等同于 Stage Input。

```text
Run Request
├── Goal / Instruction
└── Typed Arguments
```

Run Request 不提供绕过 Contract 的无类型材料袋。本次上传的文件、图片或数据包必须对应 SOP 已声明的 `file` Argument；如果 SOP 未声明该 Argument，本次 Run 就不能临时把它塞入隐式 Prompt 或 Stage Input。

### 3.1 Goal / Instruction

每次人工或外部发起都必须形成一个可审计的 Goal / Instruction，例如：

- `帮我审核单号 BX-001 的单据`；
- `开始审核待处理发票`；
- `完成客户管理模块的需求交付`。

Goal 可以由用户输入、Trigger 模板或 API 调用产生。Title 可以从 Goal 派生，但不能替代原始 Goal。

### 3.2 Argument Definition

SOP 只为每 Run 才能确定的动态值声明 Argument。所有 Argument 使用同一骨架：

```ts
type ArgumentDefinition = {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "date" | "datetime" | "choice" | "file";
  required: boolean;
  cardinality: "one" | "many";
  description?: string;
  constraints?: Record<string, unknown>;
};
```

`constraints` 必须由对应类型的平台注册校验器解释，不能成为任意脚本或隐藏 DSL。具体持久化字段和类型扩展协议仍属原型范围。

`file` Argument 的取值在 Run 启动时必须固化为与该 Argument Key 关联的不可变内容快照，至少保留文件名、媒体类型、内容摘要和受保护的 Asset Reference，保证恢复时仍能读取当时输入。它不是 Resource File、SOP Resource 或 Stage Artifact，不进入 Project `Artifacts`；Run 启动后若需补充或替换文件，必须通过 Supplemental Input/Input Response 生成新的输入 Revision，不能原地覆盖旧内容。

示例：

```text
documentNo  单号  text    required  one
amount      金额  number  optional  one
invoices    发票  file    required  many
```

### 3.3 Trigger 正交性

Trigger 不属于 Argument Type。人工、API、Webhook 和定时触发只负责创建同一种 Run Request：

```text
Trigger Payload Field
→ 精确映射到 Argument Key
→ 创建 Run Request
```

Webhook 的 `payload.documentId` 与人工填写的 `documentNo` 可以满足同一个 Argument Definition。映射必须由配置中的稳定 Key 明确声明，不通过字段名猜测或语义匹配。

### 3.4 `+` 的产品边界

SOP Run Composer 沿用 Paperclip Task 的紧凑交互和 `in [Project]` 语法。`+` 只展示当前 Run Request 中尚未赋值或允许补充的 Argument：

```text
+ 添加本次请求内容
  单号    文本
  金额    数值
  发票    文件
```

`+` 不展示 Connector、MCP、Skill、SOP Resource、上游 Artifact、历史 Run 或通用 Paperclip 对象浏览器。不存在尚可填写的动态 Argument 时，`+` 隐藏；它不降级为无类型附件或临时材料入口。

### 3.5 Run Owner

每次 Run Request 在开始执行前必须解析为一名具体、有效的部门成员作为 Run Owner。人工创建可以默认选择创建人，但 Composer 必须清晰展示负责人并允许修改；API、Webhook 和定时触发必须由调用参数或 Trigger 配置提供可解析负责人，不能把系统账号或 Agent 当作 Run Owner。

Run Owner 负责全生命周期的检查、监控、Review 和人工协调。Run Owner 与 Run Creator、SOP Owner、Stage Agent 是不同角色；同一个人可以同时承担多个角色，但系统不能因此合并其语义。

运行中的补充输入权限严格限定在单个 SOP Run：该 Run 的有效 Run Creator 与 Run Owner 可以向本 Run 任意 Stage 提交 Supplemental Input 或回复 Input Request；Human Gate Assignee 只能在本 Run 中自己获授权的 Stage 操作和回复。Input Request 不创建独立 Assignee，也不能把任何角色权限传播到其他 Run。Input Response 只提供运行信息，不能替代 Human Gate Decision。

## 4. SOP Resources

SOP Resources 是 SOP Definition 中跨 Run 复用的一组稳定 Resource Binding，例如：

- 审核规则与参考案例；
- 报告模板；
- 知识库；
- 待处理资源库或固定文件夹；
- 其他稳定资源位置引用。

SOP Resources：

- 不属于 Run Request；
- 不授予 Agent 权限；
- 不替代 Agent 自身的 Skill、Connection、Tool、Secret Reference 使用权或 Workspace Access；
- 通过稳定的 Resource File/Folder ID 建立 Binding，不保存 Path、File Name 或底层 Blob Key；
- 可以通过 Data Binding 成为 Stage Consume Slot 的来源；
- 运行中读取的具体内容应转化为版本化 Fact、Artifact 或 Evidence。

发布检查必须验证每个 Resource Binding 仍然有效。Run 启动时解析并固定本次使用的内容快照：已启动 Run 不受随后替换影响，后续 Run 使用 Resource File 的最新内容；Folder Binding 固定本次 Run 看到的子项集合。资源库通过 Binding 反向展示使用它的 SOP，并保护被绑定资源本身不被删除、移动或重命名。

SOP Resources 不是 Workspace、文件库副本或新的权限边界。它只引用部门文件资源库等既有资源；Paperclip Project Workspace 与 Execution Workspace 仍承担可写执行现场。正式挂载与权限预检仍需数据原型验证，但不得再引入新的 SOP 专属 Workspace 实体。

## 5. Stage I/O Contract

Stage 使用 `Consumes / Produces` 描述执行数据边界，不复用 Run Request Argument 表单语义。

```ts
type DataSlot = {
  key: string;
  label: string;
  kind: "value" | "resource" | "artifact" | "fact" | "external_fact" | "evidence" | "finding" | "outcome";
  contractRef: string;
  required: boolean;
  cardinality: "one" | "many";
};
```

`contractRef` 指向版本化值 Schema、Artifact Type、Resource Type、Fact Schema、External Fact Schema、Evidence Schema、Finding Schema 或 Outcome Schema。JSON、XML、PDF 等只是 Artifact 的表现格式，不替代结构化运行语义。

### 5.1 Stage Consumes

Consumes 声明 Stage 开始执行前必须解析出的数据，例如：

- Run Request Argument；
- SOP Resource；
- 上游 Stage Artifact；
- 上游 Fact、External Fact、Evidence、Finding 或 Outcome。

### 5.2 Stage Produces

Produces 声明 Stage Completion Candidate 必须提交的结果。审核 Stage 可以同时产生：

```text
extractedFacts   fact[]
evidenceChain    evidence[]
auditFindings    finding[]
auditOutcome     outcome
auditReport      artifact
```

其中：

- Fact 是带 Schema 和来源的结构化业务陈述，可以由 Agent 提交，但必须标明 Agent、Artifact 或其他允许来源，不能自动冒充外部权威状态；
- External Fact 是由 Connector/Platform Observer 通过具体 Connection 观察、经平台校验后固化的外部状态。Stage Output 可以引用其 Handle，但 Agent、Executor 和 `submit_domain_fact` 都不能创建或伪造它；
- Evidence 是支持或反驳判断的版本化引用；
- Finding 是基于 Evidence 的结构化评估结论；
- Outcome 是 Stage 或业务单元的结果；
- Artifact 是本次 Run 产生并保留来源的可检查产物，覆盖中间产物与最终产物；报告、文件或数据包是常见表现，但 Artifact 不等于部门文件资源库。

Artifact 默认只属于产生它的 Run，不因生成成功或通过 Stage 验收而自动进入部门资源库。用户检查确认后可以显式发布为新的 Resource File；发布不改写原 Artifact，也不要求复制底层 Blob。Artifact 的 Project 汇总、Task/SOP 来源隔离与人工发布边界已经由 Run Cockpit 模型固定；高级类型分类、复杂跨版本比较、批量 Review 与高级检索延后，MVP 仍提供基础预览、下载、溯源和 Review。

## 6. Data Binding 与流程画布

Data Binding 是流程画布的数据连线，允许以下稳定来源：

```text
run.goal
run.arguments.<key>
sop.resources.<resourceKey>
stage.<stageId>.outputs.<slotKey>
```

示例：

```text
run.goal
→ AuditStage.consumes.instruction

run.arguments.documentNo
→ FetchStage.consumes.documentNo

FetchStage.produces.document
→ AuditStage.consumes.document

sop.resources.auditRules
→ AuditStage.consumes.auditRules
```

Binding 只使用稳定 Stage ID、Slot Key 和 Contract Ref。显示名称可以修改，但不能改变已有绑定身份。

`file` Argument 和 `sop.resources.*` 在运行时都解析为带明确来源与内容 Revision 的只读 Resource Handle，并只能连接到 Contract 兼容的 `resource` Consume Slot；来源仍分别保持为 Run Request 与 SOP Resource，不能因为使用同一种 Handle 就合并生命周期或权限。文件 Argument 不会因为被 Stage 消费而变成 Artifact，只有 Stage 明确登记的产出才是 Artifact。

### 6.1 发布校验

发布前必须静态验证：

- 每个 required Consume Slot 在每条合法进入路径上都有明确来源；
- 上游 Produce 与下游 Consume 的 `kind`、`contractRef` 和 cardinality 兼容；
- 不存在悬空连线、循环中的未初始化 Slot 或跨 Company Resource；
- Trigger 映射到存在且兼容的 Run Argument；
- Stage Binding 已完整绑定 Agent；
- 可选 Stage Capability Allowlist 是所绑定 Agent 能力的子集。

Draft 允许暂存未完成连线。Release 必须先通过静态校验，生成不可变 Validation Snapshot，并至少完成一次绑定该快照的模拟 Validation Run 或历史任务回放。发布只能引用已通过的同一快照所固定的契约与 Revision，不能在试跑后重新读取 Draft 或重新编译一份“看起来相同”的定义。

## 7. Stage Output Set Revision

Stage 每轮 Producer 按 `Produces` 提交的所有输出固化为一个不可变 Stage Output Set Revision：

```text
Stage Output Set Revision
├── Value Revisions
├── Resource Handle Revisions
├── Artifact Revisions
├── Facts
├── External Fact Handles
├── Evidence Set Revision
├── Findings
└── Outcome Candidate
```

Producer 可以按业务契约产出 Evidence 或 Finding，但每项都必须保留 Producer 来源。Verifier 和 Completion Gate 必须引用同一个 Output Set Revision；Verifier 对它产生的 Assessment、Finding、Evidence 引用和解释固化为独立的 Verification Result Revision，不得追加或反写 Producer Output Set。任何 Producer Artifact、Fact、External Fact Handle、Evidence、Finding 或 Outcome Candidate 发生关键变化，都必须生成新的 Output Set Revision；旧 Verification Result 只保留审计，不能推进新 Revision。

## 8. Acceptance Contract 与 Verifier

每个 Stage 必须有 Acceptance Contract，但不强制绑定 Agent Verifier。

```text
1. Mechanical Completion Gate  始终存在
2. Agent Verifier              按需配置
3. Human Gate                  按风险或职责分离配置
```

### 8.1 Mechanical Completion Gate

Kernel 必须机械校验：

- required Produce Slot 与 Schema 是否齐全；
- Artifact、Fact、External Fact Handle 和 Evidence 是否绑定当前 Revision；
- 普通 Fact 与 External Fact 是否来自 Contract 允许的来源类型，External Fact 是否由 Connector/Platform Observer 经平台校验固化；
- 必需 Assessment 是否由引用当前 Output Set Revision 的合法 Verification Result Revision 产生明确 Verdict；
- 是否存在阻断性 Finding 或 Assessment Conflict；
- 人工 Decision 是否仍有效；
- Stage Epoch、预算、权限和允许 Transition 是否有效。

Agent 的 `done`、Completion Candidate 或 Verifier 的自报 `pass` 均不能直接完成 Stage。

### 8.2 Verifier Binding

Agent Verifier 是 Stage 内部执行角色，不是默认业务 Stage。它读取：

- Stage Contract 与 Acceptance Criteria；
- 固定 Stage Output Set Revision；
- 相关 Run Request、Fact、External Fact、Artifact、Evidence 和未解决 Finding。

Verifier 不得修改被验证输出、直接改变 Stage 状态或选择未声明 Transition。

### 8.3 Human Gate Assignee

Stage 只要启用 Human Gate，就必须同时配置 Human Assignee Selector。首期最小来源为：

```text
specific_user   固定部门成员
run.creator     本次 Run 创建人
run.owner       本次 Run 负责人
sop.owner       SOP 负责人
```

Selector 是明确的人员解析规则，不是自然语言描述、部门角色搜索或 Agent 运行时选择。发布检查必须验证固定人员仍为有效部门成员，且所有触发路径都能提供动态来源；Run 开始前把全部 Gate Selector 解析为具体 User ID 并固定到本次 Run。任何必需人员无法解析时，Run 只能保持草稿或阻塞，不得开始执行。

Run Owner 与本次 Run 的全部 Human Gate Assignee 都可以查看和管理本次 Run 的全部 Artifact，但只有当前 Gate Assignee 可以提交该 Gate 的人工 Decision。该 Run 派生权与 Project Membership 的基础查看权取并集；改派只撤销派生部分，Actor 如果仍是 Project 授权成员则保留 Project 基础查看权。改派必须显式记录原因并进入审计，不得因 SOP Owner 或 Run Creator 后续变化而静默漂移。

Run Owner 或任一 Gate Assignee 失去有效部门成员资格时，Run 必须暂停并产生改派 Attention。人员改派只能由 SOP Owner 或部门管理员显式提交；Run Owner 可以监控、协调和请求改派，但不能凭运行控制权改变 Gate 或 Owner 的 Authority Revision。改派只改变后续责任与访问，不改写历史审阅或已完成 Decision。

### 8.4 Verification Result Revision

Verifier 使用平台固定协议提交逐验收项的不可变 Verification Result Revision：

```ts
type VerificationResult = {
  stageId: string;
  stageEpoch: number;
  outputSetRevisionId: string;
  assessments: Array<{
    criterionId: string;
    verdict: "satisfied" | "violated" | "uncertain" | "not_applicable" | "not_evaluated";
    evidenceRefs: string[];
    explanation: string;
  }>;
  findings: unknown[];
  producedEvidence: unknown[];
  summary: string;
};
```

以上仅固定产品语义；最终类型名、Schema 与 Extension 接口仍需实现前设计。`assessments`、`findings` 和 `producedEvidence` 必须标记 Evaluator/Verifier 来源并绑定 `outputSetRevisionId`，不能冒充 Producer 声明的 Stage Output。Kernel 根据 Acceptance Contract 联合评估 Producer Output Set 与对应 Verification Result，不能把 Verifier 顶层文本结论当作权威状态。

### 8.5 触发与返工 Loop

```text
Producer 提交 Output Set Revision
→ Stage Executor 提交 Completion Candidate
→ Kernel 执行 Mechanical Gate
→ 如已配置 Verifier，Kernel 自动创建 Verifier Invocation
→ Verifier 产生 Assessment、Finding 与 Evidence
→ Kernel 执行 Completion Gate
```

验证失败时：

- Kernel 保留绑定当前 Revision 的 Finding；
- Planner / Producer 根据 Finding 在同一 Stage 内返工；
- Producer 提交新的 Output Set Revision；
- Verifier 必须重新验证新 Revision；
- 每轮消耗 Invocation Budget；
- 达到预算或返工上限后按 Stage Policy 转人工、阻塞或失败。

P3/P10 已验证该 Loop 的确定性状态语义、Revision 隔离、持久恢复和独立 Completion Gate；TV-05 已完成真实模型接缝消融。生产 Scheduler 接入，以及复杂真实业务任务中的质量、成本和时延，仍须在生产纵切与灯塔中验证。

### 8.6 何时使用独立 Verifier Stage

只有验证本身满足 Stage 判定标准时，才建独立业务 Stage：

- 责任人或责任组织发生变化；
- 产生独立业务决定或交付物；
- 构成审批、合规或职责分离边界；
- 下游业务路径直接依赖其 Outcome。

代码验收、证据完整性检查、报告章节检查等内部质量活动保留在原 Stage 的 Verifier Activity 中，避免画布膨胀和验证 Stage 递归。

## 9. Stage Binding 与能力范围

Stage Binding 首期只做：

```text
Role Slot → Agent
```

默认继承发布时固定的 Agent Configuration Snapshot 中已配置的 Skill、Connection-backed Tool 和来源限定 Connectionless Extension Agent Tool。该 Snapshot 由系统自动保存，只用于 SOP 固定、运行重建和审计，不在产品中表现为需要部门管理员升级或回滚的 Agent 版本。只有在高级设置中显式选择稳定能力 ID Allowlist 时，Stage 才进一步收窄能力。SOP、SOP Run 和 Stage Binding 均不得创建 Connector、Connection、Platform Extension、Secret 或 Tool Grant，也不得通过自然语言或语义匹配解释权限边界。

部门管理员后续维护同一个 Agent 时，已经发布的 SOP Release 与 Binding Revision 继续使用原 Snapshot。SOP Studio 应提示“绑定 Agent 配置已有变化”；只有 SOP 负责人显式同步当前配置、重新完成 Validation Run 并创建新 Binding Revision 后，未来 Run 才采用新配置。该动作叫“同步 Agent 配置”，不是“升级 Agent”。

## 10. 生命周期

```text
Draft
→ 静态校验
→ 生成不可变 Validation Snapshot
→ Validation Run / 历史回放
→ 发布同一已验证基线为 Release
```

- Draft 可持续自动保存并允许不完整配置；
- 发布前必须完成 Stage Binding、Data Binding、Trigger Mapping 和必需 Contract；
- Validation Run 复用 SOP Run Kernel，使用 `mode=validation` 并固定 Validation Snapshot，不新增 Test Run 实体，也不冒充生产 SOP Run；
- Validation Run 默认禁止未明确授权的外部写副作用；历史回放不得 dispatch 外部 Effect。确需真实故障演练时，可以复用同一 Project/Connection 来验证相同能力契约，但必须使用由 Validation Run ID 派生的独立动作键与外部对象命名空间，显式限定专用 Branch/PR/Workflow 输入、非生产 Environment、允许副作用、清理方式和负责人；不得写入受保护默认 Branch、复用生产 Run 的 External Object/Artifact/Deployment 身份或触碰生产环境，并继续经过正常 Intent/Attempt、Human Gate 与审计链；
- Validation Run 完成后如果 Draft、Binding、Agent Configuration Snapshot、资源内容或 Project Env Resolution Snapshot 发生漂移，必须重新生成快照并试跑；
- Release 不可变；修改形成新 Draft 与新 Release；
- 已启动的生产 Run 固定其 Release、Execution Definition Revision、Binding Revision、Agent Configuration Snapshot Set、Adapter Version Set、Model Deployment ID Set、Skill Version Set、Connection Configuration Revision Set、SOP Resource Snapshot Set、Project Env Resolution Snapshot、Stage Executor/Routine Revision 与编译器版本；
- 回滚只影响未来 Run，不改写历史 Run。

## 11. 与 Runtime 的边界

Studio 负责声明业务契约，Runtime 负责维护：

- Resolved Stage Input Set；
- Stage Output Set Revision；
- Activity、Invocation、Command 和 Decision；
- Value、Resource Handle、Artifact、Fact、External Fact Handle、Evidence、Finding 和 Outcome；
- Verification Result Revision 与 Completion Gate；
- Input Request、Human Decision Request、Wait、Checkpoint 和 Continuation；
- 预算、幂等、恢复和审计。

运行中缺少新的外部动态值时，Input Request 应引用已有 Argument Definition，或使用同一类型契约声明追加值。Input Request 不能把缺失的上游 Artifact 静默改成人工上传；除非 SOP Contract 明确声明允许该替代来源。

## 12. 尚待验证但不阻塞产品契约

- `ArgumentDefinition`、`DataSlot`、`VerificationResult` 的最终物理 Schema；
- Schema Registry、Contract Ref 和兼容性升级机制；
- SOP Resource Binding 的挂载模型和权限预检；
- Run Composer 的自然语言 Argument 提取与确认交互；
- 画布端口、连线和多分支路径错误提示原型；
- 哪些高风险 Stage 由部门策略强制配置 Agent Verifier；
- Agent Verifier 在复杂真实任务上的质量、成本和时延消融；
- 生产 Scheduler、Lease、Retry、Connector 副作用和长时间运行接入。

这些问题必须进入原型或实现计划，但不得反向模糊已经确认的 Run Request、Stage I/O、Data Binding、Acceptance Contract 和 Verifier 状态所有权边界。

## 13. 验收场景

1. 人工输入 `帮我审核单号 BX-001`，确认 `documentNo` 后创建 Run；Webhook 映射同一 Argument Key 时产生等价 Run Request。
2. 固定发票文件夹通过 `sop.resources.invoiceInbox` 连接到 Collect Stage；用户只输入 `开始审核`，不重复选择资源。
3. 临时发票 SOP 把 `run.arguments.invoices` 连接到 Audit Stage，并通过 `+` 上传 `file[]`。
4. 上游 Fetch Stage 的 `document Artifact` 精确连接到 Audit Stage；缺少任何合法路径绑定时禁止发布。
5. Audit Stage 产生 Fact、Evidence、Finding、Outcome 与 JSON/XML Report Artifact；Connector 观察到的外部状态只能作为经平台固化的 External Fact Handle 进入 Output Set；下游按 Slot 精确消费。
6. Producer Revision 1 被 Verifier 拒绝并生成 Finding；返工形成 Revision 2，旧 Evidence 不能使 Revision 2 完成。
7. 没有 Agent Verifier 的简单采集 Stage 仍通过 Mechanical Gate；具有独立合规责任的复核工作可以建成业务 Stage。
8. Agent 或 Verifier 自报 `done/pass` 时，Kernel 仍拒绝缺少 required Output、Evidence 或合法 Verdict 的 Completion Candidate。
9. Draft 生成 Validation Snapshot 并试跑通过后再次编辑 Stage Instruction；旧结果不能发布新内容，必须生成新快照并重新试跑。
10. Verifier 针对 Producer Revision 1 产生的 Finding 保存在 Verification Result Revision 中，不得反写 Producer Output Set，也不能被 Producer 冒充为独立验证证据。
