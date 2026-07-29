# 子需求 09：企业平台治理、运行健康、成本、风险与审计

状态：首期产品面已确认；治理投影与 Worker 原型已验证，生产数据源、生产接入与 UI 未验证
日期：2026-07-26
依赖：子需求 02、03、05、06、07、08
关联决策：DEC-009 至 DEC-013、DEC-049 至 DEC-057、DEC-069 至 DEC-071、DEC-091 至 DEC-115
关联验证：VAL-009、VAL-013、VAL-018

## 1. 目标与边界

Enterprise Console 服务一家企业内部的平台治理。企业管理员关心部门、额度、AI 基础设施、Worker/运行健康、成本、平台审批、风险、合规和审计，不负责部门业务交付。

一个 Paperclip Instance 只服务一家企业。现有 Company 是部门空间；不新增 Enterprise/Tenant 业务实体，也不建设跨企业运营后台。

企业治理必须内容盲：能够回答“哪个部门、哪类基础设施、多少成本、什么故障、谁执行了什么治理动作”，但不能因此读取部门 SOP、Run、Artifact、Prompt、Transcript、资源文件或私有 Skill。

## 2. 首期 Enterprise Console

```text
总览
├── Enterprise Overview
└── Departments

AI 基础设施
├── Models & Credentials
├── Connectors
├── MCP Servers
├── Skills Registry
├── Adapters
└── Platform Extensions

平台运营
├── Runtime Health
├── Capacity & Incidents
└── Cost

治理
├── Risk & Approvals
├── Resource Governance
├── Compliance
├── Audit
└── Access

设置
└── Instance Settings
```

每个能力入口拥有独立列表、详情和类型专属动作。跨类型 Catalog 若保留，只是治理总览与深链，不承载写操作。

## 3. Governance DTO 与 Disclosure Manifest

企业页面必须消费独立 Governance DTO，不得复用 Company 内容 API 后在前端隐藏字段。

每个治理 DTO 必须有 Disclosure Manifest，逐字段声明：

- 治理目的；
- 数据来源；
- 聚合粒度；
- 是否可能泄露业务内容；
- 允许的 Enterprise Role；
- 保留与导出规则；
- 可深链的目标页面。

默认禁止返回自由文本业务字段、文件名、Prompt、Transcript、Artifact 内容、SOP 名称、Department Skill 元数据或可反推出业务语义的样本值。需要进入部门内容时必须使用有效 Membership 或明确 Break-glass Session，不能扩大治理 DTO。

## 4. Enterprise Overview

首期总览至少展示：

- 部门数量、启停状态与额度异常；
- 活跃、排队、等待和失败运行的聚合数量；
- Worker 在线/就绪状态、Slot 容量和 Sandbox 使用；
- Model、MCP、Connector、Adapter 与 Platform Extension 健康；
- 企业和部门成本、预算与存储使用；
- 待处理的平台审批、基础设施异常和治理 Attention；
- 审计写入、投影刷新与关键后台任务健康。

总览卡片只能深链到对应治理页，不得跳入业务 Run、SOP、Artifact 或 Transcript。

## 5. Departments 与额度

企业管理员可以：

- 创建、启用、停用部门；
- 维护组织成员关系；
- 下发或收回成本、存储和并发额度；
- 查看部门级用量、健康、异常和治理动作状态；
- 停用平台 User、撤销 Session 和管理企业身份授权。

“发现部门”不等于“进入部门”。没有 Membership 的部门不出现在“我的部门”中；企业管理员只能在 Enterprise Scope 查看其治理投影或发起受限 Break-glass。

部门停用、额度收回和成员变更必须展示受影响的活跃运行、排队 Command、能力使用和未决治理动作，但不得暴露业务内容。

## 6. AI 基础设施治理

企业管理员负责供给和治理：

- Model Credential 与 Model Deployment；
- Connector Definition/Version；
- 独立 Remote/Managed MCP；
- Agent Adapter Definition/Version；
- Enterprise Skill 与 External Skill Repository；
- Instance-scoped Platform Extension。

企业管理员可以执行类型适配的登记、安装、基础测试、更新、部门开放、停用、影响查看和受引用保护卸载。安装能力与向部门开放是两个明确动作。

企业管理员不创建部门 Connection、不组装 Agent、不选择 Agent Tool、不配置 SOP Stage，也不能以企业策略覆盖业务流程。

