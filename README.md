# Ethereal

使用 Vite 4 搭建的 Vue 2 博客，免费使用

## Features

- 使用 Vite 4 构建
- 基于 Vue 2 + Vue Router + Vuex 开发的 SPA 博客主题
- 使用 GitHub Issue 编写文章，通过 GitHub API 获取文章数据
- 评论系统内置 Twikoo 和 Gitalk，免费无广，方便后续迁移
- 使用 GitHub Pages & Vercel 部署在线访问，无需额外服务器

## Recommended Environment

- NVM（Node.js 14+）
- pnpm
- git
- IDE/Editor:
  - [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

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

1、修改 `.env` 中的配置

2、修改 `src/config.js` 中的配置

### Preview Locally

确定配置无误后，运行下面命令

```sh
pnpm dev
```

浏览器打开 <http://localhost:3000> 即可预览

### Build for Production

运行下面命令，将会在 `dist` 目录下生成静态文件

```sh
pnpm build
```

将 `dist` 目录下的文件上传到你的服务器即可

## License

This project is licensed under the MIT License.
