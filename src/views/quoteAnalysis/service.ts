import { request } from "@/utils/service"

export function getStatementAnalysisBoard(id: number) {
  return request({
    url: "/api/services/app/AnalyseBoard/GetStatementAnalysisBoard",
    method: "get",
    data: {
      id
    }
  })
}

export function postCalculateFullGrossMargin(productBoards: any, auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoard/PostCalculateFullGrossMargin",
    method: "post",
    data: {
      auditFlowId,
      productBoards
    }
  })
}

export function postSpreadSheetCalculate(productBoards: any, auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoard/PostSpreadSheetCalculate",
    method: "post",
    data: {
      auditFlowId,
      productBoards
    }
  })
}
// 查看年份维度对比
export function PostYearDimensionalityComparison(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoard/PostYearDimensionalityComparison",
    method: "post",
    data
  })
}

export function postIsOffer(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoard/PostIsOffer",
    method: "post",
    data
  })
}
export function getDownloadMessage(id: number, fileName: string) {
  return request({
    url: "/api/services/app/AnalyseBoard/GetDownloadMessage",
    method: "get",
    data: {
      id,
      fileName
    },
    responseType: "blob"
  })
}

export function PostIsOfferSave(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoard/PostIsOfferSave",
    method: "post",
    data
  })
}
