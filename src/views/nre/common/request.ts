import { request } from "@/utils/service"
import {
  ProductDepartmentModel,
  ProjectManagementModel,
  ResourcesManagementModel,
  NreMarketingDepartmentModel
} from "../data.type"

// 项目管理部录入
export function PostProjectManagement(data: {
  /**
   * 流程Id
   */
  auditFlowId?: number
  /**
   * Nre核价 项目管理部 实体
   */
  projectManagement?: ProjectManagementModel | null
}): any {
  return request({
    url: "/api/services/app/NrePricing/PostProjectManagementSingle",
    method: "post",
    data
  })
}

// 产品部-电子工程师 录入
export function PostProductDepartment(data: {
  /**
   * 流程Id
   */
  auditFlowId?: number
  solutionId: number
  isSubmit: boolean
  /**
   * 实验费 实体类
   */
  productDepartmentModels?: ProductDepartmentModel | null
}): any {
  return request({
    url: "/api/services/app/NrePricing/PostProductDepartmentSingle",
    method: "post",
    data
  })
}

// Nre 品保部=>项目制程QC量检具 录入(单个零件)
export function PostQADepartment(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/PostQcGaugeSingle",
    method: "post",
    data
  })
}

// Nre 品保部=>试验项目 录入
export function PostExperimentItems(data: {
  /**
   * 流程Id
   */
  auditFlowId?: number
  solutionId?: number
  /**
   * 带零件id 的 品保录入模型
   */
  environmentalExperimentFeeModels?: any
  isSubmit: boolean
}): any {
  return request({
    url: "/api/services/app/NrePricing/PostExperimentItemsSingle",
    method: "post",
    data
  })
}

// 资源部录入
export function PostResourcesManagement(data: {
  /**
   * 流程Id
   */
  auditFlowId?: number
  /**
   * Nre核价  资源部录入 实体
   */
  resourcesManagementModels?: ResourcesManagementModel | null
}): any {
  return request({
    url: "/api/services/app/NrePricing/PostResourcesManagementSingle",
    method: "post",
    data
  })
}

// 资源部录入初始值
export function GetInitialResourcesManagement(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/NrePricing/GetInitialResourcesManagementSingle",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}

// 计算 模具清单的 数量以及费用
export function PostCalculateMouldInventory(data: {
  /**
   * 零件Id
   */
  solutionId?: number
  /**
   * Nre核价  资源部录入 实体
   */
  mouldInventory?: ResourcesManagementModel | null
}): any {
  return request({
    url: "/api/services/app/NrePricing/PostCalculateMouldInventorySingle",
    method: "post",
    data
  })
}

// Nre 资源部录入初始值
export function GetInitialResourcesManagementSingle(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/GetInitialResourcesManagementSingle",
    method: "get",
    data
  })
}
// Nre 营销部录入初始值
export function GetInitialSalesDepartment(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/GetInitialSalesDepartment",
    method: "get",
    data
  })
}

// Ner 营销部录入
export function PostSalesDepartment(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/PostResourcesManagementSingle",
    method: "post",
    data
  })
}

/**NRE 核价表 */

export function GetPricingForm(data: { auditFlowId: number; solutionId: number }): any {
  return request({
    url: "/api/services/app/NrePricing/GetPricingForm",
    method: "get",
    data
  })
}

