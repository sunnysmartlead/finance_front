export interface User {
  date: string
  name: string
  address: string
  pcsYearList?: Array<Object>
}

export const productTypeMap = {
  recommend: "TypeSelect_Recommend", // 我司推荐1
  cspecify: "TypeSelect_Appoint", // 客户指定2
  csupply: "TypeSelect_Supply", // 客户供应3
  cask:"TypeSelect_Ask" //客户要求
}
export const updateFrequency = {
  HalfYear: "UpdateFrequency_HalfYear", // 半年份
  Year: "UpdateFrequency_Year"
}

/**
 * PriceEvaluationStartInput，PriceEvaluationStart 方法的输入参数
 */
export interface InputModal {
  /**
   *
   * 设备费分摊（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【AllocationOfEquipmentCost】）
   */
  allocationOfEquipmentCost: boolean
  /**
   * 治具费分摊
   * （字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【AllocationOfFixtureCost】）
   */
  allocationOfFixtureCost: boolean
  /**
   * 模具费分摊
   * （字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【AllocationOfMouldCost】）
   */
  allocationOfMouldCost: boolean
  /**
   *
   * 报价币种（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【Currency】）
   */
  currency: number
  /**
   * 客户名称
   */
  customerName: string
  /**
   *
   * 客户性质（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【CustomerNature】）
   */
  customerNature: number | null
  /**
   * 客户特殊性要求
   */
  customerSpecialRequest?: null | string
  /**
   * 客户目标价
   */
  customerTargetPrice: number | null
  /**
   * 要求核价完成时间
   */
  deadline: Date | undefined
  /**
   *
   * 开发费分摊（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【DevelopmentCost】）
   */
  developmentCost: boolean
  /**
   * 拟稿日期
   */
  draftDate: Date
  /**
   * 拟稿人
   */
  drafter: string
  /**
   * 拟稿人工号
   */
  drafterNumber: number | null
  /**
   * 拟稿公司
   */
  draftingCompany: string
  /**
   * 拟稿部门
   */
  draftingDepartment: string
  /**
   * 汇率
   */
  exchangeRate: number
  /**
   *
   * 落地工厂（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【LandingFactory】）
   */
  landingFactory: number
  /**
   * 模组数量
   */
  modelCount: CreateModelCountDto[]
  /**
   * 单据编号
   */
  number: string
  /**
   *
   * 包装方式（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【PackagingType】）
   */
  packagingType: number
  /**
   * 付款方式
   */
  paymentMethod: string
  /**
   * 终端走量（PCS）
   */
  pcs: CreatePcsDto[]
  /**
   * 交货地点
   */
  placeOfDelivery: string
  /**
   * 产品信息（【产品信息】和【客户指定/供应详情】是同一张表的不同展示形式）
   */
  productInformation?: CreateProductInformationDto[] | null
  /**
   * 项目代码
   */
  projectCode: string
  /**
   * 项目周期（年）
   */
  projectCycle: number
  /**
   * 项目经理（User表的Id）
   */
  projectManager: number
  /**
   * 项目名称
   */
  projectName: string
  /**
   *
   * 报价形式（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【QuotationType】）
   */
  quotationType: number
  /**
   *
   * 信赖性费用分摊（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【ReliabilityCost】）
   */
  reliabilityCost: boolean
  /**
   * 要求
   */
  requirement: CreateRequirementDto[]
  /**
   *
   * 销售类型（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【SalesType】）
   */
  salesType: number
  /**
   *
   * 样品报价类型（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【SampleQuotationType】）
   */
  // sampleQuotationType: number
  /**
   *
   * 运输方式（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【ShippingType】）
   */
  shippingType: number
  /**
   * Sop时间（年份）
   */
  sopTime: number
  /**
   * SOR附件上传
   */
  sorFile: number[]
  /**
   * 终端名称
   */
  terminalName: string
  /**
   *
   * 终端性质（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TerminalNature】）
   */
  terminalNature: number
  /**
   * 标题
   */
  title: string
  /**
   * 贸易方式
   */
  tradeMode: string
  /**
   * 流程id
   */
  auditFlowId: number
}

/**
 * CreateModelCountDto，创建 模组数量 的参数
 */
export interface CreateModelCountDto {
  /**
   * 市场份额（%）
   */
  marketShare: number
  /**
   * 年份
   */
  modelCountYearList: CreateModelCountYearDto[]
  /**
   * 模组总量
   */
  modelTotal: number
  /**
   * 模组搭载率
   */
  moduleCarryingRate: number
  /**
   * 序号（正序排序，从1开始）
   */
  order: number
  /**
   * 客户零件号
   */
  partNumber?: null | string
  /**
   *
   * 产品（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【Product】）
   */
  product: number
  /**
   *
   * 产品小类（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【ProductType】）
   */
  productType: number
  /**
   * 单车产品数量
   */
  singleCarProductsQuantity: number
}

