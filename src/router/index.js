import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/index.vue'
import config from '@/config.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      index: 0,
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
      index: 99,
      title: '文章',
    },
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('@/views/archives/index.vue'),
    meta: {
      index: 1,
      title: '归档',
    },
  },
  {
    path: '/inspiration',
    name: 'Inspiration',
    component: () => import('@/views/inspiration/index.vue'),
    meta: {
      index: 2,
      title: '灵感',
    },
  },
  {
    path: '/friend',
    name: 'Friend',
    component: () => import('@/views/friend/index.vue'),
    meta: {
      index: 3,
      title: '友链',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/index.vue'),
    meta: {
      index: 4,
      title: '关于',
    },
  },
  {
    path: '*',
    redirect: '/',
  },
]

function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }
  else {
    let position = {}
    if (to.hash) {
      position = { selector: to.hash, behavior: 'smooth' }
      if (document.querySelector(to.hash))
        return position
      return false
    }
    position = { x: 0, y: 0 }
    return position
  }
}

const router = new VueRouter({
  routes,
  scrollBehavior,
})

router.beforeEach((to, from, next) => {
  if (!to.path.startsWith('/post'))
    window.document.title = `${config.title} | ${to.meta.title}`
  if (to.path === '/')
    window.document.title = `${config.title} | ${config.subtitle}`
  next()
})

export default router
