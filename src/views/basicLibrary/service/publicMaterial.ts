import { request } from "@/utils/service"
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
export function deleteMultiplePublicMaterials(data: { ids: string[] }): any {
  return request({
    url: "/api/services/app/UnitPriceLibrary/DeleteMultiplePublicMaterials",
    method: "delete",
    data
  })
}

/** 导出共用物料库 */
export function exportSharedMaterialWarehouse(data: any): any {
  return request({
    url: "/api/services/app/UnitPriceLibrary/ExportSharedMaterialWarehouse",
    method: "post",
    data
  })
}
