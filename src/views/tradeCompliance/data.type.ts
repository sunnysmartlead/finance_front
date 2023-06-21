/**
 * 贸易合规判定界面Dto
 */
export interface TradeComplianceCheckDto {
  /**
   * 是否成功标志位
   */
  isSuccess?: boolean
  /**
   * 错误信息
   */
  messsage?: null | string
  /**
   * 产品组成物料信息表
   */
  productMaterialInfos?: ProductMaterialInfo[] | null
  tradeComplianceCheck?: TradeComplianceCheck
}

/**
 * ProductMaterialInfo
 */
export interface ProductMaterialInfo {
  amount?: number
  auditFlowId?: number
  controlStateType?: null | string
  count?: number
  creationTime?: Date
  creatorUserId?: number | null
  deleterUserId?: number | null
  deletionTime?: Date | null
  id?: number
  isDeleted?: boolean
  lastModificationTime?: Date | null
  lastModifierUserId?: number | null
  materialCode?: null | string
  materialName?: null | string
  tradeComplianceCheckId?: number
  unitPrice?: number
}

/**
 * TradeComplianceCheck
 */
export interface TradeComplianceCheck {
  amountPricePercent?: number
  analysisConclusion?: null | string
  auditFlowId?: number
  country?: string
  creationTime?: Date
  creatorUserId?: number | null
  deleterUserId?: number | null
  deletionTime?: Date | null
  eccnPricePercent?: number
  id?: number
  isDeleted?: boolean
  lastModificationTime?: Date | null
  lastModifierUserId?: number | null
  pendingPricePercent?: number
  productFairValue?: number
  productId?: number
  productName?: string
  productType?: string
}
