export interface loginModel {
  /**
   * 登录密码
   */
  password: string
  /**
   * 记忆登录状态
   */
  rememberClient?: boolean
  /**
   * 登录帐号或者邮箱
   */
  userNameOrEmailAddress: string
}
