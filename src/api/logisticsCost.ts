import { request,baseDomain} from "@/utils/service"

export interface QueryParams {
  AuditFlowId?: number
  ProductId?:number
}
  /**
/** 列表 */
export function GetListAll(data: QueryParams) {
    return request({
      url: "/api/services/app/Logisticscost/GetListAll",
      method: "get",
      data
    })
}

/** 新增 */
export function createProcess(data:any) {
    return request({
      url: "/api/services/app/Logisticscost/Create",
      method: "post",
      data: data
    })
  }

/** 列表 */
export function GetGradientllodelYearByProductId(data: QueryParams) {
  return request({
    url: "/api/services/app/DataInput/GetGradientModelYearByProductId",
    method: "get",
    data
  })
}

export function GetGradientByAuditFlowId (data: QueryParams) {
  return request({
    url: "/api/services/app/DataInput/GetGradientByAuditFlowId",
    method: "get",
    data
  })
}