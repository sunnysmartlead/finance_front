// 单价库表头
export const unitCols = [
  {
    name: "价格主数据号",
    key: "priceMasterDataNumber"
  },
  {
    name: "采购组编码",
    key: "procurementGroupCode"
  },
  {
    name: "采购组名称",
    key: "procurementGroupName"
  },
  {
    name: "工厂编码",
    key: "factoryCode"
  },
  {
    name: "工厂名称",
    key: "factoryName"
  },
  {
    name: "供应商编码",
    key: "supplierCode"
  },
  {
    name: "供应商优先级",
    key: "supplierPriority"
  },
  {
    name: "供应商ERP编码",
    key: "supplierErpCode"
  },
  {
    name: "供应商名称",
    key: "supplierName"
  },
  {
    name: "一级物料簇编码",
    key: "firstLevelMaterialClusterCode"
  },
  {
    name: "一级物料簇名称",
    key: "firstLevelMaterialClusterName"
  },
  {
    name: "二级物料簇编码",
    key: "secondaryMaterialClusterCode"
  },
  {
    name: "二级物料簇名称",
    key: "secondaryMaterialClusterName"
  },
  {
    name: "物料编码",
    key: "materialCode"
  },
  {
    name: "物料名称",
    key: "materialName"
  },
  {
    name: "采购类别",
    key: "purchaseCategory"
  },
  {
    name: "基本单位",
    key: "basicUnit"
  },
  {
    name: "是否客户指定",
    key: "isItSpecifiedByTheCustomer"
  },
  {
    name: "是否冻结",
    key: "freezeOrNot"
  },
  {
    name: "同步PO状态",
    key: "synchronizePOstatus"
  },
  {
    name: "物料冻结",
    key: "materialFreezing"
  },
  {
    name: "采购订单冻结",
    key: "purchaseOrderFreeze"
  },
  {
    name: "收获冻结",
    key: "harvestFreeze"
  },
  {
    name: "付款冻结",
    key: "paymentFreeze"
  },
  {
    name: "创建人",
    key: "founder"
  },
  {
    name: "生效日期",
    key: "effectiveDate"
  },
  {
    name: "失效日期",
    key: "expirationDate"
  },
  {
    name: "价格基数",
    key: "priceBase"
  },
  {
    name: "定价单位",
    key: "pricingUnit"
  },
  {
    name: "货币编码",
    key: "currencyCode"
  },
  {
    name: "税率",
    key: "taxRate"
  },
  {
    name: "未税价",
    key: "untaxedPrice"
  },
  {
    name: "含税价",
    key: "priceIncludingTax"
  },
  {
    name: "成本基价",
    key: "costBasePrice"
  },
  {
    name: "返利未税价",
    key: "rebateBeforeTaxPrice"
  },
  {
    name: "返利含税价",
    key: "rebatePriceIncludingTax"
  },
  {
    name: "过量交货限度%",
    key: "excessiveDeliveryLimit"
  },
  {
    name: "交货不足限度%",
    key: "insufficientDeliveryLimit"
  },
  {
    name: "计划天数",
    key: "plannedDays"
  },
  {
    name: "关税",
    key: "tariff"
  },
  {
    name: "原净价",
    key: "originalNetPrice"
  },
  {
    name: "价格变动类型",
    key: "typeOfPriceChange"
  },
  {
    name: "原有效日期",
    key: "originalEffectiveDate"
  },
  {
    name: "原失效日期",
    key: "originalExpirationDate"
  },
  {
    name: "返利模式",
    key: "rebateMode"
  },
  {
    name: "返点信息",
    key: "rebateInformation"
  },
  {
    name: "创建方式",
    key: "creationMethod"
  },
  {
    name: "版本号",
    key: "versionNumber"
  },
  {
    name: "备注",
    key: "remarks"
  },
  {
    name: "报价类型",
    key: "quotationType"
  },
  {
    name: "阶梯/批量起始数量",
    key: "batchStartQuantity"
  },
  {
    name: "阶梯/批量未税价（当期价格）",
    key: "bulkUntaxedPrice"
  }
]

export const unitCols2 = [

  {
    name: "阶梯/批量含税价",
    key: "batchPriceIncludingTax"
  },
  {
    name: "阶梯/批量返利未税价",
    key: "batchRebateWithoutTaxPrice"
  },
  {
    name: "阶梯/批量返利含税价",
    key: "batchRebateIncludingTaxPrice"
  },
  {
    name: "原产地信息",
    key: "originInformation"
  },
  {
    name: "物料管制状态",
    key: "materialControlStatus"
  },
  {
    name: "MOQ",
    key: "moq"
  }
]
