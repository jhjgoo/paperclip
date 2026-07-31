# 子需求 13：知识处理、引用与能力草稿

状态：产品契约已确认；最小生产纵切待 VAL-019 验证\
日期：2026-07-31\
依赖：子需求 02、03、04、05、06\
关联决策：DEC-127 至 DEC-130\
关联验证：VAL-019

## 1. 目标与边界

本子需求定义部门 Resource 如何形成可检索、可引用的派生知识，以及如何从固定来源生成待审核能力草稿。它不替代 Resources、SOP Studio、Skills Registry、Connections 或 Improvement Campaign 的事实源和生命周期。

首期只支持 Markdown、PDF、docx；只实现词法检索与可选 LLM 路由。向量数据库、知识图谱编辑器、自动本体、多文档持续重写和知识自动生成通用 `SKILL.md` 延后。

## 2. 权威链与领域模型

```text
Resource Revision（权威来源）
→ Knowledge Processing Job
→ Derived Index Revision（可重建派生物）
→ Citation / Evidence Pack
→ Capability Draft Candidate
→ Review
→ 既有 Studio / Skill / Connection 草稿入口
```

`Knowledge Processing Job` 至少记录 Company、Resource Revision、Parser Version、阶段、进度、取消请求、错误和输出摘要。阶段至少覆盖解析、规范化、结构提取、索引、Citation 建立和可选能力发现。失败或取消不得改变 Resource Revision，也不得把半成品 Index 标记为 Ready。

`Derived Index Revision` 必须固定来源 Revision、Parser/Schema 版本和内容 Digest。它可以删除并重建，不能成为引用权限或内容真实性的来源。

`Citation` 必须能定位到固定 Resource Revision 的页码、章节、段落或稳定文本范围，并保留内容摘要。检索结果先返回 Citation 和路由轨迹，再由调用方决定是否生成摘要；生成文本不能替代引用。

## 3. 检索合同

检索顺序首期保持简单：

1. 使用查询词、标题、章节和局部文本做词法召回；
2. 可选 LLM 只负责在候选文档/章节间路由；
3. LLM 不可用、超时或返回非法结果时降级到词法路径；
4. 输出固定 Citation Set、命中原因、路由轨迹和完整性警告。

检索必须继承 Resource 访问边界。Agent 只能检索本次 SOP Binding、Run 授权或其已有部门权限可访问的 Resource Revision；派生索引不能扩大可见范围。

## 4. Capability Draft Candidate

首期允许 3 类 Candidate：

- `SOP Draft Candidate`：阶段、输入输出、责任、验收和风险的草稿；
- `Skill Draft Candidate`：部门 Skill 内容草稿，不等于可安装通用 `SKILL.md` 包；
- `Connection / HTTP Tool Draft Candidate`：只包含有明确来源的 URL、Method、参数和 Schema 草稿。

每个 Candidate 必须固定：

- Company、Candidate Type、状态和不可变 Digest；
- Citation Set 与 Resource Revision Set；
- 来源摘要、生成模型、Prompt/Generator Version、Schema Version；
- 结构化草稿、未解析项、风险、副作用和验证状态；
- 创建、审阅、拒绝、过期和应用的 Actor/时间。

状态最小集合为 `pending_review | accepted_to_draft | rejected | stale`。来源 Revision、Schema 或关键生成配置变化后，未处理 Candidate 进入 `stale`，不能静默重写。

## 5. 审阅与进入既有生命周期

- 接受 SOP Candidate：在 SOP Studio 创建 Draft Revision 和来源引用，不创建 Release；
- 接受 Skill Candidate：创建 Department Skill Draft，不安装、不启用、不绑定 Agent；
- 接受 Tool Candidate：预填 Connection 向导，不写 Secret、不 Probe、不启用 Tool；
- 拒绝 Candidate：保留来源、理由和审计，不影响资源与既有能力；
- Warning：来源不足或接口不明确时只记录警告，不生成可执行草稿。

SOP 后续仍需 Diff 审阅、Schema/Graph/Capability/Resource/Secret/Workspace Preflight、Validation Run、Evidence 和人工发布。Skill 仍需真实测试和版本化。Tool 仍需 Worker/Sandbox Probe、风险分级、Human Gate 和 Connection Configuration Revision。

## 6. 权限、安全与审计

- Job、Index、Citation 和 Candidate 均为 Company-scoped；
- 读取 Candidate 必须同时满足 Candidate 权限和来源 Resource 权限；
- 模型输入只包含调用者有权访问的固定内容，并记录发送范围；
- 不把 Secret、未授权 Resource、原始全文或生成代码写入审计摘要；
- Candidate 不获得 Agent、Connection、Tool 或 Sandbox 的运行权限；
- 任何 Probe 或 generated code 都必须进入 Worker/Sandbox，不在 Server 进程执行。

## 7. 验收场景

1. 同一 Resource Revision 重试处理只形成一个 Ready Index Revision；取消后可从安全点重试。
2. PDF、docx 和 Markdown 的 Citation 均能回到固定来源位置；Resource 更新后旧引用仍指向历史 Revision。
3. LLM 路由失败时返回词法结果和降级标记，不把 Job 判为失败。
4. SOP Candidate 应用后只产生带来源的 Draft Revision；发布按钮仍受完整机械门禁控制。
5. Tool 文本缺少精确 URL 或 Method 时只产生 Warning；明确接口形成的 Candidate 也不含 Secret。
6. 删除派生索引后可以从 Resource Revision 重建，不改变历史 Citation 与 Candidate Digest。
7. 无来源权限的用户和 Agent 不能通过搜索、Candidate 摘要或错误信息推断内容。

## 8. 验证缺口

VAL-019 当前为 `planned / inconclusive / No-Go`。尚需验证生产 Schema、Job Claim/恢复、解析器隔离、Citation 稳定性、权限过滤、Candidate 去重/过期、Studio Diff、Worker/Sandbox Probe 和 Validation Run 接入。验证合同见 [知识到 SOP 草稿 tracer bullet](./27-knowledge-to-sop-tracer-bullet-validation-plan.md)。
