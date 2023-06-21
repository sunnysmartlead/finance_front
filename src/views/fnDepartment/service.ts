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
export function getQualityCost() {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/GetQualityCost",
    method: "get"
  })
}

/** 保存质量成本比例录入 */
export function saveQualityCost(qualityCostList: QualityCostProportionEntryInfo[]) {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/SaveQualityCost",
    method: "post",
    data: {
      qualityCostList
    }
  })
}

/** 保存制造成本里计算字段参数维护*/
export function saveManufacturingCost(data: ManufacturingCostsInfo) {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/SaveManufacturingCost",
    method: "post",
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
export function SaveRateEntryInput(data: RateEntryDto): Promise<any> {
  return request({
    url: "/api/services/app/FinanceDepartmentInput/SaveRateEntryInput",
    method: "post",
    data
  })
}
