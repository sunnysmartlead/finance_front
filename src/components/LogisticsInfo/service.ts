import { request } from "@/utils/service"
import { SaveProductionControlInfo, productParams } from "./data.type"

/** 获取年份 */
export function getYears(auditFlowId: number | undefined): any {
  return request({
    url: "/api/services/app/ProductionControl/GetAllYearsFrom",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
// 提交数据
export function saveProductionControl(data: SaveProductionControlInfo) {
  return request({
    url: "/api/services/app/ProductionControl/SavaProductionControl",
    method: "post",
    data
  })
}

export function getPcsByPriceAuditFlowId(priceEvaluationId: number) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPcsByPriceAuditFlowId",
    method: "get",
    data: {
      auditFlowId: priceEvaluationId
    }
  })
}

export function getModelCountByAuditFlowId(auditFlowId: number) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetModelCountByAuditFlowId",
    method: "get",
    data: {
      auditFlowId
    }
  })
}

export function getSor(auditFlowId: number) {
  return request({
    url: "/api/services/app/ProductionControl/GetSorFileId",
    method: "get",
    data: {
      auditFlowId
    },
    responseType: "blob"
  })
}

export function getProductFreight(data: productParams) {
  return request({
    url: "/api/services/app/ProductDevelopmentInput/PostProductDevelopmentInput",
    method: "post",
    data
  })
}

export function getProductionControl(auditFlowId: number, productId: number) {
  return request({
    url: "/api/services/app/ProductionControl/GetProductionControl",
    method: "get",
    data: {
      auditFlowId,
      productId
    }
  })
}

export function getSorByAuditFlowId(auditFlowId: any) {
  return request({
    url: "/api/services/app/ProductDevelopmentInput/GetSorByAuditFlowId",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
