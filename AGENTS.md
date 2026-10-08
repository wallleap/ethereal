# AGENTS.md — Ethereal 开发代理指南

本文件适用于整个仓库。修改 `src/store/` 和 `src/components/markdown/` 时，还应先阅读对应目录中的 `AGENTS.md`。本文描述的是**当前架构**，不要把重构设想当成已实现的功能。

## 项目定位与技术栈

- Ethereal 是纯前端 SPA 博客主题，文章内容主要来自 GitHub Issues，不依赖自建业务后端。
- 使用 Vue **2.7.14**（Options API、单文件组件）、Vue Router **3**、Vuex **3**、Vue I18n **8**、Vite **4** 和 JavaScript；**不是 Vue 3/Pinia/TypeScript 项目**。
- 样式使用 SCSS、CSS 自定义属性、明暗主题；Markdown 使用 Marked 5 + Highlight.js；HTTP 使用 Axios。
- 使用 pnpm 和仓库现有 `pnpm-lock.yaml`；CI 中使用 Node.js 18、pnpm 8。不要未经要求升级主版本或更换包管理器。

## 快速开始与验证

```sh
pnpm install
pnpm run dev       # Vite，默认 http://localhost:8000
pnpm run lint      # ESLint 检查（不自动修复）
pnpm run build     # 输出到 dist/
pnpm run preview
```

- 启动所需配置参考 `.env.sample`、`src/config.sample.js` 和 `docs/guide.md`。
- 当前 `package.json` **没有 test 脚本和独立测试框架**；不要声称已运行不存在的测试。引入测试之前先明确范围。
- 已知基线（2026-10-08）：`pnpm run build` 能成功，存在 vendor chunk 超过 700 KB 的警告；`pnpm run lint` 当前有 **50 errors / 6 warnings**。修改时要区分原有问题与新问题，不要借题批量格式化全仓库。
- 禁止为通过检查而随意使用 `pnpm run lint:fix` 全仓库自动修复；优先仅检查/修复变更文件。

## 代码导航

| 位置 | 职责 |
| --- | --- |
| `src/main.js`、`src/app.vue` | 应用启动、全局组件/指令、整体布局 |
| `src/router/index.js` | 页面路由、页面标题、导航和滚动行为 |
| `src/views/` | 首页、分类、文章、归档、灵感、友链、关于页面 |
| `src/components/` | 共用 UI、搜索、评论、Markdown、SVG、分页等 |
| `src/api/` | GitHub REST/GraphQL、Gist、诗词接口封装 |
| `src/utils/request.js` | Axios 实例、超时、鉴权与 API 地址 |
| `src/store/modules/` | `github`、`gist`、`poetry`、`style` 四个命名空间 |
| `src/utils/format.js` | Issue 数据和文章 Front Matter 格式化 |
| `src/locale/lang/` | `zh-CN`、`en-US` 文案 |
| `src/assets/style/` | 全局 SCSS、变量、响应式 mixin |
| `src/assets/icons/` | 被 `svgBuilder` 注入 HTML 的 SVG 图标 |
| `public/` | 原样复制的静态资源 |
| `vite.config.js`、`index.html` | Vite 配置、HTML 模板和注入的资源 |
| `.github/workflows/`、`deploy.sh` | 发布流程，属于高风险操作 |
| `docs/guide.md`、`README.md` | 用户配置、内容模型及使用说明 |

## 数据契约（修改前先确认）

1. 博客文章：GitHub Issue 的 **OPEN** 状态；标题是 Issue title，正文是 Markdown，Labels 作为标签，Milestone 作为分类。
2. `About` 和 `Inspiration`：通过关闭的 Issue + 对应 Label 获取。友链还存在独立 `friendsRepo` 的关闭 Issue，以及博客 `Friend` Issue 评论的数据路径；不要将这些来源混同。
3. 文章正文支持可选 Front Matter；`src/utils/format.js` 负责标题、作者、封面、日期、摘要的转换。保持列表页与详情页字段一致。
4. `src/api/github.js` 负责请求，`src/store/modules/github.js` 负责转换/状态，View 负责展示。修改字段时沿此链路检查所有使用点，不要在多个组件各自重新实现数据清洗。
5. Gist 里的 `counter.json`、`visitor.json`、`like.json` 分别承担文章热度、来源访客、点赞统计。它们是**持久化数据**，不是可随意清空的缓存。
6. 搜索、分类、文章详情等页面以路由参数、GitHub Issue number 和 API 返回结构协同工作；修改路由/字段/Label 名称时同步检查调用方和 `docs/guide.md`。

