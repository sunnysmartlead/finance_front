const urlMap = {
  TRAuditMKT: { path: "/trAudit/index", query: { trCheckType: 1 } }, //市场部TR主方案审核界面"
  TRAuditR_D: { path: "/trAudit/index", query: { trCheckType: 2 } }, //"产品开发部TR主方案审核"
  StructBomAudit: { path: "/bomView/struc", query: {} }, //结构bom审核界面
  StructBomImport: { path: "/structuralMaterialImport/index", query: {} }, //结构bom导入界面
  ElectronicBomImport: { path: "/electronicImport/index", query: {} },
  ElectronicBomAudit: { path: "/bomView/elec", query: {} }, //电子bom审核界面
  StructPriceInput: { path: "/resourcesDepartment/construction", query: {} }, //结构单价录入界面
  ElecBomPriceAudit: { path: "/bomVerify/electronic", query: {} }, //电子bom单价审核界面
  StructBomPriceAudit: { path: "/bomVerify/construction", query: {} }, //StructBomPriceAudit
  ElectronicPriceInput: { path: "/resourcesDepartment/electronic", query: {} }, //电子单价录入界面
  BomPriceAudit: { path: "/bomVerify/index", query: {} }, // bom单价审核
  ElecLossRateInput: { path: "/bomLoss/indexElec", query: {} },
  StructLossRateInput: { path: "/bomLoss/indexStruct", query: {} },
  ManHourImport: { path: "/processImport/index", query: {} }, // 工序导入
  LogisticsCostInput: { path: "/pmDepartment/index", query: {} }, //物流成本录入界面
  NreInputOther: { path: "/nre/nreProjectManageMent", query: {} }, //NRE核价手板件、差旅及其他费用录入界面
  NreInputEmc: { path: "/nre/nrePilotprojects", query: {} }, //NRE核价电子-EMC实验费录入界面"
  NreInputMould: { path: "/nre/nreResourcesDepartment", query: {} }, //NRE模具清单录入界面
  NreInputTest: { path: "/nre/nreExperimentItems", query: {} }, //NRE实验费用录入界面
  NreInputGage: { path: "/nre/nreQCDepartment", query: {} }, //NRE检具费用录入界面"
  TradeApproval: { path: "/tradeCompliance/index", query: {} }, //贸易合规审核（结束流程&退回流程）
  PriceBoardAudit: { path: "/dashboard/index", query: {} }, //核价看板
  ProjectPriceAudit: { path: "/projectPriceAudit/index", query: {} }, //项目部核价审核界面
  FinancePriceAudit: { path: "/financePriceAudit/index", query: {} }, //财务部核价审核界面
  PriceCheckDownload: { path: "/quoteAnalysis/index", query: {} }, //"版本的核价表查看&下载界面（产品+NRE）"
  CostCheckNreFactor: { path: "/quoteAnalysis/index", query: {} }, //"成本信息表下载&填报NRE报价系数&产品报价看板界面"
  QuoteApproval: { path: "/marketingQuotation/index", query: {} }, //"总经理报价审批界面"
  QuoteFormCheckDownload: "/marketingQuotation/index", //"报价审核表查看&下载界面"
  ArchiveEnd: { path: "/archive/index", query: {} }, //"归档结束（异常终止）"
  LossRateInput: { path: "/processImport/index", query: {} }, // "工程损耗率录入界面"
  RequirementInput: { path: "/demandApply/index", query: {} }, //"核价需求录入界面"
  PMInput: { path: "/partEntry/managerOperate", query: {} }, //"项目经理录入界面"
  ProductionCostInput: { path: "/manufacturingCost/index", query: {} } //"制造成本录入"
}
export default urlMap
