# 全站国际化与中文化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将既有 Paperclip 的静态 UI 文案完整迁移到 `zh-CN`/`en`，默认中文，并让用户能在个人设置中本地切换语言。

**Architecture:** 复用 `ui/src/i18n/` 中已初始化的 `i18next` 单 namespace；新增很薄的 locale preference 与格式化入口，不引入服务端状态。所有页面使用语义 Key；TypeScript AST 静态检查只拦截用户可见的新增硬编码文案，语言包结构校验保证两种语言完全对等。

**Tech Stack:** React 19、TypeScript、i18next、react-i18next、Vitest、原生 `Intl`、TypeScript compiler API。

---

## 实施边界与提交策略

- 不新增 npm 依赖、数据库字段、API 或 Profile 修改；语言偏好使用 `localStorage`。
- `zh-CN` 是无本地偏好或偏好无效时的唯一默认值，不读取浏览器语言。
- 每个中间提交可存在未迁移页面，但最终发布门禁必须覆盖全部注册路由；不将「部分中文」作为可发布状态。
- 用户输入、Agent 输出、外部数据、文件内容、代码、命令、URL、原始日志与 Transcript 不迁移为翻译 Key。
- 现有 `App.tsx` 的 `boardRoutes()` 是覆盖清单的权威入口；路由新增时，i18n 审计测试必须将其纳入扫描。

## 文件结构

| 文件 | 责任 |
| --- | --- |
| `ui/src/i18n/locale-preference.ts` | 读取、校验与写入浏览器个人语言偏好；无副作用导出，便于单测。 |
| `ui/src/i18n/format.ts` | 使用当前 i18n locale 的日期、时间、数字、金额、相对时间格式化；不包含业务状态文案。 |
| `ui/src/i18n/static-text-check.ts` | 用 TypeScript AST 识别 React 用户可见文本节点和指定 string 属性，输出可测试诊断。 |
| `ui/src/i18n/locales/en.json` | 英文基准翻译 Key。 |
| `ui/src/i18n/locales/zh-CN.json` | 简体中文翻译 Key，与英文 Key 树严格一致。 |
| `ui/src/i18n/index.ts`、`locales.ts`、`locale-validation.ts` | 用 preference 初始化 i18n、切换语言、默认 `zh-CN` 与双向 Key 对等校验。 |
| `ui/src/lib/utils.ts` | 委托通用格式化函数，删除写死的 `en-US` 与英文相对时间。 |
| `ui/src/pages/ProfileSettings.tsx` | 增加「显示与语言」区，实时切换语言且不触发 Profile API。 |
| `ui/src/components/SidebarAccountMenu.tsx` | 将账户菜单静态文案迁移，并保留个人设置入口。 |
| `ui/src/App.tsx` 与 `ui/src/components/Layout.tsx` | 迁移启动/空状态、路由壳、导航和共享操作文案。 |
| `scripts/check-ui-i18n-static-text.mjs` | CI 可运行的静态文本门禁，调用 `static-text-check` 的 TypeScript AST 逻辑。 |
| `ui/src/i18n/*.test.ts` | preference、format、语言包对等与静态文案门禁测试。 |

## Task 1: 完成可切换的语言运行时

**Files:**

- Create: `ui/src/i18n/locale-preference.ts`
- Create: `ui/src/i18n/locale-preference.test.ts`
- Modify: `ui/src/i18n/index.ts`
- Modify: `ui/src/i18n/locales.ts`
- Modify: `ui/src/i18n/locale-validation.ts`
- Modify: `ui/src/i18n/locale-validation.test.ts`
- Modify: `ui/src/i18n/locales/en.json`
- Create: `ui/src/i18n/locales/zh-CN.json`

- [ ] **Step 1: 写出 preference 与双语言默认值的失败测试。**

```ts
expect(readLocalePreference(storage)).toBe("zh-CN");
storage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, "en");
expect(readLocalePreference(storage)).toBe("en");
storage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, "fr");
expect(readLocalePreference(storage)).toBe("zh-CN");
```

同时补充测试：`localeMessages` 包含 `zh-CN` 与 `en`，任一语言以另一语言为 reference 校验均为 `[]`。

- [ ] **Step 2: 运行失败测试。**

Run: `pnpm exec vitest run ui/src/i18n/locale-preference.test.ts ui/src/i18n/locale-validation.test.ts`  
Expected: FAIL，因为 preference 模块、`zh-CN` 语言包和默认语言尚不存在。