// Nre项目管理部 获取版本录入过的值
export function GetReturnProjectManagement(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/NrePricing/GetReturnProjectManagementSingle",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}

// Nre项目管理部 获取版本录入过的值
export function GetReturnExperimentItems(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/NrePricing/GetReturnExperimentItemsSingle",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}

// Nre 品保部=>项目制程QC量检具 录入过的值(单个零件)
export function GetReturnQcGauge(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/NrePricing/GetReturnQcGaugeSingle",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}

// Ner 营销部 录入过的值
export function GetReturnInitialSalesDepartment(Id: number): any {
  return request({
    url: "/api/services/app/NrePricing/GetInitialResourcesManagementSingle",
    method: "get",
    data: {
      Id
    }
  })
}

// 产品部-电子工程师 录入过的值(单个零件)
export function GetProductDepartment(auditFlowId: number, solutionId: number): any {
  return request({
    url: "/api/services/app/NrePricing/GetProductDepartmentSingle",
    method: "get",
    data: {
      auditFlowId,
      solutionId
    }
  })
}

//  初版NRE核价表下载
export function NreTableDownload(data: any) {
  return request({
    url: "/api/services/app/PriceEvaluation/NreTableDownload",
    method: "get",
    data,
    responseType: "blob"
  })
}

//  Nre 品保部=>试验项目 产品开发部-NRE 下载
export function GetExportOfProductDepartmentFeeForm(data: any) {
  return request({
    url: "/api/services/app/NrePricing/GetExportOfProductDepartmentFeeForm",
    method: "get",
    data,
    responseType: "blob"
  })
}

//  Nre 品保部=>试验项目 产品开发部-NRE 下载
export function GetExportOfEnvironmentalExperimentFeeForm(data: any) {
  return request({
    url: "/api/services/app/NrePricing/GetExportOfEnvironmentalExperimentFeeForm",
    method: "get",
    data,
    responseType: "blob"
  })
}

// 获取 产品开发部-NRE 实验费
export function GetFoundationEmc(data: any) {
  return request({
    url: "/api/services/app/FoundationEmc/GetListAll",
    method: "get",
    data
  })
}

//  Nre 产品部-电子工程师 导入数据
export function PostProductDepartmentSingleExcel(data: any) {
  return request({
    url: "/api/services/app/NrePricing/PostProductDepartmentSingleExcel",
    method: "post",
    data,
    responseType: "blob"
  })
}

//  Nre 品保部=>试验项目 导入数据(Excel 单个零件解析数据)
export function PostExperimentItemsSingleExcel(data: any) {
  return request({
    url: "/api/services/app/NrePricing/PostExperimentItemsSingleExcel",
    method: "post",
    data,
    responseType: "blob"
  })
}

// 获取环境实验费
export function GetFoundationreliableList(data: any): any {
  return request({
    url: "/api/services/app/Foundationreliable/GetListAll",
    method: "get",
    data
  })
}

// 手板件费用修改项添加
export function AdditionOfCostModificationItemsForHandBoards(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AdditionOfCostModificationItemsForHandBoards",
    method: "post",
    data
  })
}

// 模具费用修改项添加
export function AddMoldCostModificationItem(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AddMoldCostModificationItem",
    method: "post",
    data
  })
}

// 工装费用修改项添加
export function AddToolingCostModificationItem(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AddToolingCostModificationItem",
    method: "post",
    data
  })
}

// 治具费用修改项添加
export function AdditionOfFixtureCostModificationItem(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AdditionOfFixtureCostModificationItem",
    method: "post",
    data
  })
}

// 检具费用修改项添加
export function AddInspectionToolCostModificationItem(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AddInspectionToolCostModificationItem",
    method: "post",
    data
  })
}

// 生产设备费用修改项添加
export function AddProductionEquipmentCostModificationItem(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AddProductionEquipmentCostModificationItem",
    method: "post",
    data
  })
}

// 实验费用修改项添加
export function AddExperimentalFeeModificationItem(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AddExperimentalFeeModificationItem",
    method: "post",
    data
  })
}

// 测试软件费用修改项添加
export function AddingModificationItemsForTestingSoftwareCosts(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AddingModificationItemsForTestingSoftwareCosts",
    method: "post",
    data
  })
}

// 差旅费用修改项添加
export function AddTravelExpenseModificationItem(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/AddTravelExpenseModificationItem",
    method: "post",
    data
  })
}

// 其他费用修改项添加
export function OtherExpenseModificationItemsAdded(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/OtherExpenseModificationItemsAdded",
    method: "post",
    data
  })
}
