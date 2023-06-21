export interface auditFlowInfo {
  auditFlowId: number
  productId: number
}

/**
 * LossRateListDto，损耗率表Dto
 */
export interface LossRateListDto {
  /**
   * 流程表流程号
   */
  auditFlowId?: number
  /**
   * 损耗率表
   */
  lossRateDtoList?: LossRateDto[] | null
  /**
   * 零件号
   */
  productId?: number
}

/**
 * LossRateDto，损耗率模块Dto
 */
export interface LossRateDto {
  /**
   * 流程表流程号
   */
  auditFlowId?: number
  /**
   * 物料大类
   */
  categoryName?: null | string
  /**
   * 序号
   */
  idNumber?: number
  /**
   * 年份
   */
  lossRateYearList?: LossRateYearDto[] | null
  /**
   * 产品名称（零件1，零件2...）
   */
  product?: null | string
  /**
   * 零件号
   */
  productId?: number
  /**
   * 超级大种类
   */
  superType?: null | string
}

/**
 * LossRateYearDto，损耗率年份类
 */
export interface LossRateYearDto {
  /**
   * 损耗率值
   */
  rate?: number | string
  /**
   * 损耗率年份
   */
  year?: number | string
}
