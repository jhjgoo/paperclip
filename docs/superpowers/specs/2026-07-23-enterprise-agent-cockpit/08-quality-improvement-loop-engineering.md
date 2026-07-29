# 子需求 08：质量评估、改进候选与 Loop Engineering

状态：产品模型已确认；机械 Campaign 状态原型已验证；真实 L1 归因、Researcher Agent 和生产晋升仍待验证\
日期：2026-07-26\
依赖：子需求 04、05、06、07\
关联决策：DEC-017、DEC-018、DEC-086、DEC-089、DEC-090、DEC-122\
关联验证：VAL-011、VAL-015

## 1. 目标与边界

本子需求定义平台如何从多个真实 SOP Run 中发现问题、生成隔离候选、完成独立验证，并由人决定是否创建新版本；任何生产采用都只能显式影响未来 Run。

产品必须区分两层循环：

```text
Delivery Loop（单次 Run 内）
└── 在固定 Release 内完成 Stage 执行、验证、返工与交付

Improvement Loop（跨 Run）
└── 在固定实验边界内生成、比较和验证候选版本
```

Stage 重试、Agent 反思或 Verifier 返工不等于 SOP/Skill 自我升级。跨 Run 改进拥有独立状态机、预算、候选池和晋升决定。

## 2. 首期产品原则

首期采用“候选空间受控自治、生产空间人工晋升”：

- Kernel 决定实验边界、预算、调度、停止和候选资格；
- Researcher Agent 可以在允许范围内连续提出多个候选；
- Evaluator 不得由正在被评价的候选修改；
- 候选只能在隔离环境中验证，不能原地修改生产定义；
- 系统可以给出比较结论，也必须允许 `inconclusive`；
- 部门负责人最终决定接受、拒绝或继续实验；
- Stage Instruction 候选被接受时创建新的不可变 SOP Release；Department Skill 候选被接受时只创建新的不可变 Department Skill Version，仍须经 Agent 测试、Binding 同步、Validation Run 和新 SOP Release 才能被未来 Run 采用。

首期不自动发布生产版本、不自动演化 SOP 拓扑、不训练模型权重，也不建设 Policy Studio。

## 3. Improvement Campaign

Improvement Campaign 是一次有界改进实验，至少固定：

```text
Improvement Campaign
├── Base Execution Variant
├── Optimization Target Base
│   ├── SOP Release + Stage Instruction；或
│   └── Department Skill Version
├── Optimization Target
├── Evaluation Contract
├── Validation Cases
├── Execution Context
├── Capability Boundary
├── Budget & Stop Conditions
├── Candidate Pool
└── Promotion Decision
```

Base Execution Variant 必须固定用于比较的 SOP Release、Execution Definition Revision、Binding Revision、Agent Configuration Snapshot Set、Adapter Version Set、Model Deployment ID Set、Skill Version Set、Connection Configuration Revision Set、SOP Resource Snapshot Set、Project Env Resolution Snapshot、Stage Executor/Routine Revision 和实际执行后端事实。Optimization Target Base 再明确本次唯一可变对象及其精确版本。

Campaign 创建后必须冻结 Base Execution Variant、Optimization Target Base、Evaluator、Cases、执行上下文、权限上限和允许修改范围。修改这些条件必须创建新的 Campaign，不得在中途改变评分口径后继续比较。Resource File 即使保持稳定 ID，只要内容 Revision 变化，也属于实验上下文漂移。

## 4. 首期 Optimization Target

首期一次 Campaign 原则上只改变一个主要维度，并只开放低风险、可版本化目标：

- 单个 Stage Instruction；或
- 单个 Department Skill 内容版本。

Enterprise Skill 对部门是只读采用关系，不能成为部门 Improvement Campaign 的可写目标。首期不隐式复制或原地修改 Enterprise Skill；未来如需从企业版本派生部门版本，必须另行设计显式 Fork、归属和发布审批流程。

首期不允许候选修改：

- SOP Stage Graph、Transition 或 Human Gate；
- Evaluator、Acceptance Contract 或 Hidden Validation Cases；
- Agent 有效能力边界、Connection、Tool、Model Deployment 或 Adapter；
- Project Env、执行后端或基础设施资源；
- 生产数据、生产 Release 或运行中的 Run。

