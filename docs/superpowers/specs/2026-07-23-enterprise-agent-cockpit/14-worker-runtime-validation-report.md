# 独立 Worker、并发 Sandbox 与 Workspace 技术验证报告

状态：`validated`（可丢弃真实 Docker 原型）\
日期：2026-07-26\
验证包：TV-04（VAL-018）

> 归档说明：本报告保留 Docker/Worker 实验事实、不变量与 Digest；可丢弃 Control Server、Worker、Sandbox 和执行命令未纳入正式开发基线。

## 1. 结论

TV-04 证明首期单节点 Docker 架构可以将 Paperclip Server 与 Agent 执行面分离：Server 容器既不挂载 Docker Socket，也不挂载 Workspace Root；独立 Worker 仅通过出站 Control API 注册、Heartbeat、Claim、续租、提交 Event/Receipt 和释放 Command，并通过 Docker Engine API 管理兄弟 Sandbox。

两套全新的 scratch PostgreSQL、临时 Worker State 与 Workspace Root 连续执行得到相同语义基数：7 个场景、1 个稳定 Worker、4 个 Session、8 个 Command、8 个 Event、8 个 Receipt，峰值恰好 2 个并发 Sandbox，清理后残留容器为 0。

在 TV-03 针对当前 Heartbeat 接缝重新封口后，TV-04 已消费新 TV-03 证据并完整重跑；本次可复核 Evidence Digest 为 `6b1b698f41a8352445d1b55069288751925eebe9eaf6c8f675ef514b56d4f0f7`。运行环境为 Docker Server 29.4.0、`node:20-alpine` 镜像 `sha256:cd266ddf7e80183cbac3cb23b49e90ab83a06f14f95d28681d8468f89dc00615`。

## 2. 已验证的不变量

- Control Server 与 Worker 是两个独立容器；Server 只有只读源码挂载，没有 Docker Socket、Workspace Root 或 Agent 执行入口。
- Worker 通过实例 Service Credential 注册并获得内存中的短期 Session Token；Worker 环境没有数据库凭证，Sandbox 环境没有 Worker Service/Session Credential。
- 同一稳定 Worker ID 每次注册递增 Session Epoch；旧 Session 的 Heartbeat、Renew 和 Receipt 被拒绝。
- Command 重领递增 Fencing Token；即使当前 Session 携带旧 Fence，也不能提交权威 Receipt。
- 固定两个 Slot 时实际峰值为 2，第三次 Claim 返回 `capacity_full`，没有容量超卖。
- `draining`、`not_ready` 与 `capacity_full` 是三个正交拒绝原因，没有把管理状态、健康状态和容量混成一个布尔值。
- 调度先按 Company 活跃占用与历史公平性选择 Company，再在 Company 内按持久优先级和入队时间选 Command；首批并发包含两个 Company，同 Company 高优先级先于低优先级。
- 每个 Sandbox 只挂载本 Run 目录；跨 Run 文件读取失败。Docker Inspect 与容器内 cgroup 同时证明 64 MiB 内存、0.25 CPU、64 PID、`network=none`、只读 Root FS、Drop All Capabilities 和 `no-new-privileges`。
- Sandbox 销毁及 Worker 容器替换不会删除 Workspace；重建后使用同一 Worker State/Workspace Mount，可读取旧 Checkpoint 并继续追加。
- 每次执行按唯一前缀精确清理容器，Workspace 持久性断言在容器清理后执行；两轮均无泄漏。

## 3. Paperclip 适配结论

当前 `heartbeat.executeRun()` 仍由 Server 直接拥有 Workspace、Runtime Service、Adapter 子进程和 Run 状态。Plugin Worker 只隔离受信 Plugin，Sandbox Provider Lease 只抽象执行环境，均不能直接充当 Agent Execution Worker。

正式纵切需要新增一个窄 Worker Control 接缝，而不是复制 Heartbeat 或把 Plugin Worker 改名：Server 持 Command/Lease/Session/Fence/Receipt 权威事实，Worker 持 Docker/Workspace 执行能力，Sandbox 只持当前 Invocation 的 Agent 能力。原型代码适配审计的有效结论已经收口到本节与正式运行规格，原始审计文件不再保留。

## 4. 历史证据

当时的统一验证真实创建两个独立 Control Server/Worker 容器和多个资源受限 Sandbox，连续运行完整矩阵两次，并在系统临时目录生成 `paperclip.validation-evidence.v1`。证据包含验证工作区源码 Revision、脏工作区标记、相关原型与生产适配文件 SHA-256、Docker Server/Image 身份、TV-02/TV-03 Evidence Digest、两轮场景和语义基数、Invariant 与 Scope Limit，不包含真实凭证或业务正文。原始命令和可丢弃运行时代码不再保留。

## 5. 适用边界

本报告不代表生产 Worker Schema、API、Docker Compose 或 UI 已实现。它只证明单节点 Docker、单 Worker、固定双 Slot 和本机 Workspace Volume 下的核心协议；多 Worker/Kubernetes、跨节点 Workspace、任意不受信镜像加固与规模性能不在 TV-04 范围。TV-05 仍需把真实 Release/Binding、Capability Manifest、Kernel Recovery 和 Worker Receipt 接成一次完整 Stage Loop。
