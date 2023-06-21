import { request } from "@/utils/service"

// BOM单价审核 加载电子料结构件初始值(单个零件)
export function GetBOMElectronicSingle(auditFlowId: number, productId: number): any {
  return request({
    url: "/api/services/app/ResourceEntering/GetBOMElectronicSingle",
    method: "get",
    data: {
      auditFlowId,
      productId
    }
  })
}
// BOM单价审核 加载结构料初始值(单个零件)
export function GetBOMStructuralSingle(auditFlowId: number, productId: number): any {
  return request({
    url: "/api/services/app/ResourceEntering/GetBOMStructuralSingle",
    method: "get",
    data: {
      auditFlowId,
      productId
    }
  })
}

// Bom审核
export function SetBomState(data: {
  auditFlowId: number
  bomCheckType: number
  isAgree: boolean
  opinionDescription: string
  unitPriceId:Array<number>
  peopleId:Array<number>
}): any {
  return request({
    url: "/api/services/app/BomCheck/SetBomState",
    method: "post",
    data
  })
}
