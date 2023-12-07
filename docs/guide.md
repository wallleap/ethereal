# 使用教程

推荐开发环境：

安装了 nvm 或其他 node 版本管理工具，如果你需要和我保持一致，可以运行

```sh
nvm install 18
nvm use 18
```

并且使用 pnpm 代替 npm（如果你使用其他方式安装了 pnpm 则跳过）

```sh
npm i -g pnpm
```

## Prepare Repo & Issues

在开始之前，需要准备好 GitHub 仓库和 Issues 作为你的博客数据源

之后新建「灵感」、「关于」页面以及博客文章就直接在这个仓库新建 Issue 就行

### Create a repo for blog issues

创建一个新的 GitHub 仓库，用于存放博客文章，仓库名随意，例如 `blog`

![创建博客仓库](./imgs/createblog.png)

然后创建如下 Issues

#### 关于页面

title 为 `关于`，label 为 `About`，内容随意，例如：

```md
## 关于我

我的介绍

## 关于本站

本站介绍
```

![创建关于页面](./imgs/createabout.png)

填写完毕后，点击 `Submit new issue` 按钮，并且 `Close issue` 关闭该 Issue

![关闭关于页面](./imgs/closeissue.png)

该 Issue 会作为关于页面的内容，**有且只有一个**，并且 `About` label 只能在这个 Issue 使用

![关于标签](./imgs/aboutlabel.png)

#### 灵感页面

新建 Issue，title 随意，label 为 `Inspiration`，例如：

```md
今天看到了一篇好文章，学到了 xxx
```

填写完毕，点击 `Submit new issue` 按钮，之后点击 `Close issue` 关闭该 Issue

![inspiration](./imgs/inspiration.png)

灵感页面将会展示所有 `Inspiration` label 的 Issue，所以可以**创建多条**

![多条](./imgs/multiinspiration.png)

#### 常规文章

新建 Issue，title 随意，label 随意，label 将作为文章的**标签**（例如 `CSS`），Milestone 将作为文章的**分类**（例如 `前端`、`后端`、`安全`）

> 可以统一管理 Milestone 和 Label

![管理](./imgs/managetags.png)

删除无用的 Label 并且新增需要的 Label

![Label](./imgs/labels.png)

新建 Milestone，只需要 title，其他项不填

![Milestone](./imgs/milestones.png)

内容使用 Markdown 编写，建议按照一定规范，例如：

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

- [ ] 任务列表
- [x] 任务列表（已完成）

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

可点击的链接：<https://linkxxx.com>