## 编码与 UI 约定

- 沿用现有 Vue 2 Options API（`data`、`computed`、`watch`、`methods`、生命周期钩子）及组件目录 `index.vue` / `index.scss`；不要仅为个人偏好迁移到 Composition API。
- 使用 `@/...` 引用 `src`，遵守 `.eslintrc` 中 `@antfu` 的规则；以附近代码为风格参考，避免大范围无关重排。
- 优先复用现有 `SvgIcon`、`$message`、`v-loading`、`Pagination` 等组件/能力。
- 普通 API 请求走 `src/api/`，跨页面状态走 Vuex；Vuex 模块使用 `github/...`、`gist/...` 等 namespaced action/mutation。
- 修改界面时同时检查窄屏、浅色/深色模式、加载/空状态和报错状态。主题变量位于 `src/assets/style/variables.scss`；布局 mixin 位于 `mixins.scss`。
- 用户可见的新文案尽量维护 `src/locale/lang/zh-CN.js` 和 `en-US.js` 两份翻译，不要无故新增仅一种语言的硬编码。
- 当前是 Vue 2：清理监听器/定时器时使用适用于 Vue 2 的销毁钩子（例如 `beforeDestroy`）；不要照搬仅适用于 Vue 3 的生命周期。
- 图标存放于 `src/assets/icons/`，由 `src/components/svg_icon/svgBuilder.js` 在构建阶段生成 symbol；新图标需检查 ID、viewBox 和主题色。
- 小步修改、优先解决根因，不为单个需求引入大依赖、全局状态或新服务端架构。

## 正确性与风险边界

- **Gist 读写**：现有统计逻辑存在读取→修改→PATCH 的并发覆盖风险。请求失败、空响应、缺少文件、非法 JSON 与真正的零计数必须区分；不得将失败误当作 `[]` / `{}` 后回写覆盖线上数据。参见 `src/store/AGENTS.md`。
- **开发环境**：统计请求可能写入真实 Gist；检查 `import.meta.env.DEV` 分支。不要为了本地预览触发线上统计写操作，且不要假设禁用更新后调用方一定能拿到数组。
- **Markdown / HTML**：文章来自 GitHub 并不等于浏览器渲染天然安全。存在 `v-html`、自定义 renderer、代码高亮、目录生成、图片灯箱及复制功能，处理 HTML 时审查注入/链接等风险；参见 `src/components/markdown/AGENTS.md`。
- **配置与令牌**：`VITE_*` 是 Vite 前端构建变量，构建后可能进入客户端资源；不要称之为运行时私密服务端凭证。禁止打印、提交或复制真实令牌到日志/示例。阅读样例即可，不要无故打开/输出 `.env.local`。
- **HTTP**：保留明确的失败语义（网络失败、鉴权失败、限流、有效的空列表）。不要用 `catch` 静默返回空数据导致内容丢失或后续写坏统计。
- **发布**：未得到明确授权，禁止运行 `deploy.sh`、推送分支或 tag、发布 Release、触发部署或对远端仓库执行强制推送。`deploy.sh` 包含 `git push -f` 及目录清理行为；GitHub Actions 含跨仓库发布。
- **产物**：不要手工编辑 `dist/`、`node_modules/` 或锁文件；只有依赖确实变化时才更新 `pnpm-lock.yaml`。

## Agent 执行流程

1. 先读本文件、目标目录的局部 `AGENTS.md`、相关入口/调用方和 `docs/guide.md` 中对应的数据约定。
2. 复述任务影响范围，分清 UI、GitHub 数据模型、统计持久化、构建部署；对涉及线上写入/删除/迁移的操作先征求明确授权。
3. 修改尽量局限于必要文件；在已有 Bug 附近工作时可指出，但不要私自扩展为全局重构。
4. 对变化的 API/状态/渲染逻辑至少验证成功、空值、异常和重复/并发调用路径；无法联真实 GitHub 时说明使用了哪些静态/模拟验证。
5. 运行与修改相关的检查；通常至少执行 `pnpm run build`，检查变更文件 ESLint，可能时执行 `pnpm run lint` 并区分历史基线。
6. 回报**修改文件、核心原因、实际验证结果、未覆盖场景和剩余风险**；不要宣称未执行的验证已通过。