- [ ] **Step 3: 用最小 API 实现 preference 与 i18n 切换。**

```ts
export const LOCALE_PREFERENCE_STORAGE_KEY = "paperclip.locale";

export function readLocalePreference(storage: Pick<Storage, "getItem"> | null = window.localStorage): SupportedLocale {
  const candidate = storage?.getItem(LOCALE_PREFERENCE_STORAGE_KEY);
  return isSupportedLocale(candidate) ? candidate : DEFAULT_LOCALE;
}

export async function setLocale(locale: SupportedLocale) {
  window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, locale);
  await i18n.changeLanguage(locale);
}
```

`DEFAULT_LOCALE` 改为 `"zh-CN"`。i18n 初始化时读取 preference；没有 `window` 或 storage 抛错时安全回退默认值。`locale-validation.ts` 接受显式 reference，不再把英文写死为唯一校验方向。

- [ ] **Step 4: 建立最小但完整的双语 Key 基线。**

为 runtime、语言选择器、应用空状态和共享导航建立嵌套 Key，例如：

```json
{
  "language": { "label": "Language", "zhCn": "Chinese (Simplified)", "en": "English" },
  "app": { "noCompanies": { "title": "Create your first company" } },
  "common": { "save": "Save", "cancel": "Cancel", "loading": "Loading…" }
}
```

中文语言包使用相同 Key，翻译值不含 HTML；插值 token 与基准值精确一致。

- [ ] **Step 5: 运行测试与类型检查。**

Run: `pnpm exec vitest run ui/src/i18n/locale-preference.test.ts ui/src/i18n/locale-validation.test.ts && pnpm --filter @paperclipai/ui typecheck`  
Expected: PASS。

- [ ] **Step 6: 提交基础运行时。**

```bash
git add ui/src/i18n
git commit -m "feat(i18n): 支持本地语言偏好与中文默认值"
```

## Task 2: 统一本地化格式与个人设置入口

**Files:**

- Create: `ui/src/i18n/format.ts`
- Create: `ui/src/i18n/format.test.ts`
- Modify: `ui/src/lib/utils.ts`
- Modify: `ui/src/lib/utils.test.ts`
- Modify: `ui/src/pages/ProfileSettings.tsx`
- Modify: `ui/src/pages/ProfileSettings.test.tsx`
- Modify: `ui/src/components/SidebarAccountMenu.tsx`
- Modify: `ui/src/components/SidebarAccountMenu.test.tsx`

- [ ] **Step 1: 写出格式化与设置交互的失败测试。**

```ts
await setLocale("zh-CN");
expect(formatDate("2026-07-29T00:00:00Z")).toContain("2026");
expect(formatCents(12345)).not.toContain("$123.45");
await setLocale("en");
expect(formatCents(12345)).toContain("123.45");
```

渲染 `ProfileSettings`，选择 English 后断言 `i18n.language === "en"`、`paperclip.locale === "en"`，并断言没有调用 `authApi.updateProfile`。

- [ ] **Step 2: 运行失败测试。**

Run: `pnpm exec vitest run ui/src/i18n/format.test.ts ui/src/lib/utils.test.ts ui/src/pages/ProfileSettings.test.tsx`  
Expected: FAIL，因为格式化仍写死 `en-US`，页面没有语言控件。

- [ ] **Step 3: 实现 locale-aware format 并改造通用 helpers。**

```ts
export function formatCurrency(cents: number) {
  return new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
```

`formatCents`、`formatNumber`、`formatDate`、`formatDateTime`、`formatShortDate`、`relativeTime`、`formatTokens`、`formatDurationMs` 改为委托 locale formatter。语义词（例如「刚刚」「分钟前」和单位）通过 i18n Key，不把英文后缀留在 formatter。保留函数名与调用方兼容，避免本次重构业务 API。

- [ ] **Step 4: 在个人设置新增「显示与语言」Card。**

使用现有 `Card`、`Label` 与原生 `<select>` 或现有 select 组件；仅调用 `setLocale`。`ProfileSettings`、`SidebarAccountMenu` 自身的静态文案也迁移为 `t(...)`，账户菜单保持现有 Profile 路由，不新增导航层级。

- [ ] **Step 5: 运行相关测试。**

Run: `pnpm exec vitest run ui/src/i18n/format.test.ts ui/src/lib/utils.test.ts ui/src/pages/ProfileSettings.test.tsx ui/src/components/SidebarAccountMenu.test.tsx && pnpm --filter @paperclipai/ui typecheck`  
Expected: PASS。

