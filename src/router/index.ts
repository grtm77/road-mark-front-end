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
      redirect: '/addSensor',
      children: [
        {
          path: '/addSensor',
          component: () => import('@/views/addSensor.vue')
        },
        {
          path: '/addGateway',
          component: () => import('@/views/addGateway.vue')
        },
      ]
    }
  ]
})
export default router
