export interface NreMarketingDepartmentModel {
  /**
   * 表单名称  如{手板件费用,模具费,生产设备费}
   */
  formName?: null | string
  /**
   * 报价系数
   */
  offerCoefficient?: number
  /**
   * 报价金额
   */
  offerMoney?: number
  /**
   * 核价金额
   */
  pricingMoney?: number
  /**
   * 流程Id
   */
  auditFlowId?: number
  /**
   * 备注
   */
  remark?: null | string
}
