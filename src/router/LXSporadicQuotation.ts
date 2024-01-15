import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const LXconstantRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/SporadicQuotation/index",
    component: Layout,
    meta: {
      title: "零星报价部分",
      hidden: false
    },
    children: [
      {
        path: "/LXRequirementEntry/index",
        component: () => import("@/views/LXSporadicQuotation/LXRequirementEntry/index.vue"),
        name: "LXRequirementEntry",
        meta: {
          title: "零星报价部分--需求录入"
        }
      }
    ]
  },
]
