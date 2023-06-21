import { request } from "@/utils/service"
/**
 * AddDerartment，部门新增
 */
export interface DepartmentInfo {
  /**
   * 父部门
   */
  fid?: number | null
  /**
   * 部门名称
   */
  name: string
  id?: number | null | undefined
}
/**
 * UpdateDerpartmentInput，部门更新
 */
export interface UpdateDepartmentInfo {
  id?: number | null | undefined
  /**
   * 部门名称
   */
  name: string
}
/** 创建部门 */
export function addDepartment(data: DepartmentInfo) {
  return request({
    url: "/api/services/app/Hr/AddDepartment",
    method: "post",
    data
  })
}

/** 修改部门 */
export function updateDepartment(data: UpdateDepartmentInfo) {
  return request({
    url: "/api/services/app/Hr/UpdateDepartment",
    method: "put",
    data
  })
}
/** 删除部门 */
export function deleteDerpartment(id: number) {
  return request({
    url: "/api/services/app/Hr/DeleteDepartment",
    method: "delete",
    data: {
      id
    }
  })
}

/** 获取根部门 */
export function getRootDepartment() {
  return request({
    url: "/api/services/app/Hr/GetRootDepartment",
    method: "get"
  })
}
/** 获取下属部门 */
export function getDepartmentChildren(id: number) {
  return request({
    url: "/api/services/app/Hr/GetSubordinateDepartment",
    method: "get",
    data: {
      id
    }
  })
}
