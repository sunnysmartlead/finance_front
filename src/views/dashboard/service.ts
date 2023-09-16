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
export function GetPricingPanelProportionOfProductCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluationGet/GetPricingPanelProportionOfProductCost",
    method: "get",
    data
  })
}

// 核价看板-利润分布图
export function GetPricingPanelProfit(data: GetLossCostProps) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetPricingPanelProfit",
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
export function GetLogisticsCost(data: any) {
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
export function GetGoTable(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluationGet/GetGoTable",
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
  comment: string,
  opinion: string,
  nodeInstanceId: number,
  backProcessIdentifiers?: any[]
) {
  return request({
    url: "/api/services/app/PriceBoardCheck/SetFinancePriceState",
    method: "post",
    data: {
      auditFlowId,
      isAgree,
      backProcessIdentifiers,
      opinionDescription,
      comment,
      opinion,
      nodeInstanceId
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

// 获取其他成本项目
export function GetOtherCostItem(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluationGet/GetOtherCostItem2List",
    method: "get",
    data
  })
}

// 获取修改项（物料成本）
export function GetUpdateItemMaterial(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetUpdateItemMaterial",
    method: "get",
    data
  })
}

// 创建修改项（物料成本）
export function SetUpdateItemMaterial(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/SetUpdateItemMaterial",
    method: "post",
    data
  })
}

// 获取修改项（损耗成本）
export function GetUpdateItemLossCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetUpdateItemLossCost",
    method: "get",
    data
  })
}

// 创建修改项（损耗成本）
export function SetUpdateItemLossCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/SetUpdateItemLossCost",
    method: "post",
    data
  })
}


// 获取修改项（制造成本）
export function SetUpdateItemManufacturingCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/SetUpdateItemManufacturingCost",
    method: "post",
    data
  })
}

// 创建修改项（制造成本）
export function GetUpdateItemManufacturingCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetUpdateItemManufacturingCost",
    method: "get",
    data
  })
}

// 创建修改项（质量成本）
export function SetUpdateItemQualityCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/SetUpdateItemQualityCost",
    method: "post",
    data
  })
}

// 获取修改项（质量成本）
export function GetUpdateItemQualityCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetUpdateItemQualityCost",
    method: "get",
    data
  })
}

// 创建修改项（其他成本）
export function SetUpdateItemOtherCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/SetUpdateItemOtherCost",
    method: "post",
    data
  })
}

// 查询修改项（其他成本）
export function GetUpdateItemOtherCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetUpdateItemOtherCost",
    method: "get",
    data
  })
}

// 查询修改项（其他成本）
export function GetUpdateItemLogisticsCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetUpdateItemLogisticsCost",
    method: "get",
    data
  })
}

// 创建修改项（其他成本）
export function SetUpdateItemLogisticsCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/SetUpdateItemLogisticsCost",
    method: "post",
    data
  })
}

// 核价表下载
export function PriceEvaluationTableDownload(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/PriceEvaluationTableDownload",
    method: "get",
    data,
    responseType: "blob",
  })
}
