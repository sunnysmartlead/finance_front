import { request } from "@/utils/service"
import { CreateUserDto, UserDto, PasswordInfo, ResetPasswordAd, UserParams } from "./data.type"
export interface RoleParams {
  keyword?: string
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
/** 用户模板下载 */
export function DownloadFile() {
  return request({
    url: "/api/services/app/User/GetImportTemplate",
    method: "get",
    responseType: "blob"
  })
}

/** 角色列表 */
export function getRoleList(data: RoleParams) {
  return request({
    url: "/api/services/app/Role/GetAll",
    method: "get",
    data
  })
}
