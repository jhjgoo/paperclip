# Gate A 跨包证据兼容性技术验证报告

状态：契约兼容性 `validated`；Gate A `validated`（Go：允许最小生产纵切）\
日期：2026-07-27\
范围：TV-01～TV-05 证据、依赖、身份语义与 Scope Limit

> 归档说明：本报告保留 Gate A 的历史兼容性判定、Digest 与产品授权边界；其“当前源码”均指 2026-07-27 的验证工作区快照。可丢弃探针、临时生产接缝和执行命令未纳入正式开发基线，不能据此认为当前 HEAD 已实现这些能力。

## 1. 结论

TV-01～TV-05 的保留证据与当时验证工作区源码可以组成一条精确、无环且不扩大声明范围的 Gate A 证据链。兼容性探针连续执行两轮，稳定 Compatibility Digest 均为 `9d514f181a0a7c0a740f34f8200554d0499671fa026390c43c78c28d797f2ae7`；两次外层 Evidence Digest 分别为 `396a9efa…30bba` 与 `4ccde2ab…5687c`。

TV-01 的确定性链与隔离真实 GitHub Canary 已连续两轮通过；TV-05 又以该新 Digest 重新执行生产接缝与四组真实模型消融并通过。TV-01～TV-05 当前 Verdict 均为 `validated`，因此 Gate A 为 Go，允许开始最小生产纵切。该结论不等于生产就绪，也不允许绕过 Gate B 直接对 MoonTV 发起灯塔 SOP Run。

## 2. 证据链重新封口

第一次兼容性执行发现 TV-03 的保留证据固定了加入 TV-05 Heartbeat 接缝之前的 `heartbeat.ts` 摘要。该差异不是授权协议反例，但旧证据不能证明当前源码。验证按依赖顺序重新执行：

1. TV-03 在当前 Heartbeat 接缝上重新通过，Evidence Digest 为 `24f0ad87c755d61b78169add367372d2345b5575b34aecfed28308cf1d5a7b0f`；
2. TV-04 消费新 TV-03 证据并重新通过，Evidence Digest 为 `6b1b698f41a8352445d1b55069288751925eebe9eaf6c8f675ef514b56d4f0f7`；
3. TV-01 隔离真实 GitHub Canary 连续两轮通过，当前 Evidence Digest 为 `ae7cfaba0b4f36642dcb73d6c45e491309dbae5507044d101e4036b0ceaa8ed7`；
4. TV-05 消费新 TV-01/TV-03/TV-04 证据重新执行生产接缝与真实模型消融并通过，Evidence Digest 为 `562f778094f7e6074bc253b1a572ad9309c3219ce2fb121196bb4ec919594a50`。

TV-02 源码摘要未漂移，继续使用已验证证据 `d976251862bf4747847613fdace38c3d688bad78042ed77cde8ac037a7339eb6`。全部下游依赖均精确引用当前上游 Digest，不再消费旧的 TV-01 `inconclusive` 证据。

## 3. 已验证的不变量

- 5 个精确 Evidence Digest 均能取回对应 `paperclip.validation-evidence.v1`；其包 ID、Verdict、Invariant、依赖和 Scope Limit 与登记值一致。
- 47 个相关源码摘要全部与保留证据一致，没有用旧证据覆盖新代码。
- 7 条依赖边无环，并精确引用上游 Evidence Digest。
- Release/Execution Definition/Binding/Agent Snapshot/Capability Manifest 使用不可变身份；不读取可变当前指针解释历史运行。
- Agent Capability Scope 固定 Company、Run、Stage、Epoch、Invocation、Agent Snapshot 与 Manifest Digest。
- External Operation Key 固定 Effect Occurrence，但不混入 Stage Epoch、Invocation、Tool Invocation、Worker Session、Fence 或 Parameter Digest。
- Worker Receipt 必须固定 Command、Stage Execution、Epoch、Invocation、Worker Session Epoch 和 Fence。
- 文件 Artifact 必须固定内容 SHA-256 和 Producing Invocation。
- 故意删除 Release ID、Stage Epoch、Fence、Artifact Digest，或把 Invocation 混入 Effect Key 的 5 个反例全部被机械拒绝。
- TV-01 的真实 Provider 结论来自自身隔离 Canary；TV-05 明确消费确定性与真实 Canary 证据，同时继续声明生产 Connector/Worker/SOP Kernel 尚未实现。

## 4. 历史证据

当时的兼容性探针只读取保留 Evidence 和验证工作区源码契约，不再次执行五个业务状态机；证据输出到系统临时目录，不包含 Secret 或业务正文。原始命令、探针和临时生产接缝不再保留。

## 5. 适用边界

本报告不实现生产 SOP、Connector、Worker、Kernel、Resource、Attention 或 Governance 状态。Gate A 的 Go 只允许开始最小生产纵切；TV-06、TV-07、TV-09 必须在该纵切中验证并形成 Gate B 证据，Gate B 之前不得让 Agent 或人工直接开发 MoonTV 需求。TV-08 仍必须消费真实 L1 事实。
