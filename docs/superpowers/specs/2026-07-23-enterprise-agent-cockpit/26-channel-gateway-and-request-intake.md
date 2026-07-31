# 子需求 14：Channel Gateway 与请求接入

状态：产品契约已确认；最小生产纵切待 VAL-020 验证\
日期：2026-07-31\
依赖：子需求 02、03、04、05、07\
关联决策：DEC-126、DEC-131、DEC-132\
关联验证：VAL-020

## 1. 目标与首期范围

本子需求让已绑定的企业内部成员从一个企业 IM 渠道私聊创建 Run Request，并接收可靠回执和已认证 Web 深链。Channel Gateway 是接入边界，不是聊天产品、Agent Runtime、Run Kernel 或审批系统。

首期不支持群聊、陌生用户自动开户、多个 IM Provider、LLM 自动选择 SOP、跨 Agent 自由切换、渠道内 Human Gate 审批或渠道侧独立会话状态机。

## 2. 领域模型

```text
Channel Connection Revision
→ External Identity Binding
→ Inbound Event
→ Conversation Route
→ Intake Router
   ├── Run Request
   ├── Input Response
   └── Discussion Message
→ Delivery Outbox
```

- `Channel Connection Revision`：固定 Provider、签名配置、Credential Reference、Webhook/轮询方式、能力与状态，不保存明文 Secret；
- `External Identity Binding`：把 Company + Channel + Provider Account Scope + External User 绑定到具体内部 User；
- `Inbound Event`：保存 Provider Event ID、签名/时间校验、归一化载荷摘要、状态、重试和错误；
- `Conversation Route`：固定会话当前允许的 Intake 目标和人工选择结果，不能成为 Agent/SOP 自动授权；
- `Delivery Outbox`：与领域变更同事务登记目标、内容引用、幂等键和投递状态。

## 3. 入站协议

Provider Adapter 只负责验证、归一化和发送。Gateway 按 `(channelConnectionRevisionId, providerEventId)` 去重，并通过持久 Claim/Lease/Fencing 处理事件；进程锁和内存队列不能成为正确性前提。

```text
Provider Adapter
→ Signature / Timestamp / Replay Check
→ Identity Binding
→ Persistent Dedup + Claim
→ Intake Router
→ 既有领域 Service 重新鉴权
```

Intake Router 不根据自由文本猜测权限。首期私聊创建 Run Request 时，用户必须从允许的 SOP/Project 中明确选择或使用已固定 Route；缺少必需 Argument、Project 或 Run Owner 时，返回结构化补充入口而不是创建不完整 Run。

Input Response 只能回复既有、未决且当前 Actor 有权处理的 Input Request。Discussion Message 只追加协作消息。两者都不能改变 Human Gate、预算、能力、Secret、Release 或 Kernel 状态。

## 4. 出站与恢复

Delivery Outbox 必须与 Run Request 或回复事实同事务写入。投递 Worker 原子 Claim，按 Provider 能力使用幂等键和有界退避；状态至少为 `pending | sending | delivered | retryable | uncertain | failed`。

Provider 结果不确定时进入 `uncertain` 并停止盲目重发，等待查询或人工 Reconcile。失败投递不得回滚已提交 Run Request，也不得重复创建 Run；工作台和 Channels 页面必须显示失败、下一动作和审计深链。

## 5. Human Gate 与高风险动作

IM 只发送摘要和一次性/短期已认证 Web 深链。进入 Web 页面后必须重新校验 Session、Company Membership、Gate Assignee、Stage Epoch、Authority Revision 和请求有效性。

以下内容不得由 IM 自由文本直接执行：

- Human Gate 批准、拒绝或要求返工；
- Pause、Resume、Cancel、Retry Stage 或预算覆盖；
- Secret 查看、提交或凭证轮换；
- Connection 启停、高风险 Tool Probe 或外部写操作；
- 角色改派、Break-glass 或企业治理动作。

## 6. 与现有 Paperclip 的边界

- Run Request、Input Response、Discussion、Human Gate 和 Attention 继续由各自主责 Service 拥有；
- Channel Gateway 只保存接入事实和 Delivery Outbox，不复制业务对象内容；
- 不复用 `BoardChat` 作为渠道 seam。其 `local_trusted`、本地 CLI 和跳过权限语义不满足外部身份与企业接入边界；
- Agent 仍由 Worker/Adapter 执行，Gateway 不调用 Agent Loop；
- 所有路由保持 Company Scope、预算、审计和现有权限检查。

## 7. 验收场景

1. 同一 Provider Event 重复、乱序或进程重启后只创建一个 Run Request。
2. 未绑定、已停用或跨 Company 的外部身份不能创建 Run，也不能从错误响应推断可用 SOP。
3. 创建成功但出站超时不重复创建 Run；Outbox 查询后收敛到 Delivered 或 Uncertain。
4. 用户发送「批准」不能改变 Human Gate；Web 深链只允许当前 Assignee 在有效 Epoch 作出决定。
5. 用户回复 Input Request 时，系统重新验证 Run、Stage 和 Actor；过期请求返回结构化失效原因。
6. Channel Connection Revision 更新不改写历史 Inbound/Delivery 事实；旧 Revision 的迟到事件按固定身份处理或拒绝。
7. Channels 页面能重放安全的接入处理或投递，但不能借重放重复产生业务副作用。

## 8. 验证缺口

VAL-020 当前为 `planned / inconclusive / No-Go`。尚需验证生产 Schema、Provider Adapter、签名与重放保护、身份绑定、持久 Claim/Lease/Fencing、唯一约束、Outbox 恢复、Web Deep Link 重新鉴权和故障注入。验证合同见 [IM 请求接入 tracer bullet](./28-channel-intake-tracer-bullet-validation-plan.md)。
