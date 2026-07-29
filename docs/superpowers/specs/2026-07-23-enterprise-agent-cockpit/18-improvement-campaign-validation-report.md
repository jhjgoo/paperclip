# Improvement Campaign 机械状态技术验证报告

状态：机械阶段 `validated`；完整 TV-08 `inconclusive`\
日期：2026-07-26\
验证包：TV-08 阶段一（VAL-011、VAL-015）

> 归档说明：本报告保留机械状态实验、不变量与 Digest；固定合成 Case、可丢弃实现和执行命令未纳入正式开发基线。

## 1. 结论

固定合成 Case 上的 Improvement Campaign 机械状态模型可以闭合表达“候选空间受控自治、生产空间人工晋升”。10 个证伪场景连续执行两轮，场景顺序、观察结果和语义基数一致：17 个冻结身份维度、8 个负向拒绝、0 个生产晋升副作用。两轮 Mechanical Digest 均为 `751c5dabdaafeb1b69f918919b7ff1d3124ccd38f88b4d1af53dd15c7d1ab0f8`，文档同步后重新封口的 Evidence Digest 为 `d4680bfa1f6c6c9bb539e9c0d0f01320a830e6704ee3c4191183acfafa2e19e9`。

本结果不能把完整 TV-08 标记为 `validated`。原型没有使用真实 L1 Run、真实 Researcher Agent、真实 Candidate Workspace、Validation/Shadow/Limited Trial 或生产 Release Service；统一 Evidence 的总体 Verdict 因此仍是 `inconclusive`。

## 2. 已验证的不变量

- Campaign 创建时冻结 Base Execution Variant、唯一 Optimization Target、Evaluator、Case Set、Capability、Resource、Project Env、Backend 和预算。
- Candidate Revision 使用不可变 Digest，只允许修改声明的单个 Stage Instruction 或 Department Skill 内容维度；错误维度和试图修改 Evaluator/权限/环境的候选在 Validation 前拒绝。
- Candidate 不修改生产 Head；失败或淘汰候选仍保留事实。
- Retry/Delivery Attempt 合并到同一 SOP Run 样本，不被重复计算为效果样本。
- Hard Gate 失败不能被 Primary Outcome 改善抵消；样本不足、Case Mix 不平衡、Late Fact/Reopen 与多目标冲突机械输出 `inconclusive`。
- Late Fact/Reopen 生成新的 Outcome/Effect Report Revision，旧报告及其 Fact Digest 不被改写。
- Candidate 与 Validation Run 数量由 Kernel 预算硬停；冻结上下文漂移会暂停，恢复前必须重新匹配原 Frozen Digest。
- Campaign 可从序列化状态重建，候选、预算、报告和审计不丢失。
- 只有 Human 可以对精确、已验证 Candidate Digest 作 Promotion Decision；Accept 只产生未来 SOP Release 或 Department Skill Version 提案，不直接改生产 Head。
- Effect Report 能追溯 Frozen Variant、Candidate、Evaluator、Case Set 和 Trial Fact Digest。

## 3. 证伪矩阵

矩阵覆盖：

1. 完整 Variant 冻结与生产 Head 不变；
2. 错误维度、Evaluator/Capability/Environment 篡改；
3. Retry 去重与单变量候选验证；
4. Hard Gate 否决；
5. 样本不足与 Case Mix 不平衡；
6. Late Fact/Reopen 的报告修订；
7. Drift Pause、序列化重建与显式 Resume；
8. Candidate/Validation 预算硬停；
9. Agent 晋升、错误 Digest 和非验证候选的拒绝；
10. 多目标冲突与完整追溯。

## 4. 历史证据

当时的验证证据写入系统临时目录，不包含业务正文、Secret 或 Provider Credential。原始命令和固定合成 Case 已按可丢弃原型边界移除。

## 5. 剩余完整 TV-08 验证

完整 TV-08 仍必须在 Gate B 和真实 L1 之后完成：

- 从真实 L1 Run/Validation Run 固定不可变 Execution Variant、Outcome、Finding、Evidence 和 Case Mix；
- 由真实 Researcher Agent 至少连续产生两个隔离 Candidate Revision，并在 Provider 中断后从持久状态恢复；
- 使用真实 Candidate Workspace 和固定 Evaluator 执行 Replay、Curated/Hidden Validation，必要时进入受控 Shadow/Limited Trial；
- 验证外部副作用隔离、真实成本/时延、样本充分性和多目标可用性；
- Human Promotion 通过真实版本服务创建未来 SOP Release 或 Department Skill Version，并演练未来 Binding 回滚；
- 证明历史 L1、旧 Release、旧 Report 和已开始 Run 永不漂移。

在这些证据出现前，Gate C 仍为“未进入”，不能用本机械原型替代。
