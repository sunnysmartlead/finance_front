/**
 * ProjectManagementDto，Nre核价 项目管理部 交互类
 */
export interface NreProjectManageMentData {
  /**
   * 流程Id
   */
  auditFlowId?: number
  /**
   * Nre核价 项目管理部 实体
   */
  projectManagements?: ProjectManagementModel[]
}

/**
 * ProjectManagementModel，Nre核价 项目管理部  模型
 */
export interface ProjectManagementModel {
  /**
   * 手板件费用
   */
  handPieceCost?: HandPieceCostModel[]
  /**
   * 零件的id
   */
  productId?: number
  /**
   * 其他费用
   */
  restsCost?: RestsCostModel[]
  /**
   * 差旅费
   */
  travelExpense?: TravelExpenseModel[]
}

/**
 * HandPieceCostModel，手板件费用 模型
 */
export interface HandPieceCostModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 零件名
   */
  partName?: null | string
  /**
   * 料号
   */
  partNumber?: null | string
  /**
   * 数量
   */
  quantity?: number
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单价
   */
  unitPrice?: number
}

/**
 * RestsCostModel，其他费用 模型
 */
export interface RestsCostModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 项目
   */
  rroject?: null | string
}

/**
 * TravelExpenseModel，差旅费 模型
 */
export interface TravelExpenseModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 费用/天
   */
  costSky?: number
  /**
   * 人数
   */
  peopleCount?: number
  /**
   * 事由外键
   */
  reasonsId?: string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 天数
   */
  skyCount?: number
}

/**
 * ProductDepartmentDto，产品部-电子工程师 录入 交互类
 */
export interface NrePilotprojectsData {
  /**
   * 流程Id
   */
  auditFlowId?: number
  /**
   * 实验费 实体类
   */
  productDepartmentModels?: ProductDepartmentModel[]
}

/**
 * ProductDepartmentModel，产品部-电子工程师 录入 实验费  模型
 */
export interface ProductDepartmentModel {
  /**
   * 实验费 模型
   */
  laboratoryFeeModels?: LaboratoryFeeModel[]
  /**
   * 零件的id
   */
  productId?: number
}

/**
 * LaboratoryFeeModel，实验费 模型
 */
export interface LaboratoryFeeModel {
  /**
   * 总费用
   */
  allCost?: number
  /**
   * 是否指定第三方
   */
  isThirdParty?: boolean
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 实验项目
   */
  testItem?: null | string
  /**
   * 时间
   */
  time?: number
  /**
   * 单价
   */
  unitPrice?: number
  /**
   * 数量
   */
  quantity?: number
}

/**
 * QADepartmentDto，Nre 品保部录入交互类
 */
export interface NreQCDepartmentData {
  /**
   * 流程Id
   */
  auditFlowId?: number
  /**
   * 带零件id 的 品保录入模型
   */
  qaDepartments?: QADepartmentPartModel[]
}

/**
 * QADepartmentPartModel，带零件id 的 品保录入模型
 */
export interface QADepartmentPartModel {
  /**
   * 零件的id
   */
  productId?: number
  /**
   * 品保录入  项目制程QC量检具表 模型
   */
  qaqcDepartments?: QADepartmentQCModel[]
  /**
   * 品保录入  试验项目表 模型
   */
  qaTestDepartments?: QADepartmentTestModel[]
}

/**
 * QADepartmentTestModel，品保录入  试验项目表 模型
 */
export interface QADepartmentTestModel {
  /**
   * 总费用
   */
  allCost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 时间-DV
   */
  dataDV?: number
  /**
   * 时间-PV
   */
  dataPV?: number
  /**
   * 时间-摸底
   */
  dataThoroughly?: number
  /**
   * 是否指定第三方
   */
  isThirdParty?: boolean
  /**
   * 试验项目(根据与客户协定项目)
   */
  projectName?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单位
   */
  unit?: null | string
  /**
   * 单价
   */
  unitPrice?: number
}

/**
 * QADepartmentQCModel，Nre 品保部 录入 项目制程QC 表
 */
export interface QADepartmentQCModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 项目制程QC量检具
   */
  qc?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单价
   */
  unitPrice?: number
  /**
   * 使用工站
   */
  useWorkstation?: null | string
}

/**
 * ProductDepartmentModel，产品部-电子工程师 录入 实验费  模型
 */
export interface ProductDepartmentModel {
  /**
   * 实验费 模型
   */
  laboratoryFeeModels?: LaboratoryFeeModel[]
  /**
   * 零件的id
   */
  productId?: number
}

/**
 * LaboratoryFeeModel，实验费 模型
 */
export interface LaboratoryFeeModel {
  /**
   * 总费用
   */
  allCost?: number
  /**
   * 是否指定第三方
   */
  isThirdParty?: boolean
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 实验项目
   */
  testItem?: null | string
  /**
   * 时间
   */
  time?: number
  /**
   * 单价
   */
  unitPrice?: number
}

/**
 * QADepartmentPartModel，带零件id 的 品保录入模型
 */
export interface QADepartmentPartModel {
  /**
   * 零件的id
   */
  productId?: number
  /**
   * 品保录入  项目制程QC量检具表 模型
   */
  qaqcDepartments?: QADepartmentQCModel[]
  /**
   * 品保录入  试验项目表 模型
   */
  qaTestDepartments?: QADepartmentTestModel[]
}

/**
 * QADepartmentTestModel，品保录入  试验项目表 模型
 */
