

/**
 * LXRequirementEntDto，零星报价需求录入交互类
 */
 export interface LXRequirementEntDto {
  /**
   * 审批流程主表ID
   */
  auditFlowId?: number;
  /**
   * 零部件类型
   */
  componentType?: number;
  /**
   * 客户性质
   */
  customerNature?: null | string;
  /**
   * 直接客户名称
   */
  directCustomerName?: null | string;
  /**
   * 拟稿日期
   */
  draftDate?: Date;
  /**
   * 拟稿人
   */
  drafter?: null | string;
  /**
   * 拟稿人工号
   */
  drafterNumber?: number;
  /**
   * 拟稿公司
   */
  draftingCompany?: null | string;
  /**
   * 拟稿公司Id
   */
  draftingCompanyId?: number;
  /**
   * 拟稿部门
   */
  draftingDepartment?: null | string;
  /**
   * 拟稿部门Id
   */
  draftingDepartmentId?: number;
  /**
   * 附件Id
   */
  enclosureId?: number;
  /**
   * 终端客户名称
   */
  endCustomerName?: null | string;
  /**
   * 终端客户性质
   */
  endCustomerNature?: null | string;
  /**
   * Id
   */
  id?: number;
  /**
   * 是否提交
   */
  isSubmit?: boolean;
  /**
   * 零星报价列表实体类
   */
  lxDataListDtos?: LXDataListDto[] | null;
  /**
   * 单据编号
   */
  number?: null | string;
  /**
   * 项目名称
   */
  projectName?: null | string;
  /**
   * 标题
   */
  title?: null | string;
}

/**
* LXDataListDto，零星报价列表交互类 保存\提交\查询
*/
export interface LXDataListDto {
  /**
   * 数据
   */
  data?: null | string;
  /**
   * Id
   */
  id?: number;
  listName?: number;
  /**
   * 列名称注释
   */
  listNameDisplayName?: null | string;
  /**
   * 零星报价需求录入主表Id
   */
  requirementEntryId?: number;
}