## 7. Skills Registry 隔离

企业 `Skills Registry` 只展示 Enterprise Skills 与 External Repositories：

- 企业直接创建或从外部仓库安装的不可变 Skill Version；
- 来源、版本、结构校验、部门开放、健康与影响；
- 外部仓库中的可发现版本和显式安装动作。

企业管理员不能列出、搜索、读取元数据或内容、查看使用关系，或管理任何 Department Skill。未来部门主动提交发布快照时，企业审批只能读取该次不可变 Submission，不得借此浏览部门 Skill 空间。

## 8. Runtime Health

Enterprise Console 观察 Worker、Sandbox、Execution Command、Lease、Workspace 挂载和 Workspace Runtime Service 的技术健康，但不管理业务执行 Environment Catalog。

Worker 状态必须按三个正交维度表达：

```text
Admin State     enabled / draining / disabled
Liveness        online / stale / offline
Readiness       ready / not_ready(reason)
Capacity        available / full
```

只有 `enabled + online + ready + available` 的 Worker 可以 Claim 新 Command。`full` 是容量状态，不是故障；在线但 Docker、Workspace 或必要 Adapter 不可用的 Worker 必须标记 `not_ready`。

首期企业管理员只拥有以下 Worker 动作：

- `enable`：允许领取新工作；
- `drain`：停止领取新工作，等待现有 Sandbox 结束或进入安全恢复；
- `disable`：紧急停止领取并触发受影响 Command 的恢复检查；
- 针对具体故障由系统声明的有限 Recovery Action。

不提供通用“强制成功”、任意状态编辑或绕过 SOP Kernel 的操作。

## 9. Instance Runtime Configuration

Instance、Server、Worker、Docker/Sandbox Provider、默认 Temporary Sandbox Image、数据库、存储和网络参数通过 `.env`、Docker Compose 或系统配置维护，不进入 Enterprise Console 的 Environment Catalog。

Project Env 只属于部门 Project，保存项目级变量与 Secret Reference。企业管理员不能配置或读取 Project Env；Enterprise Console 只能看到不泄露键名和值的绑定健康聚合，例如“缺失绑定数量”。

如果未来确实需要不同 Project 使用不同镜像或执行集群，必须另行设计 Project Runtime Profile；首期不得提前建立该实体或页面。

## 10. Capacity 与调度观察

首期为单节点 Docker 和一个逻辑 Worker，但 Worker 可以在固定 `maxConcurrentSandboxes` 内管理多个并行 Sandbox。

企业管理员可以查看：

- 总 Slot、使用中、可用和等待数量；
- 按部门聚合的运行中与排队数量；
- 最久等待时间与公平调度异常；
- Sandbox 创建、资源限制、销毁和清理失败；
- Worker Session、Heartbeat、Claim、Lease/Fencing 与迟到 Receipt 拒绝；
- Workspace Volume 挂载、容量和恢复健康。

业务用户、SOP 和 Stage 不填写 CPU、内存、PID 或 Worker Pool 请求。首期所有部门等权，采用非抢占式公平队列，不提供权重、保留 Slot 或专属 Worker Pool。

## 11. Cost 与额度

Cost 页面必须区分：

- Model/Provider 用量；
- Agent Invocation 与 Delivery Attempt；
- Connector/MCP 外部调用；
- Worker/Sandbox 运行；
- 存储和文件资源用量；
- 部门预算、额度与硬停止事实。

企业管理员可以查看企业与部门聚合、下发或收回额度、定位异常增长和导出治理报表，但不能通过成本明细读取 Prompt、Artifact、Tool 参数或业务 Outcome。

预算硬停止仍由运行时执行；企业页面不能把超预算 Run 强制标记成功。恢复必须先调整有效额度或处理具体故障，再由原运行状态机重新校验。

## 12. Risk、Approvals 与 Compliance

首期只治理已有平台事实和高风险基础设施动作，包括：

- 企业能力安装与部门开放；
- Credential 使用、轮换与撤销；
- Platform Extension 启停或卸载；
- Connector/MCP/Adapter 高影响更新；
- Worker 紧急停用和系统声明的恢复动作；
- Break-glass Session。

Compliance 与 Risk 页面只呈现已有治理事实、审批状态和审计结果，不主动解释部门业务语义。

