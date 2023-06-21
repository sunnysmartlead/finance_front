/**
 * CreateUserDto
 */
export interface CreateUserDto {
  /**
   * 邮箱地址
   */
  emailAddress: string
  /**
   * 是否启用
   */
  isActive?: boolean
  /**
   * 名称
   */
  name: string
  /**
   * 用户密码
   */
  password: string
  /**
   * 选取的用户角色
   */
  roleNames?: string[] | null
  /**
   * 姓
   */
  surname: string
  /**
   * 用户名
   */
  userName: string
}

/**
 * UserDto
 */
export interface UserDto {
  /**
   * 创建时间
   */
  creationTime?: Date
  /**
   * 邮箱地址
   */
  emailAddress: string
  /**
   * 全部名称（姓氏+名称）
   */
  fullName?: null | string
  id?: number
  /**
   * 是否启用
   */
  isActive?: boolean
  /**
   * 追进登录时间
   */
  lastLoginTime?: Date | null
  /**
   * 名称
   */
  name: string
  /**
   * 所属角色名称
   */
  roleNames?: string[] | null
  /**
   * 姓氏
   */
  surname: string
  /**
   * 用户名
   */
  userName: string
}
export interface PasswordInfo {
  /**
   * 当前的密码
   */
  currentPassword: string
  /**
   * 新密码
   */
  newPassword: string
}
/**
 * ResetPasswordDto
 */
export interface ResetPasswordAd {
  /**
   * 管理的密码
   */
  adminPassword: string
  /**
   * 新密码
   */
  newPassword: string
  /**
   * 用户的ID
   */
  userId: number
}
export interface UserParams {
  keyword?: string
  isActive?: string
  skipCount: number
  maxResultCount: number
}

export interface User {
  id?: number
  name: string
  surname: string
  userName: string
  emailAddress: string
  isActive: Boolean
  roleNames: string
  password: string
  number: string
  position: string
}
