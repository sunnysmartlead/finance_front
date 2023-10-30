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
export function PostSpreadSheetCalculate(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostSpreadSheetCalculate",
    method: "post",
    data
  })
}

//获取方案
export function GetSolution(auditFlowId: number): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetSolution",
    method: "get",
    data: {
      auditFlowId
    }
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
export function PostComparison(data: { auditFlowId: number; productId: number }): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostYearDimensionalityComparison",
    method: "post",
    data
  })
}

//查看年度对比（阶梯数量）
export function PostYearDimensionalityComparisonForGradient(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostYearDimensionalityComparisonForGradient",
    method: "post",
    data
  })
}

// AnalyseBoardSecond / PostStatementAnalysisBoardSecond
// AnalyseBoardSecond / PostYearDimensionalityComparison
// AnalyseBoardSecond / PostSpreadSheetCalculate 计算毛利率

interface calculateRateParam {
  auditFlowId: number
  gradientId: number
  productId: number
  solutionId: number
}
// 计算
export function calculateRate(data: calculateRateParam) {
  return request({
    url: "/api/services/app/FoundationProcedure/Create",
    method: "post",
    data: data
  })
}

// 获取报价反馈数据
export function getQuotationFeedback(auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetQuotationFeedback",
    method: "post",
    data: {
      auditFlowId
    }
  })
}
// 获取归档数据
export function getFinancialArchive(auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetFinancialArchive",
    method: "post",
    data: {
      auditFlowId
    }
  })
}
/**
 * 营销部报价审批数据
 */
export function getQuotationApprovedMarketing(auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetQuotationApprovedMarketing",
    method: "post",
    data: {
      auditFlowId
    }
  })
}
/**
 * 中标确认
 * @param auditFlowId
 * @returns
 */
export function getAcceptanceBid(auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetAcceptanceBid",
    method: "post",
    data: {
      auditFlowId
    }
  })
}

/**
 * 总经理中标查看
 * @param auditFlowId
 * @returns
 */
export function getBidView(auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetBidView",
    method: "post",
    data: {
      auditFlowId
    }
  })
}

// 归档
export function getDownloadList(auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetDownloadList",
    method: "post",
    data: {
      auditFlowId
    }
  })
}

//查看核心器件
export function GetCoreComponentAndNreList(auditFlowId: number) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetCoreComponentAndNreList",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
//下载成本信息表
export function PostDownloadMessageSecond(data: any) {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostDownloadMessageSecond",
    method: "post",
    responseType: "blob",
    data
  })
}
