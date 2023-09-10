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

//
/** 获取设备状态枚举列表 */
export function getDeviceStatus() {
  return request({
    url: "api/services/app/ProcessHoursEnter/GetDeviceStatus",
    method: "get",
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

  //保存
  export function handleSaveOption(data:any) {
    return request({
      url: "/api/services/app/ProcessHoursEnter/CreateList ",
      method: "post",
      data: data
    })
  }


  //提交
  export function handleSubmitOption(data:any) {
    return request({
      url: "/api/services/app/ProcessHoursEnter/CreateSubmit ",
      method: "post",
      data: data
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


export function downLoad3DImg(data:any) {
  return request({
    url: "/api/services/app/WorkingHours/GetPicture3DByAuditFlowId",
    method: "get",
    data: data
  })
}


export function FindStructureBomByProcess(data:any) {
  return request({
    url: "/api/services/app/StructionBom/FindStructureBomByProcess",
    method: "post",
    responseType:'blob',
    data: data
  })
}

export function FindElectronicBomByProcess(data:any) {
  return request({
    url: "/api/services/app/ElectronicBom/FindElectronicBomByProcess",
    method: "post",
    responseType:'blob',
    data: data
  })
}


export function GetBoardInfomation(data: any) {
  return request({
    url: "/api/services/app/ElectronicBom/GetBoardInfomation",
    method: "get",
    data
  })
}


//获取硬件设备下拉列表
export function getHardWareListForSelect(data: any) {
  return request({
    url: "/api/services/app/FoundationHardwareItem/GetListAll",
    method: "get",
    data
  })
}
//获取下拉治具列表
export function getZhiJuListForSelect(data: any) {
  return request({
    url: "/api/services/app/FoundationFixtureItem/GetListAll",
    method: "get",
    data
  })
}

//获取下拉检具列表
export function getJianJuListForSelect(data: any) {
  return request({
    url: "/api/services/app/FoundationFixture/GetListAll",
    method: "get",
    data
  })
}

//获取下拉工装列表
export function getWorkClothsListForSelect(data: any) {
  return request({
    url: "/api/services/app/FoundationProcedure/GetListAll",
    method: "get",
    data
  })
}

export function GetEditorByProcessNumber(data: any) {
  return request({
    url: "/api/services/app/ProcessHoursEnter/GetEditorByProcessNumber",
    method: "get",
    data
  })
}