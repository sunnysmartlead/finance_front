import { request } from "@/utils/service"

/**
 * foundationReliable
 */
export interface foundationProcedure {
  /**
   * 工装名称
   */
  installationName: string
  /**
   * 名称
   */
  processName: string

  /**
   * 工序名称
   */
  installationSupplier: string
  /**
   * 工装单价
   */
  installationPrice: number
  /**
   * 工序单价
   */
  processNumber: number
  /**
   * 测试线名称
   */
  testName: string

  /**
   * 测试单价
   */
  TestPrice: number
}

/**
 * UserDto
 */
export interface foundationProcedureDto {
  /**
   * 工装名称
   */
  installationName?: String
}

/**
 * ResetPasswordDto
 */

export interface QueryParams {
  ProcessName?: string
}
/** 创建用户 */
export function createFoundationProcedure(data) {
  return request({
    url: "/api/services/app/FoundationProcedure/Create",
    method: "post",
    data: data
  })
}

// 查询岗位详细
export function getFoundationProcedureById(id: number) {
  return request({
    url: "api/services/app/FoundationProcedure/GetAsyncById",
    method: "get",
    data: {
      id
    }
  })
}

/** 修改用户 */
export function updateFoundationProcedure(data) {
  return request({
    url: "/api/services/app/FoundationProcedure/Update",
    method: "put",
    data
  })
}

/** 用户列表 */
export function GetListAll(data: QueryParams) {
  return request({
    url: "api/services/app/FoundationProcedure/GetListAll",
    method: "get",
    data
  })
}
