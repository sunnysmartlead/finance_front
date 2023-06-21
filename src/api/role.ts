import { request } from "@/utils/service"
export interface Role {
  id?: number | null | undefined
  /**
   * 角色描述
   */
  description?: null | string
  /**
   * 角色权限
   */
  grantedPermissions?: string[] | null
  /**
   * 角色名称
   */
  name: string
  /**
   * 标准名称(字母全部转为大写)
   */
  normalizedName?: null | string
}

export interface RoleParams {
  keyword?: string
  skipCount: number
  maxResultCount: number
}
/** 角色列表 */
/** 创建角色 */
export function createRole(data: Role) {
  return request({
    url: "/api/services/app/Role/Create",
    method: "post",
    data
  })
}

/** 修改用户 */
export function updateRole(data: Role) {
  return request({
    url: "/api/services/app/Role/Update",
    method: "put",
    data
  })
}
/** 删除用户 */
export function deleteRole(id: number) {
  return request({
    url: "/api/services/app/Role/Delete",
    method: "delete",
    data: {
      id
    }
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

/** 权限列表 */
export function getPermissionList() {
  return request({
    url: "/api/services/app/Role/GetAllPermissions",
    method: "get"
  })
}
