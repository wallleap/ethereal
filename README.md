# Ethereal

![GitHub stars](https://img.shields.io/github/stars/wallleap/ethereal?style=flat) ![GitHub forks](https://img.shields.io/github/forks/wallleap/ethereal?style=flat) ![GitHub issues](https://img.shields.io/github/issues/wallleap/ethereal?style=flat) ![GitHub last commit](https://img.shields.io/github/last-commit/wallleap/ethereal?style=flat) ![GitHub](https://img.shields.io/github/license/wallleap/ethereal?style=flat) ![build](https://img.shields.io/github/workflow/status/wallleap/ethereal/deploy.yml)

使用 Vite 4 搭建的 Vue 2 博客，免费使用

## Features

- :writing_hand: 使用 Vite 4 构建打包，速度更快
- :fairy: 基于 Vue 2 + Vue Router + Vuex 开发的 SPA 博客主题
- :whale: 使用 GitHub Issue 编写文章，通过 GitHub API 获取文章数据
- :octopus:	 评论系统内置 Twikoo 和 Utterances，免费无广，方便后续迁移
- :crab: 使用 GitHub Actions 自动构建部署，Token 仅用于构建，安全可靠
- :sparkles: 使用 GitHub Pages or Vercel 部署在线访问，无需额外服务器

## Recommended Environment

- NVM（Node.js 14+）
- pnpm
- Git
- IDE/Editor:
  - [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## Online Demo

- [wallleap](https://myblog.wallleap.cn)

## Preview

图片占位

## Prepare Repo & Issues

### Create a repo for blog issues

创建一个新的 GitHub 仓库，用于存放博客文章，仓库名随意，例如 `blog`，然后创建如下 Issues

**关于页面**

内容随意，title 为`关于`，label 为`About`，例如：

```md
## 关于我

我的介绍

## 关于本站

本站介绍
```

填写完毕后，点击 `Submit new issue` 按钮，并且 `Close issue` 关闭该 Issue

该 Issue 会作为关于页面的内容，有且只有一个，并且 `About` label 只能在这个 Issue 使用

**灵感页面**

可以新建 Issue，title 随意，label 为 `Inspiration`，例如：

```md
今天看到了一篇好文章，学到了 xxx
```

填写完毕后，点击 `Submit new issue` 按钮，之后点击 `Close issue` 关闭该 Issue

灵感页面将会展示所有 `Inspiration` label 的 Issue，所以可以创建多条

**常规文章**

可以新建 Issue，title 随意，label 随意，label 将作为文章的标签（例如 `CSS`），Milestone 将作为文章的分类（例如 `前端`、`后端`、`安全`），内容使用 Markdown 编写，建议按照一定规范，例如：

````md
第一段将作为摘要显示。

## 文章中只能从二级标题开始

这里是段落，下面还有一个空行，是个新段落。段落中的 word 英文单词两边加空格。

理论上一个页面只能有一个一级标题，在文章中的一级标题就是 Issue Title 或 Front Matter 中的 title。

## 二级标题

### 三级标题

#### 四级标题（不要跨级使用）

不建议使用五、六级标题，如果需要，可以把 title 加粗，例如：

**这是一个五级标题**

其他内容

## 其他块级

> 引用文字

```语言
代码块
```

- 无序列表
- 无序列表
- 无序列表
  1. 有序列表（可嵌套）
  1. 有序列表
  1. 有序列表

|表格|对齐|序号|
|-|-|-:|
|小明明|上面使用 `:` 进行对齐|5|
|小红|加在哪边这列就向哪对齐（左右）|79|
|小陆|两边都加就是居中对齐|192|

暂时没有支持公式

需要分隔的时候使用 `---` 单独一行，会渲染成 `<hr>` 标签

---

可以使用一些 HTML 标签，例如

<details>
<summary>点击展开</summary>
展开后的内容
</details>

如果需要插入图片，可以使用下面的方式

![图片描述](https://xxx.com/xxx.png)

## 文字

链接

[链接文字](https://xxx.com)

**加粗**，*斜体*，~~删除线~~，`行内代码`，<u>下划线</u>，<mark>高亮</mark> 或 ==高亮==

19^th^、2<sup>3</sup>，H~2~O、H<sub>n</sub>
````

填写完毕后，点击 `Submit new issue` 按钮，保持 Issue Open 状态

### Create a repo for friends links

创建一个新的 GitHub 仓库，用于存放友链，仓库名随意，例如 `friends`，然后创建 Issue

title 随意，内容按如下格式

```md
name: Ta的站点名称
url: Ta的博客链接
avatar: Ta的头像链接
desc: 一句话描述
```

填写完毕后，点击 `Submit new issue` 按钮，之后 `Close issue` 关闭该 Issue

可以设置 `Label`

- 不加默认显示
- `失联`，将显示在失联列表
- `未添加`，将以文字形式展示在友链页面

至此，博客所需的仓库和 Issue 已经创建完毕，接下来就是配置博客

## How to use

### Clone Project

```sh
git clone git@github.com:wallleap/Ethereal.git blog
cd blog
```

### Install Dependencies

```sh
pnpm install
```

### Customize configuration

1、复制 `.env.sample` 重命名为 `.env.local`，修改其中的配置项

- VITE_GITHUB_TOKEN
  1. 前往 <https://github.com/settings/tokens> 生成一个新的 Token，勾选 `repo` 权限（如果使用 Beta 版本，建议缩小权限范围，`Only select repositories` 选择你的博客仓库，`Repository permissions` 勾选 Issues）
  2. 复制生成的 Token，填入 `.env.local` 中的 `VITE_GITHUB_TOKEN` 中，并在中间任意位置加入 ` ,` 空格+半角逗号（避免 GitHub 检测到让 Token 过期），例如：`VITE_GITHUB_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxx, xxxxxxxxxxxxxx"`
- VITE_TWIKOO_ID="Your Twikoo ID"
  - 前往 <https://twikoo.js.org/> 按照文档部署配置
  - 将 `envId` 填入 `.env.local` 中的 `VITE_TWIKOO_ID` 中
- VITE_LEANCLOUD_ID="Your LeanCloud AppId"
  - 这三个用于统计文章的热度和页面访问量的
  - 前往 <https://console.leancloud.cn/> 切换地区为国际版（左上角），注册账号，创建一个应用
  - 设置中的应用凭证中的 `AppId` 填入 `.env.local` 中的 `VITE_LEANCLOUD_ID` 中
- VITE_LEANCLOUD_KEY="Your LeanCloud AppKey"
  - `AppKey` 填入 `.env.local` 中的 `VITE_LEANCLOUD_KEY` 中
- VITE_LEANCLOUD_SERVER="Your LeanCloud Server URL"
  - 由于它自带的域名在国内已经访问不了了，因此需要在域名绑定中绑定自己的域名
  - 之后将 REST API 服务器地址填入 `.env.local` 中的 `VITE_LEANCLOUD_SERVER` 中，例如：`https://xxx.com`
  - 接着在安全中心的 `Web 安全域名` 中添加自己的域名，例如：`https://xxx.com`

2、修改 `src/config.js` 中的配置

提下重点注意的

- `username` 是你的 GitHub 用户名
- `repository` 是你的博客仓库名
- `friends` 是你的友链仓库名
- `utterances.code` 前往 <https://utteranc.es/> 按照文档部署配置，将生成的代码填入 `utterances.code` 中，两边的 \` 不要删除

### Preview Locally

确定配置无误后，运行下面命令

```sh
pnpm dev
```

浏览器打开 <http://localhost:8000> 即可预览

### Build for Production

1、不使用 GitHub Actions

运行下面命令，将会在 `dist` 目录下生成静态文件

```sh
pnpm build
```

将 `dist` 目录下的文件上传到你的服务器即可

2、使用 GitHub Actions

在 GitHub 创建仓库 `ethereal` 和 `用户名.github.io`，将 `ethereal` 作为博客源码仓库，将 `用户名.github.io` 作为博客部署仓库

在 `ethereal` **仓库**的 `Settings` -> `Secretes and variables` -> `Action` 中 `New repository secret`，添加以下变量

- ACCESS_TOKEN：对应着 `.env.local` 中的 `VITE_GITHUB_TOKEN`，例如：`xxxxxxxxxxxxxxxxxxxxxxxxxx, xxxxxxxxxxxxxx`
- `.env.local` 中的剩余四项，`Name` 为 `VITE_TWIKOO_ID`、`VITE_LEANCLOUD_ID`、`VITE_LEANCLOUD_KEY`、`VITE_LEANCLOUD_SERVER`，`Secret` 分别为对应的双引号中的内容

以上是对应的环境变量，让项目代码能够获取到相应的值，接下来是新增一个推送权限的 Token

- `PERSONAL_TOKEN`
  - 在 <https://github.com/settings/tokens> 新生成一个 Token，勾选 `repo`、`workflow` 权限，复制生成的 Token，填入 `PERSONAL_TOKEN` 中

在本地终端执行生成 SSH 密钥

```sh
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f ethereal -N ""
```

执行完上面命令后会生成两个文件，打开 `ethereal.pub` 文件，将里面的内容复制

回到 `ethereal` 仓库，在 `Settings` -> `Deploy keys` -> `Add deploy key`，`Title` 为 `ACTIONS_DEPLOY_KEY`，`Key` 中粘贴刚才复制的内容，勾选 `Allow write access`，点击 `Add key` 按钮（这两步是为了让 GitHub Actions 可以推送到 `用户名.github.io` 仓库）

之后每次 push 代码到 `ethereal` 仓库，都将触发 GitHub Actions，自动构建部署到 `用户名.github.io` 仓库

可以点击 Actions 查看构建状态，如果构建失败，可以点击右侧的 `Re-run jobs` 按钮重新构建

如果使用 GitHub Pages，直接到 `用户名.github.io` 仓库开启 Pages，如果不需要，想用 Vercel，可以不开启

3、使用 Vercel

前往 <https://vercel.com/> 注册账号，点击 `New Project`，选择 `Import Git Repository`，选择 `用户名.github.io` 仓库，点击 `Import` 按钮，之后点击 `Deploy` 按钮，即可完成部署

由于国内访问不了 vercel 域名，所以需要绑定你自己的域名，前往 `Settings` -> `Domains` -> `Add`，输入你的域名，点击 `Add` 按钮，之后按照提示操作即可

## Contributing

欢迎提交 PR 或 Issue，如果你喜欢这个项目，欢迎 Star

## License

This project is licensed under the MIT License.
