import { request } from "@/utils/service"
import { GetLossCostProps, SetPriceEvaluationTableInputCountType } from "./data.type"

// 核价看板-【产品选择】下拉框下拉数据
export function GetPricingPanelProductSelectList(data: { AuditFlowId: number }) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPricingPanelProductSelectList",
    method: "get",
    data
  })
}

// 核价看板-[时间选择]下拉框下拉数据
export function GetPricingPanelTimeSelectList(data: { AuditFlowId: number }) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPricingPanelTimeSelectList",
    method: "get",
    data
  })
}

// 获取损耗成本
export function GetLossCost(data: GetLossCostProps) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetLossCost",
    method: "get",
    data
  })
}

// 获取 质量成本
export function GetQualityCost(data: GetLossCostProps) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetQualityCost",
    method: "get",
    data
  })
}

// 核价看板-产品成本占比图
export function GetPricingPanelProportionOfProductCost(data: GetLossCostProps) {
  return request({
    url: "/api/services/app/PriceEvaluationGet/GetPricingPanelProportionOfProductCost",
    method: "get",
    data
  })
}

// 核价看板-利润分布图
export function GetPricingPanelProfit(data: GetLossCostProps) {
  return request({
    url: "/api/services/app/PriceEvaluationGet/GetPricingPanelProfit",
    method: "get",
    data
  })
}

// 获取梯度
export function GetGradient(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetGradient",
    method: "get",
    data
  })
}

// 获取 bom成本（含损耗）汇总表
export function GetBomCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluationGet/GetBomCost",
    method: "get",
    data
  })
}

// 获取 物流成本汇总表
export function GetLogisticsCost(data: GetLossCostProps) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetLogisticsCost",
    method: "get",
    data
  })
}

// 获取 制造成本汇总表
export function GetManufacturingCost(data: GetLossCostProps) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetManufacturingCost",
    method: "get",
    data
  })
}

// 获取推移图
export function GetGoTable(data: { AuditFlowId: number; SolutionId: number; InputCount: number }) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetGoTable",
    method: "get",
    data
  })
}
// 上传tr主方案
export function addPricingPanelTrProgrammeId(auditFlowId: number, fileManagementId: number) {
  return request({
    url: "/api/services/app/PriceEvaluation/AddPricingPanelTrProgrammeId",
    method: "post",
    data: {
      auditFlowId,
      fileManagementId
    }
  })
}
// 核价看板审核
export function SetPriceBoardState(
  auditFlowId: number,
  isAgree: boolean,
  opinionDescription: string,
  backProcessIdentifiers?: any[]
) {
  return request({
    url: "/api/services/app/PriceBoardCheck/SetPriceBoardState",
    method: "post",
    data: {
      auditFlowId,
      isAgree,
      backProcessIdentifiers,
      opinionDescription
    }
  })
}

// 项目部核价审核
export function SetProjectPriceState(
  auditFlowId: number,
  isAgree: boolean,
  opinionDescription: string,
  backProcessIdentifiers?: any[]
) {
  return request({
    url: "/api/services/app/PriceBoardCheck/SetProjectPriceState",
    method: "post",
    data: {
      auditFlowId,
      isAgree,
      backProcessIdentifiers,
      opinionDescription
    }
  })
}

// 项目部核价审核
export function SetFinancePriceState(
  auditFlowId: number,
  isAgree: boolean,
  opinionDescription: string,
  backProcessIdentifiers?: any[]
) {
  return request({
    url: "/api/services/app/PriceBoardCheck/SetFinancePriceState",
    method: "post",
    data: {
      auditFlowId,
      isAgree,
      backProcessIdentifiers,
      opinionDescription
    }
  })
}

// 获取核价表模组的InputCount（投入量）和年份
export function GetPriceEvaluationTableInputCount(auditFlowId: number) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPriceEvaluationTableInputCount",
    method: "get",
    data: {
      auditFlowId
    }
  })
}

// 设置投入量和年份
export function SetPriceEvaluationTableInputCount(data: SetPriceEvaluationTableInputCountType) {
  return request({
    url: "/api/services/app/PriceEvaluation/SetPriceEvaluationTableInputCount",
    method: "post",
    data
  })
}

// 生成核价表
export function CreatePriceEvaluationTable(auditFlowId: number) {
  return request({
    url: "/api/services/app/PriceEvaluation/CreatePriceEvaluationTable",
    method: "post",
    data: {
      auditFlowId
    }
  })
}

// 是否贸易合规
export function GetIsTradeCompliance(auditFlowId: number) {
  return request({
    url: "/api/services/app/TradeCompliance/GetIsTradeCompliance",
    method: "get",
    data: {
      auditFlowId
    }
  })
}

// 获取修改项信息
export function GetUpdateItem(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetUpdateItem",
    method: "get",
    data
  })
}

// 获取其他成本项目
export function GetOtherCostItem(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluationGet/GetOtherCostItem",
    method: "get",
    data
  })
}
