import { request } from "@/utils/service"

// 创建自建表
export function CreateProjectSelf(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/Create",
    method: "post",
    data
  })
}

// 更新自建表
export function UpdateProjectSelf(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/Update",
    method: "put",
    data
  })
}

// 删除自建表
export function DeleteProjectSelf(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/Delete",
    method: "delete",
    data
  })
}

// 获取基础库日志
export function GetBaseStoreLog(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/GetBaseStoreLog",
    method: "get",
    data
  })
}

// 更新基础库日志
export function UpdateBaseStoreLog(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/UpdateBaseStoreLog",
    method: "put",
    data
  })
}

// 获取导入模板
export function GetImportTemplate(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/GetProjectSelfImport",
    method: "get",
    data,
    responseType: "blob"
  })
}

// 获取导入模板
export function GetExcelImport(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/ExcelImport",
    method: "get",
    data
  })
}

// 获取全部自建表
export function GetAllProjectSelf(data: any) {
  return request({
    url: "/api/services/app/ProjectSelf/GetAll",
    method: "get",
    data
  })
}
