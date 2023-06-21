<template>
  <div class="unitPrice-import">
    <div class="unitPrice-import__btn-container">
      <div>
        <el-form :model="data.searchForm" inline>
          <el-form-item label="关键字">
            <el-input v-model="data.searchForm.Filter" placeholder="物料编号/单据号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="">
          <el-upload
            :action="$baseUrl + 'api/services/app/UnitPriceLibrary/ImportPublicMaterialWarehouse'"
            :on-success="handleSuccess"
            show-file-list
            :on-progress="handleGetUploadProgress"
            :on-error="handleUploadError"
          >
            <el-button type="primary">共用库导入</el-button>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-button type="primary" @click="data.setVisible = true">模板文件下载</el-button>
        </el-form-item> -->
      </el-form>
      <el-table :data="data.tableData" border style="width: 100%" height="700">
        <el-table-column :label="col.name" :prop="col.key" v-for="col in unitCols" :key="col.key" width="150" />
        <el-table-column label="模组走量" prop="moduleThroughputs" width="175">
          <el-table-column
            v-for="(item, iIndex) in data.moduleThroughputs"
            :key="iIndex"
            :prop="`moduleThroughputs.${iIndex}.value`"
            :label="item.year"
            :formatter="formatDatas"
          />
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="data.total"
        :page-size="20"
        v-model:currentPage="data.pageNo"
        @update:current-page="handlePageChange"
        style="margin-top: 10px"
      />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue"
import type { UploadProps } from "element-plus"
import { ElMessageBox } from "element-plus"
import { unitCols } from "./common/const"
import { getQueryPublicMaterialWarehouse } from "./service"
import { filter } from "lodash"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"

const data = reactive<any>({
  tableData: [],
  pageNo: 1,
  total: 0,
  searchForm: {
    skipCount: 0,
    maxResultCount: 20,
    Filter: ""
  },
  moduleThroughputs: []
})

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  console.log(res)
  if (res.success) {
    let { searchForm } = data
    searchForm.skipCount = 0
    data.pageNo = 1
    getList()
    ElMessageBox.alert("上传成功", "成功", {
      type: "success",
      confirmButtonText: "OK"
    })
  } else {
    ElMessageBox.alert(res.error.message, "提醒", {
      type: "warning",
      confirmButtonText: "OK"
    })
  }
}

const getList = async () => {
  let { searchForm } = data
  searchForm.skipCount = (data.pageNo - 1) * searchForm.maxResultCount
  let res: any = await getQueryPublicMaterialWarehouse(searchForm)
  data.moduleThroughputs = res.result.items[0]?.moduleThroughputs
  console.log(data.moduleThroughputs, "data.moduleThroughputs")
  setTimeout(() => {
    data.tableData = res.result.items
    data.total = res.result.totalCount
  }, 300)
}

const search = () => {
  getList()
}

const handlePageChange = () => {
  getList()
}

onMounted(() => {
  getList()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

const formatDatas = (record: any, _row: any, cellValue: any) => {
  return cellValue.toFixed(2)
}
</script>
<style lang="scss" scoped>
.unitPrice-import {
  &__btn-container {
    margin: 20px 0;
    position: relative;
  }
}
</style>
