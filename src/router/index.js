import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
    },
    children: [
      {
        path: 'category/:number',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: {
          title: '分类',
        },
      },
    ],
  },
  {
    path: '/post/:number',
    name: 'Post',
    component: () => import('@/views/post/index.vue'),
    meta: {
      title: '文章',
    },
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('@/views/archives/index.vue'),
    meta: {
      title: '归档',
    },
  },
  {
    path: '/inspiration',
    name: 'Inspiration',
    component: () => import('@/views/inspiration/index.vue'),
    meta: {
      title: '灵感',
    },
  },
  {
    path: '/friend',
    name: 'Friend',
    component: () => import('@/views/friend/index.vue'),
    meta: {
      title: '友链',
    },
  },
]

const router = new VueRouter({
  routes,
})

export default router
