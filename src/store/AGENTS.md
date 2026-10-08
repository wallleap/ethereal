# src/store/AGENTS.md — Vuex 与持久化数据

作用域：`src/store/`（尤其 `modules/gist.js`、`modules/github.js`）。同时遵守根目录 `AGENTS.md`。

## 当前数据流

- `src/store/index.js` 注册 `github`、`gist`、`poetry`、`style` 四个 namespaced 模块，并使用 `vuex-persistedstate`。不要假设页面刷新会清空所有模块数据。
- GitHub Issues 请求封装在 `src/api/github.js`，业务格式化在 `src/store/modules/github.js` 与 `src/utils/format.js`。保留 Issue 的 number、标签、Milestone、时间和正文等消费方依赖字段。
- Gist 请求封装在 `src/api/gist.js`，实际数据文件是 `counter.json`、`visitor.json`、`like.json`，由 `modules/gist.js` 读写。
- 当前 `gist.js` 的模块 `state` 是一个函数，但 `getGistAction` 给 `state.counter/visitor/like` 赋值；这是值得排查的遗留模式，不要在不检查调用方的情况下依赖或进一步复制。
- 文章详情使用 `gist/updateCounterAction` 的返回数组读取热度；它在开发模式可能提前返回 `undefined`，后续调用方必须考虑这个分支。

## Gist 修改的不可破坏规则

1. **读失败不写**：鉴权失败、404、429、5xx、网络错误、文件不存在和无效 JSON 必须明确区分；不能把错误场景等价成空数组/对象再 PATCH。
2. **先验证后更新**：对读取的数据校验类型及预期字段，再执行增量更新；不要默认远端内容永远正确。
3. **并发与幂等性**：当前读取→本地加一→PATCH 整个文件存在 lost update 风险。方案必须分析多个标签页/访客并发、请求重试和重复计数，不能声称 Gist PATCH 本身具备原子自增能力。
4. **最小写入范围**：更新单一统计文件时不覆盖其他统计文件。不要因为局部 API 不可用而触发全量重置。
5. **开发调试隔离**：不要在运行测试、开发预览或 Agent 验证时写入线上 Gist；mock/stub 请求，或仅运行不产生真实写入的检查。
6. **数据一致性**：如果调整状态初始化/缓存，保证 Vuex 状态和 action 返回结果一致；避免将共享的可变状态用作多个异步请求的中转数据。
7. **错误反馈**：View 可以展示错误与回退 UI，但不得伪装成写入成功；不可把热度/点赞展示值直接作为权威远端状态。

## 验证清单

- 读取：合法数据、JSON 损坏、空文件、缺文件、失败响应、限流。
- 更新：首次创建、正常递增、重复请求、并发读写、失败重试。
- 页面：首页分类卡片热度、文章详情、访客来源、点赞显示；开发模式不能因返回 `undefined` 崩溃。
- 统计数据修改前后不能意外变 0、变空或者丢失已有记录。
