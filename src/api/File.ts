import { request } from "@/utils/service"

/**
 * 下载文件
 * @param data
 * @returns
 */
export function DownloadFile(data: any): any {
  return request({
    url: "/api/services/app/FileCommonService/DownloadFile",
    method: "get",
    responseType:"blob",
    data
  })
}