如果后续需要同时改变多个维度，必须先有足够的归因证据和新的产品决策。

## 5. Evaluation Contract

Evaluation Contract 不是一个模糊“AI 评分”，至少包含：

- Primary Outcome：主要业务效果；
- Hard Gate：不可被均值抵消的必过条件；
- Quality Guardrails：质量、安全、合规和副作用约束；
- Flow & Efficiency：周期、返工、Token、成本和人工介入；
- Sample Sufficiency：最小样本量与覆盖要求；
- Comparison Rule：如何得到 better/worse/inconclusive；
- Evidence Contract：每个结论需要引用的 Artifact、Fact、Evidence、Finding 或外部事实。

Evaluator 必须固定版本并与候选生成角色隔离。Agent 可以解释结果和提出假设，但不能直接把自然语言结论写成晋升事实。

## 6. Validation Cases 与隔离

候选按风险与可用数据进入以下验证阶梯：

1. Contract Validation：结构、引用、权限和预算检查；
2. Historical Replay：对可重放历史任务进行离线回放；
3. Curated Validation：使用明确案例集验证；
4. Hidden Validation：使用候选生成者不可见的保留案例；
5. Shadow：读取真实流量但不产生业务副作用；
6. Limited Trial：在明确范围和人工监管下有限试运行。

不是所有业务都必须完成全部阶梯，但任何跳级都必须由 Evaluation Contract 允许并留下审计事实。具有不可逆副作用的场景不能仅凭离线评分自动进入 Limited Trial。

## 7. Candidate Revision 与 Candidate Pool

Candidate Revision 是不可变候选，不是 Base 的原地编辑。每个候选至少记录：

- Base Digest；
- Optimization Target 与变更 Diff；
- 生成假设和来源；
- Agent Configuration Snapshot Set、Adapter Version Set、Model Deployment ID Set、Skill Version Set、Connection Configuration Revision Set、Agent Tool Binding Set、SOP Resource Snapshot Set、Project Env Resolution Snapshot（变量键及 Secret Binding/Version，不含明文值）和实际执行后端事实；
- 使用的 Case Set、Evaluator Version 与预算；
- 每次 Validation Run 的结果与证据；
- 当前资格、淘汰原因和比较位置。

Campaign 可以保留多个各有优势的候选，不强制只保存单一最高分。多目标互相冲突时应保留 Pareto 候选或返回 `inconclusive`，不得用任意权重掩盖 Hard Gate 失败。

## 8. Campaign Kernel

Campaign Kernel 负责：

- 在预算内调度 Candidate Generation 与 Validation Run；
- 检查一次只改变允许目标；
- 保持候选、Evaluator 和 Case 隔离；
- 汇总结构化结果与证据完整性；
- 执行停止条件；
- 维护 Candidate Pool 和 Effect Report；
- 在需要人类选择时创建 Attention；
- 保证暂停、恢复和停止后不会重复晋升。

Researcher Agent 负责提出假设、生成候选和解释结果，不负责决定系统是否继续调度或是否进入生产。

## 9. 停止条件

每个 Campaign 必须配置可机械执行的停止条件，至少覆盖：

- 最大 Candidate 数；
- 最大 Validation Run 数；
- Token、成本和时间预算；
- 连续无改进次数；
- Hard Gate 失败上限；
- 达到目标阈值；
- 人工暂停或终止；
- 基线、Evaluator、Case、权限或执行事实发生漂移。

漂移导致不可比时应暂停或结束 Campaign，而不是继续产生看似可比较的分数。

## 10. Effect Report

Effect Report 必须让部门负责人无需阅读完整 Transcript 即可回答：

1. 改了什么，为什么改；
2. 与哪个 Base、哪些 Case、哪个 Evaluator 比较；
3. Primary Outcome 是否改善；
4. 哪些 Hard Gate 与 Guardrail 通过或失败；
5. 成本、周期、返工和人工介入如何变化；
6. 是否存在样本不足、Case Mix 差异或执行上下文漂移；
7. 支撑结论的 Artifact、Evidence、Finding 和 Validation Run 在哪里；
8. 系统建议是接受、拒绝、继续实验还是 `inconclusive`。

