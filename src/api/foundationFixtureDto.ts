import { request } from "@/utils/service"

/**
 * ResetPasswordDto
 */

export interface QueryParams {
  DeviceName?: string
}
/** 新增 */
export function createFoundationFixture(data:any) {
  return request({
    url: "/api/services/app/FoundationFixture/Create",
    method: "post",
    data: data
  })
}

export function getFoundationDeviceById(id: number) {
  return request({
    url: "api/services/app/FoundationFixture/GetAsyncById",
    method: "get",
    data: {
      id
    }
  })
}

/** 修改 */
export function updateFoundationFixture(data:any) {
  return request({
    url: "/api/services/app/FoundationFixture/Update",
    method: "put",
    data
  })
}

/** 列表 */
export function getListAll(data: QueryParams) {
  return request({
    url: "api/services/app/FoundationFixture/GetListAll",
    method: "get",
    data
  })
}
export function deleteFoundationPFoundationFixture(id: number | undefined) {
  return request({
    url: "/api/services/app/FoundationFixture/Delete",
    method: "delete",
    data: {
      id
    }
  })
}
