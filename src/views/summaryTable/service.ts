import { request } from "@/utils/service"
export function GetUserInput() {
  return request({
    url: "/api/services/app/UserInput/GetUserInput",
    method: "get"
  })
}
