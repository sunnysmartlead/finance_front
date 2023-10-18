import { request } from "@/utils/service"

  //获取日志

// 获取方案对比表
export function GetSolutionContrast(data:any){
  return request({
    url: "/api/services/app/PriceEvaluation/GetSolutionContrast",
    method: "get",
    data
  })
}

// 下载方案对比表
export function GetSolutionContrastDonwload(data:any){
  return request({
    url: "/api/services/app/PriceEvaluation/GetSolutionContrastDonwload",
    method: "get",
    data,
    responseType: "blob",
  })
}
