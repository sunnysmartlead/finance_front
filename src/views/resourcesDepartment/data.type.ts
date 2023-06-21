/**
 * ResourceDepartmentDto，资源部录入时  加载初始值
 */
export interface ElectronicStructuralModel {
  /**
   * 结构BOM单价表单
   */
  constructionBomList?: ConstructionDto[] | null
  /**
   * 电子BOM单价表单
   */
  electronicBomList?: ElectronicDto[] | null
  /**
   * 零件
   */
  partDtoList?: PartModel[] | null
}

/**
 * 结构BOM单价
 */
export interface ConstructionDto {
  /**
   * 零件的名称
   */
  parName?: null | string
  /**
   * 零件的id
   */
  productId?: null | string
  /**
   * 结构料
   */
  structureMaterial?: ConstructionModel[]
  /**
   * 超级大种类  结构料 胶水等辅材 SMT外协 包材
   */
  superTypeName?: string
}

/**
 * ConstructionModel，结构BOM表单
 */
export interface ConstructionModel {
  productId: number
  /**
   * 物料大类
   */
  categoryName?: null | string
  /**
   * 币种
   */
  currency?: null | string
  /**
   * 关键尺寸精度及重要要求
   */
  dimensionalAccuracyRemark?: null | string
  /**
   * 图号名称
   */
  drawingNumName?: null | string
  /**
   * 结构料BOM Id
   */
  id?: number
  /**
   * 材料
   */
  materialName?: null | string
  /**
   * 系统单价（原币）
   */
  materialsSystemPrice?: number
  /**
   * 成型工艺
   */
  moldingProcess?: null | string
  /**
   * 外形尺寸mm
   */
  overallDimensionSize?: null | string
  /**
   * 物料编号（SAP）
   */
  sapItemNum?: null | string
  /**
   * 二次加工方法
   */
  secondaryProcessingMethod?: null | string
  /**
   * Sop
   */
  sop?: YearOrValueMode[] | null
  /**
   * 表面处理
   */
  surfaceTreatmentMethod?: null | string
  /**
   * 物料种类
   */
  typeName?: null | string
  /**
   * 重量g
   */
  weightNumber?: null | string
  peopleId: number
  peopleName: string
  isEntering?: boolean
  isSubmit?: boolean
  isEdit?: false
}

/**
 * YearOrValueMode
 */
export interface YearOrValueMode {
  /**
   * 值
   */
  value: number
  /**
   * 年份
   */
  year: number
}

/**
 * ElectronicDto，电子BOM表单
 */
export interface ElectronicDto {
  /**
   * 物料大类
   */
  categoryName?: null | string
  /**
   * 币种
   */
  currency?: null | string
  /**
   * 电子料BOM Id
   */
  electronicId?: number
  /**
   * 原币
   */
  iginalCurrency?: YearOrValueMode[] | null
  /**
   * 项目物料的年降率
   */
  inTheRate?: YearOrValueMode[] | null
  /**
   * 项目物料的使用量
   */
  materialsUseCount?: YearOrValueMode[] | null
  /**
   * 零件的名称
   */
  parName?: null | string
  /**
   * 零件的id
   */
  productId?: null | string
  peopleName?: string
  /**
   * 确认人 Id
   */
  peopleId?: number
  /**
   * 物料返利金额
   */
  rebateMoney?: number
  /**
   * 材料名称
   */
  sapItemName?: null | string
  /**
   * 物料编号
   */
  sapItemNum?: null | string
  /**
   * 本位币
   */
  standardMoney?: YearOrValueMode[] | null
  /**
   * 系统单价（原币）
   */
  systemiginalCurrency?: YearOrValueMode[] | null
  /**
   * 物料种类
   */
  typeName?: null | string
  isEntering?: boolean
  isSubmit?: boolean
}

/**
 * PartModel，零件模组
 */
export interface PartModel {
  /**
   * 零件的名称
   */
  parName?: null | string
  /**
   * 零件的id
   */
  productId?: null | string
}
