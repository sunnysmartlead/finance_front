/**
 * SharedMaterialWarehouseModePagedResultDto
 */
export interface Response {
    items?:      SharedMaterialWarehouseMode[] | null;
    totalCount?: number;
}

export interface QueryPublicMaterialWarehouse {
    /**
     * 查询过滤关键字
     */
    Filter?: string;
    /**
     * 每页行数
     */
    MaxResultCount?: number;
    /**
     * 跳过数量
     */
    SkipCount?: number;
}


/**
 * SharedMaterialWarehouseMode，公共物料库 模型
 */
export interface SharedMaterialWarehouseMode {
    /**
     * 装配数量
     */
    assemblyQuantity?: number;
    /**
     * 项目名称
     */
    entryName?: null | string;
    /**
     * 物料编码
     */
    materialCode?: null | string;
    /**
     * 物料名称
     */
    materialName?: null | string;
    /**
     * 模组走量
     */
    moduleThroughputs?: YearOrValueModeCanNull[] | null;
    /**
     * 项目子代码
     */
    projectSubcode?: null | string;
}

/**
 * YearOrValueModeCanNull，键值对 一个年份对应一个值可为空 模型
 */
export interface YearOrValueModeCanNull {
    /**
     * 值
     */
    value?: number | null;
    /**
     * 年份
     */
    year?: number;
}
