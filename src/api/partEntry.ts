import { request } from "@/utils/service"

// export interface UserInputInfo {
//   electronicEngineerNum?: string
//   engineeringTechnologyNum?: string
//   fileId?: number
//   financeNum?: string
//   id?: number
//   isFirst?: string
//   isNRE?: string
//   productionManagementNum?: string
//   qualityNum?: string
//   resourceManagementNum?: string
//   structureEngineerNum?: string
// }

export interface UserInputInfo {
  auditFlowId: number
  electronicEngineerId?: undefined | string
  engineerLossRateId?: undefined | string
  engineerWorkHourId?: undefined | string
  fileId?: number | null
  id?: number
  isFirst?: undefined | boolean
  product?: undefined | boolean | null
  productId?: number
  productManageId?: undefined | string
  qualityBenchId?: undefined | string
  qualityToolId?: undefined | string
  resourceElecId?: undefined | string
  resourceStructId?: undefined | string
  structureEngineerId?: undefined | string
}

/** 项目经理确认 */
export function PostManagement(data: UserInputInfo) {
  return request({
    url: "/api/services/app/UserInput/PostManagement",
    method: "post",
    data
  })
}
/** 核价团队下拉选择 */
export function GetUserInput() {
  return request({
    url: "/api/services/app/UserInput/GetUserInput",
    method: "get"
  })
}

//根据流程号查询项目经理录入
export function getManagement(auditFlowId: any) {
  return request({
    url: "/api/services/app/UserInput/getManagement",
    method: "get",
    data: {
      auditFlowId
    }
  })
}
