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

// Ner 营销部录入初始值
export function GetInitialResourcesManagementSingle(data: any): any {
  return request({
    url: "/api/services/app/NrePricing/GetInitialResourcesManagementSingle",
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

export function GetPricingForm(data: { Id: number; solutionId: number }): any {
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
