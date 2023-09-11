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
 * WorkingHoursV2Dto
 */
export interface WorkingHoursV2Dto {
  /**
   * 人工工时
   */
  laborHour?: number
  /**
   * 机器工时
   */
  machineHour?: number
  /**
   * 人均跟线数量
   */
  perFollowUpQuantity?: number
  /**
   * 年份
   */
  year?: number
}

/**
 * PagedInputDto，分页Dto
 */
export interface PagedInputDto {
  /**
   * 每页行数
   */
  maxResultCount?: number
  /**
   * 当前第几页，下标从0开始,第一页传过来为0
   */
  pageIndex?: number
  /**
   * 跳过数量
   */
  skipCount?: number
}
/** 保存切线工时 */
export function addFollowLineTangent(data: WorkingHoursV2Dto) {
  return request({
    url: "/api/services/app/WorkingHoursV2/AddFollowLineTangent",
    method: "post",
    data
  })
}

/** 修改切线工时 */
export function editFollowLineTangent(data: WorkingHoursV2Dto) {
  return request({
    url: "/api/services/app/WorkingHoursV2/EditFollowLineTangent",
    method: "post",
    data
  })
}
// /** 删除切线工时 */
export function deleteFollowLineTangent(id: number) {
  return request({
    url: "/api/services/app/WorkingHoursV2/DeleteFollowLineTangent",
    method: "delete",
    data: {
      id
    }
  })
}

/** 获取切线工时列表 */
export function getTangentHoursList(data: PagedInputDto) {
  return request({
    url: "/api/services/app/WorkingHoursV2/PostFollowLineTangentList",
    method: "post",
    data
  })
}
