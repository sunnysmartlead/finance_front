import { request } from "@/utils/service"
import { RatePage } from "./data.type"
/** 录入 */
export function saveApplyInfo(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/PriceEvaluationStart",
    method: "post",
    data
  })
}

/** 保存录入 */
export function priceEvaluationStartSave(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/PriceEvaluationStartSave",
    method: "post",
    data
  })
}

/** 查询汇率 */
export function getExchangeRate(data: RatePage) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/GetExchangeRate",
    method: "get",
    data
  })
}

// 获取项目核价表
export function getPriceEvaluationTable(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPriceEvaluationTable",
    method: "get",
    data
  })
}

export function getPriceEvaluationStartData(auditFlowId: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPriceEvaluationStartData",
    method: "get",
    data: {
      auditFlowId
    }
  })
}

// 保存营销部报价表
export function PostAuditQuotationListSave(data: any) {
  return request({
    url: "/api/services/app/AnalyseBoard/PostAuditQuotationListSave",
    method: "post",
    data
  })
}

// 获取项目版本
export function GetQuoteVersion(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetQuoteVersion",
    method: "get",
    data
  })
}

// 查询已有流程
export function getWorkflowOvered(data: any) {
  return request({
    url: "/api/services/app/WorkflowInstance/GetWorkflowOvered",
    method: "get",
    data
  })
}

// 快速核价
export function priceEvaluationStart(data: any) {
  return request({
    url: "/api/services/app/QuickQuotationReview/PriceEvaluationStart",
    method: "post",
    data
  })
}
