# TV-10：知识到 SOP 草稿 tracer bullet 验证合同

状态：`planned / inconclusive / No-Go`\
日期：2026-07-31\
验证项：VAL-019

> 本文是原型验证合同，不是验证报告。尚未运行原型、未形成 Evidence Digest，也未授权把知识处理或 Candidate 标记为生产能力。

## 1. 要回答的问题

最小生产纵切能否保持以下权威链：

```text
Resource Revision
→ Knowledge Processing Job
→ Derived Index Revision
→ Citation
→ SOP Draft Candidate
→ Studio Diff
→ Validation Run
```

## 2. 原型范围

- 1 个 Company、3 个固定样本：Markdown、PDF、docx；
- 1 个含歧义步骤、1 个缺少接口依据、1 个来源更新样本；
- 持久 Job、Index、Citation、Candidate 和 Draft Revision；
- 最小 Studio Diff/Warning 界面或可操作原型；
- 接入现有 Validation Snapshot/Run 接口的窄适配层；
- 不接向量数据库、知识图谱、多模型编排或自动发布。

## 3. 必测场景

1. 正常处理 3 种文件并回到精确 Citation；
2. 处理中取消、进程退出、重试和重复提交；
3. LLM 路由失败后词法降级；
4. 同一来源和生成参数的 Candidate 去重；
5. 来源 Revision 更新使旧 Candidate 进入 Stale；
6. 接受 Candidate 只创建 Draft Revision；
7. `target_paths` 越界 Patch 被拒绝；
8. 缺少能力、Resource、Secret 或 Workspace Preflight 时 Validation 失败；
9. 跨 Company、无 Resource 权限和错误信息侧信道测试；
10. 删除并重建 Index 后 Citation/Digest 一致性检查。

## 4. 机器证据

- 固定输入文件 Digest、Parser/Schema/Generator Version；
- 每个 Job 的阶段事件、Claim/Retry/Cancel 记录；
- Citation 定位与来源内容 Digest；
- Candidate Digest、Diff、Warning、Stale 原因；
- Validation Snapshot/Run ID、门禁结果和 Evidence 引用；
- 权限、重复、故障恢复和清理测试输出；
- 两次全新 scratch PostgreSQL 重跑的一致性 Digest。

## 5. Stop Rule 与 Go/No-Go

任一条件触发即保持 No-Go：

- Index 或生成文本成为权威来源；
- Citation 不能稳定回到固定 Resource Revision；
- 重试产生重复 Candidate 或自动创建 Release；
- Candidate/Patch 扩大能力或越过允许路径；
- LLM Reflection 能代替机械 Validation；
- 无权限 Actor 能从搜索、摘要或错误信息获得内容。

只有全部场景在两套全新 scratch PostgreSQL 上通过、Digest 一致，且最小生产 Schema/Service/API/UI/Validation 接缝完整，才能把 VAL-019 更新为 `validated`。孤立脚本或静态 Demo 只允许记录为局部原型证据。

## 6. 原型后决策

- 召回效果不足时，先用固定评测集判断是否需要 embedding；不因主观体验直接引入向量数据库。
- Citation 与结构化 Draft 可用但生成质量不足时，保留人工草稿入口，不扩大自动化权限。
- 只有真实评测证明词法 + LLM 路由不足，才提交索引架构 Reopen Proposal。
