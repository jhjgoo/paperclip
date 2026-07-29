# TV-09：企业内容盲 Governance Projection 验证报告

状态：孤立领域契约原型 `validated`；生产集成未验证\
日期：2026-07-27\
验证项：VAL-013\
收口重跑 Evidence Digest：`3f63fb7be9cf2d886620b06b9180b55d67a65de5acacae5758962f9cae0a3cfb`

> 2026-07-27 治理校准：本报告保留原型证据，但此前“生产 Governance Projection”的称谓不成立。相关模块没有生产治理数据源、Route/Service 调用链、持久存储或 UI 接入；不得据此宣称 TV-09 企业治理纵切通过。

> 归档说明：孤立治理模块、验证驱动器和执行命令未纳入正式开发基线；本报告只保留字段边界、观测基数、Digest 与生产缺口。

## 1. 结论

TV-09 使用孤立 Governance Projection 领域契约原型连续执行两轮。两轮均覆盖 4 个场景、6 类 G3/G4 Canary、6 个原型输出面，Company 内容 API 调用为 0、Canary 泄露为 0、Stop Rule 违规为 0。

已证明：

- 44 个 Governance DTO 叶子字段与 Disclosure Manifest 精确一一对应；
- 允许字段分布为 G0=16、G1=19、G2=9、G3=0、G4=0；
- Manifest 为每个字段登记治理目的、来源、分类、脱敏、授权角色、保留、导出与深链；
- 名称、正文、路径、URL、Provider Metadata、Activity Details 六类 Canary 均未出现在 DTO、日志、错误、搜索、导出或深链；
- 投影依赖接口只提供部门聚合和运行时聚合，不提供 Company 内容查询方法；带额外内容方法的测试 Source 调用数仍为 0；
- 企业 Active Run、成本、存储汇总与逐部门聚合事实完全对账；
- 数据过期、部分采集、缺部门或 Source 失败时显式返回 Freshness/Completeness 降级，不回退查询业务内容或样本值。

## 2. 候选生产接缝（尚未接入）

- 候选 DTO、Manifest、Allowlist、搜索/导出/深链与错误边界：正式实现时建立独立内容盲 Governance Projection
- Instance Admin 身份接缝：`server/src/services/access.ts`、`server/src/services/authorization.ts`
- 现有聚合来源候选：`server/src/services/dashboard.ts`、`server/src/routes/health.ts`

企业页面必须调用独立 `GovernanceAggregateSource`，不能注入或复用 Company 内容 API 后在前端隐藏字段。

## 3. 历史机器证据

```text
executions: 2
scenarios: 4 / 4
manifestFields: 44
canaryClasses: 6
outputSurfaces: 6
contentApiCalls: 0
g3g4Leaks: 0
stopRuleViolations: 0
verdict: validated
```

目标 Vitest：3/3 通过。

原始驱动器与命令已按可丢弃原型边界移除，以上输出只作为历史验证记录保留。

## 4. Stop Rule

Stop Rule 未触发。Canary 明文只存在于测试/验证输入内；机器 Evidence 仅保存不可逆 Canary Digest、数量和各输出面命中数，不复制明文。任何未来字段若未进入 Manifest，或被分类为 G3/G4，将使字段快照测试直接失败。

## 5. 范围限制

本结论不代表 Enterprise Console UI、投影持久化调度、完整治理动作或审计导出已经生产就绪。它证明了内容盲 DTO 边界、Allowlist 和故障降级可行；正式路线必须只接受该 DTO，不能在 Controller/UI 旁路拼装 Company 内容。
