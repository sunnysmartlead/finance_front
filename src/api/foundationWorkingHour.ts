import { request } from "@/utils/service"


/**
 * ResetPasswordDto
 */

export interface QueryParams {
  ProcessName?: string
}
/** 新增 */
export function createFoundationWorkingHour(data:any) {
  return request({
    url: "/api/services/app/FoundationWorkingHour/Create",
    method: "post",
    data: data
  })
}

// 查询岗位详细
export function getFoundationWorkingHour(id: number) {
  return request({
    url: "api/services/app/FoundationWorkingHour/GetAsyncById",
    method: "get",
    data: {
      id
    }
  })
}

/** 修改 */
export function updateFoundationWorkingHour(data:any) {
  return request({
    url: "/api/services/app/FoundationWorkingHour/Update",
    method: "put",
    data
  })
}

/** 列表 */
export function getListAll(data: QueryParams) {
  return request({
    url: "api/services/app/FoundationWorkingHour/GetListAll",
    method: "get",
    data
  })
}
export function deleteFoundationWorkingHour(id: number | undefined) {
  return request({
    url: "/api/services/app/FoundationWorkingHour/Delete",
    method: "delete",
    data: {
      id
    }
  })
}
