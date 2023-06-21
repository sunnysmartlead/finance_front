import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { getToken, removeToken, setToken } from "@/utils/cookies"
import router, { resetRouter } from "@/router"
import { userInfoRequest, login } from "@/api/login"
import { RouteRecordRaw } from "vue-router"

interface IUserState {
  token: string
  roles: string[]
  userInfo: any
}

export const useUserStore = defineStore({
  id: "user",
  state: (): IUserState => {
    return {
      token: getToken() || "admin-token", //login 获取token accessToken:"admin-token"
      roles: [], // 暂时admin为所有人的默认角色，保存角色 ['admin']
      userInfo: {}
    }
  },
  actions: {
    /** 设置角色数组 */
    setRoles(roles: string[]) {
      this.roles = roles
    },
    /** 登录 */
    // login(userInfo: { username: string; password: string }) {
    //   return new Promise((resolve, reject) => {
    //     accountLogin({
    //       username: userInfo.username.trim(),
    //       password: userInfo.password
    //     })
    //       .then((res: any) => {
    //         setToken(res.data.accessToken)
    //         this.token = res.data.accessToken
    //         resolve(true)
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       })
    //   })
    // },

    login(userInfo: { userNameOrEmailAddress: string; password: string; rememberClient: boolean }) {
      return new Promise((resolve, reject) => {
        login({
          userNameOrEmailAddress: userInfo.userNameOrEmailAddress.trim(),
          password: userInfo.password,
          rememberClient: true
        })
          .then((res: any) => {
            setToken(res.result.accessToken)
            this.token = res.result.accessToken
            this.userInfo = res.result.user
            window.localStorage.setItem("user", JSON.stringify(res.result.user))
            resolve(true)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /** 获取用户详情 */
    getInfo() {
      return new Promise((resolve, reject) => {
        userInfoRequest()
          .then((res: any) => {
            this.roles = res.data.user.roles
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /** 切换角色 */
    /** 该项目无需使用 */
    async changeRoles(role: string) {
      const token = role + "-token"
      this.token = token
      setToken(token)
      await this.getInfo()
      const permissionStore = usePermissionStore()
      permissionStore.setRoutes(this.roles)
      resetRouter()
      permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
        router.addRoute(item)
      })
    },
    /** 登出 */
    logout() {
      removeToken()
      this.token = ""
      this.roles = []
      resetRouter()
      window.localStorage.clear()
      window.sessionStorage.clear()
      router.push({ path: "/login" })
    },
    /** 重置 token */
    resetToken() {
      removeToken()
      this.token = ""
      this.roles = []
    }
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
