export interface VersionManageRequest {
  data: any[]
}

// 版本管理
export interface VersionManageItem {
  projectName: string
  versionNo: string
  processNo: string
  draftTime: string
  pricingEndTime: string
  quotationEndTime: string
}

// 操作记录
export interface RecordItem {
  projectName: string
  versionNo: string
  createTime: string
  lastMotifier: string
  lastMotifyTIme: string
}

export interface ReportItem {
  [x: string]: any
}
