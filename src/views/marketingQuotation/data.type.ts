/**
 *  报价表  交互类
 */
export interface QuotationListDto {
  /**
   * 报价策略
   */
  biddingStrategy?: BiddingStrategyModel[] | null
  /**
   * 客户性质
   */
  clientNature?: null | string
  /**
   * 核心部件
   */
  coreComponent?: CoreComponentModel[]
  /**
   * 查询日期
   */
  date?: Date
  /**
   * 开发计划
   */
  developmentPlan?: null | string
  /**
   * 直接客户名称
   */
  directCustomerName?: null | string
  /**
   * 汇率
   */
  exchangeRate?: number
  /**
   * 费用表
   */
  expensesStatement?: ExpensesStatementModel[] | null
  /**
   * 销售类型
   */
  forSale?: null | string
  /**
   * 贸易方式
   */
  modeOfTrade?: null | string
  /**
   * 走量信息
   */
  motionMessage?: MotionMessageModel[] | []
  /**
   * Nre费用
   */
  nreCost?: NreCostMessageModel[] | null
  /**
   * 报价形式
   */
  offerForm?: null | string
  /**
   * 付款方式
   */
  paymentMethod?: null | string
  /**
   * 内部核价信息
   */
  pricingMessage?: PricingMessage[]
  /**
   * 项目声明周期
   */
  projectCycle?: number
  /**
   * 项目名称
   */
  projectName?: null | string
  /**
   * 报价币种
   */
  quoteCurrency?: null | string
  /**
   * 记录编号
   */
  recordNumber?: null | string
  /**
   * 样品报价类型
   */
  sampleQuotationType?: null | string
  /**
   * Sop时间
   */
  sopTime?: number
  /**
   * 终端客户性质
   */
  terminalClientNature?: null | string
  /**
   * 终端客户名称
   */
  terminalCustomerName?: null | string
  /**
   * 版本
   */
  versions?: number
}

/**
 * BiddingStrategyModel，报价策略 模型
 */
export interface BiddingStrategyModel {
  /**
   * 成本
   */
  cost?: number
  /**
   * 毛利率
   */
  grossMargin?: number
  /**
   * 模组数量主键
   */
  modelCountId?: number
  /**
   * 价格
   */
  price?: number
  /**
   * 产品
   */
  product?: null | string
}

/**
 * CoreComponentModel，核心部件 模型
 */
export interface CoreComponentModel {
  /**
   * 部件名称
   */
  componentName?: null | string
  /**
   * 模组数量主键
   */
  modelCountId?: number
  /**
   * 零件种类模型
   */
  productSubclass?: ComponenModel[] | null
}

/**
 * ComponenModel，零件 模型
 */
export interface ComponenModel {
  /**
   * 核心部件
   */
  coreComponent?: null | string
  /**
   * 型号
   */
  model?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 类型
   */
  type?: null | string
}

/**
 * ExpensesStatementModel，费用表 模型
 */
export interface ExpensesStatementModel {
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
   * 备注
   */
  remark?: null | string
}

/**
 * MotionMessageModel，走量信息 模型
 */
export interface MotionMessageModel {
  /**
   * 名称
   */
  messageName?: null | string
  /**
   * Sop
   */
  sop?: SopOrValueMode[] | null
}

/**
 * SopOrValueMode，Sop 模型
 */
export interface SopOrValueMode {
  /**
   * 值
   */
  value?: number
  /**
   * SopKey
   */
  year?: number
}

/**
 * NreCostMessageModel，Nre费用信息 模型
 */
export interface NreCostMessageModel {
  /**
   * 模组数量主键
   */
  modelCountId?: number
  /**
   * Nre费用 模型
   */
  nreCostModels?: NreCostModel[] | []
  /**
   * Nre 费用 模组名称
   */
  nreCostModuleName?: string
}

/**
 * NreCostModel，Nre费用 模型
 */
export interface NreCostModel {
  /**
   * 成本
   */
  cost?: number
  /**
   * 名称
   */
  name?: null | string
}

/**
 * PricingMessage，价信息 模型
 */
export interface PricingMessage {
  /**
   * 模组数量主键
   */
  modelCountId?: number
  /**
   * 内部核价信息 模型
   */
  pricingMessageModels?: PricingMessageModel[]
  /**
   * 内部核价信息 模组名称
   */
  pricingMessageName?: string
}

/**
 * PricingMessageModel，内部核价信息 模型
 */
export interface PricingMessageModel {
  /**
   * 成本值
   */
  costValue?: number
  /**
   * 名称
   */
  name?: null | string
}

/**
 * 审批 报价表  交互类
 */
export interface AuditQuotationListDto {
  /**
   * 流程号Id
   */
  auditFlowId?: number
  /**
   * 报价策略
   */
  biddingStrategy?: BiddingStrategyModel[] | null
  /**
   * 客户性质
   */
  clientNature?: null | string
  /**
   * 核心部件
   */
  coreComponent?: CoreComponentModel[] | null
  /**
   * 查询日期
   */
  date?: Date
  /**
   * 开发计划
   */
  developmentPlan?: null | string
  /**
   * 直接客户名称
   */
  directCustomerName?: null | string
  /**
   * 汇率
   */
  exchangeRate?: number
  /**
   * 费用表
   */
  expensesStatement?: ExpensesStatementModel[] | null
  /**
   * 销售类型
   */
  forSale?: null | string
  /**
   * 是否审批通过 0 否 1 是
   */
  isPass?: boolean
  /**
   * 贸易方式
   */
  modeOfTrade?: null | string
  /**
   * 走量信息
   */
  motionMessage?: MotionMessageModel[] | null
  /**
   * Nre费用
   */
  nreCost?: NreCostMessageModel[] | null
  /**
   * 报价形式
   */
  offerForm?: null | string
  /**
   * 付款方式
   */
  paymentMethod?: null | string
  /**
   * 内部核价信息
   */
  pricingMessage?: PricingMessage[] | null
  /**
   * 项目声明周期
   */
  projectCycle?: number
  /**
   * 项目名称
   */
  projectName?: null | string
  /**
   * 报价币种
   */
  quoteCurrency?: null | string
  /**
   * 记录编号
   */
  recordNumber?: null | string
  /**
   * 样品报价类型
   */
  sampleQuotationType?: null | string
  /**
   * Sop时间
   */
  sopTime?: number
  /**
   * 终端客户性质
   */
  terminalClientNature?: null | string
  /**
   * 终端客户名称
   */
  terminalCustomerName?: null | string
  /**
   * 版本
   */
  versions?: number
}
