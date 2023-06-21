import { request } from "@/utils/service"

export function getPriceEvaluationTable(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPriceEvaluationTable",
    method: "get",
    data
  })
}

export function getPriceEvaluationTableResult(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPriceEvaluationTableResult",
    method: "get",
    data
  })
}

// 初版产品核价表下载
export function PriceEvaluationTableDownload(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/PriceEvaluationTableDownload",
    method: "get",
    data,
    responseType: "blob"
  })
}
