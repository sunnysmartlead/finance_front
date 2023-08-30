import { request } from "@/utils/service"
export function ProductDevelopmentDepartmentReview(data: any) {
  return request({
    url: "/api/services/app/DemandApplyAudit/ProductDevelopmentDepartmentReview",
    method: "post",
    data
  })
}
