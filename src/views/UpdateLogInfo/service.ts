import { request } from "@/utils/service"


/** 获取更新日志表 */
export function GetUpdateLogInfo(data?:any) {
  return request({
    url: "/api/services/app/UpdateLog/GetUpdateLogInfo",
    method: "get",
    data
  })
}

/** 删除版本号 */
export function DelUpdateLogInfo(data:any) {
  return request({
    url: "/api/services/app/UpdateLog/DelUpdateLogInfo",
    method: "get",
    data
  })
}

/** 添加/更新 版本号 */
export function AddVersions(data:any) {
  return request({
    url: "/api/services/app/UpdateLog/AddVersions",
    method: "post",
    data
  })
}
