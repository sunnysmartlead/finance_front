import { request } from "@/utils/service"
/**
 * CountryLibraryDto，贸易合规 国家输入参数Dto
 */
/**
 * EditCountryLibraryDto
 */
export interface CountryLibraryDto {
  /**
   * 国家
   */
  country?: null | string
  id?: number
  /**
   * 国家类型
   */
  nationalType?: null | string
  /**
   * 比例
   */
  rate?: null | string
}
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
/** 创建国家 */
export function createCountry(data: CountryLibraryDto) {
  return request({
    url: "/api/services/app/CountryLibrary/AddCountryLibrary",
    method: "post",
    data
  })
}

/** 修改国家 */
export function updateCountry(data: CountryLibraryDto) {
  return request({
    url: "/api/services/app/CountryLibrary/EditCountryLibrary",
    method: "post",
    data
  })
}
/** 删除国家 */
export function deleteCountry(id: number) {
  return request({
    url: "/api/services/app/CountryLibrary/DeleteCountryLibrary",
    method: "delete",
    data: {
      id
    }
  })
}

/** 国家列表 */
export function getCountryLibraryList(data: PagedInputDto) {
  return request({
    url: "/api/services/app/CountryLibrary/PostDCountryLibraryList",
    method: "post",
    data
  })
}
