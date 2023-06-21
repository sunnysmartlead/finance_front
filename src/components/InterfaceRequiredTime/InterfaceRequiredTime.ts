import { request } from "@/utils/service"

//获取页面期望完成时间
export function getPermissionList(data:{auditFlowId: number,processIdentifier:String}):any {
  return request({
    url: "/api/services/app/VersionManagment/GetInterfaceRequiredTime",
    method: "get",
    data
  })
}
