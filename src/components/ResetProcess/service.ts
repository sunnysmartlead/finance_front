import { request } from "@/utils/service"
// 获取用户
export function GetAll({ keyword, isActive }: any): any {
  return request({
    url: "/api/services/app/User/GetAll",
    method: "get",
    data: {
      keyword,
      isActive,
      skipCount: 1,
      maxResultCount: 20
    }
  })
}
//将任务重置给别人
export function ResetTask({ nodeInstanceId, targetUserId }: any): any {
  return request({
    url: "/api/services/app/WorkflowInstance/ResetTask",
    method: "post",
    data: {
      nodeInstanceId,
      targetUserId
    }
  })
}
