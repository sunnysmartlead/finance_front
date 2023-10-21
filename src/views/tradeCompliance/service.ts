import { request } from "@/utils/service"

export function GetTradeComplianceCheckFromDateBase(data: { AuditFlowId: number; ProductId: number }): any {
  return request({
    url: "/api/services/app/TradeCompliance/GetTradeComplianceCheckFromDateBase",
    method: "get",
    data
  })
}

export function IsTradeComplianceCheck(data: any): any {
  return request({
    url: "/api/services/app/FinanceCheck/IsTradeComplianceCheck",
    method: "post",
    data
  })
}
export function SubmitNode(data: any): any {
  return request({
    url: "/api/services/app/WorkflowInstance/SubmitNode",
    method: "post",
    data
  })
}
export function PostExportOfTradeForm(data: any): any {
  return request({
    url: "/api/services/app/TradeCompliance/PostExportOfTradeForm",
    method: "post",
    data,
    responseType: 'blob'
  })
}
