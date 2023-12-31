<template>
  <div>
    <el-card m="2">
      <template #header>
        <el-row wrap="false" justify="space-between">
          <span>损耗率-参数</span>
          <el-row>
            <CommonUpload path="api/services/app/UnitPriceLibrary/LossRateImport" btn-text="损耗率导入"
              v-model="fileList" :onSuccess="handleSuccess" />
            <el-button m="2" type="primary" @click="handleExport">损耗率导出</el-button>
            <el-button m="2" type="primary" @click="handleExportTemplate">损耗率模板导出</el-button>
          </el-row>
        </el-row>
      </template>
      <el-row align="middle">
        关键字：
        <el-input v-model="data.selfTableParams.filter" @change.enter="fetchTableData" style="width: 250px" />
        <el-button m="2" @click="onReset" type="primary">重置</el-button>
      </el-row>
      <el-table :data="tableData" height="500">
        <el-table-column label="产品大类" prop="superType" width="120">
          <template #default="{ row }">
            <el-input v-model="row.superType" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="物料大类" prop="materialCategory" width="120">
          <template #default="{ row }">
            <el-input v-model="row.materialCategory" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="物料种类" prop="categoryName" width="120">
          <template #default="{ row }">
            <el-input v-model="row.categoryName" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in lossRateYearList" :key="item.year" :label="item.yearAlias"
          :prop="`lossRateYearList.${index}.rate`" width="120">
          <template #default="{ row }">
            <el-input v-model="row.lossRateYearList[index].rate" v-if="row.isEdit" />
          </template>
        </el-table-column>
      </el-table>
      <el-row justify="end" m="2">
        <el-pagination :page-size="20" :pager-count="data.selfTableParams.skipCount" layout="prev, pager, next"
          :total="data.selfTabletotal" background @current-change="(val) => changeCurrent(val, data.selfTableParams)" />
      </el-row>
    </el-card>
    <LogList :type="12" ref="logListRef" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from "vue"
import {
  LossRateQuery,
  LossRateImport,
  ExportOfLossRateTemplate,
  LossRateExport,
} from "./common/request"
import { downloadFileExcel } from "@/utils"
import type { UploadProps, UploadUserFile } from "element-plus"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import LogList, { LogListAPI } from "@/components/LogList/index.vue"
import CommonUpload from '@/components/CommonUpload/index.vue'

const data = reactive({
  selfTabletotal: 0,
  selfTableParams: {
    filter: "",
    skipCount: 1
  },
  logFetchParams: {
    filter: "",
    skipCount: 1,
    maxResultCount: 20
  },
  logListTotal: 0
})
const fileList = ref<UploadUserFile[]>([])
const tableData = ref<any>([])
const lossRateYearList = ref<any>([])
const logListRef = ref<LogListAPI | null>(null)

watch(
  () => data.selfTableParams.skipCount,
  () => {
    fetchTableData()
  },
  {
    deep: true
  }
)

const changeCurrent = (val: number, row: any) => {
  row.skipCount = val
}

const fetchTableData = async () => {
  const { result }: any = await LossRateQuery({
    ...data.selfTableParams,
    skipCount: (data.selfTableParams.skipCount - 1) * 20,
    maxResultCount: 20
  })
  if (result?.items) {
    lossRateYearList.value = result?.items[0]?.lossRateYearList
    console.log("更新了")
    setTimeout(() => {
      tableData.value = result?.items
    }, 200);
    data.selfTabletotal = result?.totalCount
  }
}


const handleStartEdit = (row: any, isEdit: boolean) => {
  row.isEdit = isEdit
}

const onReset = () => {
  data.selfTableParams.filter = ""
  fetchTableData()
}

// 损耗率-参数导出
const handleExport = async () => {
  try {
    const res: any = await LossRateExport({})
    downloadFileExcel(res, "损耗率-参数")
    console.log(res, "损耗率-参数模板")
  } catch (err: any) {
    console.log(err, "[ 损耗率-参数模板 失败 ]")
  }
}

const handleExportTemplate = async () => {
  try {
    const res: any = await ExportOfLossRateTemplate({})
    downloadFileExcel(res, "损耗率-参数模板")
    console.log(res, "损耗率-参数模板")
  } catch (err: any) {
    console.log(err, "[ 损耗率-参数模板 失败 ]")
  }
}

// 导入项目自建表
const handleSuccess: UploadProps["onSuccess"] = async (res: any) => {
  if (!res.error) {
    tableData.value = res.result || []
    console.log(res, "导入项目自建表")
    ElMessage.success("导入成功！")
    fetchTableData()
    logListRef.value?.onRefresh()
    console.log(logListRef.value, "123123")
  } else {
    ElMessage.error(res.error.message)
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onMounted(() => {
  fetchTableData()
})
</script>

<style lang="scss" scoped>
.log-card {
  width: 400px;
}

.time {
  margin: 5px 10px;
}
</style>
