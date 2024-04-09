import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/login',
    //   component: () => import('@/views/login/index.vue')
    // },
    {
      path: "/",
      component: () => import("@/layout/index.vue"),
      redirect: "/mark",
      children: [
        {
          path: "/mark",
          component: () => import("@/views/mark.vue"),
        },
        {
          path: "/viewData",
          component: () => import("@/views/viewData.vue"),
        },
        {
          path: "/addCrossing",
          component: () => import("@/views/addCrossing.vue"),
        },
      ],
    },
  ],
});
export default router;
