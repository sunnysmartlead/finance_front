import { request } from "@/utils/service"
export function getProductByAuditFlowId(auditFlowId: number) {
  return request({
    url: "/api/services/app/ProductDevelopmentInput/GetProductByAuditFlowId",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
