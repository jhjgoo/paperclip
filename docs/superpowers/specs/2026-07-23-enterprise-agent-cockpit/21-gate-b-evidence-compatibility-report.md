# Gate B：孤立契约 Evidence Compatibility 报告

状态：原型兼容矩阵 `validated`；Gate B `inconclusive / No-Go`\
日期：2026-07-27\
收口重跑 Compatibility Digest：`db7f0af52f76a095e34fd4ccb038923475f76670f431c04a5db804cf14d4d372`\
收口重跑外层 Evidence Digest：`d4e85bc762fe61ec6751b104b12d0e856434183af4b8ec1e09513201223d46b7`

> 2026-07-27 收口校准：Runner 已拆分 `contractCompatibility` 与 `gateBVerdict`。孤立原型兼容矩阵通过时输出 `contractCompatibility=validated`；只要 TV-06/07/09 尚未接入生产 Schema、API、持久存储、真实事实源和 UI，`gateBVerdict` 就保持 `inconclusive`。当前证据不授权启动真实研发灯塔。

> 归档说明：本报告保留孤立契约兼容矩阵的结果、Digest 与 No-Go 边界；Runner、原型源码和执行命令未纳入正式开发基线。

## 1. 结论

Gate B 收口 Runner 在一次命令中按依赖顺序重新生成 TV-06、TV-07、TV-09 当前 Evidence，再执行两轮兼容矩阵。两轮 Compatibility Digest 均为 `db7f0af5…d372`，结果为 `contractCompatibility=validated`、`gateBVerdict=inconclusive`，并明确返回生产集成 Blocker。

Gate B 当前固定消费：

| Package | Evidence Digest | Verdict |
| --- | --- | --- |
| TV-06 | `5a0ef48f…5e41` | validated |
| TV-07 | `0761ed2f…e58a` | validated |
| TV-09 | `3f63fb7b…a3cfb` | validated |

TV-07 精确依赖本轮 TV-06 Digest；TV-06 与 TV-09 精确依赖 Gate A Compatibility Digest `9d514f18…f2ae7`。17 个相关源码摘要全部与本轮 Evidence 相等，无漂移。Runner 不再依赖可能被系统清理或已经过期的临时历史 Evidence。

## 2. 跨包原型接缝

### Authority → Attention

- Membership 失效只产生一个 `ReassignmentAttention`；
- 该事项的精确稳定 ID 成为 `personnel_reassignment` Required Source Ref；
- Required Item 不能永久 Dismiss；
- 改派生成 Authority Revision 2；旧 Revision 的 Gate Decision 返回 `stale_authority_revision`。

### Resource → Governance

- SOP Binding 保护的 Resource 不能移动；
- Resource Inspection 只派生存储字节、回收站占用与 GC 健康；
- Folder Name、File Name 和内容 Canary 在 Governance DTO 中命中为 0；
- 聚合对账全部为 true。

## 3. 历史机器证据

```text
current dependency evidence generation: 1
compatibility executions: 2
packages: 3
dependencyEdges: 3
matchingSourceDigests: 17
productionSeams: 2
negativeCases: 4
missingRetainedEvidence: 0
sourceDigestDrift: 0
g3g4Leaks: 0
compatibilityDigest: db7f0af5…d372
contractCompatibility: validated
gateBVerdict: inconclusive
gateBBlocker: production Schema/persistence/API/authorization/UI not integrated
```

原始 Runner 与命令已按可丢弃原型边界移除，以上输出只作为历史验证记录保留。

## 4. 当前授权范围

当前 Gate B 为 `inconclusive / No-Go`，不授权启动真实研发灯塔 L0/L1，也不允许人工或普通 Agent 直接修改 MoonTV。下一步应先把 Resource/Authority、Attention 与 Governance 接入最小生产纵切，并用生产 Schema、持久事实源、API、授权和 UI/操作路径重新验证；完成后再重新判定 Gate B。最小生产纵切只要求贯穿真实产品层的最窄闭环，不等于一次完成全部生产功能。

TV-08 仍未完成。它必须在真实 L1 和受控故障 Validation Run 之后，消费不可变运行事实完成 L2 Improvement Campaign。
