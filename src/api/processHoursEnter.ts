import { request,baseDomain} from "@/utils/service"
const uploadAction = baseDomain + "api/services/app/ProcessHoursEnter/UploadProcessHoursEnter"

export {uploadAction}

export interface QueryParams {
  AuditFlowId:Number,
  SolutionId:Number
}
  /**
/** 工序列表 */
export function GetListAll(data: QueryParams) {
    return request({
      url: "/api/services/app/ProcessHoursEnter/GetListAll",
      method: "get",
      data
    })
}


export function getListUphOrLine(data: QueryParams) {
  return request({
    url: "/api/services/app/ProcessHoursEnter/GetListUphOrLine",
    method: "get",
    data
  })
}

//查询工序详细
export function getProcessHourDetail(id: number) {
    return request({
      url: "/api/services/app/ProcessHoursEnter/GetById",
      method: "get",
      data: {
        id
      }
    })
 }

/** 创建工序 */
export function handleCreate(data:any) {
    return request({
      url: "/api/services/app/ProcessHoursEnter/Create",
      method: "post",
      data: data
    })
  }

 /** 修改工序 */
export function handleUpdate(data:any) {
    return request({
      url: "/api/services/app/ProcessHoursEnter/Update",
      method: "put",
      data
    })
  }
/** 删除工序 */
  export function handleDelete(id: number | undefined) {
    return request({
      url: "/api/services/app/ProcessHoursEnter/Delete",
      method: "delete",
      data: {
        id
      }
    })
  }


/** 导出 */
export function exportProcess(data:any) {
  return request({
    url: "/api/services/app/ProcessHoursEnter/FoundationProcedureDownloadStream",
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

