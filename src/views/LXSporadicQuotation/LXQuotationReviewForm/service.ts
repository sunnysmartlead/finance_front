import { request } from "@/utils/service"


/** 零星报价 查询需求录入 */
export function QueryLXManagerApproval(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/QueryLXManagerApproval",
    method: "get",
    data
  })
}

/** 下载生成报价审核表 */
export function DownloadQueryLXManagerApproval(data: any) {
  return request({
    url: "/api/services/app/RequirementEntry/DownloadQueryLXManagerApproval",
    method: "get",
    responseType:'blob',
    data
  })
}

/** 审核报价策略 提交 */
export function ReviewQuotationStrategy(data: any): any {
  return request({
    url: "/api/services/app/RequirementEntry/ReviewQuotationStrategy",
    method: "post",
    data
  })
}
