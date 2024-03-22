import { request } from "@/utils/service"
/** 零星报价需求录入 保存\提交 */
export function LXRequirementEnt(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/LXRequirementEnt",
    method: "post",
    data
  })
}

/** 零星报价 查询需求录入 */
export function QueryLXRequirementEnt(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/QueryLXRequirementEnt",
    method: "get",
    data
  })
}

/** 下载生成报价审核表 */
export function DownloadQueryLXManagerApproval(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/DownloadQueryLXManagerApproval",
    method: "post",
    responseType:'blob',
    data
  })
}
