import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { createHtmlPlugin } from 'vite-plugin-html'
import { svgBuilder } from './src/components/svg_icon/svgBuilder.js'
import config from './src/config.js'

const isProduction = process.env.NODE_ENV === 'production'
// 打包排除的第三方库
const external = [

]
// 注入的 CSS 和 JS CDN
const CDN = {
  css: [

  ],
  js: [
    config.twikoo.src,
  ],
}

// https://vitejs.dev/config/
export default defineConfig({
  base: isProduction ? './' : '/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/style/mixins.scss";
        `,
      },
    },
  },
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: `${config.title} | ${config.subtitle}`,
          description: config.description,
          keywords: config.keywords,
          logo: config.logo,
          favicon16: config.favicon16,
          favicon32: config.favicon32,
          url: config.url,
          css: isProduction ? CDN.css : [],
          js: isProduction ? CDN.js : [config.twikoo.src],
        },
      },
    }),
    svgBuilder('./src/assets/icons/'),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
  },
  build: {
    chunkSizeWarningLimit: 700,
    // rollup 配置
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes('node_modules'))
            return 'vendor'
        },
      },
      external,
    },
  },
})
