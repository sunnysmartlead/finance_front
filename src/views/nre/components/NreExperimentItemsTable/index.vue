<template>
  <div style="padding: 0 10px">
    <!-- <VertifyBox :onSubmit="handleVertify" /> -->
    <ProcessVertifyBox :onSubmit="isVertify?NREToExamineFun:submit"  :processType="isVertify?'baseProcessType':'confirmProcessType'"/>
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
              <el-button style="margin-top: 8px" v-if="!isVertify">试验项目导入</el-button>
            </el-upload>
            <SORDonwload />
            <el-button m="2" type="primary" class="pddAudit_but" @click="data.dialogTableVisible = true"
              >查看设计方案</el-button
            >
            <el-button type="primary" @click="handleFethNreTableDownload" m="2">环境试验费模板下载</el-button>
            <el-button type="primary" @click="handleDownLoadExcel" v-if="!isVertify" m="2">试验项目导出</el-button>
            <el-button v-if="!isVertify" type="primary" @click="addExperimentItemsData" m="2" v-havedone>
              新增
            </el-button>
          </el-row>
        </el-row>
      </template>
      <el-table
        :data="experimentItems"
        style="width: 100%"
        border
        :summary-method="getQaTestDepartmentsSummaries"
        show-summary
      >
        <el-table-column align="center"  type="index" label="序号" width="80" />
        <el-table-column align="center"  label="试验项目（根据与客户协定项目）" width="180">
          <template #default="{ row, $index }">
            <!-- <el-input v-model="row.projectName" /> -->
            <span v-if="isVertify">{{ row.projectName }}</span>
            <SelectSearch
              v-else
              :request="GetFoundationreliableList"
              :onChange="(record: any) => handleChangeData(record, $index)"
              v-model="row.projectName"
            />
          </template>
        </el-table-column>
        <el-table-column align="center"  label="是否指定第三方" width="180">
          <template #default="{ row }">
            <el-select :disabled="isVertify" v-model="row.isThirdParty">
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="单价" prop="unitPrice" width="175" />
        <el-table-column align="center"  label="调整系数" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.adjustmentCoefficient }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.adjustmentCoefficient" />
          </template>
        </el-table-column>
        <el-table-column align="center"  label="计价单位" prop="unit" width="180" />
        <el-table-column align="center"  label="时间-摸底" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.countBottomingOut }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.countBottomingOut" />
          </template>
        </el-table-column>
        <el-table-column align="center"  label="时间-DV" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.countDV }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.countDV" />
          </template>
        </el-table-column>
        <el-table-column align="center"  label="时间-PV" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.countPV }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.countPV" />
          </template>
        </el-table-column>
        <el-table-column align="center"  label="总费用" prop="allCost" width="180" />
        <el-table-column align="center"  label="备注">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.remark }}</span>
            <el-input v-else v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column align="center"  label="操作" v-if="!isVertify" fixed="right">
          <template #default="{ $index }">
            <el-button @click="deleteExperimentItemsData($index)" type="danger" v-havedone>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <designScheme v-model:dialogTableVisible="data.dialogTableVisible" @close="data.dialogTableVisible = false" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watch, ref } from "vue"
import { QADepartmentTestModel } from "../../data.type"
import { getQaTestDepartmentsSummaries } from "../../common/nreQCDepartmentSummaries"
import {
  PostExperimentItems,
  NREToExamine,
  GetReturnExperimentItems,
  GetFoundationreliableList,
  GetExportOfEnvironmentalExperimentFeeForm,
  PostExperimentItemsSingleDownloadExcel
} from "../../common/request"
import getQuery from "@/utils/getQuery"
import type { UploadProps, UploadUserFile } from "element-plus"
import { ElMessage } from "element-plus"
import { downloadFileExcel } from "@/utils"
import { handleGetUploadProgress, handleUploadTemplateError } from "@/utils/upload"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
import SORDonwload from "@/components/SORDonwload/index.vue"
import SelectSearch from "../SelectSearch/index.vue"
import { designScheme } from "@/views/demandApplyAudit"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"

