// import { createRouter, createWebHashHistory, RouteRecordRaw, createWebHistory } from "vue-router"
import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    redirect: "/todoCenter/index",
    component: Layout,
    meta: {
      title: "首页"
    },
    children: [
      {
        path: "/todoCenter/index",
        component: () => import("@/views/todoCenter/index.vue"),
        name: "todoCenter",
        meta: {
          title: "待办中心"
        }
      }
    ]
  },
  {
    path: "/",
    redirect: "/createProcess/index",
    component: Layout,
    meta: {
      title: "新建流程"
    },
    children: [
      {
        path: "/createProcess/index",
        component: () => import("@/views/createProcess/index.vue"),
        name: "createProcess",
        meta: {
          title: "新建流程"
        }
      }
    ]
  },
  {
    path: "/nupriceManagement",
    redirect: "/demandApply/index",
    component: Layout,
    meta: {
      title: "核价管理",
      hidden: false
    },
    children: [
      {
        path: "/demandApply/index",
        component: () => import("@/views/demandApply/index.vue"),
        name: "demandApply",
        meta: {
          title: "核价需求录入"
        }
      },
      {
        path: "/demandApplyAudit/index",
        component: () => import("@/views/demandApplyAudit/index.vue"),
        name: "demandApplyAudit",
        meta: {
          title: "核价需求审核&方案录入"
        }
      },
      {
        path: "/pddAudit/index",
        component: () => import("@/views/pddAudit/index.vue"),
        name: "pddAudit",
        meta: {
          title: "产品开发部审核"
        }
      },
      // {
      //   path: "/partEntry/managerOperate",
      //   component: () => import("@/views/partEntry/managerOperate.vue"),
      //   name: "managerOperate",
      //   meta: {
      //     title: "项目经理录入"
      //   }
      // },
      // {
      //   path: "/trAudit/index",
      //   component: () => import("@/views/trAudit/index.vue"),
      //   name: "trAudit",
      //   meta: {
      //     title: "Tr主方案"
      //   }
      // },
      // {
      //   path: "productPriceList",
      //   component: () => import("@/views/productPriceList/index.vue"),
      //   name: "ProductPriceList",
      //   meta: {
      //     title: "项目核价表"
      //   }
      // },
      // {
      //   path: "/demandApply/result",
      //   component: () => import("@/views/demandApply/marketingApproval.vue"),
      //   name: "demandApplyResult",
      //   meta: {
      //     title: "营销部报价表"
      //   }
      // }
    ]
  },
  {
    path: "/electronicImport",
    redirect: "/electronicImport/index",
    component: Layout,
    meta: {
      hidden: false
    },
    children: [
      {
        path: "/electronicImport/index",
        component: () => import("@/views/electronicImport/index.vue"),
        name: "electronicImport",
        meta: {
          title: "电子料导入"
        }
      }
    ]
  },
  {
    path: "/structuralMaterialImport",
    redirect: "/structuralMaterialImport/index",
    component: Layout,
    meta: {
      hidden: false
    },
    children: [
      {
        path: "/structuralMaterialImport/index",
        component: () => import("@/views/structuralMaterialImport/index.vue"),
        name: "structuralMaterialImport",
        meta: {
          title: "结构料导入"
        }
      }
    ]
  },
  {
    path: "/resourcesDepartment",
    redirect: "/resourcesDepartment/index",
    component: Layout,
    meta: {
      title: "BOM单价录入"
      // hidden: true
    },
    children: [
      {
        path: "/resourcesDepartment/electronic",
        component: () => import("@/views/resourcesDepartment/electronic.vue"),
        name: "electronic",
        meta: {
          title: "电子料单价录入"
        }
      },
      {
        path: "/resourcesDepartment/construction",
        component: () => import("@/views/resourcesDepartment/construction.vue"),
        name: "construction",
        meta: {
          title: "结构BOM单价录入"
        }
      },
      {
        path: "/resourcesDepartment/moduleNumber",
        component: () => import("@/views/resourcesDepartment/moduleNumber.vue"),
        name: "moduleNumber",
        meta: {
          title: "项目走量",
          hidden: true
        }
      }
    ]
  },
  {
    path: "/bomVerify",
    redirect: "/bomVerify/construction",
    component: Layout,
    meta: {
      title: "BOM单价审核"
      //hidden: true
    },
    children: [
      {
        path: "/bomVerify/electronic",
        component: () => import("@/views/bomVerify/electronic.vue"),
        name: "bomVerifyElectronic",
        meta: {
          title: "电子料单价审核"
        }
      },
      {
        path: "/bomVerify/construction",
        component: () => import("@/views/bomVerify/construction.vue"),
        name: "bomVerifyConstruction",
        meta: {
          title: "结构BOM单价审核"
        }
      },
      {
        path: "/bomVerify/index",
        component: () => import("@/views/bomVerify/index.vue"),
        name: "bomVerify",
        meta: {
          title: "bom单价审核"
        }
      },
      {
        path: "/bomVerify/edit",
        component: () => import("@/views/bomVerify/edit.vue"),
        name: "bomVerifyModify",
        meta: {
          title: "bom单价修改",
          hidden: true
        }
      }
    ]
  },
  {
    path: "/bomLoss",
    redirect: "/bomLoss/indexElec",
    component: Layout,
    meta: {
      title: "BOM损耗率表单",
      hidden: true
    },
    children: [
      {
        path: "/bomLoss/indexElec",
        component: () => import("@/views/bomLoss/indexElec.vue"),
        name: "bomLossElec",
        meta: {
          title: "电子BOM损耗率表单"
        }
      },
      {
        path: "/bomLoss/indexStruct",
        component: () => import("@/views/bomLoss/indexStruct.vue"),
        name: "bomLossStruct",
        meta: {
          title: "结构BOM损耗率表单"
        }
      }
    ]
  },
  {
    path: "/processImport",
    redirect: "/processImport/index",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/processImport/index",
        component: () => import("@/views/processImport/index.vue"),
        name: "processImport",
        meta: {
          title: "工序导入"
        }
      }
    ]
  },
  {
    path: "/manufacturingCost",
    redirect: "/manufacturingCost/index",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/manufacturingCost/index",
        component: () => import("@/views/manufacturingCost/index.vue"),
        name: "manufacturingCost",
        meta: {
          title: "制造成本录入"
        }
      }
    ]
  },
  {
    path: "/pmDepartment",
    redirect: "/pmDepartment/index",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/pmDepartment/index",
        component: () => import("@/views/pmDepartment/index.vue"),
        name: "pmDepartment",
        meta: {
          title: "生管部录入"
        }
      }
    ]
  },

  {
    path: "/processHoursExport",
    redirect: "/processHoursExport/index",
    component: Layout,
    meta: {
      //roles: ["admin"]
      title: "工序工时"
    },
    children: [
      {
        path: "/processHoursExport/index",
        component: () => import("@/views/processHoursExport/index.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "processHoursExport",
        meta: {
          title: "工序工时导入"
        }
      },
      {
        path: "/processHoursExport/processLib",
        component: () => import("@/views/processHoursExport/processLib.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "processLib",
        meta: {
          title: "工序库"
        }
      },
      {
        path: "/processHoursExport/workingHours",
        component: () => import("@/views/processHoursExport/workingHours.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "workingHours",
        meta: {
          title: "工时库"
        }
      },
      {
        path: "/processHoursExport/environment",
        component: () => import("@/views/processHoursExport/environment.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "environment",
        meta: {
          title: "环境"
        }
      },
      {
        path: "/processHoursExport/emc",
        component: () => import("@/views/processHoursExport/emc.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "emc",
        meta: {
          title: "emc"
        }
      },
      {
        path: "/processHoursExport/workClothes",
        component: () => import("@/views/processHoursExport/workClothes.vue"),
        name: "baseLibLog",
        meta: {
          title: "工装库"
        }
      },
      {
        path: "/processHoursExport/deviceLib",
        component: () => import("@/views/processHoursExport/deviceLib.vue"),
        name: "deviceLib",
        meta: {
          title: "设备库"
        }
      },
      {
        path: "/processHoursExport/fixture",
        component: () => import("@/views/processHoursExport/fixture.vue"),
        name: "fixture",
        meta: {
          title: "治具检具"
        }
      },
      {
        path: "/processHoursExport/softwareHardware",
        component: () => import("@/views/processHoursExport/softwareHardware.vue"),
        name: "softwareHardware",
        meta: {
          title: "硬件及软件"
        }
      },
      {
        path: "/processHoursExport/logisticsCost",
        component: () => import("@/views/processHoursExport/logisticsCost.vue"),
        name: "logisticsCost",
        meta: {
          title: "物流成本录入"
        }
      },

      {
        path: "/processHoursExport/standardProcess",
        component: () => import("@/views/processHoursExport/standardProcess.vue"),
        name: "standardProcess",
        meta: {
          title: "标准工艺库"
        }
      },
      {
        path: "/processHoursExport/COBManufactureCost",
        component: () => import("@/views/processHoursExport/COBManufactureCost.vue"),
        name: "COBManufactureCost",
        meta: {
          title: "COB制造成本录入"
        }
      }
    ]
  },
  {
    path: "/nre",
    redirect: "/nre/nreProjectManageMent",
    component: Layout,
    meta: {
      title: "NRE"
      // hidden: true
    },
    children: [
      {
        path: "/nre/nreProjectManageMent",
        component: () => import("@/views/nre/nreProjectManageMent.vue"),
        name: "nreProjectManageMent",
        meta: {
          title: "项目管理部手板件录入"
        }
      },
      {
        path: "/nre/nrePilotprojects",
        component: () => import("@/views/nre/nrePilotprojects.vue"),
        name: "nrePilotprojects",
        meta: {
          title: "产品部EMC实验费录入"
        }
      },
      {
        path: "/nre/nrePilotprojectsVertify",
        component: () => import("@/views/nre/vertify/nrePilotprojects.vue"),
        name: "nrePilotprojectsVertify",
        meta: {
          title: "产品部EMC实验费录入审核"
        }
      },
      {
        path: "/nre/nreResourcesDepartment",
        component: () => import("@/views/nre/nreResourcesDepartment.vue"),
        name: "nreResourcesDepartment",
        meta: {
          title: "模具费NRE"
        }
      },
      {
        path: "/nre/nreResourcesDepartmentVertify",
        component: () => import("@/views/nre/vertify/nreResourcesDepartment.vue"),
        name: "nreResourcesDepartmentVertify",
        meta: {
          title: "模具费NRE审核"
        }
      },
      {
        path: "/nre/nreExperimentItems",
        component: () => import("@/views/nre/nreExperimentItems.vue"),
        name: "nreExperimentItems",
        meta: {
          title: "品保部环境实验费"
        }
      },
      {
        path: "/nre/nreExperimentItemsVertify",
        component: () => import("@/views/nre/vertify/nreExperimentItems.vue"),
        name: "nreExperimentItemsVertify",
        meta: {
          title: "品保部环境实验费审核"
        }
      },
      // {
      //   path: "/nre/nreQCDepartment",
      //   component: () => import("@/views/nre/nreQCDepartment.vue"),
      //   name: "nreQCDepartment",
      //   meta: {
      //     title: "品保部-检具NRE"
      //   }
      // },
      {
        path: "/nre/nreMarketingDepartment",
        component: () => import("@/views/nre/nreMarketingDepartment.vue"),
        name: "nreMarketingDepartment",
        meta: {
          title: "营销部NRE"
        }
      },
      {
        path: "/nre/nreMarketingDepartmentVertify",
        component: () => import("@/views/nre/vertify/nreMarketingDepartment.vue"),
        name: "nreMarketingDepartmentVertify",
        meta: {
          title: "营销部NRE审核"
        }
      },
      {
        path: "/nre/nrePricelist",
        component: () => import("@/views/nre/nrePricelist.vue"),
        name: "nrePricelist",
        meta: {
          title: "核价表NRE"
        }
      }
      // {
      //   path: "/nre/engineeringDepartment",
      //   component: () => import("@/views/nre/engineeringDepartment.vue"),
      //   name: "engineeringDepartment",
      //   meta: {
      //     title: "工程部NRE"
      //   }
      // },
      // {
      //   path: "/nre/costInformation",
      //   component: () => import("@/views/nre/costInformation.vue"),
      //   name: "costInformation",
      //   meta: {
      //     title: "成本信息表"
      //   }
      // }
    ]
  },
  {
    path: "/dashboard",
    redirect: "/dashboard/index",
    component: Layout,
    meta: {
      title: "核价看板"
      // hidden: true
    },
    // meta: {
    //   hidden: true
    // },
    children: [
      {
        path: "/dashboard/index",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "核价看板"
        }
      },
      {
        path: "/projectChiefAudit",
        component: () => import("@/views/dashboard/projectChiefAudit/index.vue"),
        name: "ProjectChiefAudit",
        meta: {
          title: "项目部核价审核"
        }
      },
      {
        path: "/financeDirectorAudit",
        component: () => import("@/views/dashboard/financeDirectorAudit/index.vue"),
        name: "FinanceDirectorAudit",
        meta: {
          title: "财务审核"
        }
      },
      {
        path: "/projectDirectorLook",
        component: () => import("@/views/dashboard/projectDirectorLook/index.vue"),
        name: "ProjectDirectorLook",
        meta: {
          title: "项目部长查看"
        }
      }
    ]
  },
  {
    path: "/tradeCompliance",
    redirect: "/tradeCompliance/index",
    component: Layout,
    meta: {
      hidden: false
    },
    children: [
      {
        path: "/tradeCompliance/index",
        component: () => import("@/views/tradeCompliance/index.vue"),
        name: "tradeCompliance",
        meta: {
          title: "贸易合规"
        }
      },
      {
        path: "/tradeCompliance/not",
        component: () => import("@/views/tradeCompliance/notCompliance.vue"),
        name: "notTradeCompliance",
        meta: {
          title: "贸易不合规"
        }
      }
    ]
  },
  {
    path: "/quoteAnalysis",
    redirect: "/quoteAnalysis/index",
    component: Layout,
    meta: {
      title: "报价模块",
      hidden: false
    },
    children: [
      {
        path: "/quoteAnalysis/index",
        component: () => import("@/views/quoteAnalysis/index.vue"),
        name: "quoteAnalysis",
        meta: {
          title: "报价分析看板"
        }
      },
      {
        path: "/quoteAnalysis/marketingApproval",
        component: () => import("@/views/quoteAnalysis/marketingApproval.vue"),
        name: "marketingApproval",
        meta: {
          title: "营销部审批"
        }
      },
      {
        path: "/quoteAnalysis/quoteFeedback",
        component: () => import("@/views/quoteAnalysis/quoteFeedback.vue"),
        name: "quoteFeedback",
        meta: {
          title: "报价反馈"
        }
      },
      {
        path: "/quoteAnalysis/quoteForm",
        component: () => import("@/views/quoteAnalysis/quoteForm.vue"),
        name: "quoteForm",
        meta: {
          title: "报价单"
        }
      },
      {
        path: "/quoteAnalysis/nreCoreDevices",
        component: () => import("@/views/fnDepartment/nreCoreDevices.vue"),
        name: "nreCoreDevices",
        meta: {
          title: "NRE核心器件"
        }
      }
    ]
  },
  {
    path: "/marketingQuotation",
    redirect: "/marketingQuotation/index",
    component: Layout,
    meta: {
      title: "总经理审批",
      hidden: false
    },
    children: [
      // {
      //   path: "/marketingQuotation/index",
      //   component: () => import("@/views/marketingQuotation/old.vue"),
      //   name: "marketingQuotation",
      //   meta: {
      //     title: "总经理审批"
      //   }
      // },
      {
        path: "/marketingQuotation/indexFirst",
        component: () => import("@/views/marketingQuotation/indexFirst.vue"),
        name: "indexFirst",
        meta: {
          title: "总经理审批1"
        }
      },
      {
        path: "/marketingQuotation/indexSecond",
        // component: () => import("@/views/demandApply/marketingApproval.vue"),
        component: () => import("@/views/marketingQuotation/indexSecond.vue"),
        name: "indexSecond",
        meta: {
          title: "总经理审批2"
        }
      }
    ]
  },
  {
    path: "/bomView",
    redirect: "/bomView/index",
    component: Layout,
    meta: {
      title: "BOM查看"
      // hidden: true
    },
    children: [
      {
        path: "/bomView/elec",
        component: () => import("@/views/bomView/elec.vue"),
        name: "elecView",
        meta: {
          title: "电子料BOM查看"
        }
      },
      {
        path: "/bomView/struc",
        component: () => import("@/views/bomView/struc.vue"),
        name: "strucView",
        meta: {
          title: "结构料BOM查看"
        }
      }
      // {
      //   path: "/bomView/index",
      //   component: () => import("@/views/bomView/index.vue"),
      //   name: "bomView",
      //   meta: {
      //     title: "BOM查看"
      //   }
      // }
    ]
  },

  {
    path: "/summaryTable",
    redirect: "/summaryTable/index",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/summaryTable/index",
        component: () => import("@/views/summaryTable/index.vue"),
        name: "summaryTable",
        meta: {
          title: "汇总表"
        }
      }
    ]
  },

  {
    path: "/archive",
    redirect: "/archive/index",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/archive/index",
        component: () => import("@/views/archive/index.vue"),
        name: "archive",
        meta: {
          title: "归档"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限（roles 属性）的路由
 * 必须带有 name 属性
 */
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/timeliness",
    redirect: "/timeliness/index",
    component: Layout,
    meta: {
      roles: ["timeliness"]
    },
    children: [
      {
        path: "/timeliness/index",
        component: () => import("@/views/versionManagement/timeliness.vue"),
        name: "timeliness",
        meta: {
          title: "时效性查询"
        }
      },
      {
        path: "/timeliness/operationRecord",
        component: () => import("@/views/versionManagement/operationRecord.vue"),
        name: "timelinessOperationRecord",
        meta: {
          title: "时效性管理",
          hidden: false
        }
      }
    ]
  },
  {
    path: "/",
    redirect: "/todoCenter/index",
    component: Layout,
    meta: {
      title: "关闭流程",
      roles: ["closeFlow"]
    },
    children: [
      {
        path: "/timeliness/closeFlow",
        component: () => import("@/views/versionManagement/closeFlow.vue"),
        name: "closeFlowPage",
        meta: {
          title: "关闭流程"
        }
      }
    ]
  },
  {
    path: "/processHoursExport",
    redirect: "/processHoursExport/index",
    component: Layout,
    meta: {
      //roles: ["admin"]
      title: "工序工时"
    },
    children: [
      {
        path: "/processHoursExport/index",
        component: () => import("@/views/processHoursExport/index.vue"),
        name: "processHoursExport",
        meta: {
          title: "工序工时导入"
        }
      },
      {
        path: "/processHoursExport/processLib",
        component: () => import("@/views/processHoursExport/processLib.vue"),
        name: "processLib",
        meta: {
          title: "工序库"
        }
      },
      {
        path: "/processHoursExport/workingHours",
        component: () => import("@/views/processHoursExport/workingHours.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "workingHours",
        meta: {
          title: "工时库"
        }
      },
      {
        path: "/processHoursExport/environment",
        component: () => import("@/views/processHoursExport/environment.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "environment",
        meta: {
          title: "环境"
        }
      },
      {
        path: "/processHoursExport/emc",
        component: () => import("@/views/processHoursExport/emc.vue"),
        //component: () => import("@/views/processImport/index.vue"),
        name: "emc",
        meta: {
          title: "emc"
        }
      },
      {
        path: "/processHoursExport/workClothes",
        component: () => import("@/views/processHoursExport/workClothes.vue"),
        name: "baseLibLog",
        meta: {
          title: "工装库"
        }
      },
      {
        path: "/processHoursExport/deviceLib",
        component: () => import("@/views/processHoursExport/deviceLib.vue"),
        name: "deviceLib",
        meta: {
          title: "设备库"
        }
      },
      {
        path: "/processHoursExport/fixture",
        component: () => import("@/views/processHoursExport/fixture.vue"),
        name: "fixture",
        meta: {
          title: "治具检具"
        }
      },
      {
        path: "/processHoursExport/softwareHardware",
        component: () => import("@/views/processHoursExport/softwareHardware.vue"),
        name: "softwareHardware",
        meta: {
          title: "硬件及软件"
        }
      },
      {
        path: "/processHoursExport/logisticsCost",
        component: () => import("@/views/processHoursExport/logisticsCost.vue"),
        name: "logisticsCost",
        meta: {
          title: "物流成本录入"
        }
      },
      {
        path: "/processHoursExport/standardProcess",
        component: () => import("@/views/processHoursExport/standardProcess.vue"),
        name: "standardProcess",
        meta: {
          title: "标准工艺库"
        }
      },
      {
        path: "/processHoursExport/COBManufactureCost",
        component: () => import("@/views/processHoursExport/COBManufactureCost.vue"),
        name: "COBManufactureCost",
        meta: {
          title: "COB制造成本录入"
        }
      }
    ]
  },
  {
    path: "/versionManagement",
    redirect: "/versionManagement/index",
    component: Layout,
    meta: {
      title: "版本管理",
      roles: ["admin"]
    },
    children: [
      {
        path: "/versionManagement/index",
        component: () => import("@/views/versionManagement/index.vue"),
        name: "versionManagement",
        meta: {
          title: "版本管理"
        }
      },
      {
        path: "/versionManagement/operationRecord",
        component: () => import("@/views/versionManagement/operationRecord.vue"),
        name: "operationRecord",
        meta: {
          title: "时效性管理",
          hidden: false
        }
      },
      {
        path: "/versionManagement/reportQuery",
        component: () => import("@/views/versionManagement/reportQuery.vue"),
        name: "reportQuery",
        meta: {
          title: "报表查询"
        }
      }
    ]
  },
  {
    path: "/departmentManage",
    redirect: "/departmentManage/index",
    component: Layout,
    meta: {
      roles: ["admin"]
    },
    children: [
      {
        path: "/departmentManage/index",
        component: () => import("@/views/departmentManage/index.vue"),
        name: "departmentManage",
        meta: {
          title: "部门管理"
        }
      }
    ]
  },
  {
    path: "/role",
    redirect: "/role/index",
    component: Layout,
    meta: {
      roles: ["admin"]
    },
    children: [
      {
        path: "/role/index",
        component: () => import("@/views/role/index.vue"),
        name: "role",
        meta: {
          title: "角色管理"
        }
      }
    ]
  },
  {
    path: "/user",
    redirect: "/user/index",
    component: Layout,
    meta: {
      roles: ["admin"]
    },
    children: [
      {
        path: "/user/index",
        component: () => import("@/views/user/index.vue"),
        name: "user",
        meta: {
          title: "用户管理"
        }
      }
    ]
  },
  {
    path: "/E-mail",
    redirect: "/E-mail/index",
    component: Layout,
    meta: {
      roles: ["admin"]
    },
    children: [
      {
        path: "/E-mail/index",
        component: () => import("@/views/E-mail/index.vue"),
        name: "E-mail",
        meta: {
          title: "邮箱管理"
        }
      }
    ]
  },
  {
    path: "/dictionary",
    redirect: "/dictionary/index",
    component: Layout,
    meta: {
      roles: ["admin"]
    },
    children: [
      {
        path: "/dictionary/index",
        component: () => import("@/views/dictionary/index.vue"),
        name: "dictionary",
        meta: {
          title: "字典管理"
        }
      },
      {
        path: "/dictionary/detailList",
        component: () => import("@/views/dictionary/detailList.vue"),
        name: "detailList",
        meta: {
          title: "字典管理明细表",
          hidden: true
        }
      }
    ]
  },
  {
    path: "/fnDepartment",
    redirect: "/fnDepartment/index",
    component: Layout,
    meta: {
      title: "财务参数管理"
      // roles: ["finance"]
    },
    name: "fnDepartment",
    children: [
      {
        path: "/fnDepartment/countryLibrary",
        component: () => import("@/views/countryLibrary/index.vue"),
        name: "countryLibrary",
        meta: {
          title: "国家库"
        }
      },
      {
        path: "/fnDepartment/qualityCost",
        component: () => import("@/views/fnDepartment/qualityCost.vue"),
        name: "qualityCost",
        meta: {
          title: "质量成本比例录入"
        }
      },
      {
        path: "/fnDepartment/exchangeRate",
        component: () => import("@/views/fnDepartment/exchangeRate.vue"),
        name: "exchangeRate",
        meta: {
          title: "汇率"
        }
      },
      {
        path: "/fnDepartment/grossProfitMargin",
        component: () => import("@/views/fnDepartment/grossProfitMargin.vue"),
        name: "grossProfitMargin",
        meta: {
          title: "毛利率"
        }
      },
      {
        path: "/fnDepartment/unitPriceImport",
        component: () => import("@/views/fnDepartment/unitPriceImport.vue"),
        name: "unitPriceImport",
        meta: {
          title: "单价库导入"
        }
      },
      {
        path: "/fnDepartment/fulllifeCycle",
        component: () => import("@/views/fnDepartment/fulllifeCycle.vue"),
        name: "fulllifeCycle",
        meta: {
          title: "制造成本计算参数维护"
        }
      },
      {
        path: "/fnDepartment/rateEntry",
        component: () => import("@/views/fnDepartment/rateEntry.vue"),
        name: "rateEntry",
        meta: {
          title: "作业价格"
        }
      }
      // {
      //   path: "/fnDepartment/nreCoreDevices",
      //   component: () => import("@/views/fnDepartment/nreCoreDevices.vue"),
      //   name: "nreCoreDevices",
      //   meta: {
      //     title: "nre核心"
      //   }
      // }
    ]
  },
  {
    path: "/basicLibrary",
    redirect: "/basicLibrary/publicMaterial",
    component: Layout,
    meta: {
      title: "基础库管理"
    },
    children: [
      {
        path: "publicMaterial",
        component: () => import("@/views/basicLibrary/publicMaterial.vue"),
        name: "publicMaterial",
        meta: {
          title: "共用物料库"
        }
      }
    ]
  },
  {
    path: "/financeDepartment",
    redirect: "/financeDepartment/selfBuilt",
    component: Layout,
    children: [
      {
        path: "selfBuilt",
        component: () => import("@/views/financeDepartment/selfBuiltTable.vue"),
        name: "selfBuilt",
        meta: {
          title: "自建项目表"
        }
      }
    ]
  },
  {
    path: "/engineeringDepartment",
    redirect: "/engineeringDepartment/lossRate",
    component: Layout,
    children: [
      {
        path: "lossRate",
        component: () => import("@/views/engineeringDepartment/lossRate.vue"),
        name: "lossRate",
        meta: {
          title: "损耗率-参数"
        }
      }
    ]
  },
  {
    path: "/",
    redirect: "/UpdateLogInfo/index",
    component: Layout,
    meta: {
      title: "更新日志"
    },
    children: [
      {
        path: "/UpdateLogInfo/index",
        component: () => import("@/views/UpdateLogInfo/index.vue"),
        name: "UpdateLogInfo",
        meta: {
          title: "更新日志"
        }
      }
    ]
  },
  {
    path: "/engineeringParameters",
    redirect: "/engineeringParameters/followLineTangent",
    component: Layout,
    meta: {
      title: "工程部维护参数"
    },
    children: [
      {
        path: "followLineTangent",
        component: () => import("@/views/tangentHours/index.vue"),
        name: "followLineTangent",
        meta: {
          title: "切线工时"
        }
      }
    ]
  },
  // {
  //   path: "/permission",
  //   component: Layout,
  //   redirect: "/permission/page",
  //   name: "Permission",
  //   meta: {
  //     title: "权限管理",
  //     icon: "lock",
  //     roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page.vue"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "页面权限",
  //         roles: ["admin"] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive.vue"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // },
  {
    path: "/:pathMatch(.*)*", // 必须将 'ErrorPage' 路由放在最后, Must put the 'ErrorPage' route at the end
    component: Layout,
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      title: "错误页面",
      icon: "404",
      hidden: true
    },
    children: [
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        name: "401",
        meta: {
          title: "401"
        }
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        name: "404",
        meta: {
          title: "404"
        }
      }
    ]
  }
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  ;``
  // 注意：所有动态路由路由必须带有 name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器，不过体验不是很好
    window.location.reload()
  }
}

export default router
