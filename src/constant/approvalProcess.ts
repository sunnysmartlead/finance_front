// 报价反馈	EvalFeedback
// 不合规是否退回	MybhgSelect
// 财务审核	YesOrNo
// 查看每个方案初版BOM成本	Done
// 电子BOM单价审核	ElectronicBomEvalSelect
// 电子BOM匹配修改	Done
// 电子BOM审核	YesOrNo
// 定制结构件	Done
// 工序工时添加	Done
// 归档	Done
// 核价看板	HjkbSelect
// 核价审批录入	YesOrNo
// 核价需求录入	EvalReason
// 核心器件成本NRE费用拆分	Done
// 结构BOM单价审核	StructBomEvalSelect
// 结构BOM匹配修改	Done
// 结构BOM审核	YesOrNo
// 开始
// 贸易合规	YesOrNo
// 模具费审核	YesOrNo
// 确认中标金额	YesOrNo
// 上传电子BOM	Done
// 上传结构BOM	Done
// 审批报价策略与核价表	YesOrNo
// 生成报价分析界面选择报价方案	Done
// 物流成本录入	Done
// 系统生成报价审批表报价单	Done
// 项目部课长审核	YesOrNo
// 项目部长查看核价表	Done
// 选择是否报价	YesOrNo
// 总经理查看中标金额	Done
// BOM成本审核	BomEvalSelect
// COB制造成本录入	Done
// NRE_可靠性实验费录入	Done
// NRE_可靠性实验费审核	YesOrNo
// NRE_EMC实验费录入	Done
// NRE_EMC实验费审核	YesOrNo
// NRE模具费录入	Done
// NRE手板件	Done
// TR审核	YesOrNo

const baseProcessType = {
  approval: [
    {
      label: "不同意",
      val: "YesOrNo_No"
    },
    {
      label: "同意",
      val: "YesOrNo_Yes"
    },
    {
      label: "保存",
      val: "YesOrNo_Save"
    }
  ],
  confirm: [
    {
      label: "完成",
      val: "Done"
    },
    {
      label: "保存",
      val: "Save"
    }
  ]
}

// 报价反馈
const quoteFeedbackProcessType = [
  {
    label: "客户要求",
    val: "TypeSelect_Ask"
  },
  {
    label: "客户供应",
    val: "TypeSelect_Supply"
  },
  {
    label: "客户指定采购",
    val: "TypeSelect_Appoint"
  },

  {
    label: "我司推荐",
    val: "TypeSelect_Recommend"
  }
]

// 贸易不合规
const complianceProcessType = [
  {
    val: "MybhgSelect_Cobzzcblr",
    label: "COB制造成本录入"
  },
  {
    val: "MybhgSelect_Gsgxtj",
    label: "工序工时添加"
  },
  {
    val: "MybhgSelect_Wlcblr",
    label: "物流成本录入"
  },
  {
    val: "MybhgSelect_Dzbomppxg",
    label: "电子BOM匹配修改"
  },
  {
    val: "MybhgSelect_Scdzbom",
    label: "上传电子BOM"
  },
  {
    val: "MybhgSelect_Jgbomppxg",
    label: "结构BOM匹配修改"
  },
  {
    val: "MybhgSelect_Dzjgj",
    label: "定制结构件"
  },
  {
    val: "MybhgSelect_Scjgbom",
    label: "上传结构BOM"
  },
  {
    val: "MybhgSelect_No",
    label: "不退回"
  }
]

//电子BOM单价审核
const electronicBomProcessType = [
  {
    val: "ElectronicBomEvalSelect_Yes",
    label: "同意"
  },
  {
    val: "ElectronicBomEvalSelect_Dzbomppxg",
    label: "电子BOM匹配修改"
  }
]

// 结构BOM单价审核
const structBomProcessType = [
  {
    val: "StructBomEvalSelect_Jgbomppxg",
    label: "退回到【结构BOM匹配修改】"
  },
  {
    val: "StructBomEvalSelect_Dzjgj",
    label: "退回到【定制结构件】"
  },
  {
    val: "StructBomEvalSelect_Yes",
    label: "同意"
  }
]

//BOM成本审核
const bomCostProcessType = [
  {
    val: "BomEvalSelect_Dzbomppxg",
    label: "电子BOM匹配修改"
  },
  {
    val: "BomEvalSelect_Jgbomppxg",
    label: "结构BOM匹配修改"
  },
  {
    val: "BomEvalSelect_Dzjgj",
    label: "定制结构件"
  },
  {
    val: "BomEvalSelect_Yes",
    label: "同意"
  }
]

export {
  baseProcessType,
  quoteFeedbackProcessType,
  complianceProcessType,
  electronicBomProcessType,
  structBomProcessType,
  bomCostProcessType
}
