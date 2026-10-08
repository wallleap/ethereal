# src/components/markdown/AGENTS.md — Markdown 渲染模块

作用域：`src/components/markdown/`。同时遵守根目录 `AGENTS.md`。

## 实现与依赖

- `mark_it.js` 基于 **Marked 5**，有自定义 renderer（标题、段落、列表、图片、链接、代码等）、TOC 生成、smartypants、上下标和 Highlight.js 扩展。
- `index.vue` 负责接收内容、可选解析、通过 `v-html` 展示、图片灯箱和代码复制；文章页及摘要卡片也会调用 `MarkIt.parse()`。
- `index.scss` 控制 Markdown 排版。修改标签/class 名称时必须同步样式、目录及事件处理逻辑。

## 修改约束

1. 保持 `parse(data)` 的异步契约：返回 `{ content, toc }` 或空输入的 `null`；修改时逐一核对所有调用方及空值分支。
2. 不破坏二级及以下标题、锚点/目录链接、代码块高亮、任务列表、图片、表格、Front Matter 正文与上下标等已支持功能。
3. 渲染文章 HTML 不能默认信任：`renderer.html` 当前直接返回 HTML，`v-html` 会渲染它。修改相关逻辑时审查潜在脚本/事件属性/危险 URL，必要时提出与已有 Markdown 特性兼容的净化方案；**不能假定 GitHub 已替前端完成 HTML 净化**。
4. 自定义链接、新窗口打开行为要考虑协议安全及 `rel="noopener noreferrer"`；Markdown 中的 URL、属性和文字在拼接 HTML 时也需要审查。
5. TOC 使用共享的 `tocObj` 缓存；如果支持多实例或并发解析，需要确保不同文章的 TOC 不会串内容。不要未经验证地共享可变解析状态。
6. `index.vue` 的全局 Clipboard 实例、DOM 点击事件与路由/组件销毁需要清理；Vue 2 项目采用对应 Vue 2 生命周期钩子。
7. 不要在摘要卡片和文章详情之间反复对同一内容做不必要的解析，也不要静默吞掉异步解析失败。

## 修改后检查

- 普通段落、中文/英文标题与目录跳转。
- 多个连续标题、文章切换、短内容/空内容。
- 代码块与复制、图片预览、表格、任务列表、上下标。
- 包含原生 HTML 的正文、危险属性/URL 的防护行为。
- 浅色/深色主题、窄屏样式、组件卸载与重复装载。
