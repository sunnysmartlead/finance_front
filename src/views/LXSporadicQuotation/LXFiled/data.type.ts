
/**
 * 归档文件下载列表 模型
 */
 export interface PigeonholeDownloadTableModel {
  auditFlowId?: number;
  creationTime?: Date;
  creatorUserId?: number | null;
  deleterUserId?: number | null;
  deletionTime?: Date | null;
  fileId?: number;
  fileName?: null | string;
  filePath?: null | string;
  id?: number;
  isDeleted?: boolean;
  lastModificationTime?: Date | null;
  lastModifierUserId?: number | null;
  productId?: number;
  productName?: null | string;
  quoteProjectName?: null | string;
}
