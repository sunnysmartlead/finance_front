import { request } from "@/utils/service"
import { TangentSaveDto } from "./data.type"

export function downloadWorkingHoursInfo() {
  return request({
    url: "/api/services/app/FileCommonService/DownloadWorkingHoursInfo",
    method: "post",
    responseType: "blob"
  })
}

export function SaveWorkingHour(data: any) {
  return request({
    url: "/api/services/app/WorkingHours/SaveWorkingHour",
    method: "post",
    data
  })
}

export function SaveTangentHours(data: TangentSaveDto): any {
  return request({
    url: "/api/services/app/WorkingHours/SaveTangentHours",
    method: "post",
    data
  })
}

export function getTangentHoursList(auditFlowId: number, productId: number): any {
  return request({
    url: "/api/services/app/WorkingHours/GetTangentHoursList",
    method: "get",
    data: {
      auditFlowId,
      productId
    }
  })
}

// 工序工时提交
export function SubmitWorkingHourAndSwitchLine(auditFlowId: number): any {
  return request({
    url: "/api/services/app/WorkingHours/SubmitWorkingHourAndSwitchLine",
    method: "post",
    data: {
      auditFlowId
    }
  })
}

/** 获取年份 */
export function getYears(auditFlowId: number) {
  return request({
    url: "/api/services/app/ProductionControl/GetAllYearsFrom",
    method: "get",
    data: {
      auditFlowId
    }
  })
}

/**查询工序工时 */
export function QueryWorkingHour(auditFlowId: number, productId: number) {
  return request({
    url: "/api/services/app/WorkingHours/GetWorkingHour",
    method: "get",
    data: {
      auditFlowId,
      productId
    }
  })
}

/**获取3D爆炸图 */
export function GetPicture3DByAuditFlowId(auditFlowId: number, productId: any) {
  return request({
    url: "/api/services/app/WorkingHours/GetPicture3DByAuditFlowId",
    method: "get",
    data: {
      auditFlowId,
      solutionId: productId
    }
  })
}

//根据流程号获取零件号
export function getProductByAuditFlowId(auditFlowId: number) {
  return request({
    url: "/api/services/app/ProductDevelopmentInput/GetProductByAuditFlowId",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