首期不建设自定义合规规则、DLP、SIEM、风险文件识别、复杂告警编排、通用策略引擎、统一信任评分或复杂企业 RBAC。

## 13. Resource Governance

企业管理员可以查看逐部门存储额度、实际用量、回收站占用、Blob 回收健康和治理动作状态，并下发或收回额度。首期只允许执行系统声明且不需要选择业务文件的有限维护动作，例如重算部门用量或重试 Blob 回收。

Resource Governance 不能复用部门文件浏览器，也不得展示目录、文件名、预览、下载、提取文本或内容摘要。企业管理员不能选择具体 Resource File/Folder 执行删除、移动、恢复或永久清除；这些逻辑文件动作仍由有 Company 内容权限的部门角色完成。企业管理员执行维护动作时不得获得文件详情访问权。本阶段不设计风险文件识别、文件隔离、定向删除与处置流程。

被 SOP Binding、Run、Artifact 或其他保留关系引用的资源继续受引用保护；治理动作必须通过领域 Service 校验，不能直接删除底层 Blob。

## 14. Audit

企业审计至少支持按以下维度筛选和导出：

- Actor 与身份来源；
- Enterprise/Company Scope；
- 部门；
- 资源类型和稳定 ID；
- 动作、结果、失败原因；
- 发生时间；
- Approval、Break-glass、Worker Session、Command、Connection 或能力版本关联。

必须审计：

- 组织、成员和额度变更；
- 能力登记、安装、更新、部门开放、停用和卸载；
- Credential 轮换和撤销；
- Worker 管理与恢复；
- 平台审批和 Break-glass；
- 外部工具调用与治理动作；
- Governance DTO 导出。

审计记录可以引用业务对象稳定 ID，但不得把部门内容复制进企业审计正文。

## 15. Break-glass

Break-glass 保留为到期、限范围、全审计的紧急访问，不因 Enterprise Console 扩大权限。

创建 Session 必须声明原因、目标 Company、允许权限和到期时间；进入部门前再次提示。Session 到期、撤销或 Membership/身份变化后立即失效，并清理对应缓存和实时订阅。

Break-glass 不是企业管理员的日常部门浏览入口，也不能用于绕过业务审批、职责分离或 Artifact 发布权限。

## 16. 验收场景

1. 企业管理员看到各部门成本、容量和健康，但无法打开任何部门 SOP、Run、Artifact、Prompt 或 Transcript。
2. 企业管理员安装 Connector Version 并向指定部门开放；部门是否创建 Connection、绑定 Agent 或启用 Sync 不由企业页面代替。
3. Enterprise Skills 页面无法搜索或列出 Department Skill；外部 Skill 安装后形成独立企业版本。
4. Worker 满载时显示 `online + ready + full`，不会误报故障；Docker 不可用时显示 `online + not_ready`。
5. `drain` 后 Worker 不领取新 Command，现有运行安全结束；`disable` 触发结构化恢复检查而非强制完成。
6. 企业管理员调整部门文件额度、重算用量或重试 Blob 回收，但 Resource Governance 不返回文件名、预览或内容，也不能定向删除、移动或恢复逻辑文件。
7. 没有 Membership 的企业管理员从 Departments 页面只能进入治理详情或 Break-glass，不能进入部门 Dashboard。
8. Project Env 缺失绑定可以形成数量级治理异常，但企业管理员看不到变量键、Secret 名称或值。

## 17. 验证状态与缺口

VAL-013 已在孤立治理投影原型中验证 Governance DTO、Disclosure Manifest、字段白名单、内容 Canary 和故障降级；VAL-018 已验证独立 Worker、Sandbox、容量、公平调度、Session/Fencing 和 Workspace 隔离恢复。

仍需验证：

- 治理 DTO 接入真实聚合数据源、Instance Admin 授权、持久投影、Route/API 和 Enterprise Console 的最小生产纵切；
- Worker、Sandbox、容量和健康事实接入生产控制链与企业治理视图；
- 企业聚合查询的性能、刷新与故障降级；
- 审计导出、保留和内容泄露检查；
- Break-glass 与多标签页权限撤销的生产事务；
- Cost Event 在 Model、Connector、Worker、Sandbox 和存储之间的一致归集。

这些是治理投影和生产执行证据缺口，不再是企业管理员职责或页面范围待选项。
