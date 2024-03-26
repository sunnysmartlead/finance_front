import { request } from "@/utils/service"


/**
 *
 * @param data 归档文件列表
 * @returns
 */
export function GetDownloadList(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/GetDownloadList",
    method: "get",
    data
  })
}
/**
 *
 * @param data 归档文件下载  多个
 * @returns
 */
export function PostPigeonholeDownloads(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/PostPigeonholeDownloads",
    method: "post",
    responseType: "blob",
    data
  })
}

/**
 *
 * @param data 归档文件下载  单个
 * @returns
 */
 export function GetPigeonholeDownload(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/GetPigeonholeDownload",
    method: "get",
    responseType: "blob",
    data
  })
}
