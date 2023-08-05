import { request,baseDomain} from "@/utils/service"

export {baseDomain}

export interface QueryParams {
  name?: string
  classification?: string
}
/** 创建用户 */
export function createFoundationEmc(data) {
  return request({
    url: "/api/services/app/FoundationEmc/Create",
    method: "post",
    data: data
  })
}

// 查询岗位详细
export function getFoundationEmcById(id: number) {
  return request({
    url: "api/services/app/FoundationEmc/GetAsyncById",
    method: "get",
    data: {
      id
    }
  })
}

/** 修改用户 */
export function updateFoundationEmc(data) {
  return request({
    url: "/api/services/app/FoundationEmc/Update",
    method: "put",
    data
  })
}
/** 删除用户 */
export function deleteFoundationEmc(id: number | undefined) {
  return request({
    url: "/api/services/app/FoundationEmc/Delete",
    method: "delete",
    data: {
      id
    }
  })
}

/** 用户列表 */
export function GetListAll(data: QueryParams) {
  return request({
    url: "api/services/app/FoundationEmc/GetListAll",
    method: "get",
    data
  })
}

//获取日志
export function getLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/GetListAll",
    method: "get",
    data
  })
}


//获取日志
export function getEmcLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/GetListAll",
    method: "get",
    data
  })
}

//保存日志
export function saveEmcLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/update",
    method: "put",
    data
  })
}