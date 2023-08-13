import { request,baseDomain} from "@/utils/service"

const uploadAction=baseDomain+"api/services/app/FoundationStandardTechnology/UploadFoundationStandardTechnology"

export {uploadAction}

const prefix="/api/services/app/FoundationStandardTechnology"

export interface QueryParams {
  name?: string
}
  /**
/** 标准工艺列表 */
export function getListAll(data: QueryParams) {
    return request({
      url: prefix+"/GetListAll",
      method: "get",
      data
    })
}

//查询工序详细
export function getDetail(id: number) {
    return request({
      url: prefix+"/GethsyncById",
      method: "get",
      data: {
        id
      }
    })
 }

/** 创建工序 */
export function create(data:any) {
    return request({
      url: prefix+"/Create",
      method: "post",
      data: data
    })
  }

 /** 修改工序 */
export function update(data:any) {
    return request({
      url: prefix+"/Update",
      method: "put",
      data
    })
  }
/** 删除工序 */
 export function deleteProcess(id: number | undefined) {
    return request({
      url: prefix+"/Delete",
      method: "delete",
      data: {
        id
      }
    })
 }


//1 工装  2 EMC  3环境 4 工序 5 设备 6 治具 7 硬件及软件  8 工时库 9标准工艺

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

