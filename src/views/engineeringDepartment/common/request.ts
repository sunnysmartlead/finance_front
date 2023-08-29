import { request } from "@/utils/service";

/** 查询损耗率 */
export function LossRateQuery(data: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/LossRateQuery",
    method: "post",
    data
  })
}

/** 导入损耗率 */
export function LossRateImport(data: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/LossRateImport",
    method: "post",
    data,
    responseType: "blob"
  })
}

/** 导出损耗率模板 */
export function ExportOfLossRateTemplate(data: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/ExportOfLossRateTemplate",
    method: "post",
    data,
    responseType: "blob"
  })
}

/** 导出损耗率 */
export function LossRateExport(data: any) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/LossRateExport",
    method: "post",
    data,
    responseType: "blob"
  })
}
