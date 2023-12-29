import { request } from "@/utils/service"

export function getSorFile(auditFlowId: any) {
  return request({
    url: "/api/services/app/ProductionControl/GetSorFileId",
    method: "get",
    data: {
      auditFlowId
    },
    responseType: "blob"
  })
}
export function getSorByAuditFlowId(auditFlowId: any) {
  return request({
    url: "/api/services/app/ProductDevelopmentInput/GetSorByAuditFlowId",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
export function GetElectronBomDownload(auditFlowId: any,solutionId: any) {
  return request({
    url: "/api/services/app/ProcessHoursEnter/GetStructureBom",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}

export function GetStructureBomDownload(auditFlowId: any,solutionId: any) {
  return request({
    url: "/api/services/app/ProcessHoursEnter/GetStructureBom",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}
