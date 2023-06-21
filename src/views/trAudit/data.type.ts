export interface TRMainSolutionState {
  /**
   * 审核流程Id
   */
  auditFlowId?: number | string
  /**
   * TR主方案审核意见
   */
  isAgree?: boolean
  trCheckType?: number
  opinionDescription: string
}
