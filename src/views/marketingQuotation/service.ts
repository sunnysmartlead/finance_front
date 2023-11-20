import { request } from "@/utils/service"

// 查看 报价审核表
export function GetQuotationList(data: {
  /**
   * 流程Id
   */
  Id?: number
}): any {
  return request({
    url: "/api/services/app/AnalyseBoard/GetQuotationList",
    method: "get",
    data
  })
}

// 提交报价
export function PostIsOffer(data: {
  /**
   * 流程Id
   */
  Id?: number
}): any {
  return request({
    url: "/api/services/app/AnalyseBoard/PostIsOffer",
    method: "post",
    data
  })
}

// 报价审核
export function PostAuditQuotationList(data: {
  /**
   * 流程Id
   */
  Id?: number
}): any {
  return request({
    url: "/api/services/app/AnalyseBoard/PostAuditQuotationList",
    method: "post",
    data
  })
}

// 报价审核
export function PostAuditQuotationListSave(data: {
  /**
   * 流程Id
   */
  Id?: number
}): any {
  return request({
    url: "/api/services/app/AnalyseBoard/PostAuditQuotationList",
    method: "post",
    data
  })
}

// 总经理审批1获取
export function GetManagerApprovalOfferOne(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetManagerApprovalOfferOne",
    method: "get",
    data
  })
}
// 总经理审批1 保存提交
export function PostManagerApprovalOfferOneSave(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostManagerApprovalOfferOneSave",
    method: "post",
    data
  })
}

// 总经理审批2
export function GetManagerApprovalOfferTwo(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetManagerApprovalOfferTwo",
    method: "get",
    data
  })
}
// 总经理审批2 保存提交
export function PostManagerApprovalOfferTwoSave(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/PostManagerApprovalOfferTwoSave",
    method: "post",
    data
  })
}

// 中标确认查看
export function GetAcceptanceBid(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetAcceptanceBid",
    method: "get",
    data
  })
}
// 总经理中标查看
export function GetBidView(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetBidView",
    method: "get",
    data
  })
}
