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
]

const router = new VueRouter({
  routes,
})

export default router
