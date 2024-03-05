import { request } from "@/utils/service"

/**
 * 前端流程流转
 * @param data
 * @returns
 */
export function SubmitNode(data: any): any {
  return request({
    url: "/api/services/app/WorkflowInstance/SubmitNode",
    method: "post",
    data
  })
}
