/**
 * LossCost，损耗成本
 */
export interface LossCost {
  id?: number
  /**
   * MOQ分摊成本
   */
  moqShareCount?: number
  /**
   * 成本项目名称（损耗率、电子料等等）
   */
  name?: null | string
  /**
   * 损耗成本
   */
  wastageCost?: number
}

// 获取损耗成本
export interface GetLossCostProps {
  /**
   * 审批流程主表Id
   */
  AuditFlowId?: number
  /**
   * 模组数量Id（即零件Id）
   */
  ModelCountId?: number
  /**
   * 年份
   */
  Year?: string
}

/**
 * ManufacturingCost，制造成本
 */
export interface ManufacturingCost {
  /**
   * 梯度K/Y（模组数量）
   */
  gradientKy?: number
  id?: number
  manufacturingCostDirect?: ManufacturingCostDirect
  manufacturingCostIndirect?: ManufacturingCostIndirect
}

/**
 * ManufacturingCostDirect，直接制造成本
 */
export interface ManufacturingCostDirect {
  /**
   * 直接制造成本：直接人工
   */
  directLabor?: number
  /**
   * 直接制造成本：设备折旧
   */
  equipmentDepreciation?: number
  id?: number
  /**
   * 直接制造成本：换线成本
   */
  lineChangeCost?: number
  /**
   * 直接制造成本：制造费用
   */
  manufacturingExpenses?: number
  /**
   * 小计
   */
  subtotal?: number
}

/**
 * ManufacturingCostIndirect，间接制造成本
 */
export interface ManufacturingCostIndirect {
  /**
   * 间接制造成本：直接人工
   */
  directLabor?: number
  /**
   * 间接制造成本：设备折旧
   */
  equipmentDepreciation?: number
  id?: number
  /**
   * 间接制造成本：制造费用
   */
  manufacturingExpenses?: number
  /**
   * 小计
   */
  subtotal?: number
}

/**
 * ModelCountSelectListDto，核价看板产品选择下拉框返回值（返回的Id，为ModelCountId，即模组/产品/零件的Id）
 */
export interface ModelCountSelectListDto {
  id?: number
  /**
   * 产品名称
   */
  productName?: null | string
}

/**
 * YearListDto，核价看板产品选择下拉框下拉数据接口 返回的年份信息
 * Id是年份值，为【2022、2023、2024】。Name为年份显示名称，为【全生命周期、2022年、2023年、2024年】
 */
export interface YearListDto {
  id?: number
  /**
   * 年份名称
   */
  name?: null | string
}

/**
 *  ，设置投入量方法 参数输入
 */
export interface SetPriceEvaluationTableInputCountType {
  /**
   * 审批流程主表Id
   */
  auditFlowId: number
  /**
   * 模组数量
   */
  modelCountInputCount: ModelCountInputCount[]
}

/**
 * ModelCountInputCount，模组投入数量
 */
export interface ModelCountInputCount {
  /**
   * 投入量
   */
  inputCount: number
  /**
   * 模组数量Id（即零件Id）
   */
  modelCountId: number
  /**
   * 年份
   */
  year: number
}
