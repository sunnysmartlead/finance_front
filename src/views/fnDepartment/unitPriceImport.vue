<template>
  <el-card class="unitPrice-import">
    <div class="unitPrice-import__btn-container">
      <div>
        <el-form :model="data.searchForm" inline>
          <el-form-item label="关键字">
            <el-input v-model="data.searchForm.Filter" placeholder="物料编号/单据号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="primary" @click="EvalTableModel">单价库模版下载</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-form :inline="true">
        <el-form-item label="">
          <el-upload
            :action="$baseUrl + 'api/services/app/UnitPriceLibrary/PostUInitPriceForm'"
            :on-success="handleSuccess"
            show-file-list
            :on-progress="handleGetUploadProgress"
            :on-error="handleUploadError"
          >
            <el-button type="primary">单价库导入</el-button>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-button type="primary" @click="data.setVisible = true">模板文件下载</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <el-table :v-loading="data.loading" :data="data.tableData" border style="width: 100%" height="700">
      <el-table-column :label="col.name" :prop="col.key" v-for="col in unitCols" :key="col.key" width="150" />
      <el-table-column label="返点率" prop="uInitPriceFormYearOrValueModes" width="175">
        <el-table-column
          v-for="(item, iIndex) in filter(data.uInitPriceFormYearOrValueModes, (k) => k?.uInitPriceFormType === 0)"
          :key="iIndex"
          :label="item.year"
          :formatter="formatDatas"
        >
          <template #default="{ row }">
            {{ filter(row.uInitPriceFormYearOrValueModes, (k) => k?.uInitPriceFormType === 0)[iIndex].value }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="年降率" width="175">
        <el-table-column
          v-for="(item, iIndex) in filter(data.uInitPriceFormYearOrValueModes, (k) => k?.uInitPriceFormType === 1)"
          :key="iIndex"
          :label="item.year"
          :formatter="formatDatas"
        >
          <template #default="{ row }">
            {{ filter(row.uInitPriceFormYearOrValueModes, (k) => k?.uInitPriceFormType === 1)[iIndex].value }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="年未税价" width="300">
        <el-table-column
          v-for="(item, iIndex) in filter(data.uInitPriceFormYearOrValueModes, (k) => k?.uInitPriceFormType === 2)"
          :key="iIndex"
          :label="item.year"
          :formatter="formatDatas"
        >
          <template #default="{ row }">
            {{ filter(row.uInitPriceFormYearOrValueModes, (k) => k?.uInitPriceFormType === 2)[iIndex].value }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="col.name" :prop="col.key" v-for="col in unitCols2" :key="col.key" width="150" />
    </el-table>
    <el-row justify="end" style="margin-top: 10px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="data.total"
        :page-size="20"
        v-model:currentPage="data.pageNo"
        @update:current-page="handlePageChange"
      />
    </el-row>
  </el-card>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue"
import type { UploadProps } from "element-plus"
import { ElMessageBox, ElMessage, ElLoading } from "element-plus"
import { unitCols, unitCols2 } from "./constant"
import { getUInitPrice, UnitPriceLibraryTemplateDownload } from "./service"
import { filter } from "lodash"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { downloadFileExcel } from "@/utils"
const data = reactive<any>({
  loading: false,
  tableData: [],
  setVisible: false,
  downloadSetForm: {
    number: 0
  },
  searchForm: {
    skipCount: 0,
    maxResultCount: 20,
    Filter: ""
  },
  pageNo: 1,
  total: 0,
  uInitPriceFormYearOrValueModes: []
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



//核价表模版下载
const EvalTableModel=async()=>{
  try {
      const res: any = await UnitPriceLibraryTemplateDownload(null)
      downloadFileExcel(res, "单价库模版")
      ElMessage.success("下载成功！")
  } catch (err:any) {
    console.log(err, "[ 单价库模版下载 失败 ]")
  }
}
// const downLoadTemplate = async () => {
//   let res: any = await DownloadFile(Number(data.downloadSetForm.number))
//   const blob = res
//   const reader = new FileReader()
//   reader.readAsDataURL(blob)
//   reader.onload = function () {
//     let url = URL.createObjectURL(new Blob([blob]))
//     let a = document.createElement("a")
//     document.body.appendChild(a) //此处增加了将创建的添加到body当中
//     a.href = url
//     a.download = "模板文件.xlsx"
//     a.target = "_blank"
//     a.click()
//     a.remove() //将a标签移除
//   }
// }

const getList = async () => {
  data.loading = true
  let { searchForm } = data
  searchForm.skipCount = (data.pageNo - 1) * searchForm.maxResultCount
  let res: any = await getUInitPrice(searchForm)
  data.uInitPriceFormYearOrValueModes = res.result.items[0]?.uInitPriceFormYearOrValueModes
  data.loading = false
  data.tableData = res.result.items
  data.total = res.result.totalCount
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
  margin-top: 20px;

  &__btn-container {
    margin: 20px 0;
    position: relative;
  }
}
</style>
