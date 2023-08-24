import { request } from "@/utils/service"

// BOM单价审核 加载电子料结构件初始值(单个零件)
export function GetBOMElectronicSingle(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/ResourceEntering/GetBOMElectronicSingle",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}

// BOM单价审核 加载结构料初始值(单个零件)
export function GetBOMStructuralSingle(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/ResourceEntering/GetBOMStructuralSingle",
    method: "get",
    data: {
      auditFlowId,
      solutionId
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
