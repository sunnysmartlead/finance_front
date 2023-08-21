import { request,baseDomain} from "@/utils/service"

const uploadAction=baseDomain+"api/services/app/FProcesses/UploadFoundationFProcesses"

export {uploadAction}

export interface QueryParams {
    ProcessName?: string
}
  /**
/** 工序列表 */
export function GetListAll(data: QueryParams) {
    return request({
      url: "/api/services/app/FProcesses/GetListAll",
      method: "get",
      data
    })
}

//查询工序详细
export function getProcessDetail(id: number) {
    return request({
      url: "/api/services/app/FProcesses/GetById",
      method: "get",
      data: {
        id
      }
    })
 }

/** 创建工序 */
export function createProcess(data:any) {
    return request({
      url: "/api/services/app/FProcesses/Create",
      method: "post",
      data: data
    })
  }

 /** 修改工序 */
export function updateProcess(data:any) {
    return request({
      url: "/api/services/app/FProcesses/Update",
      method: "put",
      data
    })
  }
/** 删除工序 */
  export function deleteProcess(id: number | undefined) {
    return request({
      url: "/api/services/app/FProcesses/Delete",
      method: "delete",
      data: {
        id
      }
    })
  }


/** 导出 */
export function exportProcess(data:any) {
  return request({
    url: "/api/services/app/FProcesses/FoundationProcedureDownloadStream",
    method: "post",
    responseType:'blob',
    data: data
  })
}

  //获取日志
export function getProcessLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/GetListAll",
    method: "get",
    data
  })
}

//保存日志
export function saveProcessLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/update",
    method: "put",
    data
  })
}

