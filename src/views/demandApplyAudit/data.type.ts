/**
 * AuditEntering，营销部审核 录入类
 */
export interface Response {
  /**
   * 流程Id
   */
  auditFlowId?: number;
  /**
   * 设计方案
   */
  designSolutionList?: DesignSolutionDto[] | null;
  /**
   * true 为提价  false为保存
   */
  isSubmit?: boolean;
  pricingTeam?: PricingTeamDto;
  /**
   * 营销部审核 方案表
   */
  solutionTableList?: SolutionTableDto[] | null;
}
/**
 * DesignSchemeDto，营销部审核中项目设计方案
 */
export interface DesignSolutionDto {
  /**
   * 前端生成的唯一Id
   */
  uuid?: null | string;
  /**
   * 文件列表信息
   */
  file?: FileUploadOutputDto;
  /**
   * 3D爆炸图ID
   */
  fileId?: number;
  /**
   * 线束
   */
  harness?: null | string;
  /**
   * Id
   */
  id?: number;
  /**
   * lens
   */
  lens?: null | string;
  /**
   * lsp
   */
  isp?: null | string;
  /**
   * MCU
   */
  mcu?: null | string;
  /**
   * 工艺方案
   */
  processProgram?: null | string;
  /**
   * 产品类型
   */
  productType?: null | string;
  /**
   * 其他
   */
  rests?: null | string;
  /**
   * 方案名称
   */
  solutionName?: null | string;
  /**
   * sensor
   */
  sensor?: null | string;
  /**
   * serial
   */
  serial?: null | string;
  /**
   * 支架
   */
  stand?: null | string;
  /**
   * 传动结构
   */
  transmissionStructure?: null | string;
  /**
   * vcsel
   */
  vcsel?: null | string;
}
/**
 * FileUploadOutputDto，文件上传成功后的实体
 */
export interface FileUploadOutputDto {
  /**
   * 数据库FileManagement表中的Id
   */
  fileId?: number;
  /**
   * 文件的大小
   */
  fileLength?: number;
  /**
   * 文件名称：文件上传的原始名称
   */
  fileName?: null | string;
  /**
   * 文件的类型
   */
  fileType?: null | string;
  /**
   * 配置的文件保存路径+guid生成的文件名+文件的原始后缀
   */
  fileUrl?: null | string;
}
/**
 * PricingTeamDto，核价团队  其中包含(核价人员以及对应完成时间)
 */
export interface PricingTeamDto {
  /**
   * 项目核价审核员
   */
  auditId?: number | null;
  /**
   * 营销部要求核价完成时间期望完成时间
   */
  deadline?: Date | string;
  /**
   * 产品部-电子工程师期望完成时间
   */
  elecEngineerTime?: Date | string;
  /**
   * 产品开发部-EMC实验费用录入员
   */
  emcId?: number | null;
  /**
   * 产品部-EMC实验费录入员期望完成时间
   */
  emcTime?: Date | string;
  /**
   * 工程技术部-工序工时录入员
   */
  engineerId?: number | null;
  /**
   * 工程技术部-工序工时录入员期望完成时间
   */
  engineerWorkHourTime?: Date | string;
  /**
   * Id
   */
  id?: number;
  /**
   * 资源部-模具录入员
   */
  mouldWorkHourTime?: Date | string;
  /**
   * 财务部-制造费用录入员
   */
  productCostInputId?: number | null;
  /**
   * 制造成本录入员期望完成时间
   */
  productCostInputTime?: Date | string;
  /**
   * 生成管理部-物流成本录入员期望完成时间
   */
  productManageTime?: Date | string;
  /**
   * 生产管理部-物流费用录入员
   */
  productManageTimeId?: number | null;
  /**
   * 品质保证部-实验费用录人员
   */
  qualityBenchId?: number | null;
  /**
   * 品质保证部-实验室费用录入员期望完成时间
   */
  qualityBenchTime?: Date | string;
  /**
   * 资源管理部-电子资源开发期望完成时间
   */
  resourceElecTime?: Date | string;
  /**
   * 资源管理部-结构资源开发期望完成时间
   */
  resourceStructTime?: Date | string;
  /**
   * 产品部-结构工程师期望完成时间
   */
  structEngineerTime?: Date | string;
  /**
   * TR预计提交时间
   */
  trSubmitTime?: Date | string;
}
/**
 * SolutionTableDto，营销部审核 方案表
 */
export interface SolutionTableDto {
  /**
   * 电子工程师(用户ID)
   */
  elecEngineerId?: number | null;
  /**
   * Id
   */
  id?: string;
  /**
   * 是否COB方案
   */
  isCOB?: boolean;
  /**
   * 是否为首款产品
   */
  isFirst?: boolean;
  /**
   * 模组名称
   */
  moduleName?: null | string;
  /**
 * 模组id
 */
  productld?: number;
  /**
   * 产品名称
   */
  product?: null | string;
  /**
   * 方案名称
   */
  solutionName?: null | string;
  /**
   * 结构工程师(用户ID)
   */
  structEngineerId?: number | null;
}
/**
 * FileUploadOutputDto，文件上传成功后的实体
 */
export interface FileUploadOutputDto {
  /**
   * 数据库FileManagement表中的Id
   */
  fileId?: number;
  /**
   * 文件的大小
   */
  fileLength?: number;
  /**
   * 文件名称：文件上传的原始名称
   */
  fileName?: null | string;
  /**
   * 文件的类型
   */
  fileType?: null | string;
  /**
   * 配置的文件保存路径+guid生成的文件名+文件的原始后缀
   */
  fileUrl?: null | string;
}
export interface user {
  id: number
  name: string
}
