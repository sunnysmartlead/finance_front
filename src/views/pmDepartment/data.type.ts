/**
 * ProductControlInputDto
 */
export interface SaveProductionControlInfo {
  auditFlowId?: number
  infoList?: ProductionControlInfo[] | null
  productId?: number
}

/**
 * ProductionControlInfo
 */
export interface ProductionControlInfo {
  freight?: number
  id?: number
  monthEndDemand?: number
  perFreight?: number
  perPackagingPrice?: number
  perTotalLogisticsCost?: number
  storageExpenses?: number
  year?: null | string
}

export interface productParams {
  auditFlowId: number
  productId: number
}
