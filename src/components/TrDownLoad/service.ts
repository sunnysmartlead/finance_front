import { request } from "@/utils/service"
import { TRMainSolutionState } from "./data.type"
/** 获取TR主方案信息 */
export function getAuditFlowVersion(auditFlowId: number) {
  return request({
    url: "/api/services/app/TRCheck/GetTRMainSolution",
    method: "get",
    data: {
      flowId: auditFlowId
    }
  })
}

export function addPricingPanelTrProgrammeId(auditFlowId: number, fileManagementId: number) {
  return request({
    url: "/api/services/app/PriceEvaluation/AddPricingPanelTrProgrammeId",
    method: "post",
    data: {
      auditFlowId,
      fileManagementId
    }
  })
}
export function downloadFile(fileId: number) {
  return request({
    url: "/api/services/app/FileCommonService/DownloadFile",
    method: "get",
    data: {
      fileId
    },
    responseType: "blob"
    // onDownloadProgress: function (progressEvent: any) {
    //   console.log(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2) + "%")
    //   // 对原生进度事件的处理
    // }
  })
}
export function setTRMainSolutionState(data: TRMainSolutionState) {
  return request({
    url: "/api/services/app/TRCheck/SetTRMainSolutionState",
    method: "post",
    data
  })
}
