export interface TableRow {
  assemblyQuantity?: number
  categoryName?: null | string
  creationTime?: Date
  creatorUserId?: number | null
  deleterUserId?: number | null
  deletionTime?: Date | null
  encapsulationSize?: null | string
  id?: number
  idNumber?: number
  isDeleted?: boolean
  isInvolveItem?: null | string
  lastModificationTime?: Date | null
  lastModifierUserId?: number | null
  partNumber?: null | string
  auditFlowId?: null | string
  sapItemName?: null | string
  sapItemNum?: null | string
  typeName?: null | string
}

/**
 * 保存切线工时
 */
export interface TangentSaveDto {
  /**
   * 流程表ID
   */
  auditFlowId?: number
  /**
   * 是否成功标志位
   */
  isSuccess?: boolean
  /**
   * 错误信息
   */
  message?: null | string
  /**
   * MoudelCount表id
   */
  productId?: number
  tangentHoursDetailList?: TangentHoursDetail[] | null
  /**
   * UPH
   */
  uph?: number
}

/**
 * TangentHoursDetail
 */
export interface TangentHoursDetail {
  /**
   * 标准人工工时
   */
  laborTime?: number
  /**
   * 标准机器工时
   */
  machineHours?: number
  /**
   * 人员数量
   */
  personnelNumber?: number
  /**
   * 标准人工工时
   */
  year?: number
}