import { useRouter } from "vue-router"

const route = useRouter()

let Host = "NreInputTest"
let { auditFlowId, productId }: any = getQuery()

const props = defineProps({
  isVertify: Boolean,
})

console.log(props, "props")
/**
 * 数据部分
 */
const fileList = ref<UploadUserFile[]>([])
const experimentItems = ref<QADepartmentTestModel[]>([])
const data = reactive<{
  projectList: any[]
  dialogTableVisible: boolean
  isSubmit: boolean
}>({
  projectList: [],
  dialogTableVisible: false,
  isSubmit: false
})

watch(
  () => experimentItems.value,
  (val) => {
    val.forEach((item: any) => {
      item.allCost =
        item.unitPrice *
        (item.adjustmentCoefficient || 0) *
        ((item.countBottomingOut || 0) + (item.countDV || 0) + (item.countPV || 0))
    })
  },
  {
    deep: true
  }
)

const deleteExperimentItemsData = (i: number) => {
  experimentItems.value.splice(i, 1)
}

const addExperimentItemsData = () => {
  experimentItems.value.push({
    allCost: 0,
    count: 0,
    countDV: 0,
    countPV: 0,
    countBottomingOut: 0,
    isThirdParty: false,
    projectName: "",
    remark: "",
    unit: "",
    unitPrice: 0,
    adjustmentCoefficient: 0
  })
}

const submit = async ({ comment, opinion, nodeInstanceId }: any) => {
  try {
    const isSubmit: boolean=true
    const { success } = await PostExperimentItems({
      auditFlowId,
      solutionId: productId,
      isSubmit,
      environmentalExperimentFeeModels: experimentItems.value,
      opinionDescription: comment,
      opinion,
      nodeInstanceId
    })
    if (!success) throw Error()
    ElMessage.success(`${isSubmit ? "提交" : "保存"}成功`)
  } catch (err) {
    console.log(err, "[PostExperimentItems err]")
    // ElMessage.error("提交失败")
  }
}

const NREToExamineFun = async ({ comment, opinion, nodeInstanceId }: any) => {
  try {
    const { success } = await NREToExamine({
      auditFlowId,
      nreCheckType:2,
      opinionDescription: comment,
      opinion,
      nodeInstanceId
    })
    if (!success) throw Error()
    ElMessage.success(`提交成功`)
  } catch (err) {
    console.log(err, "[PostExperimentItems err]")
    // ElMessage.error("提交失败")
  }
}

// NRE实验费模板下载
const handleFethNreTableDownload = async () => {
  try {
    const res: any = await PostExperimentItemsSingleDownloadExcel({
      auditFlowId,
      solutionId: productId
    })
    downloadFileExcel(res, "NRE实验费模板")
    console.log(res, "NreTableDownload")
  } catch (err: any) {
    console.log(err, "[ NRE实验费模板下载 失败 ]")
  }
}

// 环境实验费模板导出
const handleDownLoadExcel = async () => {
  try {
    const res = await GetExportOfEnvironmentalExperimentFeeForm({
      auditFlowId,
      solutionId: productId
    })
    downloadFileExcel(res, "NRE实验费")
    console.log(res, "NreTableDownload")
  } catch (err) {
    console.log(err, "[ NRE实验费下载 失败 ]")
  }
}


// NRE实验费模板上传
const handleSuccess: UploadProps["onSuccess"] = async (res: any) => {
  if (!res.error) {
    experimentItems.value = res.result || []
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
  const { result, isSubmit } = await GetReturnExperimentItems(auditFlowId, productId)
  experimentItems.value = result?.environmentalExperimentFeeModels || []
  data.isSubmit = isSubmit
}

const handleChangeData = (row: any, i: number) => {
  experimentItems.value.forEach((item: any, index: number) => {
    if (i === index) {
      console.log(row, "{ row }")
      item.unit = row.unit
      item.unitPrice = row.price
      item.projectName = row.query
    }
  })
}

// 审核
const handleVertify = () => {}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  auditFlowId = Number(auditFlowId)
  productId = Number(productId)
  initFetch()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
