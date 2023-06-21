import { request } from "@/utils/service"

/** 获取系统中邮件信息 */
export function GetEmailInfo(data?: any) {
  return request({
    url: "/api/services/app/AuditFlow/GetEmailInfo",
    method: "get",
    data
  })
}

/** 获取系统中邮件信息 */
export function ChangeEmailInfo(data: any) {
  return request({
    url: "/api/services/app/AuditFlow/ChangeEmailInfo",
    method: "post",
    data
  })
}
