import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: () => import('@/components/404.vue')
    },
    {
      path: '/sellerPage',
      name: 'sellerPage',
      component: () => import('@/views/seller-page.vue')
    },
    {
      path: '/trendPage',
      name: 'trendPage',
      component: () => import('@/views/trend-page.vue')
    },
    {
      path: '/mapPage',
      name: 'mapPage',
      component: () => import('@/views/map-page.vue')
    },
    {
      path: '/rankPage',
      name: 'rankPage',
      component: () => import('@/views/rank-page.vue')
    },
    {
      path: '/hotPage',
      name: 'hotPage',
      component: () => import('@/views/hot-page.vue')
    },
    {
      path: '/stockPage',
      name: 'stockPage',
      component: () => import('@/views/stock-page.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home.vue')
    },
  ]
})

export default router