export interface QADepartmentTestModel {
  /**
   * 总费用
   */
  allCost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 时间-DV
   */
  dataDV?: string | undefined
  /**
   * 时间-PV
   */
  dataPV?: string | undefined
  /**
   * 时间-摸底
   */
  dataThoroughly?: string | undefined
  /**
   * 是否指定第三方
   */
  isThirdParty?: boolean
  /**
   * 试验项目(根据与客户协定项目)
   */
  projectName?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单位
   */
  unit?: null | string
  /**
   * 单价
   */
  unitPrice?: number
}

/**
 * QADepartmentQCModel，Nre 品保部 录入 项目制程QC 表
 */
export interface QADepartmentQCModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 项目制程QC量检具
   */
  qc?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单价
   */
  unitPrice?: number
  /**
   * 使用工站
   */
  useWorkstation?: null | string
}

/**
 * ResourcesManagementModel，Nre核价  资源部录入 模型
 */
export interface ResourcesManagementModel {
  /**
   * 模具清单
   */
  mouldInventory?: MouldInventoryModel[]
  /**
   * 零件的id
   */
  productId?: number
}

/**
 * MouldInventoryModel，模具清单 模型
 */
export interface MouldInventoryModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 结构BOM Id
   */
  id?: number
  /**
   * 模具名称
   */
  modelName?: string | undefined
  /**
   * 模次数
   */
  modelNumber?: number
  /**
   * 模穴数
   */
  moldCavityCount?: number
  /**
   * 单价
   */
  unitPrice?: number
}

/** 营销部 */

/**
 * 录入营销部
 */
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
  cost?: number
}

export interface pricingForm {
  /**
   * 客户名称
   */
  clientName?: null | string
  /**
   * 编制日期
   */
  compilenumber?: number
  handPieceCost?: HandPieceCostModel[]
  /**
   * 实验费 模型
   */
  laboratoryFeeModels?: LaboratoryFeeModel[]
  /**
   * 模具清单 (模具费用)
   */
  mouldInventory?: MouldInventoryModel[]
  /**
   * 项目名称
   */
  projectName?: null | string
  /**
   * 检具费用
   */
  qaqcDepartments?: QADepartmentQCModel[]
  /**
   * 记录编号=>版本号
   */
  recordNumber?: null | string
  /**
   * 产能需求
   */
  requiredCapacity?: null | string
  /**
   * 其他费用
   */
  restsCost?: RestsCostModel[]
  /**
   * (不含税人民币) NRE 总费用
   */
  rmbAllCost?: number
  /**
   * 差旅费
   */
  travelExpense?: TravelExpenseModel[]
  /**
   * (不含税美金) NRE 总费用
   */
  usdAllCost?: number
  showBtn?: boolean
}

/**
 * HandPieceCostModel，手板件费用 模型
 */
export interface HandPieceCostModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 零件名
   */
  partName?: null | string
  /**
   * 料号
   */
  partNumber?: null | string
  /**
   * 数量
   */
  quantity?: number
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单价
   */
  unitPrice?: number
}

/**
 * LaboratoryFeeModel，实验费 模型
 */
export interface LaboratoryFeeModel {
  /**
   * 总费用
   */
  allCost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 时间-DV
   */
  dataDV?: number
  /**
   * 时间-PV
   */
  dataPV?: number
  /**
   * 时间-摸底
   */
  dataThoroughly?: number
  /**
   * 是否指定第三方 (是 true   否 false)
   */
  isThirdParty?: boolean
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 实验项目
   */
  testItem?: null | string
  /**
   * 单位
   */
  unit?: null | string
  /**
   * 单价
   */
  unitPrice?: number
}

/**
 * MouldInventoryModel，模具清单 模型
 */
export interface MouldInventoryModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 模具名称
   */
  modelName?: string | undefined
  /**
   * 模次数
   */
  modelNumber?: number
  /**
   * 模穴数
   */
  moldCavityCount?: number
  /**
   * 结构BOM Id
   */
  structuralId?: number
  /**
   * 单价
   */
  unitPrice?: number
}

/**
 * QADepartmentQCModel，Nre 品保部 录入 项目制程QC 表
 */
export interface QADepartmentQCModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 项目制程QC量检具
   */
  qc?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单价
   */
  unitPrice?: number
  /**
   * 使用工站
   */
  useWorkstation?: null | string
}
/**
 * ExperimentItemsModel，带零件id 的 品保部=>试验项目 录入 模型
 */
export interface ExperimentItemsModel {
  /**
   * 零件的id
   */
  productId?: number
  /**
   * 品保录入  试验项目表 模型
   */
  qaTestDepartments?: QADepartmentTestModel[] | null
}

/**
 * QADepartmentTestModel，品保录入  试验项目表 模型
 */
export interface QADepartmentTestModel {
  /**
   * 总费用
   */
  allCost?: number
  /**
   * 数量
   */
  count?: number
  /**
   * 时间-DV
   */
  dataDV?: string
  /**
   * 时间-PV
   */
  dataPV?: string

  /**
   * 是否指定第三方 (是 true 否 false)
   */
  isThirdParty?: boolean
  /**
   * 试验项目(根据与客户协定项目)
   */
  projectName?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 单位
   */
  unit?: null | string
  /**
   * 单价
   */
  unitPrice?: number
}
/**
 * RestsCostModel，其他费用 模型
 */
export interface RestsCostModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 项目
   */
  rroject?: null | string
}

/**
 * TravelExpenseModel，差旅费 模型
 */
export interface TravelExpenseModel {
  /**
   * 费用
   */
  cost?: number
  /**
   * 费用/天
   */
  costSky?: number
  /**
   * 人数
   */
  peopleCount?: number
  /**
   * 事由外键
   */
  reasonsId?: string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 天数
   */
  skyCount?: number
}
