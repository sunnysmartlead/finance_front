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
              name="excle"
              :on-error="handleUploadTemplateError"
            >
              <el-button style="margin-top: 8px">自建表导入</el-button>
            </el-upload>
            <el-button m="2" type="primary" @click="handleExport">自建表导出</el-button>
          </el-row>
        </el-row>
      </template>
      <el-row align="middle">
        关键字：
        <el-input v-model="data.selfTableParams.filter" style="width: 250px" />
        <el-button m="2" @click="fetchTableData" type="primary">查询</el-button>
        <el-button m="2" @click="onReset" type="primary">重置</el-button>
      </el-row>
      <el-table :data="tableData" height="500">
        <el-table-column label="id" prop="id" width="80" fixed="left" />
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
          @current-change="(val) => changeCurrent(val, data.selfTableParams)"
        />
      </el-row>
    </el-card>
    <el-card m="2" header="日志记录">
      <el-table :data="logList" height="500">
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
      <el-row justify="end" m="2">
        <el-pagination
          :page-size="20"
          :pager-count="data.logFetchParams.skipCount"
          layout="prev, pager, next"
          :total="data.logListTotal"
          background
          @current-change="(val) => changeCurrent(val, data.logFetchParams)"
        />
      </el-row>
    </el-card>
    <el-dialog v-model="visible" title="新增项目自建表" width="30%" center>
      <el-form ref="formRef" :model="selfForm" :rules="rules" label-width="150px" status-icon>
        <el-form-item label="客户" prop="custom">
          <el-input v-model="selfForm.custom" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customName">
          <el-input v-model="selfForm.customName" />
        </el-form-item>
        <el-form-item label="项目代码" prop="code">
          <el-input v-model="selfForm.code" />
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input type="textarea" v-model="selfForm.description" />
        </el-form-item>
        <el-form-item label="子项目代码（WBS）" prop="subCode">
          <el-input v-model="selfForm.subCode" />
        </el-form-item>
        <el-form-item label="子项目描述" prop="subDescription">
          <el-input type="textarea" v-model="selfForm.subDescription" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-form-item>
          <el-button type="primary" @click="resetForm(formRef)"> 取消 </el-button>
          <el-button @click="submitForm(formRef)">确认</el-button>
        </el-form-item>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from "vue"
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
import { handleUploadTemplateError } from "@/utils/upload"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"

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
const visible = ref(false)
const formRef = ref<FormInstance>()
const selfForm = ref<any>({
  custom: "",
  customName: "",
  code: "",
  description: "",
  subCode: "",
  subDescription: ""
})
const rules = reactive<any>({
  custom: [
    {
      required: true,
      message: "请输入客户",
      trigger: "change"
    }
  ],
  customName: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    }
  ],
  code: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    }
  ],
  subCode: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    }
  ],
})

watch(
  () => data.selfTableParams.skipCount,
  () => {
    fetchTableData()
  },
  {
    deep: true
  }
)

watch(
  () => data.logFetchParams.skipCount,
  () => {
    fetchLogData()
  },
  {
    deep: true
  }
)

const changeCurrent = (val: number, row: any) => {
  row.skipCount = val
}

const fetchTableData = async () => {
  const { result } = await GetAllProjectSelf({
    ...data.selfTableParams,
    skipCount: (data.selfTableParams.skipCount - 1) * 20,
    maxResultCount: 20
  })
  if (result?.items) {
    tableData.value = result?.items
    data.selfTabletotal = result?.totalCount
  }
}

const handleConfirm = async (row: any) => {
  console.log(row, "row132")
  handleUpdateProjectSelf(row)
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
  visible.value = true
  console.log(formRef.value, "formRef123")
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const onReset = () => {
  data.selfTableParams.filter = ""
  fetchTableData()
}

const fetchLogData = async () => {
  const { result } =
    (await GetBaseStoreLog({
      ...data.logFetchParams,
      skipCount: (data.logFetchParams.skipCount - 1) * 20,
      maxResultCount: 20
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
const handleExport = async () => {
  try {
    const res: any = await GetImportTemplate({})
    downloadFileExcel(res, "项目自建表模板")
    console.log(res, "自建表导出")
  } catch (err: any) {
    console.log(err, "[ 自建表导出 失败 ]")
  }
}

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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!")
      console.log(selfForm)
      await handleCreateProjectSelf(selfForm.value)
      visible.value = false
      ElMessage.success("新增成功!")
    } else {
      console.log("error submit!", fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
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
