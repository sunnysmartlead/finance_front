// 单价库表头
const unitCols = [
  {
    name: "单据号",
    key: "dorderNumber"
  },
  {
    name: "凭证号",
    key: "voucherNumber"
  },
  {
    name: "单据状态",
    key: "billsState"
  },
  {
    name: "采购分类",
    key: "purchaseClassify"
  },
  {
    name: "供应商编号",
    key: "supplierCode"
  },
  {
    name: "供应商名称",
    key: "supplierName"
  },
  {
    name: "物料编号",
    key: "stockNumber"
  },
  {
    name: "物料名称",
    key: "stockName"
  },
  {
    name: "工厂",
    key: "plant"
  },
  {
    name: "工厂图号",
    key: "plantNumber"
  },
  {
    name: "税码",
    key: "taxCode"
  },
  {
    name: "货币代码",
    key: "currencies"
  },
  {
    name: "原净价",
    key: "rowNetPrice"
  },
  {
    name: "总净价（不含税）",
    key: "sumNetPrice"
  },
  {
    name: "返利类型",
    key: "rebatesType"
  },
  {
    name: "返利金额",
    key: "rebateAmount"
  },
  {
    name: "净价",
    key: "netPrice"
  },
  {
    name: "税率",
    key: "taxRate"
  },
  {
    name: "含税价",
    key: "priceIncludingTax"
  },
  {
    name: "价格单位",
    key: "priceUnit"
  },
  {
    name: "内部核算价",
    key: "internalValuation"
  },
  {
    name: "供应商报价",
    key: "vendorOffer"
  },
  {
    name: "有效开始日期",
    key: "effectiveDate"
  },
  {
    name: "有效结束日期",
    key: "effectiveEndDate"
  },
  {
    name: "价格变动类",
    key: "typePriceChange"
  },
  {
    name: "是否客户指定",
    key: "ifClientSpecify"
  },
  {
    name: "库存单位",
    key: "sku"
  },
  {
    name: "采购单位",
    key: "puom"
  },
  {
    name: "货期",
    key: "delivery"
  },
  {
    name: "允许超收",
    key: "allowExcess"
  },
  {
    name: "更改原因说明",
    key: "reasonForChange"
  },
  {
    name: "采购组织",
    key: "purchaseOrg"
  },
  {
    name: "采购组",
    key: "procurementSection"
  },
  {
    name: "报价单类型",
    key: "typeQuotation"
  },
  {
    name: "变动类型",
    key: "changeType"
  },
  {
    name: "所属部门",
    key: "theirDepartment"
  },
  {
    name: "登记人",
    key: "registrant"
  },
  {
    name: "登记日期",
    key: "recordDate"
  },
  {
    name: "冻结状态",
    key: "frozenState"
  },
  {
    name: "下限",
    key: "floor"
  },
  {
    name: "上限",
    key: "upper"
  },
  {
    name: "总净价（不含税）",
    key: "netAmount"
  },
  // {
  //   name: "返利金额",
  //   key: ""
  // },
  // {
  //   name: "净价",
  //   key: ""
  // },
  {
    name: "ECCN码",
    key: "eccnCode"
  },
  {
    name: "冻结状态显示",
    key: "displayFrozenState"
  },
  {
    name: "最新变动日期",
    key: "dateLastChange"
  }
]

export default unitCols
