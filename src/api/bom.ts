import { request } from "@/utils/service"
export interface SaveBOM {
  /**
   * 每托盘箱数
   */
  boxesPerPallet?: null | string
  electronicBomDtos?: ElectronicBOMDto[] | null
  /**
   * 内包装高
   */
  innerPackagingHeight?: null | string
  /**
   * 内包装长
   */
  innerPackagingLength?: null | string
  /**
   * 内包装宽
   */
  innerPackagingWidth?: null | string
  /**
   * 是否打托
   */
  isHit?: null | string
  /**
   * 外包装高
   */
  outerPackagingHeight?: null | string
  /**
   * 外包装长
   */
  outerPackagingLength?: null | string
  /**
   * 外包装宽
   */
  outerPackagingWidth?: null | string
  /**
   * 零件号
   */
  partNumber?: null | string
  /**
   * 零件id
   */
  productId?: null | string | number
  /**
   * 3D爆炸图名字
   */
  pictureName?: null | string
  /**
   * 3D爆炸图路径
   */
  picturePath?: null | string
  /**
   * 流程号
   */
  auditFlowId?: null | string | number
  /**
   * 单箱包装数量
   */
  quantityPerBox?: null | string
  /**
   * 备注
   */
  remarks?: null | string
  /**
   * 客户特殊性需求
   */
  requirement?: null | string
  /**
   * 单箱数量
   */
  singleBoxQuantity?: null | string
  /**
   * 单个产品重量
   */
  singleProductWeight?: null | string
  /**
   * SOR附件名称
   */
  sorName?: null | string
  /**
   * SOR附件路径
   */
  sorPath?: null | string
  structureBomDtos?: StructureBOMDto[] | null
}

/**
 * ElectronicBomDto
 */
export interface ElectronicBOMDto {
  /**
   * 装配数量
   */
  assemblyQuantity?: number
  /**
   * 物料大类
   */
  categoryName?: null | string
  /**
   * 封装(需要体现PAD的数量)
   */
  encapsulationSize?: null | string
  /**
   * 序号
   */
  idNumber?: number
  /**
   * 是否涉及（必填）
   */
  isInvolveItem?: null | string
  /**
   * 零件号
   */
  partNumber?: null | string
  /**
   * 流程号
   */
  auditFlowId?: null | string
  sapItemName?: null | string
  /**
   * 物料编号（SAP）
   */
  sapItemNum?: null | string
  /**
   * 物料种类
   */
  typeName?: null | string
}

/**
 * StructureBomDto
 */
export interface StructureBOMDto {
  /**
   * 装配数量
   */
  assemblyQuantity?: number
  /**
   * 物料大类
   */
  categoryName?: null | string
  /**
   * 关键尺寸精度及重要要求
   */
  dimensionalAccuracyRemark?: null | string
  /**
   * 图号名称
   */
  drawingNumName?: null | string
  /**
   * 序号
   */
  id?: number
  /**
   * 是否涉及（必填）
   */
  isInvolveItem?: null | string
  /**
   * 是否新开模
   */
  isNewMouldProduct?: null | string
  /**
   * 材料
   */
  materialName?: null | string
  /**
   * 成型工艺
   */
  moldingProcess?: null | string
  /**
   * 外形尺寸mm
   */
  overallDimensionSize?: null | string
  /**
   * 零件号
   */
  partNumber?: null | string
  /**
   * 流程号
   */
  auditFlowId?: null | string
  /**
   * 物料编号（SAP）
   */
  sapItemNum?: null | string
  /**
   * 二次加工方法
   */
  secondaryProcessingMethod?: null | string
  /**
   * 超级大种类
   */
  superTypeName?: null | string
  /**
   * 表面处理
   */
  surfaceTreatmentMethod?: null | string
  /**
   * 物料种类
   */
  typeName?: null | string
  /**
   * 重量g
   */
  weightNumber?: number
}

export function SaveElectronicBom(data: SaveBOM) {
  return request({
    url: "/api/services/app/ElectronicBom/SaveElectronicBom",
    method: "post",
    data
  })
}
export function DownloadFile(num: number) {
  return request({
    url: "/api/services/app/ExcekExport/DownloadFile",
    method: "post",
    responseType: "blob",
    params: {
      num
    },
    data: {
      num
    }
  })
}

export function CommonDownloadFile(fileId: number | null) {
  return request({
    url: "/api/services/app/FileCommonService/DownloadFile",
    method: "get",
    responseType: "blob",
    data: {
      fileId
    }
  })
}
export function SaveStructionBom(data: SaveBOM) {
  return request({
    url: "/api/services/app/StructionBom/SaveStructionBom",
    method: "post",
    data
  })
}
export function SaveProductDevelopmentInput(data: SaveBOM) {
  return request({
    url: "/api/services/app/ProductDevelopmentInput/SaveProductDevelopmentInput",
    method: "post",
    data
  })
}
export function GetStructionBom(data: any) {
  return request({
    url: "/api/services/app/StructionBom/FindStructureBomByProcess",
    method: "post",
    data
  })
}
export function GetElectronicBom(data: any) {
  return request({
    url: "/api/services/app/ElectronicBom/FindElectronicBomByProcess",
    method: "post",
    data
  })
}

export function getBomTemplate() {
  return request({
    url: "/api/services/app/FileCommonService/DownloadStructionBom",
    method: "post",
    responseType: "blob"
  })
}

export function SetBomState(data: any) {
  return request({
    url: "/api/services/app/BomCheck/SetBomState",
    method: "post",
    data
  })
}
export function getProductDevelopmentInput(data: any) {
  return request({
    url: "/api/services/app/ProductDevelopmentInput/PostProductDevelopmentInput",
    method: "post",
    data
  })
}
