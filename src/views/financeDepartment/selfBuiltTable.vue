<template>
  <div>
    <el-card m="2">
      <template #header>
        <el-row wrap="false" justify="space-between">
          <span>自建表</span>
          <el-row>
            <el-button type="primary" m="2" @click="handleAddTableData">新增</el-button>
            <el-upload
              v-model:file-list="fileList"
              show-file-list
              :action="$baseUrl + 'api/services/app/ProjectSelf/ExcelImport'"
              :on-success="handleSuccess"
              name="fileName"
              :on-error="handleUploadTemplateError"
            >
              <el-button style="margin-top: 8px">自建表导入</el-button>
            </el-upload>
            <!-- <el-button type="primary" @lick="handleExport">自建表导出</el-button> -->
          </el-row>
        </el-row>
      </template>
      <el-row align="middle">
        关键字：
        <el-input v-model="data.selfTableParams.filter" @change="fetchTableData" style="width: 250px" />
        <el-button m="2" @click="onReset" type="primary">重置</el-button>
      </el-row>
      <el-table :data="tableData">
        <el-table-column type="index" label="序号" width="80" fixed="left" />
        <el-table-column label="客户" prop="custom" width="120">
          <template #default="{ row }">
            <el-input v-model="row.custom" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="customName" width="120">
          <template #default="{ row }">
            <el-input v-model="row.customName" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="项目代码" prop="code">
          <template #default="{ row }">
            <el-input v-model="row.code" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="项目描述" prop="description">
          <template #default="{ row }">
            <el-input v-model="row.description" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="子项目代码（WBS）" prop="subCode" width="170">
          <template #default="{ row }">
            <el-input v-model="row.subCode" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="子项目描述" prop="subDescription">
          <template #default="{ row }">
            <el-input v-model="row.subDescription" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" v-if="!row.isEdit" @click="handleStartEdit(row, true)" link>编辑</el-button>
            <el-button type="danger" v-if="!row.isEdit" link @click="handleDelete(row)">删除</el-button>
            <template v-else>
              <el-button type="primary" @click="handleStartEdit(row, false)" link>取消</el-button>
              <el-button type="primary" link @click="handleConfirm(row)">确认</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row justify="end" m="2">
        <el-pagination
          :page-size="20"
          :pager-count="data.selfTableParams.skipCount"
          layout="prev, pager, next"
          :total="data.selfTabletotal"
          background
        />
      </el-row>
    </el-card>
    <el-card m="2" header="日志记录">
      <el-table :data="logList">
        <el-table-column type="index" label="序号" width="80" fixed="left" />
        <el-table-column label="用户" prop="userName" />
        <el-table-column label="操作时间" prop="creationTime" :formatter="formatDatas" />
        <el-table-column label="文本说明" prop="text">
          <template #default="{ row }">
            <el-input v-model="row.text" v-if="row.isEdit" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" v-if="!row.isEdit" @click="handleStartEdit(row, true)" link>编辑</el-button>
            <template v-else>
              <el-button type="primary" @click="handleStartEdit(row, false)" link>取消</el-button>
              <el-button type="primary" link @click="handleConfirmLog(row)">确认</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import {
  CreateProjectSelf,
  UpdateProjectSelf,
  DeleteProjectSelf,
  GetBaseStoreLog,
  GetImportTemplate,
  GetExcelImport,
  GetAllProjectSelf,
  UpdateBaseStoreLog
} from "./common/request"
import { formatDateTime } from "@/utils"
import { downloadFileExcel } from "@/utils"
import type { UploadProps, UploadUserFile } from "element-plus"
import { handleGetUploadProgress, handleUploadTemplateError } from "@/utils/upload"
import { ElMessage } from "element-plus"

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

const logList = ref<any>([])

const fetchTableData = async () => {
  const { result } = await GetAllProjectSelf({
    ...data.selfTableParams,
    maxResultCount: data.selfTableParams.skipCount * 20
  })
  if (result?.items) {
    tableData.value = result?.items
  }
}

const handleConfirm = async (row: any) => {
  console.log(row, "row132")
  if (row.id) {
    handleUpdateProjectSelf(row)
  } else {
    handleCreateProjectSelf(row)
  }
}

const handleStartEdit = (row: any, isEdit: boolean) => {
  row.isEdit = isEdit
}

const handleCreateProjectSelf = async (row: any) => {
  const { success } = await CreateProjectSelf({ ...row })
  if (success) {
    fetchTableData()
  }
}

const handleUpdateProjectSelf = async (row: any) => {
  const { success } = await UpdateProjectSelf({ ...row })
  if (success) {
    fetchTableData()
  }
}

const handleAddTableData = () => {
  tableData.value.unshift({
    custom: "",
    customName: "",
    code: "",
    description: "",
    subCode: "",
    subDescription: "",
    isEdit: true
  })
}

const onReset = () => {
  data.selfTableParams.filter = ""
  fetchTableData()
}

const fetchLogData = async () => {
  const { result } =
    (await GetBaseStoreLog({
      ...data.logFetchParams,
      maxResultCount: (data.logFetchParams.skipCount + 1) * 20
    })) || {}
  if (result?.items) {
    data.selfTabletotal = result.totalCount
    logList.value = result?.items
  }
}

const handleConfirmLog = async (row: any) => {
  const { success } = (await UpdateBaseStoreLog({ ...row })) || {}
  if (success) {
    fetchLogData()
  }
}

const handleDelete = async (row: any) => {
  const { success } = (await DeleteProjectSelf({ id: row.id })) || {}
  if (success) {
    fetchTableData()
  }
}

const formatDatas = (record: any, _row: any, cellValue: any) => {
  return formatDateTime(cellValue) || ""
}

// 自建表导出
// const handleExport = async () => {
//   try {
//     const res: any = await GetExcelImport({
//       auditFlowId,
//       solutionId: productId
//     })
//     downloadFileExcel(res, "项目自建表模板")
//     console.log(res, "自建表导出")
//   } catch (err: any) {
//     console.log(err, "[ 自建表导出 失败 ]")
//   }
// }

// 导入项目自建表
const handleSuccess: UploadProps["onSuccess"] = async (res: any) => {
  if (!res.error) {
    tableData.value = res.result || []
    console.log(res, "导入项目自建表")
    ElMessage.success("导入成功！")
  } else {
    ElMessage.error(res.error.message)
  }
}

onMounted(() => {
  fetchTableData()
  fetchLogData()
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
