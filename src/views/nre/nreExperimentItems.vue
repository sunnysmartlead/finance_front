<template>
  <div style="padding: 0 10px">
    <InterfaceRequiredTime :ProcessIdentifier="Host" />
    <el-card class="margin-top">
      <template #header>
        <el-row style="width: 100%" justify="space-between" align="middle">
          试验项目（根据与客户协定项目）
          <el-row>
            <el-upload
              v-model:file-list="fileList"
              show-file-list
              :action="$baseUrl + 'api/services/app/NrePricing/PostExperimentItemsSingleExcel'"
              :on-success="handleSuccess"
              :on-change="handleFileChange"
              name="fileName"
              :on-progress="handleGetUploadProgress"
              :on-error="handleUploadTemplateError"
            >
              <el-button style="margin-top: 8px">NRE实验费表单上传</el-button>
            </el-upload>
            <el-button type="primary" @click="handleFethNreTableDownload" m="2">NRE实验费模板下载</el-button>
            <el-button type="primary" @click="addExperimentItemsData" m="2" v-havedone>新增</el-button>
          </el-row>
        </el-row>
      </template>
      <el-table
        :data="data.experimentItems"
        style="width: 100%"
        border
        :summary-method="getQaTestDepartmentsSummaries"
        show-summary
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="试验项目（根据与客户协定项目）" width="180">
          <template #default="{ row }">
            <el-input v-model="row.projectName" />
          </template>
        </el-table-column>
        <el-table-column label="是否指定第三方" width="180">
          <template #default="{ row }">
            <el-select v-model="row.isThirdParty">
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="180">
          <template #default="{ row }">
            <el-input v-model="row.unitPrice" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="数量" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.count" controls-position="right" :min="0" />
          </template>
        </el-table-column> -->

        <el-table-column label="时间-摸底" width="180">
          <template #default="{ row }">
            <el-input-number :min="0" controls-position="right" v-model="row.dataThoroughly" />
          </template>
        </el-table-column>
        <el-table-column label="时间-DV" width="180">
          <template #default="{ row }">
            <el-input-number :min="0" controls-position="right" v-model="row.dataDV" />
          </template>
        </el-table-column>
        <el-table-column label="时间-PV" width="180">
          <template #default="{ row }">
            <el-input-number :min="0" controls-position="right" v-model="row.dataPV" />
          </template>
        </el-table-column>
        <el-table-column label="单位" width="180">
          <template #default="{ row }">
            <el-input v-model="row.unit" />
          </template>
        </el-table-column>
        <el-table-column label="总费用" width="180">
          <template #default="{ row }">
            <!-- <el-input-number v-model="row.allCost" type="number" :min="0" controls-position="right" :min="0" /> -->
            {{ row.unitPrice * (row.dataThoroughly + row.dataDV + row.dataPV) }}
          </template>
        </el-table-column>
        <el-table-column label="备注" width="180">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="85px">
          <template #default="{ $index }">
            <el-button @click="deleteExperimentItemsData($index)" type="danger" v-havedone>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="float: right; margin: 20px 0">
      <el-button type="primary" @click="submit" v-havedone>提交</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { QADepartmentTestModel } from "./data.type"
import { getQaTestDepartmentsSummaries } from "./common/nreQCDepartmentSummaries"
import { PostExperimentItems, GetReturnExperimentItems, PostExperimentItemsSingleDownloadExcel } from "./common/request"
import getQuery from "@/utils/getQuery"
import type { UploadProps, UploadUserFile } from "element-plus"
import { ElMessage } from "element-plus"
import { downloadFileExcel } from "@/utils"
import { handleGetUploadProgress, handleUploadTemplateError } from "@/utils/upload"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host: string = "NreInputTest"
const { auditFlowId, productId }: any = getQuery()

/**
 * 数据部分
 */
const fileList = ref<UploadUserFile[]>([])
const data = reactive<{
  experimentItems: QADepartmentTestModel[]
}>({
  experimentItems: []
})

const deleteExperimentItemsData = (i: number) => {
  data.experimentItems.splice(i, 1)
}

const addExperimentItemsData = () => {
  data.experimentItems.push({
    allCost: 0,
    count: 0,
    dataDV: 0,
    dataPV: 0,
    dataThoroughly: 0,
    isThirdParty: false,
    projectName: "",
    remark: "",
    unit: "",
    unitPrice: 0
  })
}

const submit = async () => {
  try {
    const { success } = await PostExperimentItems({
      auditFlowId,
      experimentItems: {
        productId,
        qaTestDepartments: data.experimentItems.map((item: any) => ({
          ...item,
          allCost: (item.unitPrice || 0) * (item.dataThoroughly + item.dataDV + item.dataPV)
        }))
      }
    })
    if (!success) throw Error()
    ElMessage.success("提交成功")
    // jumpTodoCenter()
  } catch (err) {
    console.log(err, "[PostExperimentItems err]")
    // ElMessage.error("提交失败")
  }
}

// NRE实验费模板下载
const handleFethNreTableDownload = async () => {
  try {
    const res: any = await PostExperimentItemsSingleDownloadExcel({
      FileName: ""
    })
    downloadFileExcel(res, "NRE实验费模板")
    console.log(res, "NreTableDownload")
  } catch (err: any) {
    console.log(err, "[ NRE实验费模板下载 失败 ]")
  }
}

// NRE实验费模板上传
const handleSuccess: UploadProps["onSuccess"] = async (res: any) => {
  if (!res.error) {
    data.experimentItems = res.result || []
    console.log(res, "NRE实验费模板上传")
    ElMessage.success("上传成功！")
  } else {
    ElMessage.error(res.error.message)
  }
}

const handleFileChange: UploadProps["onChange"] = (file, uploadFiles) => {
  console.log(uploadFiles)
  console.log(fileList, "fileList")
}

const initFetch = async () => {
  const { result } = await GetReturnExperimentItems(auditFlowId, productId)
  data.experimentItems = result?.qaTestDepartments || []
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  initFetch()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

watchEffect(() => {})
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
