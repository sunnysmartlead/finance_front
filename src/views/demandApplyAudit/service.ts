import { request } from "@/utils/service"

// 营销部审核录入
export function AuditEntering(data: any) {
  return request({
    url: "/api/services/app/DemandApplyAudit/AuditEntering",
    method: "post",
    data
  })
}

// 营销部审核输出
export function AuditExport(auditFlowId: any) {
  return request({
    url: "/api/services/app/DemandApplyAudit/AuditExport",
    method: "get",
    data: {
      auditFlowId
    }
  })
}

//下载项目设计方案
export function DownloadTemplate(data:any)
{
  return request({
    url: "/api/services/app/DemandApplyAudit/DownloadTemplate",
    method: "post",
    data,
    responseType: "blob"
  })
}

// 导入项目设计方案
export function ImportData(data: any) {
  return request({
    url: "/api/services/app/DemandApplyAudit/ImportData",
    method: "post",
    data,
    responseType: "blob"
  })
}
