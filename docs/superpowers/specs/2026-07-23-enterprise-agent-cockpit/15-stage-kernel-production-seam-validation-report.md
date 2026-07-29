# Stage Kernel 生产接缝与真实模型恢复消融技术验证报告

状态：`validated`（可丢弃生产 Schema overlay 与真实模型原型）\
日期：2026-07-26\
验证包：TV-05（VAL-002、VAL-003、VAL-005）

> 归档说明：本报告保留生产接缝实验、Fresh-context 消融结果与 Digest；临时 Heartbeat Seam、Schema overlay、模型驱动脚本和执行命令未纳入正式开发基线。

## 1. 结论

TV-05 证明了 Gate A 的 Kernel 集成方向：生产 Heartbeat 完成 Run Claim 后，可以通过一个可选、默认不改变行为的窄接缝把执行所有权交给独立 Worker；当前 Fence 的真实 Docker Receipt 可以推进持久 Stage Snapshot，旧 Fence、旧 Epoch 和 Receipt 重放不能重复推进；独立 Verifier 与机械 Completion Gate 才能提交 `completed`。

两套全新生产 Schema scratch PostgreSQL + disposable overlay 连续执行均得到相同语义基数：5 个场景、1 个 Execution Variant、4 个 Stage Snapshot、1 个 Worker Command、1 个 Receipt、1 个 Retry Attempt、1 个 Recovery Envelope、4 条 Transition Audit、0 个泄漏容器、0 次本地 Adapter 执行。消费重新封口的 TV-03/TV-04 证据后，两轮 Recovery Envelope Digest 均为 `482e79ac703826137cf064c1d66817125b23ac2e894522c3ae3e640d9e27833a`。

真实 `gpt-5.6-sol`/Codex CLI 0.142.4 消融中，R0 Session Resume、R1 当前 Summary、R2 Recovery Envelope、R3 Envelope + Selected Transcript 四组使用同一 Fixture Digest，均满足边界安全、正确下一动作和独立测试完成；每组只修改允许的实现文件。R2 在这一个受控任务上不低于 R0；R3 增加 Transcript 后完成率仍为 1，本轮输入 Token 少 181,139、时延少 58,007 ms，该单样本差异不允许统计外推。

本次重新封口后的 Evidence Digest 为 `d44b40b947daa9f0d6b005aafc250e07eb8af38a07edec4c6656f2c325a46ef0`。

## 2. 已验证的不变量

- `claimedRunExecutionSeam` 未配置时仍执行原 `executeRun()`；原型没有新增生产 Migration、Worker API、SOP API 或 UI。
- 生产 Heartbeat Run 可以完成 Claim 后交给外部执行接缝，本地 Process Adapter 的陷阱文件始终未生成。
- Execution Variant 精确固定 Release、Execution Definition Revision、Binding Revision、Agent Configuration Snapshot、Capability Manifest 与 TV-04 Worker Runtime Evidence。
- 四路并发创建同一语义 Worker Command 只有一个身份；四路并发创建同一 Retry Generation 也只有一个身份。
- 真实 `node:20-alpine` Sandbox 使用 64 MiB、0.25 CPU、64 PID、无网络、只读 Root FS、Drop All Capabilities、no-new-privileges 和单目录挂载。
- 旧 Fencing Token 与旧 Stage Epoch 的 Receipt 均被拒绝；当前 Receipt 只应用一次，相同 Receipt 重放去重。
- Receipt 固化 Artifact 后，独立 Verifier 绑定同一 Artifact SHA-256；只有全部 Evidence 通过且无 Finding 时，机械 Gate 才提交完成。
- Store 关闭重建后得到同一 Recovery Envelope Digest；P9 事实未漂移矩阵返回 `dispatch`。
- R2 完全关闭旧 Session，仅靠结构化 Envelope 和 Workspace 取证完成修复；没有修改测试/契约、创建额外文件或执行外部写操作。
- R3 的 Selected Transcript 不作为权威事实，且在本样本中没有带来完成率增益。

## 3. 四组真实模型观察

| 组别 | 安全恢复 | 正确下一动作 | 独立验证完成 | Input Tokens | Output Tokens | 时延 |
| --- | --- | --- | --- | ---: | ---: | ---: |
| R0 Session Resume | 是 | 是 | 是 | 892,178 | 5,409 | 119,574 ms |
| R1 Current Summary | 是 | 是 | 是 | 376,806 | 2,514 | 119,461 ms |
| R2 Recovery Envelope | 是 | 是 | 是 | 489,014 | 2,717 | 151,271 ms |
| R3 Envelope + Transcript | 是 | 是 | 是 | 307,875 | 2,008 | 93,264 ms |

R0 的正确下一动作允许直接应用上一 Provider Turn 已明确的修复计划，因为该 Session 已在前一轮读取同一文件并执行失败验证；Fresh R1/R2/R3 则必须先检查任务文件或执行验证器。Input Token 包含本机安装的指令与 Skill 环境，只能作为本次相对观察，不能解释为纯 Prompt 大小。

## 4. Paperclip 适配结论

最窄生产接缝是 `startNextQueuedRunForAgent() → executeRun()`，而不是 Pipeline Automation、Routine、Plugin Worker 或 Sandbox Provider。正式实现应让 Server 持 Command/Lease/Session/Fence/Kernel Snapshot 权威事实，让 Worker 持 Docker/Workspace 执行能力；Heartbeat 现有上下文、Adapter、Workspace 和 Result 能力应按模块迁移，不能复制 2,500 余行 `executeRun()`。

P8 Retry Identity、P9 Resume Eligibility 和 P10 Recovery Envelope 可以共享一次数据库事务与版本身份。Session Resume 继续作为性能优化，Fresh Context 的正确性由结构化事实和独立 Gate 保证。原型适配审计的有效结论已经收口到本节与正式运行规格，原始审计文件不再保留。

## 5. 历史证据

当时的统一验证生成 `paperclip.validation-evidence.v1`，固定验证工作区源码 SHA-256、Docker/Codex/Model 版本、两轮确定性基数、四组脱敏指标、Scope Limit，以及 TV-01 至 TV-04 的实际 Evidence Digest。TV-01 隔离真实 GitHub Canary 通过后，TV-05 使用新 Digest 重新执行并保持 `validated`；保留的 TV-05 Evidence Digest 为 `562f7780…a50`。原始命令、临时生产接缝与 overlay 不再保留。

## 6. 适用边界

本报告不代表生产 SOP Kernel Schema、Worker Control API、Compose、Stage UI 或完整端到端纵切已经开发。真实模型部分只有一个受控可运行任务，证明方向充分性与停止规则未触发，不证明跨仓库、跨模型或长期运营的统计等价。真实复杂需求、跨日运行和其他 Adapter 仍需在灯塔纵切中验证。
