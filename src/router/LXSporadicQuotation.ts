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
      },
      {
        path: "/LXReviewQuotationStrategy/index",
        component: () => import("@/views/LXSporadicQuotation/LXReviewQuotationStrategy/index.vue"),
        name: "LXReviewQuotationStrategy",
        meta: {
          title: "零星报价部分--审核报价策略"
        }
      },
      {
        path: "/LXQuotationReviewForm/index",
        component: () => import("@/views/LXSporadicQuotation/LXQuotationReviewForm/index.vue"),
        name: "LXQuotationReviewForm",
        meta: {
          title: "零星报价部分--报价审核表"
        }
      },
      // {
      //   path: "/LXViewQuotationReviewForm/index",
      //   component: () => import("@/views/LXSporadicQuotation/LXViewQuotationReviewForm/index.vue"),
      //   name: "LXViewQuotationReviewForm",
      //   meta: {
      //     title: "零星报价部分--查看报价审核表"
      //   }
      // },
      {
        path: "/LXFiled/index",
        component: () => import("@/views/LXSporadicQuotation/LXFiled/index.vue"),
        name: "LXFiled",
        meta: {
          title: "归档"
        }
      }
    ]
  },
]
