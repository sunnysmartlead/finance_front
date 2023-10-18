// const urlMap = {
//   PriceDemandReview:{path:"/demandApplyAudit/index",query: {} },//核价需求审核&方案录入
//   TRToExamine:{path:"/pddAudit/index",query: {} },//产品开发部TR审核
//   TRAuditMKT: { path: "/trAudit/index", query: { trCheckType: 1 } }, //市场部TR主方案审核界面"
//   TRAuditR_D: { path: "/trAudit/index", query: { trCheckType: 2 } }, //"产品开发部TR主方案审核"
//   StructBomAudit: { path: "/bomView/struc", query: {} }, //结构bom审核界面
//   StructBomImport: { path: "/structuralMaterialImport/index", query: {} }, //结构bom导入界面
//   ElectronicBomImport: { path: "/electronicImport/index", query: {} },
//   ElectronicBomAudit: { path: "/bomView/elec", query: {} }, //电子bom审核界面
//   StructPriceInput: { path: "/resourcesDepartment/construction", query: {} }, //结构单价录入界面
//   ElecBomPriceAudit: { path: "/bomVerify/electronic", query: {} }, //电子bom单价审核界面
//   StructBomPriceAudit: { path: "/bomVerify/construction", query: {} }, //StructBomPriceAudit
//   ElectronicPriceInput: { path: "/resourcesDepartment/electronic", query: {} }, //电子单价录入界面
//   BomPriceAudit: { path: "/bomVerify/index", query: {} }, // bom单价审核
//   ElecLossRateInput: { path: "/bomLoss/indexElec", query: {} },
//   StructLossRateInput: { path: "/bomLoss/indexStruct", query: {} },
//   ManHourImport: { path: "/processImport/index", query: {} }, // 工序导入
//   LogisticsCostInput: { path: "/pmDepartment/index", query: {} }, //物流成本录入界面
//   NreInputOther: { path: "/nre/nreProjectManageMent", query: {} }, //NRE核价手板件、差旅及其他费用录入界面
//   NreInputEmc: { path: "/nre/nrePilotprojects", query: {} }, //NRE核价电子-EMC实验费录入界面"
//   NreInputMould: { path: "/nre/nreResourcesDepartment", query: {} }, //NRE模具清单录入界面
//   NreInputTest: { path: "/nre/nreExperimentItems", query: {} }, //NRE实验费用录入界面
//   NreInputGage: { path: "/nre/nreQCDepartment", query: {} }, //NRE检具费用录入界面"
//   TradeApproval: { path: "/tradeCompliance/index", query: {} }, //贸易合规审核（结束流程&退回流程）
//   PriceBoardAudit: { path: "/dashboard/index", query: {} }, //核价看板
//   ProjectPriceAudit: { path: "/projectPriceAudit/index", query: {} }, //项目部核价审核界面
//   FinancePriceAudit: { path: "/financePriceAudit/index", query: {} }, //财务部核价审核界面
//   PriceCheckDownload: { path: "/quoteAnalysis/index", query: {} }, //"版本的核价表查看&下载界面（产品+NRE）"
//   CostCheckNreFactor: { path: "/quoteAnalysis/index", query: {} }, //"成本信息表下载&填报NRE报价系数&产品报价看板界面"
//   QuoteApproval: { path: "/marketingQuotation/index", query: {} }, //"总经理报价审批界面"
//   QuoteFormCheckDownload: "/marketingQuotation/index", //"报价审核表查看&下载界面"
//   ArchiveEnd: { path: "/archive/index", query: {} }, //"归档结束（异常终止）"
//   LossRateInput: { path: "/processImport/index", query: {} }, // "工程损耗率录入界面"
//   RequirementInput: { path: "/demandApply/index", query: {} }, //"核价需求录入界面"
//   PMInput: { path: "/partEntry/managerOperate", query: {} }, //"项目经理录入界面"
//   ProductionCostInput: { path: "/manufacturingCost/index", query: {} } //"制造成本录入"
// }
// export default urlMap
const urlMap = {
  PricingDemandInput: { path: "/demandApply/index", query: {} }, //核价需求
  PriceDemandReview: { path: "/demandApplyAudit/index", query: {} }, //核价需求审核&方案录入
  TRToExamine: { path: "/pddAudit/index", query: {} }, //产品开发部TR审核
  StructureBOM: { path: "/structuralMaterialImport/index", query: {} }, //结构bom导入
  StructureBOMToExamine: { path: "/bomView/struc", query: {} }, //结构bom导入审核
  ElectronicsBOM: { path: "/electronicImport/index", query: {} }, //电子Bom导入
  ElectronicsBOMToExamine: { path: "/bomView/elec", query: {} }, //电子Bom导入审核
  LogisticsCostEntry: { path: "/processHoursExport/logisticsCost", query: {} }, //物流成本录入
  FormulaOperationAddition: { path: "/processHoursExport/index", query: {} }, //工序工时导入
  CustomizedStructuralComponents: {}, //定制结构件
  TradeCompliance: { path: "/tradeCompliance/index", query: {} }, //贸易合规
  NotTradeCompliance: { path: "/tradeCompliance/not", query: {} }, //贸易不合规
  COBManufacturingCostEntry: { path: "/processHoursExport/COBManufactureCost", query: {} }, //COM制造成本录入
  ElectronicUnitPriceEntry: { path: "/resourcesDepartment/electronic", query: {} }, //电子单价录入
  ElectronicUnitPriceEntryToExamine: { path: "/bomVerify/electronic", query: {} }, //电子单价录入审核
  StructureUnitPriceEntry: { path: "/resourcesDepartment/construction", query: {} }, //结构单价录入
  StructureUnitPriceEntryToExamine: { path: "/bomVerify/construction", query: {} }, //结构单价录入审核
  UnitPriceInputReviewToExamine: { path: "/bomVerify/index", query: {} }, //BOM单价录入审核

  NRE_EMCExperimentalFeeInput: { path: "/nre/nrePilotprojects", query: {} }, //EMC实验费录入
  NRE_EMCExperimentalFeeInputToExamine: { path: "/nre/nrePilotprojectsVertify", query: {} }, //EMC实验费录入审核
  NRE_ReliabilityExperimentFeeInput: { path: "/nre/nreExperimentItems", query: {} }, //可靠性实验费录入
  NRE_ReliabilityExperimentFeeInputoExamine: { path: "/nre/nreExperimentItemsVertify", query: {} }, //可靠性实验费录入审核
  NRE_MoldFeeEntry: { path: "/nre/nreResourcesDepartment", query: {} }, //模具费录入
  NRE_MoldFeeEntryToExamine: { path: "/nre/nreResourcesDepartmentVertify", query: {} }, //模具费审核
  NRE_ManualComponentInput: { path: "/nre/nreProjectManageMent", query: {} }, //手板件费录入
  PriceEvaluationBoard: { path: "/dashboard/index", query: {} }, //核价看板
  FinanceDirectorAudit: { path: "/financeDirectorAudit", query: {} }, // 财务部部长审核
  ProjectChiefAudit: { path: "/projectChiefAudit", query: {} }, // 项目科长审核
  ProjectDirectorLook: { path: "/projectDirectorLook", query: {} }, // 项目部长查看
  // 报价分析看板
  QuoteAnalysis: { path: "/quoteAnalysis/index", query: {} }, // 报价分析看板
  ConfirmWinningBid: { path: "/marketingQuotation/indexSecond", query: {} }, //确认中标
  CoreNre: { path: "/quoteAnalysis/nreCoreDevices", query: {} }, //核心部件
  QuoteFeedback: { path: "/quoteAnalysis/quoteForm", query: {} }, //（报价反馈）
  BidWinningConfirmation: { path: "/marketingQuotation/indexSecond", query: {} }, // （财务中标确认）
  ArchiveEnd: { path: "/archive/index", query: {} }, //"归档结束（异常终止）"
  QuoteApproval: { path: "/marketingQuotation/indexFirst", query: {} } //"总经理报价审批界面"
}
export default urlMap
