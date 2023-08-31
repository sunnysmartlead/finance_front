import { request,baseDomain } from "@/utils/service"

const uploadAction=baseDomain+"api/services/app/FoundationDevice/UploadFoundationDevice"
export {uploadAction}
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

  //获取日志
export function getDeviceLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/GetListAll",
    method: "get",
    data
  })
}

//保存日志
export function saveDeviceLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/update",
    method: "put",
    data
  })
}

/** 导出 */
export function exportDevice(data:any) {
  return request({
    url: "/api/services/app/FoundationDevice/FoundationDeviceDownloadStream",
    method: "post",
    responseType:'blob',
    data: data
  })
}

