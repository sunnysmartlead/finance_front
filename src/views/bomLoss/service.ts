import { request } from "@/utils/service"
import { auditFlowInfo } from "./data.type"

export function saveLossRateInfo(data: any) {
  return request({
    url: "/api/services/app/LossRate/SaveLossRateInfo",
    method: "post",
    data
  })
}

export function getLossRateType(data: auditFlowInfo) {
  return request({
    url: "/api/services/app/LossRate/GetLossRateType",
    method: "get",
    data
  })
}

export function getElecLossRateType(data: auditFlowInfo) {
  return request({
    url: "/api/services/app/LossRate/GetElecLossRateType",
    method: "get",
    data
  })
}

export function getStructLossRateType(data: auditFlowInfo) {
  return request({
    url: "/api/services/app/LossRate/GetStructLossRateType",
    method: "get",
    data
  })
}
export function getOldLossRateInfo(data: auditFlowInfo) {
  return request({
    url: "/api/services/app/LossRate/GetOldLossRateInfo",
    method: "get",
    data
  })
}

export function getElecOldLossRateInfo(data: auditFlowInfo) {
  return request({
    url: "/api/services/app/LossRate/GetElecOldLossRateInfo",
    method: "get",
    data
  })
}

export function getStructOldLossRateInfo(data: auditFlowInfo) {
  return request({
    url: "/api/services/app/LossRate/GetStructOldLossRateInfo",
    method: "get",
    data
  })
}

/** 获取年份 */
export function getYears(auditFlowId: number) {
  return request({
    url: "/api/services/app/ProductionControl/GetAllYearsFrom",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
