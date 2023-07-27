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
/** 新增 */
export function createFoundationProcedure(data:any) {
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

/** 修改 */
export function updateFoundationProcedure(data:any) {
  return request({
    url: "/api/services/app/FoundationProcedure/Update",
    method: "put",
    data
  })
}

/** 列表 */
export function getListAll(data: QueryParams) {
  return request({
    url: "api/services/app/FoundationProcedure/GetListAll",
    method: "get",
    data
  })
}
