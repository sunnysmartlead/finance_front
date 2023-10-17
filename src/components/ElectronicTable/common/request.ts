import { request } from "@/utils/service"
import { ElectronicDto, ConstructionModel } from "../data.type"

// 资源部输入时,加载电子料结构件初始值
export function GetElectronic(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/ResourceEntering/GetElectronicSingle",
    method: "get",
    data: { auditFlowId, solutionId }
  })
}

// 计算电子料单价录入 根据汇率计算
export function PostElectronicMaterialCalculate(data: ElectronicDto[]): any {
  return request({
    url: "/api/services/app/ResourceEntering/PostElectronicMaterialCalculateSingle",
    method: "post",
    data
  })
}

// 计算电子料单价录入
export function PosToriginalCurrencyCalculate(data: ElectronicDto[]): any {
  return request({
    url: "/api/services/app/ResourceEntering/ElectronicMaterialUnitPriceInputCalculation",
    method: "post",
    data
  })
}

// 电子料单价录入录入确认/提交 有则添加无则修改
export function PostElectronicMaterialEntering(data: {
  isSubmit: number
  electronicDtoList: ElectronicDto[]
  auditFlowId: number
  opinion: string
  nodeInstanceId: any
}): any {
  return request({
    url: "/api/services/app/ResourceEntering/PostElectronicMaterialEntering",
    method: "post",
    data
  })
}

// 资源部输入时,加载结构料初始值
export function GetStructural(data: any): any {
  return request({
    url: "/api/services/app/ResourceEntering/GetStructuralSingle",
    method: "get",
    data
  })
}

// 结构件单价录入提交 有则添加无则修改
export function PostStructuralMemberEntering(data: {
  isSubmit: number
  structuralMaterialEntering: ConstructionModel[]
  auditFlowId: number
  opinion: string
  nodeInstanceId: any
}): any {
  return request({
    url: "/api/services/app/ResourceEntering/PostStructuralMemberEntering",
    method: "post",
    data
  })
}

// 计算结构料单价录入 ==>根据原币计算
export function ToriginalCurrencyStructural(data: ElectronicDto): any {
  return request({
    url: "/api/services/app/ResourceEntering/PosToriginalCurrencyStructuralSingle",
    method: "post",
    data
  })
}

// 计算结构料单价录入
export function PostStructuralMaterialCalculate(data: ElectronicDto): any {
  return request({
    url: "/api/services/app/ResourceEntering/CalculationOfStructuralMaterials",
    method: "post",
    data
  })
}

// 查看项目走量(获取某流程的项目走量)
export function GetProjectGoQuantity(data: { Id: number }): any {
  return request({
    url: "/api/services/app/ResourceEntering/GetProjectGoQuantity",
    method: "get",
    data
  })
}

// Bom审核
export function SetBomState(data: any): any {
  return request({
    url: "/api/services/app/BomCheck/SetBomState",
    method: "post",
    data
  })
}

// Bom审核 新
export function BomReview(data: any): any {
  return request({
    url: "/api/services/app/ResourceEntering/BOMUnitPriceReview",
    method: "post",
    data
  })
}

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

// 电子单价复制信息获取接口
export function ElectronicUnitPriceCopyingInformationAcquisition(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/ResourceEntering/ElectronicUnitPriceCopyingInformationAcquisition",
    method: "post",
    data: {
      auditFlowId,
      solutionId,
    }
  })
}

// 电子料单价复制信息录入确认/提交
export function PostElectronicMaterialEnteringCopy(data: any): any {
  return request({
    url: "/api/services/app/ResourceEntering/PostElectronicMaterialEnteringCopy",
    method: "post",
    data
  })
}

// 结构单价复制信息获取接口
export function StructureUnitPriceCopyingInformationAcquisition(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/ResourceEntering/StructureUnitPriceCopyingInformationAcquisition",
    method: "post",
    data: {
      auditFlowId,
      solutionId,
    }
  })
}

// 结构件单价复制信息录入确认/提交
export function PostStructuralMemberEnteringCopy(data: any): any {
  return request({
    url: "/api/services/app/ResourceEntering/PostStructuralMemberEnteringCopy",
    method: "post",
    data
  })
}
