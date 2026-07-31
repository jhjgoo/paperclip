# TV-11：IM 请求接入 tracer bullet 验证合同

状态：`planned / inconclusive / No-Go`\
日期：2026-07-31\
验证项：VAL-020

> 本文是原型验证合同，不是验证报告。Provider 尚未选型，原型尚未运行；不得据此宣称 IM 接入、身份绑定或可靠投递已经实现。

## 1. 要回答的问题

最小生产纵切能否在不创建平行聊天模型的前提下闭合：

```text
IM Inbound
→ Signature / Identity / Dedup
→ Run Request
→ Delivery Outbox
→ Web Gate Deep Link
```

## 2. 原型范围

- 1 个 Company、1 个企业 IM Provider、2 名已绑定内部成员；
- 只支持私聊创建 Run Request；
- 固定 1 个 SOP、1 个 Project 和显式 Run Owner；
- 最小 Channel Connection Revision、Identity Binding、Inbound Event、Route、Outbox；
- 复用现有 Run Request、Input Request、Discussion、Human Gate 与审计 Service；
- 不支持群聊、陌生用户开户、LLM 自动选 SOP或渠道内审批。

## 3. 必测场景

1. 合法签名、过期时间戳、伪造签名和重放；
2. Provider 重复 Event、乱序、并发 Claim 和进程退出恢复；
3. 未绑定、停用、跨 Company 和绑定撤销身份；
4. Run Request 创建成功但回执发送超时；
5. Provider 返回未知投递状态，Outbox 停止盲目重试；
6. 相同 Event 在重启后仍只对应一个 Run Request；
7. IM 文本尝试批准/拒绝 Gate、修改预算、读取 Secret、Pause/Cancel；
8. Web Deep Link 登录、Membership、Assignee、Epoch、Authority Revision 和过期检查；
9. Input Request 已过期、已回复、跨 Run 和无权回复；
10. Channel Connection Revision 切换期间的迟到事件、旧凭证撤销和审计。

## 4. 机器证据

- Provider 请求摘要、签名验证结果和固定 Event ID；
- Inbound 唯一约束、Claim/Lease/Fencing、处理状态和 Intake Result ID；
- Run Request、Input Response 或 Discussion 的唯一领域对象 ID；
- Outbox 幂等键、Attempt、退避、Delivered/Uncertain/Failed 收敛；
- Web Deep Link 的签发、登录后重新鉴权和拒绝原因；
- Company Scope、身份撤销、高风险文本和审计测试输出；
- 两次全新 scratch PostgreSQL 重跑的一致性 Digest。

## 5. Stop Rule 与 Go/No-Go

任一条件触发即保持 No-Go：

- 同一 Provider Event 产生多个 Run Request 或副作用；
- 进程内锁、线程或内存队列是正确性前提；
- Payload 能决定 Company、内部 User 或 Connection 身份；
- IM 自由文本能形成 Human Gate Decision 或高风险控制动作；
- Outbox 在不确定结果下继续盲目重发；
- Deep Link 不重新鉴权，或旧 Epoch/Authority 仍可决定 Gate；
- Gateway 直接调用 Agent Loop 或复制 Run 状态。

只有全部场景在两套全新 scratch PostgreSQL 上通过、Digest 一致，且生产 Schema/Service/API/最小 UI 完整，才能把 VAL-020 更新为 `validated`。Mock Provider 可以验证故障矩阵，但至少需要一次真实 Provider 签名、入站和出站 Canary 才能关闭 Provider 接缝。

## 6. Provider 选型前置条件

首个 Provider 必须支持稳定事件 ID、可验证签名或可信回调认证、明确外部账号作用域和可观测投递结果。若 Provider 无幂等发送或投递查询能力，原型必须把 `uncertain` 与人工 Reconcile 做成显式终态，不能用无限重试掩盖限制。
