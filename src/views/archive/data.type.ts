/**
 * 归档文件下载列表 模型
 */
export interface PigeonholeDownloadTableModel {
  /**
   * 归档文件列表id
   */
  downloadListSaveId: number
  /**
   * 归档文件名称
   */
  fileName?: null | string
  myProperty?: number
  /**
   * 零件名称
   */
  productName?: null | string
  /**
   * 核报价项目名称
   */
  quoteProjectName?: null | string
}
