import { request } from "@/utils/service"

export function getInstanceHistoryById(auditFlowId: any) {
  return request({
    url: "/api/services/app/WorkflowInstance/GetInstanceHistoryById",
    method: "get",
    data: {
      workflowInstanceId: auditFlowId
    }
  })
}
