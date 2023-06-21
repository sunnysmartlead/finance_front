import { request } from "@/utils/service"
export function savaNewAuditFlowInfo(data: any) {
  return request({
    url: "/api/services/app/AuditFlow/SavaNewAuditFlowInfo",
    method: "post",
    data
  })
}
export function getAllAuditFlowIds() {
  return request({
    url: "/api/services/app/AuditFlow/GetAllAuditFlowIds",
    method: "get"
  })
}

export function getAuditFlowIdsByUser(userId: number) {
  return request({
    url: "/api/services/app/AuditFlow/GetAuditFlowIdsByUser",
    method: "get",
    data: {
      userId
    }
  })
}

export function getProcessRightsByFlowId(data: any) {
  return request({
    url: "/api/services/app/AuditFlow/GetProcessRightsByFlowId",
    method: "get",
    data
  })
}

export function getFlowProcessInfo() {
  return request({
    url: "/api/services/app/AuditFlow/GetFlowProcessInfo",
    method: "get"
  })
}

export function getAllAuditFlowInfos() {
  return request({
    url: "/api/services/app/AuditFlow/GetAllAuditFlowInfos",
    method: "get"
  })
}
export function getAuditFlowNewVersionByProjectName(projectName: string) {
  return request({
    url: "/api/services/app/VersionManagment/GetAuditFlowNewVersionByProjectName",
    method: "get",
    data: {
      projectName
    }
  })
}
