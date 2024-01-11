import { request } from "@/utils/service"

export function getInstanceHistoryById(auditFlowId: number | string) {
  return request({
    // url: "/api/services/app/WorkflowInstance/GetInstanceHistoryById",
    url: "/api/services/app/WorkflowInstance/GetInstanceHistorys",
    method: "get",
    data: {
      workflowInstanceId: auditFlowId
    }
  })
}