[链接文字](https://xxx.com)

**加粗**，*斜体*，~~删除线~~，`行内代码`，<kbd>按键</kbd>，<u>下划线</u>，<mark>高亮</mark> 或 ==高亮==

19^th^、2<sup>3</sup> 上标
H~2~O、H<sub>n</sub> 下标
````

填写完毕后，点击 `Submit new issue` 按钮，保持 Issue Open 状态

![常规文章](./imgs/newpost.png)

可以使用 Front Matter 来设置文章的一些属性，例如：

```md
---
title: Vue 的完整版和运行时版有什么区别
date: 2023-06-02 20:13
updated: 2023-06-02 20:13
cover: https://cdn.wallleap.cn/img/pic/cover/vue.jpg
author: Luwang
---
```

![front-matter](./imgs/frontmatter.png)

如果只想指定文章的作者和封面的话，可以使用下面的方式

```md
[作者：Luwang]: # '<https://cdn.wallleap.cn/img/pic/cover/vue.jpg>'
```

### Create a repo for friends links

创建一个新的 GitHub 仓库，用于存放友链（单独开个仓库的优点是更好管理，可玩性更高），仓库名随意，例如 `friends`

![创建仓库](./imgs/createfreindsrepo.png)

然后创建 Issue

title 随意，内容按如下格式

```md
name: Ta的站点名称
url: Ta的博客链接
avatar: Ta的头像链接
desc: 一句话描述
```

![创建友链](./imgs/newfriendissue.png)

填写完毕，点击 `Submit new issue` 按钮，之后 `Close issue` 关闭该 Issue

![closeIssue](./imgs/closeissue1.png)

可以设置 `Label`

- 不加默认显示为友链
- `失联`，将显示在失联列表
- `未添加`，将以文字形式展示在友链页面

![label](./imgs/friendlabels.png)

至此，博客所需的仓库和 Issue 已经创建完毕，接下来就是配置博客

## How to use

### Clone Project

克隆本项目到本地

```sh
git clone git@github.com:wallleap/Ethereal.git blog
cd blog
```

### Install Dependencies

运行下面的命令安装依赖

```sh
pnpm install
```

### Customize configuration

1、复制 `.env.sample` 重命名为 `.env.local`，修改其中的配置项

**`VITE_GITHUB_TOKEN （这个用于获取 Issues 的权限)`**

前往 [https://github.com/settings/tokens](https://github.com/settings/tokens) 生成一个新的 Token，输入密码

![generate token](./imgs/generatetoken.png)

给 `issue` read-only 权限，它会自动帮你勾另一个

![token permissions](./imgs/issuetoken.png)

> 如果使用 Beta 版本，建议缩小权限范围，`Only select repositories` 选择你存放博客 Issue 的仓库（即最开始新建的 `blog` 仓库），`Repository permissions` 勾选 Issues（这个 Token 是为了获取 Issue 数据的，不需要其他权限）

![copy token](./imgs/issuetoken1.png)

复制生成的 Token，填入 `.env.local` 中的 `VITE_GITHUB_TOKEN` 中，并在中间任意位置加入 ` ,` 空格+半角逗号（避免代码部署到 GitHub 后检测到让 Token 过期）

例如：`VITE_GITHUB_TOKEN="github_pat_11AXVFLRY0i183N0naE8i4_C01urvOKNg2bjJWTZ65yL4sAkcsW, 5LClTG25dh2xNNRNKQMSJGZVWswJ9Fq"`

---

**`VITE_TWIKOO_ID （Twikoo 评论)`**

前往 [https://twikoo.js.org/](https://twikoo.js.org/) 按照文档部署配置（可以自己选择一种）

![twikoo](./imgs/twikoodeploy.png)

将得到的 `envId` 填入 `.env.local` 中的 `VITE_TWIKOO_ID` 中，如果用的是 Vercel 需要绑定自己的域名

---

下面三个是用于统计文章的热度和页面访问量的

**`VITE_LEANCLOUD_ID `**

前往 [https://console.leancloud.cn/](https://console.leancloud.cn/) 切换地区为国际版（左上角），注册账号，创建一个应用，应用名随意

![应用凭证](./imgs/leancloudapp.png)

设置中的应用凭证找到 `AppId` 填入 `.env.local` 中的 `VITE_LEANCLOUD_ID` 中

**`VITE_LEANCLOUD_KEY`**

`AppKey` 填入 `.env.local` 中的 `VITE_LEANCLOUD_KEY` 中

**`VITE_LEANCLOUD_SERVER`**

由于它自带的域名在国内已经访问不了了，因此需要在域名绑定中绑定自己的域名（使用 CNAME 解析）

![域名绑定](./imgs/leancloudapi.png)

之后将 REST API 服务器地址填入 `.env.local` 中的 `VITE_LEANCLOUD_SERVER` 中，例如：`https://xxx.com`

接着在安全中心的 `Web 安全域名` 中添加自己的博客自定义域名，例如：`https://xxx.com`（协议号、主机名、端口都需要和你使用的一致）

![安全域名](./imgs/leanclouddomain.png)

2、修改 `src/config.js` 中的配置

提下重点注意的

- `username` 是你的 GitHub 用户名
- `repository` 是你的博客仓库名
- `friends` 是你的友链仓库名

**`utterances.code`**

前往 [https://utteranc.es/](https://utteranc.es/) 按照文档部署配置

1. 创建一个公开仓库，仓库名随意，例如：`blog-comments`
2. 点击页面中的 [utterances app](https://github.com/apps/utterances) 安装到你的仓库中
3. 填写 repo，例如：`wallleap/blog-comments`

![utterances](./imgs/utterances.png)

选择 `Issue title contains page title`，标签可选，将生成的代码填入 `utterances.code` 中，两边的 \` 不要删除

![utterances code](./imgs/utterancescode.png)

例如：

![config](./imgs/utterancescode1.png)

### Preview Locally

确定配置无误后，运行下面命令

```sh
pnpm dev
```

浏览器打开 [http://localhost:8000](http://localhost:8000) 即可预览

### Build for Production

构建部署可以有多种方式，推荐直接生成静态文件然后直接放到服务器上（更简单）

#### 直接生成静态文件

运行下面命令，将会在 `dist` 目录下生成静态文件

```sh
pnpm run build
```

将 `dist` 目录下的文件上传到你的服务器即可

#### 使用 GitHub Actions（优势为自动构建部署）

在 GitHub 创建仓库 `ethereal` 和 `用户名.github.io`

将 `ethereal` 作为博客源码仓库，将 `用户名.github.io` 作为博客部署仓库

```sh
git remote add ethereal git@github.com:用户名/ethereal.git
git branch -M main
git push -u ethereal main # 别名为 origin 的是我的仓库，以后你可以接着从 origin fetch 获取更新
```

---

在 `ethereal` **仓库**的 `Settings` -> `Secretes and variables` -> `Action` 中 `New repository secret`，添加以下变量

1、`Name` 为 `ACCESS_TOKEN`

对应着 `.env.local` 中的 `VITE_GITHUB_TOKEN`，例如：`xxxxxxxxxxxxxxxxxxxxxxxxxx, xxxxxxxxxxxxxx`

2、`.env.local` 中的剩余四项

`Name` 为 `VITE_TWIKOO_ID`、`VITE_LEANCLOUD_ID`、`VITE_LEANCLOUD_KEY`、`VITE_LEANCLOUD_SERVER`

`Secret` 分别为对应的双引号中内容

---

以上是对应的环境变量，让项目代码能够获取到相应的值，接下来是新增一个推送权限的 Token，`PERSONAL_TOKEN`

在 [https://github.com/settings/tokens](https://github.com/settings/tokens) 新生成一个 Token，勾选 `repo`、`workflow` 权限，复制生成的 Token，填入 `PERSONAL_TOKEN` 的 value 中

这个是直接填入 secret 中的，因此使用 Classic Token，也没问题，不用担心泄露

![Secrets and variables](./imgs/actionssecrets.png)

---

在本地终端执行生成 SSH 密钥

```sh
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f ethereal -N ""
```

执行完上面命令后会生成两个文件，打开 `ethereal.pub` 文件，将里面的内容复制

回到 `ethereal` 仓库，在 `Settings` -> `Deploy keys` -> `Add deploy key`

`Title` 为 `ACTIONS_DEPLOY_KEY`，`Key` 中粘贴刚才复制的内容，勾选 `Allow write access`

点击 `Add key` 按钮（这两步是为了让 GitHub Actions 可以推送到 `用户名.github.io` 仓库）

![Deploy keys](./imgs/deploykeys.png)

---

修改 `.github/workflows/deploy.yml` 中 `- name: Deploy` 下面的内容

- `external_repository`：填入你的博客部署仓库名，例如：`wallleap/wallleap.github.io`
- `user_name`：填入你的 GitHub 用户名
- `user_email`：填入你的 GitHub 邮箱
- `cname`：填入你的博客自定义域名，例如：`xxx.com`

---

之后每次 push 代码到 `ethereal` 仓库，都将触发 GitHub Actions，自动构建部署到 `用户名.github.io` 仓库

```sh
git add .
git commit -m 'xxx'
git push
```

可以点击 Actions 查看构建状态，如果构建失败，可以点击右侧的 `Re-run jobs` 按钮重新构建

如果使用 GitHub Pages，直接到 `用户名.github.io` 仓库开启 Pages；如果不需要，想用 Vercel，可以不开启

#### 使用 Vercel（国内大部分网络已经访问不了了）

前往 [https://vercel.com/](https://vercel.com/) 注册账号，点击 `New Project`，选择 `Import Git Repository`，选择 `用户名.github.io` 仓库，点击 `Import` 按钮，之后点击 `Deploy` 按钮，即可完成部署

由于国内访问不了 vercel 域名，所以需要绑定你自己的域名，前往 `Settings` -> `Domains` -> `Add`，输入你的域名，点击 `Add` 按钮，之后按照提示操作即可
