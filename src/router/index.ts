import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/login',
    //   component: () => import('@/views/login/index.vue')
    // },
    {
      path: '/',
      component: () => import('@/layout/index.vue'),
      redirect: '/map',
      children: [
        {
          path: '/map',
          name: 'All',
          component: () => import('@/views/map.vue')
        },
      ]
    }
  ]
})
export default router