- [ ] **Step 6: 提交个人语言入口。**

```bash
git add ui/src/i18n ui/src/lib/utils.ts ui/src/lib/utils.test.ts ui/src/pages/ProfileSettings.tsx ui/src/pages/ProfileSettings.test.tsx ui/src/components/SidebarAccountMenu.tsx ui/src/components/SidebarAccountMenu.test.tsx
git commit -m "feat(i18n): 添加个人语言切换与本地化格式"
```

## Task 3: 建立覆盖全部路由的文案审计与 CI 门禁

**Files:**

- Create: `ui/src/i18n/static-text-check.ts`
- Create: `ui/src/i18n/static-text-check.test.ts`
- Create: `scripts/check-ui-i18n-static-text.mjs`
- Modify: `package.json`
- Modify: `ui/src/App.tsx`
- Modify: `ui/src/App.test.tsx`

- [ ] **Step 1: 写出静态 AST 检查的失败测试。**

```ts
expect(checkStaticText('<button aria-label="Save">Save</button>', "Fixture.tsx")).toEqual([
  expect.stringContaining("JSX text must use i18n"),
  expect.stringContaining("aria-label must use i18n"),
]);
expect(checkStaticText('const id = "agent-1";', "Fixture.ts")).toEqual([]);
```

同时覆盖：`data-testid`、className、URL、import path、日志、测试文件、翻译 JSON 与已声明的机器状态 map 不报错；JSX 文本、`title`、`placeholder`、`aria-*`、按钮/菜单/Toast/前端错误文字报错。

- [ ] **Step 2: 运行失败测试。**

Run: `pnpm exec vitest run ui/src/i18n/static-text-check.test.ts`  
Expected: FAIL，因为 checker 不存在。

- [ ] **Step 3: 使用已安装的 TypeScript compiler API 实现 scanner。**

```ts
export function checkStaticText(source: string, fileName: string): string[] {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  return collectStaticTextDiagnostics(sourceFile, fileName);
}
```

扫描目标仅为 `ui/src/**/*.{ts,tsx}` 的非测试源文件；允许清单只接受带原因的精确 `file:line` 项。脚本在发现诊断时返回非零退出码。`package.json` 新增 `check:i18n-static-text`，不把它混入 token gate。

- [ ] **Step 4: 以 App 路由表校验覆盖清单。**

在 `App.test.tsx` 断言注册 route 的关键页面入口全部被静态检查脚本的 source roots 覆盖，避免未来新增页面绕过门禁。不要测试每一条翻译值；语言包结构测试负责 Key 对等。

- [ ] **Step 5: 完成迁移前只允许已审计的临时基线。**

在同一提交中把当前门禁发现的全部静态 UI 文案迁移，或在临时清单上给出精确 `file:line` 与删除日期。最终任务必须将该清单删除并让 `pnpm check:i18n-static-text` 零诊断通过；不得把整个目录、文件或正则作为豁免。

- [ ] **Step 6: 运行门禁测试。**

Run: `pnpm exec vitest run ui/src/i18n/static-text-check.test.ts ui/src/App.test.tsx && pnpm check:i18n-static-text`  
Expected: 测试 PASS；中间提交可报告精确临时基线，最终提交必须输出零诊断。

- [ ] **Step 7: 提交门禁。**

```bash
git add ui/src/i18n/static-text-check.ts ui/src/i18n/static-text-check.test.ts scripts/check-ui-i18n-static-text.mjs package.json ui/src/App.tsx ui/src/App.test.tsx
git commit -m "test(i18n): 添加静态界面文案门禁"
```

## Task 4: 迁移应用壳、共享组件与核心工作对象页面

**Files:**

- Modify: `ui/src/App.tsx`
- Modify: `ui/src/components/Layout.tsx`
- Modify: `ui/src/components/SidebarAccountMenu.tsx`
- Modify: `ui/src/components/SidebarProjects.tsx`
- Modify: `ui/src/components/SidebarAgents.tsx`
- Modify: `ui/src/components/EmptyState.tsx`
- Modify: `ui/src/components/NewIssueDialog.tsx`
- Modify: `ui/src/components/IssueProperties.tsx`
- Modify: `ui/src/components/IssueChatThread.tsx`
- Modify: `ui/src/components/CommentThread.tsx`
- Modify: `ui/src/pages/Dashboard.tsx`
- Modify: `ui/src/pages/Projects.tsx`
- Modify: `ui/src/pages/ProjectDetail.tsx`
- Modify: `ui/src/pages/Issues.tsx`
- Modify: `ui/src/pages/IssueDetail.tsx`
- Modify: `ui/src/pages/Agents.tsx`
- Modify: `ui/src/pages/AgentDetail.tsx`
- Modify: `ui/src/i18n/locales/en.json`
- Modify: `ui/src/i18n/locales/zh-CN.json`

