import { request } from "@/utils/service"

export function getProductionControl(auditFlowId: any) {
  return request({
    url: "/api/services/app/ElectronicBom/GetProductionControl",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
