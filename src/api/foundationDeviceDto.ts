import { request } from "@/utils/service"


/**
 * ResetPasswordDto
 */

export interface QueryParams {
  DeviceName?: string
}
/** 新增 */
export function createFoundationDevice(data:any) {
  return request({
    url: "/api/services/app/FoundationDevice/Create",
    method: "post",
    data: data
  })
}

export function getFoundationDeviceById(id: number) {
  return request({
    url: "api/services/app/FoundationDevice/GetAsyncById",
    method: "get",
    data: {
      id
    }
  })
}

/** 修改 */
export function updateFoundationDevice(data:any) {
  return request({
    url: "/api/services/app/FoundationDevice/Update",
    method: "put",
    data
  })
}

/** 列表 */
export function getListAll(data: QueryParams) {
  return request({
    url: "api/services/app/FoundationDevice/GetListAll",
    method: "get",
    data
  })
}
export function deleteFoundationPFoundationDevice(id: number | undefined) {
  return request({
    url: "/api/services/app/FoundationDevice/Delete",
    method: "delete",
    data: {
      id
    }
  })
}
