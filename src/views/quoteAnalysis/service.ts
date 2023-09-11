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

//计算毛利率
export function PostSpreadSheetCalculate(data: {
  auditFlowId: number
  gradientId: number
  productId: number
  solutionId: number //方案
}): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostSpreadSheetCalculate",
    method: "post",
    data
  })
}

//获取方案
export function GetSolution(data: { auditFlowId: number }): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetSolution",
    method: "get",
    data
  })
}

//报价分析看板
export function PostStatementAnalysisBoardSecond(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostStatementAnalysisBoardSecond",
    method: "post",
    data
  })
}

//查看年份维度对比(全部模组)
export function PostComparison(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostYearDimensionalityComparison",
    method: "post",
    data
  })
}
// AnalyseBoardSecond / PostStatementAnalysisBoardSecond
// AnalyseBoardSecond / PostYearDimensionalityComparison
// AnalyseBoardSecond / PostSpreadSheetCalculate 计算毛利率