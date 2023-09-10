import { request } from "@/utils/service"

export interface baseDto {
  /**
   * 流程表ID
   */
  auditFlowId?: number
  /**
   * MoudelCount表id
   */
  productId?: number
}
/**
 * TangentSaveDto，保存工序工时是传入Dto
 */
export interface TangentSaveDto {
  /**
   * 流程表ID
   */
  auditFlowId?: number
  /**
   * 是否成功标志位
   */
  isSuccess?: boolean
  /**
   * 错误信息
   */
  message?: null | string
  /**
   * MoudelCount表id
   */
  productId?: number
  /**
   * 切线工时详细信息
   */
  tangentHoursDetailList?: TangentHoursDetail[] | null
  /**
   * UPH
   */
  uph?: number
}

/**
 * TangentHoursDetail，切线工时
 */
export interface TangentHoursDetail {
  /**
   * 标准人工工时
   */
  laborTime?: number
  /**
   * 标准机器工时
   */
  machineHours?: number
  /**
   * 原【人员数量】字段改成【人均跟线数量】
   */
  personnelNumber?: number
  /**
   * 年份
   */
  year?: number
}
/** 保存切线工时 */
export function saveTangentHours(data: TangentSaveDto) {
  return request({
    url: "/api/services/app/WorkingHours/SaveTangentHours",
    method: "post",
    data
  })
}

// /** 修改国家 */
// export function updateCountry(data: CountryLibraryDto) {
//   return request({
//     url: "/api/services/app/CountryLibrary/EditCountryLibrary",
//     method: "post",
//     data
//   })
// }
// /** 删除国家 */
// export function deleteCountry(id: number) {
//   return request({
//     url: "/api/services/app/CountryLibrary/DeleteCountryLibrary",
//     method: "delete",
//     data: {
//       id
//     }
//   })
// }

/** 获取切线工时列表 */
export function getTangentHoursList(data: baseDto) {
  return request({
    url: "/api/services/app/WorkingHours/GetTangentHoursList",
    method: "post",
    data
  })
}

/** 工序工时及切线工时界面提交
 */
export function submitWorkingHourAndSwitchLine(auditFlowId: number | string) {
  return request({
    url: "/api/services/app/WorkingHours/SubmitWorkingHourAndSwitchLine",
    method: "post",
    data: {
      auditFlowId
    }
  })
}
