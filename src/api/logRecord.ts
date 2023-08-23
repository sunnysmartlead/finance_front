import { request} from "@/utils/service"

  //获取日志
  
//1 工装  2 EMC  3环境 4 工时 5 设备 6 治具 7 硬件及软件  8 工时库 9标准工艺
export function getLogRecord(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/GetListAll",
    method: "get",
    data
  })
}

//保存日志
export function saveOptionLog(data:any){
  return request({
    url: "/api/services/app/FoundationLogs/update",
    method: "put",
    data
  })
}

