import { request,baseDomain } from "@/utils/service"

export {baseDomain}

/**
 * foundationreliable
 */
export interface foundationReliable {
  /**
   * 分类名称
   */
  classification: string
  /**
   * 名称
   */
  name: string
  /**
   * 单价
   */
  price: number
  /**
   * 单位
   */
  unit: string
  /**
   * 实验室
   */
  laboratory: string
}

/**
 * UserDto
 */
export interface UserDto {
  /**
   * 分类
   */
  classification?: String
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

export interface QueryParams {
  name?: string
  classification?: string
}
/** 创建用户 */
export function createFoundationReliable(data) {
  return request({
    url: "/api/services/app/Foundationreliable/Create",
    method: "post",
    data: data
  })
}

// 查询岗位详细
export function getFoundationReliableById(id: number) {
  return request({
    url: "api/services/app/Foundationreliable/GetAsyncById",
    method: "get",
    data: {
      id
    }
  })
}

/** 修改用户 */
export function updateFoundationReliable(data) {
  return request({
    url: "/api/services/app/Foundationreliable/Update",
    method: "put",
    data
  })
}
/** 删除用户 */
export function deleteFoundationReliable(id: number | undefined) {
  return request({
    url: "/api/services/app/User/Delete",
    method: "delete",
    data: {
      id
    }
  })
}

/** 用户列表 */
export function GetListAll(data: QueryParams) {
  return request({
    url: "api/services/app/Foundationreliable/GetListAll",
    method: "get",
    data
  })
}

//获取日志
export function getEnvLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/GetListAll",
    method: "get",
    data
  })
}

//保存日志
export function saveEnvLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/update",
    method: "put",
    data
  })
}