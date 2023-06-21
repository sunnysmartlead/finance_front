/**
 * UserInputInfo
 */
// export interface UserInputInfo {
//   electronicEngineerNum?: string
//   engineeringTechnologyNum?: string
//   fileId?: number | null | undefined
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
