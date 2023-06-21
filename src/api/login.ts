import { request } from "@/utils/service"

interface IUserRequestData {
  username: string
  password: string
}

/**
 * LoginModel，登录实体类
 */
export interface Login {
  /**
   * 登录密码
   */
  password: string
  /**
   * 是否记住密码
   */
  rememberClient?: boolean
  /**
   * 登录帐号或者邮箱
   */
  userNameOrEmailAddress: string
}
/** 登录，返回 token */
export function accountLogin(data: IUserRequestData) {
  return request({
    url: "users/login",
    method: "post",
    data
  })
}
/** 获取用户详情 */
export function userInfoRequest() {
  return request({
    url: "users/info",
    method: "post"
  })
}

/** 获取用户详情 */
export function login(data: Login) {
  return request({
    url: "/api/AccountManagement/Login",
    method: "post",
    data
  })
}
