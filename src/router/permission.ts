import router from "@/router"
import { RouteLocationNormalized } from "vue-router"
// import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
// import { ElMessage } from "element-plus"
// import { whiteList } from "@/config/white-list"
// import { getToken } from "@/utils/cookies"
// import asyncRouteSettings from "@/config/async-route"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

// const userStore = useUserStoreHook()
const permissionStore = usePermissionStoreHook()
NProgress.configure({ showSpinner: false })

// router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {
//   NProgress.start()
//   // 判断该用户是否登录
//   if (getToken()) {
//     if (to.path === "/login") {
//       // 如果登录，并准备进入 login 页面，则重定向到主页
//       next({ path: "/" })
//       NProgress.done()
//     } else {
//       // 检查用户是否已获得其权限角色
//       if (userStore.roles.length === 0) {
//         try {
//           if (asyncRouteSettings.open) {
//             // 注意：角色必须是一个数组！ 例如: ['admin'] 或 ['developer', 'editor']
//             await userStore.getInfo()
//             const roles = userStore.roles
//             // 根据角色生成可访问的 routes（可访问路由 = 常驻路由 + 有访问权限的动态路由）
//             permissionStore.setRoutes(roles)
//           } else {
//             // 没有开启动态路由功能，则启用默认角色
//             userStore.setRoles(asyncRouteSettings.defaultRoles)
//             permissionStore.setRoutes(asyncRouteSettings.defaultRoles)
//           }
//           // 将'有访问权限的动态路由' 添加到 router 中
//           permissionStore.dynamicRoutes.forEach((route) => {
//             router.addRoute(route)
//           })
//           // 确保添加路由已完成
//           // 设置 replace: true, 因此导航将不会留下历史记录
//           next({ ...to, replace: true })
//         } catch (err: any) {
//           // 过程中发生任何错误，都直接重置 token，并重定向到登录页面
//           userStore.resetToken()
//           ElMessage.error(err.message || "路由守卫过程发生错误")
//           next("/login")
//           NProgress.done()
//         }
//       } else {
//         next()
//       }
//     }
//   } else {
//     // 如果没有 token
//     if (whiteList.indexOf(to.path) !== -1) {
//       // 如果在免登录的白名单中，则直接进入
//       next()
//     } else {
//       // 其他没有访问权限的页面将被重定向到登录页面
//       // next("/login")
//       // 测试用
//       next({ path: "/" })
//       NProgress.done()
//     }
//   }
// })

let flag = 0
router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {
  NProgress.start()
  // 后端role的设计有点另类，这里单独前端区分一个财务角色出来
  // 结合setting里的切换一起使用
  const userStorage = window.localStorage.getItem("user") || "{}"
  const userInfo = JSON.parse(userStorage)
  const userRoles = userInfo?.userRole?.items.map((item: any) => item.name) || []
  const roles = []
  if (userInfo?.userDepartment?.name === "财务部") {
    roles.push("finance")
  }
  if (userRoles.includes("Admin")) {
    roles.push("admin")
  }
  if (userRoles.includes("Timeliness")) {
    roles.push("timeliness")
  }
  if (userRoles.includes("项目经理")) {
    roles.push("closeFlow")
  }

  if (userRoles.includes("营销部-业务员")) {
    roles.push("营销部-业务员")
  }
  if (userRoles.includes("报价审核表")) {
    roles.push("报价审核表")
  }
  if (userRoles.includes("报价单归档管理员")) {
    roles.push("报价单归档管理员")
  }
  if (userRoles.includes("单价库管理员")) {
    roles.push("单价库管理员")
  }
  if (userRoles.includes("环境实验库管理员")) {
    roles.push("环境实验库管理员")
  }
  if (userRoles.includes("EMC实验库管理员")) {
    roles.push("EMC实验库管理员")
  }
  if (userRoles.includes("工程部-基础库管理员")) {
    roles.push("工程部-基础库管理员")
  }
  if (userRoles.includes("财务部-财务参数录入员")) {
    roles.push("财务部-财务参数录入员")
  }
  if (userRoles.includes("成本拆分员")) {
    roles.push("成本拆分员")
  }

  permissionStore.setRoutes(roles)
  permissionStore.dynamicRoutes.forEach((route: any) => {
    router.addRoute(route)
  })
  if (to.path === "/login") {
    next()
  } else {
    if (userStorage) {
      if (flag === 0) {
        flag++
        next({ ...to, replace: true })
      } else {
        next()
      }
    } else {
      next({ path: "/login" })
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
