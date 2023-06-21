import { request } from "@/utils/service"
export function getAllYearsFrom(auditFlowId: any) {
  return request({
    url: "/api/services/app/ProductionControl/GetAllYearsFrom",
    method: "get",
    data: {
      auditFlowId
    }
  })
}

export function manufacturingCostInput(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/ManufacturingCostInput",
    method: "post",
    data
  })
}

export function getInputManufacturingCost(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/GetInputManufacturingCost",
    method: "get",
    data
  })
}
