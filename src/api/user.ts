import { request } from "@/utils/service"

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
/** 创建用户 */
export function createUser(data: CreateUserDto) {
  return request({
    url: "/api/services/app/User/Create",
    method: "post",
    data
  })
}

/** 修改用户 */
export function updateUser(data: UserDto) {
  return request({
    url: "/api/services/app/User/Update",
    method: "put",
    data
  })
}
/** 删除用户 */
export function deleteUser(id: number | undefined) {
  return request({
    url: "/api/services/app/User/Delete",
    method: "delete",
    data: {
      id
    }
  })
}
/** 激活用户 */
export function activateUser(id: number | undefined) {
  return request({
    url: "/api/services/app/User/Activate",
    method: "post",
    data: {
      id
    }
  })
}

/** 禁用用户 */
export function deActivateUser(id: number | undefined) {
  return request({
    url: "/api/services/app/User/DeActivate",
    method: "post",
    data: {
      id
    }
  })
}

/** 修改密码 */
export function changePassword(data: PasswordInfo) {
  return request({
    url: "/api/services/app/User/ChangePassword",
    method: "post",
    data
  })
}
/** 管理员修改密码 */
export function changePasswordAd(data: ResetPasswordAd) {
  return request({
    url: "/api/services/app/User/ResetPassword",
    method: "post",
    data
  })
}
/** 用户列表 */
export function getUserList(data: UserParams) {
  return request({
    url: "/api/services/app/User/GetAll",
    method: "get",
    data
  })
}

/** 根据角色获取人员 */
export function getUserListByRoleName(roleName: string) {
  return request({
    url: "/api/services/app/User/GetUserListByRoleName",
    method: "get",
    data: {
      roleName,
      maxResultCount: 200,
      skipCount: 0
    }
  })
}
