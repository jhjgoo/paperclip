# MoonTV SOP Throwaway Prototype Report

日期：2026-07-27\
结论：**窄范围问题已完整重跑并 validated；原型正确停在 `waiting_human_gate`，没有虚假返工。**

> 归档说明：本报告只保留 throwaway 原型回答、运行身份、结果与边界；原型源码、临时 worktree 和执行命令未纳入正式开发基线。

## 关闭性重跑

2026-07-27 使用全新 scratch PostgreSQL、全新隔离 worktree 和新的 Heartbeat Run 完成关闭性重跑：

- SOP Run：`sop-run-04e317bf-1314-4040-a8c7-55a63f2bc603`
- MoonTV 基线：`f28bef49562af618801f52c2a7d541ab74391870`
- Planner Heartbeat Run：`08f31e2a-31fc-477e-bfee-531e6b9d9d82`
- Developer Heartbeat Run：`515702e7-85e8-4c63-8739-a1fbc2051c52`
- Verifier Heartbeat Run：`a1492a50-5070-4a3a-966c-2ef200ca2152`
- Baseline acceptance：4 suites、28 tests，全部通过。
- Candidate acceptance：6 suites、42 tests，全部通过。
- Verifier：六项验收标准全部 `passed`。
- Kernel 终态：`waiting_human_gate`；`epoch=1`；`findings=[]`；没有第二次 Developer。
- 原始 MoonTV checkout 仍停留在同一基线，除既有 `.codebase-memory/` 外没有修改；没有 commit、push、Branch、PR、merge、deploy 或生产外部副作用。

关闭性重跑前的一次尝试在 Developer 600 秒上限处 `timed_out`。只读诊断发现 Developer 已形成完整候选，独立执行固定验收时 6 suites、40 tests 全部通过，因此失败边界是结构化终态返回预算不足，而非实现或测试失败。原型只把写入型 Developer 预算提高到 900 秒，并同步外层等待上限；全新重跑中的 Developer 随后在该预算内成功返回。该结果说明生产 Stage Executor 的超时应由 Stage/Executor 运行保护显式控制，不能把 Provider 超时误判为业务验收失败。

## 验证问题

机械 SOP Kernel 能否通过真实 Paperclip Heartbeat 调用 Planner、Developer、Verifier，在隔离 MoonTV worktree 中完成候选修改、独立验收并进入 Human Gate，而不是由 Root 会话直接开发？

## 真实运行事实

- SOP Run：`sop-run-cbb3de90-5250-45a3-a69b-549ff132ac00`
- MoonTV 基线：`f28bef49562af618801f52c2a7d541ab74391870`
- 候选 worktree：已清理的系统临时隔离目录（原绝对路径不作为可复用证据保留）
- Planner Heartbeat Run：`3f9cd699-3520-4844-98dd-46c3b1b7a622`
- Developer Heartbeat Run：`52b9dc05-b700-4916-8613-26987bda446e`
- Verifier Heartbeat Run：`30ceb59c-1981-472c-b06a-3262066839b6`
- 原始 MoonTV checkout 保持 `main...origin/main`，除既有 `.codebase-memory/` 外无修改。
- 没有 commit、push、Branch、PR、merge、deploy 或生产外部副作用。

## 结果

Baseline acceptance：4 suites、28 tests，全部通过。

Developer 在 SOP worktree 中形成 13 个修改文件和 2 个新增测试文件。Kernel candidate acceptance：6 suites、44 tests，全部通过。

Verifier 逐项检查六个验收标准并全部返回 `passed`：

1. 页面只展示服务端返回的当前用户可见源，并支持零个、一个或多个选择；
2. 空选择保持搜索全部可见源；
3. 服务端在下游搜索之前完成请求源与授权源交集；
4. 隐藏、禁用、无权和未知源不执行且不泄露元数据；
5. Progressive 与 non-progressive 路径携带相同 scope；
6. API、客户端、权限和页面定向测试通过。

因此按照机械门槛，第一次候选应直接进入 `waiting_human_gate`，不需要返工。

## 原型发现

`codex_local` Heartbeat 的结构化结果在首次运行中以 JSON 字符串承载。原型最初只识别对象，导致它虽然记录了 Verifier 的 `verdict=passed`，却错误判定为失败并预约第二次 Developer。Root 会话在第二次 Developer 返回前中断运行，避免无意义返工。

该发现只要求 Stage Executor 在 Kernel 判定前把 object / JSON string 归一为同一协议对象；不需要 HMAC Ledger、生产 Workspace Authority、并发控制或新领域实体。关闭性重跑已经证明归一化后的 Planner、Developer、Verifier 输出均能被 Kernel 消费，Verifier `passed` 会直接进入 Human Gate。

## 回答

**能做到。** 现有 Paperclip Heartbeat 加机械 Stage 顺序已经足以让 SOP 而非 Root 会话完成真实代码候选，并由独立 Verifier 审核后一次进入 Human Gate。下一步产品实现应优先固化 `Stage Executor output normalization → Kernel command` 和显式运行保护这一窄接缝，同时复用现有 Project/Execution Workspace；不得从本原型推导出重新实现 Workspace 子系统的需求。本结论不代表生产 SOP Schema/API/UI、Worker、Gate B 或 MoonTV L1 已完成。
