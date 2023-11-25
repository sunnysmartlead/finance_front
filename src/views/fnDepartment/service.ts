import { request } from "@/utils/service"
import {
  RatePage,
  RateItem,
  UnitPage,
  GrossMarginPage,
  GrossMarginParams,
  QualityCostProportionEntryInfo,
  ManufacturingCostsInfo,
  RateEntryDto
} from "./data.type"

/** 查询汇率 */
export function getExchangeRate(data: RatePage) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/GetExchangeRate",
    method: "get",
    data
  })
}

/** 创建修改汇率 */
export function saveExchangeRate(data: RateItem) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/PostExchangeRate",
    method: "post",
    data
  })
}
export function deleteExchangeRate(id: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/DeleteExchangeRate",
    method: "delete",
    data: {
      id
    }
  })
}
/** 查询单价库*/
export function getUInitPrice(data: UnitPage) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/GetGainUInitPriceForm",
    method: "get",
    data
  })
}

/** 创建修改毛利率 */
export function saveGrossMargin(data: GrossMarginParams) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/PostGrossMargin",
    method: "post",
    data
  })
}
/** 删除毛利率 */
export function deleteGrossMargin(id: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/DeleteGrossMargin",
    method: "delete",
    data: {
      id
    }
  })
}

/** 查询毛利率 */
export function getGrossMargin(data: GrossMarginPage) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/GetGrossMargin",
    method: "get",
    data
  })
}
/** 获取质量成本比例录入 */
export function getQualityCost(data: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/QueryQualityCostRatio",
    method: "post",
    data,
  })
}

/** 保存质量成本比例录入 */
export function saveQualityCost(data: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/QualityCostRatioSubmission",
    method: "post",
    data
  })
}

/** 保存制造成本里计算字段参数维护*/
export function saveManufacturingCost(data: any) {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/SaveManufacturingCost",
    method: "post",
    data
  })
}
/** 保存制造成本里计算字段参数维护*/
export function ModifyManufacturingCost(data: any) {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/ModifyManufacturingCost",
    method: "post",
    data
  })
}

/** 删除制造成本里计算字段参数维护*/
export function DelManufacturingCost(data: any) {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/DelManufacturingCost",
    method: "get",
    data
  })
}


/** 获取制造成本里计算字段参数维护*/
export function getManufacturingCost() {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/GetManufacturingCost",
    method: "get"
  })
}

/** 获取费率录入 */
export function GetRateEntry(): Promise<any> {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/GetRateEntry",
    method: "get"
  })
}

/** 保存费率录入 */
export function SaveRateEntryInput(data: any): Promise<any> {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/SaveRateEntryInput",
    method: "post",
    data
  })
}


/** 修改作业价格 */
export function ModifyRateEntryInput(data: any): Promise<any> {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/ModifyRateEntryInput",
    method: "post",
    data
  })
}

/** 删除作业价格 */
export function DelRateEntryInput(data: any): Promise<any> {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/DelRateEntryInput",
    method: "get",
    data
  })
}


// 下载核心器件、Nre费用拆分
export function GetDownloadCoreComponentAndNre(data: any): any {
  return request({
    url: "/api/services/app/AnalyseBoardSecond/GetDownloadCoreComponentAndNre",
    method: "get",
    data,
    responseType: "blob"
  })
}
