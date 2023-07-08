import { request } from "@/utils/service"
import qs from "query-string"
import { QueryPublicMaterialWarehouse } from "./data.type"

/** 查询共用物料库 */
export function getQueryPublicMaterialWarehouse(data: QueryPublicMaterialWarehouse) {
  return request({
    url: "/api/services/app/UnitPriceLibrary/GetQueryPublicMaterialWarehouse",
    method: "get",
    data
  })
}

/** 查询共用物料库 */
export function deleteMultiplePublicMaterials(data: any): any {
  return request({
    url: "/api/services/app/UnitPriceLibrary/DeleteMultiplePublicMaterials",
    method: "delete",
    data,
    paramsSerializer: params => qs.stringify(params)
  })
}

/** 导出共用物料库 */
export function exportSharedMaterialWarehouse(): any {
  return request({
    url: "/api/services/app/UnitPriceLibrary/ExportSharedMaterialWarehouse",
    method: "post",
    responseType: "blob"
  })
}
