import { request,baseDomain} from "@/utils/service"
const prefix="api/services/app/BomEnter"
const uploadAction=baseDomain+prefix+"/UploadFoundationStandardTechnology"

export {uploadAction}


export interface QueryParams {
  AuditFlowId?: Number,
  ProductId?: Number
}
  /**
/** 制造成本列表 */
export function GetListAll(data: QueryParams) {
    return request({
      url: prefix+"/GetListAll",
      method: "get",
      data
    })
}

//制造成本详情
export function getDetail(id: number) {
    return request({
      url: prefix+"/GetAsyncById",
      method: "get",
      data: {
        id
      }
    })
 }

/** 创建 */
export function create(data:any) {
    return request({
      url: prefix+"/Create",
      method: "post",
      data: data
    })
  }

 /** 修改 */
export function update(data:any) {
    return request({
      url: prefix+"/Update",
      method: "put",
      data
    })
  }
/** 删除 */
 export function deleteItem(id: number | undefined) {
    return request({
      url: prefix+"/Delete",
      method: "delete",
      data: {
        id
      }
    })
 }



 
