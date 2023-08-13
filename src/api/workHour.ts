import { request,baseDomain} from "@/utils/service"
const prefix="api/services/app/FoundationWorkingHour"
const uploadAction=baseDomain+prefix+"/UploadFoundationStandardTechnology"

export {uploadAction}



export interface QueryParams {
  ProcessName?: string
}
  /**
/** 工时列表 */
export function GetListAll(data: QueryParams) {
    return request({
      url: prefix+"/GetListAll",
      method: "get",
      data
    })
}

//查询工时详细
export function getDetail(id: number) {
    return request({
      url: prefix+"/GetAsyncById",
      method: "get",
      data: {
        id
      }
    })
 }

/** 创建工时 */
export function create(data:any) {
    return request({
      url: prefix+"/Create",
      method: "post",
      data: data
    })
  }

 /** 修改工时 */
export function update(data:any) {
    return request({
      url: prefix+"/Update",
      method: "put",
      data
    })
  }
/** 删除工时 */
 export function deleteItem(id: number | undefined) {
    return request({
      url: prefix+"/Delete",
      method: "delete",
      data: {
        id
      }
    })
 }



 