Report 只是一致性读模型；原始 Run、Outcome、Evidence 与 Candidate Revision 仍是事实源。

## 11. 人工晋升

只有部门负责人或明确的 Improvement Owner 可以提交 Promotion Decision。可选动作固定为：

- Accept Candidate；
- Reject Candidate；
- Continue Experiment；
- Close as Inconclusive。

接受候选必须从已验证 Candidate Digest 创建新的不可变 SOP Release 或 Department Skill Version，不能重新复制一份可编辑文本后绕过验证。Stage Instruction 候选形成的新 SOP Release 只影响后续选择它的 Run；Department Skill Version 的创建本身不改变任何 Agent、Binding 或 SOP Release，必须显式完成 Agent 更新与真实测试、Binding 同步、Validation Run 和新 SOP Release 后，后续 Run 才会采用。已启动 Run 和旧 Release 始终保持不变。

SOP Release 回滚通过未来 Run 重新选择旧 Release 实现；Department Skill 回滚通过 Agent 显式改回旧 Skill Version、重新测试并发布新的 Binding/SOP Release 实现。两者都不改写历史事实。

## 12. 权限与审计

Candidate 的能力上限不得超过 Base Agent 的有效能力上限。Campaign 不得借实验身份获得新的 Connection、Tool、Secret 或数据范围。

以下动作必须审计：

- Campaign 创建、暂停、恢复和停止；
- Base、Target、Evaluator、Cases、预算和权限边界固定；
- Candidate 生成、Diff、淘汰与验证；
- Shadow/Limited Trial 启动；
- Effect Report 形成；
- Promotion Decision 和新版本创建。

企业管理员只能查看内容盲的 Campaign 数量、成本、运行健康和平台风险投影，不能读取候选内容、业务 Case、Transcript 或结果证据。

## 13. 验收场景

1. 选择一个高返工 Stage，从固定 Base Release 发起 Campaign，只允许修改其 Instruction。
2. Researcher Agent 连续生成多个不可变候选，超出修改范围的候选在验证前被拒绝。
3. 候选通过相同 Evaluator 和 Case Set 完成 Replay/Validation；Hard Gate 失败不能被平均分抵消。
4. 两个候选分别提升质量和成本，系统保留两者并返回多目标比较或 `inconclusive`。
5. Campaign 达到预算或连续无改进上限后停止，不再创建新 Validation Run。
6. 部门负责人接受 Stage Instruction 候选后创建新 Release；接受 Department Skill 候选后先创建新 Skill Version，只有完成 Agent 测试、Binding 同步、Validation Run 和新 Release 后才被未来 Run 采用。旧 Run、旧 Release 和旧 Department Skill Version 均不变化。
7. Evaluator、Case Set 或权限发生漂移时 Campaign 暂停，不继续输出伪比较结论。

## 14. 验证缺口

阶段一机械原型已用固定合成 Case 连续两轮通过 10 个证伪场景，验证冻结上下文、单变量候选、Hard Gate、预算、Drift Pause/Resume、Late Fact/Reopen、`inconclusive` 和人工精确 Digest 晋升。证据见 [Improvement Campaign 机械状态技术验证报告](./18-improvement-campaign-validation-report.md)。该阶段没有消费真实 L1，也没有执行生产晋升，因此不改变完整 TV-08 的 `inconclusive` 状态。

- VAL-011 剩余：真实 L1 Execution Variant、Case Mix、Outcome Contract 与 Effect Report 的归因充分性；
- VAL-015 剩余：真实 Researcher Agent、Candidate Workspace、Validation 阶梯、版本服务发布与未来 Binding 回滚；
- 真实业务样本下多目标评价、样本充分性和 `inconclusive` 可用性；
- Researcher Agent 连续生成候选时的质量、成本和停止行为；
- Shadow/Limited Trial 与外部副作用隔离。

这些验证不改变“受控自治、人工生产晋升”的产品边界。