- [ ] **Step 1: 为壳层和核心页面添加翻译 Key。**

Key 按 `navigation`、`common`、`issue`、`project`、`agent`、`dashboard` 分组；状态必须把稳定值映射为显示 Key，例如：

```ts
const issueStatusLabel = (status: IssueStatus) => t(`issue.status.${status}`);
```

禁止把 API status 值直接作为中文化文案或以英文标题为 Key。

- [ ] **Step 2: 逐组件迁移静态 UI 字符串。**

每个 React 组件在 render 根部使用 `const { t } = useTranslation()`；非组件 helper 接收 `t` 或调用 i18n 的导出 `t()`。将按钮、字段、空状态、Toast、错误 fallback、确认框、`aria-label`、`title` 和 Tooltip 一并迁移；不改变任务、评论、Agent 名称及后端错误原文。

- [ ] **Step 3: 逐页运行既有核心交互测试。**

Run: `pnpm exec vitest run ui/src/components/NewIssueDialog.test.tsx ui/src/components/IssueChatThread.test.tsx ui/src/pages/IssueDetail.test.tsx ui/src/pages/Projects.test.tsx ui/src/pages/AgentDetail.test.tsx`  
Expected: PASS；测试断言改为 Key 对应的当前语言显示值，不以硬编码英文 UI 文案断言。

- [ ] **Step 4: 提交核心页面迁移。**

```bash
git add ui/src/App.tsx ui/src/components ui/src/pages/Dashboard.tsx ui/src/pages/Projects.tsx ui/src/pages/ProjectDetail.tsx ui/src/pages/Issues.tsx ui/src/pages/IssueDetail.tsx ui/src/pages/Agents.tsx ui/src/pages/AgentDetail.tsx ui/src/i18n/locales
git commit -m "feat(i18n): 本地化核心项目与任务页面"
```

## Task 5: 迁移设置、扩展、运行与全部其余注册路由

**Files:**

- Modify: `ui/src/pages/Activity.tsx`
- Modify: `ui/src/pages/AdapterManager.tsx`
- Modify: `ui/src/pages/Approvals.tsx`
- Modify: `ui/src/pages/ApprovalDetail.tsx`
- Modify: `ui/src/pages/Artifacts.tsx`
- Modify: `ui/src/pages/Auth.tsx`
- Modify: `ui/src/pages/Companies.tsx`
- Modify: `ui/src/pages/CompanyAccess.tsx`
- Modify: `ui/src/pages/CompanyEnvironments.tsx`
- Modify: `ui/src/pages/CompanyExport.tsx`
- Modify: `ui/src/pages/CompanyImport.tsx`
- Modify: `ui/src/pages/CompanyInvites.tsx`
- Modify: `ui/src/pages/CompanySettings.tsx`
- Modify: `ui/src/pages/CompanySkills.tsx`
- Modify: `ui/src/pages/Costs.tsx`
- Modify: `ui/src/pages/ExecutionWorkspaceDetail.tsx`
- Modify: `ui/src/pages/Goals.tsx`
- Modify: `ui/src/pages/GoalDetail.tsx`
- Modify: `ui/src/pages/InstanceAccess.tsx`
- Modify: `ui/src/pages/InstanceGeneralSettings.tsx`
- Modify: `ui/src/pages/InstanceSettings.tsx`
- Modify: `ui/src/pages/PluginManager.tsx`
- Modify: `ui/src/pages/PluginPage.tsx`
- Modify: `ui/src/pages/PluginSettings.tsx`
- Modify: `ui/src/pages/RoutineDetail.tsx`
- Modify: `ui/src/pages/Routines.tsx`
- Modify: `ui/src/pages/Search.tsx`
- Modify: `ui/src/pages/SkillStudio.tsx`
- Modify: `ui/src/pages/Timeline.tsx`
- Modify: `ui/src/pages/Training.tsx`
- Modify: `ui/src/pages/WhatNeedsMe.tsx`
- Modify: `ui/src/pages/Workspaces.tsx`
- Modify: `ui/src/pages/apps/**/*.tsx`
- Modify: `ui/src/pages/tools/**/*.tsx`
- Modify: `ui/src/components/artifacts/**/*.tsx`
- Modify: `ui/src/components/*Run*.tsx`
- Modify: `ui/src/i18n/locales/en.json`
- Modify: `ui/src/i18n/locales/zh-CN.json`