/**
 * CreateModelCountYearDto，创建 终端走量年份 的参数
 */
export interface CreateModelCountYearDto {
  /**
   * 数量
   */
  quantity: number
  /**
   * 年份
   */
  year: number
}

/**
 * CreatePcsDto，创建Pcs的Dto
 */
export interface CreatePcsDto {
  /**
   * 车厂
   */
  carFactory: string
  /**
   * 车型
   */
  carModel: string
  /**
   * 年份
   */
  pcsYearList: CreatePcsYearDto[]
}

/**
 * CreatePcsYearDto，创建Pcs年份的Dto
 */
export interface CreatePcsYearDto {
  /**
   * 数量
   */
  quantity: number
  /**
   * 年份
   */
  year: number
}

/**
 * CreateProductInformationDto，创建产品信息Dto
 */
export interface CreateProductInformationDto {
  /**
   * 品牌/型号
   */
  brandModel?: null | string
  /**
   * 核心部件
   */
  coreName: string
  /**
   * 零件名称
   */
  name: string
  /**
   * 单价
   */
  price?: number | null
  /**
   * 制程
   */
  productionProcess: string
  /**
   *
   * 类型选择（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TypeSelect】）
   */
  typeSelect: number
}

/**
 * CreateRequirementDto，创建 要求 的 Dto
 */
export interface CreateRequirementDto {
  /**
   * 年降率（%）
   */
  annualDeclineRate: number
  /**
   * 年度返利要求（金额）
   */
  annualRebateRequirements: number
  /**
   * 一次性折让率（%）
   */
  oneTimeDiscountRate: number
  /**
   * 年份
   */
  year: number
}

export interface RatePage {
  /**
   * 货币币种
   */
  exchangeRateKind?: string
  maxResultCount: number
  skipCount: number
}

// pcs 数据类型
export interface Pcs {
  carFactory: String
  carModel: String
  pcsYearList: YearListItem[]
  rowSum?: Number
}
export interface YearListItem {
  year: any
  quantity: string | number | null
  upDown:number
}
export interface modelCount {
  partNumber: string | null | number
  product: string
  productType: number
  marketShare: number
  moduleCarryingRate: number
  singleCarProductsQuantity: number
  modelTotal: number
  modelCountYearList: YearListItem[]
}

//产品零件
export interface productModel {
  /**
   * 线缆
   */
  cable: string
  /**
   * 目标价
   */
  customerTargetPrice?: number | null | string
  /**
   * 线缆 单价
   */
  cablePrice?: number | null
  /**
   * 线缆
   * 类型选择（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TypeSelect】）
   */
  cableTypeSelect: number
  /**
   * 安装位置
   */
  installationPosition: string
  /**
   * LED
   */
  led: string
  /**
   * LED 单价
   */
  ledPrice?: number | null
  /**
   * LED
   * 类型选择（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TypeSelect】）
   */
  ledTypeSelect: number
  /**
   * Lens
   */
  lens: string
  /**
   * Lens单价
   */
  lensPrice?: number | null
  /**
   *
   * Lens类型选择（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TypeSelect】）
   */
  lensTypeSelect: number
  /**
   * isp
   */
  isp: string
  /**
   * Lsp单价
   */
  ispPrice?: number | null
  /**
   *
   * Lsp类型选择（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TypeSelect】）
   */
  ispTypeSelect: number
  /**
   * 制程
   */
  manufactureProcess: string
  /**
   * 产品名称
   */
  name: string
  /**
   * 产品名称关联字段，类似id 不展示
   */
  product: string
  /**
   * Sensor
   */
  sensor: string
  /**
   * Sensor单价
   */
  sensorPrice?: number | null
  /**
   *
   * Sensor类型选择（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TypeSelect】）
   */
  sensorTypeSelect: number
  /**
   * 串行芯片
   */
  serialChip: string
  /**
   * 串行芯片 单价
   */
  serialChipPrice?: number | null
  /**
   * 串行芯片
   * 类型选择（字典明细表主键，根据字典名，调用【FinanceDictionary/GetFinanceDictionaryAndDetailByName】取字典，字典名Name是【TypeSelect】）
   */
  serialChipTypeSelect: number
}

//指定
export interface specifyModel {
  main: string
  price: number | null | undefined
  productName: string
  type: string
  productType: string
}

export interface requireData {
  annualDeclineRate: Number
  annualRebateRequirements: Number
  oneTimeDiscountRate: Number
  year: Number
}
