import { request } from "@/utils/service"
// 获取用户
export function GetUserByDeptName({ deptName, name }: any): any {
  return request({
    url: "/api/services/app/Hr/GetUserByDeptName",
    method: "get",
    data: {
      deptName,
      name,
      skipCount: 1,
      maxResultCount: 20
    }
  })
}
//将任务重置给别人
export function ResetTask({ nodeInstanceId, targetUserId }: any): any {
  return request({
    url: "/api/services/app/WorkflowInstance/ResetTask",
    method: "post",
    data: {
      nodeInstanceId,
      targetUserId
    }
  })
}
/**
 *
 * @param param0 根据名称模糊查询部门

 * @returns
 */
export function GetDepartmentByName({ Name }: any): any {
  return request({
    url: "/api/services/app/Hr/GetDepartmentByName",
    method: "get",
    data: {
      Name,
      skipCount: 1,
      maxResultCount: 30
    }
  })
}

/**
 *
 * @param param0 根据名称模糊查询部门

 * @returns
 */
export function GetUserByDepartmentId({ departmentId }: any): any {
  return request({
    url: "/api/services/app/Hr/GetUserByDepartmentId",
    method: "get",
    data: {
      departmentId,
      skipCount: 1,
      maxResultCount: 30
    }
  })
}