- [ ] **Step 1: 按路由分组补足页面 Key。**

页面 Key 以 `settings`、`approval`、`routine`、`workspace`、`skill`、`plugin`、`connection`、`artifact`、`search`、`cost`、`activity`、`training` 分组。App connection/gateway 页面使用现有「连接器」领域术语，不能把 Connector/Connection 与 Agent Tool 混为同一术语。

- [ ] **Step 2: 迁移 route page、其专属 panels 与对话框。**

以 `boardRoutes()` 的顺序验收：认证与引导、部门与设置、Apps/Connections、Skills、Org、Projects/Workspaces、Routines/Pipelines、Goals/Artifacts/Approvals/Costs/Activity、Inbox/Training；再迁移 App 入口引用到的专属组件。每一页将静态文案与 a11y 文案迁移到 Key，但保留 Provider、插件、外部对象与原始 run 文本。

- [ ] **Step 3: 迁移已交付的 SOP M1 页面。**

检查并迁移 `ui/src/components/sop/`、`ui/src/pages/ProjectDetail.tsx` 中 SOP tab、Cockpit 和 Stage Detail 的所有静态文案。只翻译既有只读 UI，不新增 SOP Studio、Human Gate 操作或 Task 映射。

- [ ] **Step 4: 跑全量静态门禁与页面测试。**

Run: `pnpm check:i18n-static-text && pnpm exec vitest run ui/src/pages ui/src/components`  
Expected: 静态门禁零诊断，相关 UI 测试 PASS。

- [ ] **Step 5: 提交其余页面迁移。**

```bash
git add ui/src/pages ui/src/components ui/src/i18n/locales
git commit -m "feat(i18n): 完成既有 Paperclip 页面中文化"
```

## Task 6: 完成发布前双语验收与文档同步

**Files:**

- Modify: `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/24-ui-internationalization-and-chinese-localization.md`
- Modify: `docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit/00-decision-and-validation-register.md`
- Modify: `package.json`
- Modify: `.github/workflows/*.yml`（仅在现有 UI CI 未调用 root test/check scripts 时）

- [ ] **Step 1: 追加可重复的双语路由验收测试。**

测试以 `boardRoutes()` 中的全部有效 route 为输入，分别在 `zh-CN` 和 `en` 渲染每一个可独立加载的页面；断言不出现 i18n missing-key 形式的文本，且每个 route 的静态门禁为零。需要 API 数据的页面使用现有 test query mock，不创建浏览器自动化依赖。

- [ ] **Step 2: 运行完整发布检查。**

Run: `pnpm check:i18n-static-text && pnpm check:token-gates && pnpm -r typecheck && pnpm test:run && pnpm build`  
Expected: 全部 PASS。

- [ ] **Step 3: 手工验收两种语言。**

在同一浏览器会话中验证：账户菜单进入个人设置、选择中文/英文、刷新后保持、当前路由不变化、打开主要弹窗后没有静态语言残留。记录未运行或无法运行的项目及原因。

- [ ] **Step 4: 更新状态与提交。**

将规格状态改为「已实现并通过验收」，在台账写入代码和验证证据；只在实际完成时更新。

```bash
git add docs/superpowers/specs/2026-07-23-enterprise-agent-cockpit package.json .github/workflows
git commit -m "docs(i18n): 记录全站中文化验收证据"
```

## 计划自检

- 规格的默认语言、两种语言、个人本地偏好、静态文案边界、术语表、`Intl` 格式化、全路由迁移、Key 对等与硬编码门禁均对应到 Task 1 至 Task 6。
- 不包含服务端 preference、第三种语言、机器翻译、浏览器语言探测或业务领域模型变更。
- Task 1 至 Task 3 是其余迁移的阻塞项；Task 4 与 Task 5 可在共享 Key 约束下顺序实施，Task 6 只在全部迁移结束后执行。
- 本计划没有未决占位、全目录豁免或未定义的新增依赖。
