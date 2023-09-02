<template>
  <InterfaceRequiredTime :ProcessIdentifier="Host" />
  <div style="padding: 0 10px">
    <el-card class="card-warp">
      <template #header>
        <el-row style="width: 100%" justify="space-between" align="middle">
          实验费用
          <el-row>
            <el-upload
              v-model:file-list="fileList"
              show-file-list
              :action="$baseUrl + 'api/services/app/NrePricing/PostProductDepartmentSingleExcel'"
              :on-success="handleSuccess"
              :on-change="handleFileChange"
              name="fileName"
              :on-progress="handleGetUploadProgress"
              :on-error="handleUploadTemplateError"
            >
              <el-button class="uploadBtn">NRE实验费模板上传</el-button>
            </el-upload>
            <SORDonwload />
            <TrView />
            <el-button type="primary" @click="handleFethNreTableDownload" m="2">NRE实验费模板下载</el-button>
            <el-button type="primary" @click="addLaboratoryFeeModel" m="2" v-havedone>新增</el-button>
          </el-row>
        </el-row>
      </template>
      <el-table
        :data="data.laboratoryFeeModels"
        border
        :summary-method="getLaboratoryFeeSummaries"
        show-summary
        height="70vh"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="试验项目（根据与客户协定项目）" width="180">
          <template #default="{ row, $index }">
            <span v-if="isVertify">{{ row.projectName }}</span>
            <SelectSearch
              v-else
              :request="GetFoundationEmc"
              :onChange="(record: any) => handleChangeData(record, $index)"
              v-model:value="row.projectName"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否指定第三方" width="150">
          <template #default="{ row }">
            <el-select v-model="row.isThirdParty" :disabled="isVertify">
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="unitPrice" width="175" />
        <el-table-column label="调整系数" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.coefficient }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.coefficient" />
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" width="180" />
        <el-table-column label="时间-摸底" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.countBottomingOut }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.countBottomingOut" />
          </template>
        </el-table-column>
        <el-table-column label="时间-DV" width="180">
          <template #default="{ row }">
             <span v-if="isVertify">{{ row.countDV }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.countDV" />
          </template>
        </el-table-column>
        <el-table-column label="时间-PV" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.countPV }}</span>
            <el-input-number v-else :min="0" controls-position="right" v-model="row.countPV" />
          </template>
        </el-table-column>
        <el-table-column label="总费用" prop="allCost" width="150" />
        <el-table-column label="备注" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.remark }}</span>
            <el-input v-else v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="!isVertify" fixed="right" width="90">
          <template #default="{ $index }">
            <el-button @click="deleteLaboratoryFeeModel($index)" type="danger" v-havedone>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="float: right; margin: 20px 0" v-if="isVertify">
      <el-button type="primary" v-havedone m="2">同意</el-button>
      <el-button type="primary" v-havedone>退回</el-button>
    </div>
    <div style="float: right; margin: 20px 0" v-else>
      <el-button :disabled="data.isSubmit" type="primary" @click="submit(false)" v-havedone m="2">保存</el-button>
      <el-button :disabled="data.isSubmit" type="primary" @click="submit(true)" v-havedone>提交</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watch, ref } from "vue"
import {
  PostProductDepartment,
  GetProductDepartment,
  GetExportOfProductDepartmentFeeForm,
  GetFoundationEmc
} from "../../common/request"
import type { UploadProps, UploadUserFile } from "element-plus"
import { getLaboratoryFeeSummaries } from "../../common/nrePilotprojectsSummaries"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"
import { downloadFileExcel } from "@/utils"
import { handleGetUploadProgress, handleUploadTemplateError } from "@/utils/upload"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
import SelectSearch from "../SelectSearch/index.vue"
import TrView from "@/components/TrView/index.vue"
import SORDonwload from "@/components/SORDonwload/index.vue"

let { auditFlowId, productId } = getQuery()

let Host = "NreInputEmc"
const fileList = ref<UploadUserFile[]>([])

const props = defineProps({
  isVertify: Boolean
})

const deleteLaboratoryFeeModel = (i: number) => {
  data.laboratoryFeeModels.splice(i, 1)
}

const addLaboratoryFeeModel = () => {
  data.laboratoryFeeModels.push({
    coefficient: 0,
    unitPrice: 5,
    allCost: 0,
    countBottomingOut: 0,
    countDV: 0,
    countPV: 0,
    projectName: "实验项目1"
  })
}

/**
 * 数据部分
 */
const data = reactive<{
  laboratoryFeeModels: any[]
  dialogTableVisible: boolean
  isSubmit: boolean
}>({
  laboratoryFeeModels: [],
  dialogTableVisible: false,
  isSubmit: false
})

const initFetch = async () => {
  const { result, isSubmit } = (await GetProductDepartment(auditFlowId, productId)) || {}
  data.laboratoryFeeModels = result.laboratoryFeeModels || []
  data.isSubmit = isSubmit
}

const submit = async (isSubmit: boolean) => {
  try {
    const { success } = await PostProductDepartment({
      auditFlowId,
      solutionId: productId,
      isSubmit,
      productDepartmentModels: data.laboratoryFeeModels
    })
    if (success) ElMessage.success(`${isSubmit ? "提交" : "保存"}成功`)
    console.log(success, "[PostProductDepartment RES]")
  } catch (err) {
    console.log(err, "[PostProductDepartment err]")
  }
}

// NRE实验费模板下载
const handleFethNreTableDownload = async () => {
  try {
    const res: any = await GetExportOfProductDepartmentFeeForm({
      auditFlowId,
      solutionId: productId
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
    const { result } = res
    data.laboratoryFeeModels = result || []
    console.log(res, "NRE实验费模板上传")
    ElMessage.success("上传成功！")
  } else {
    ElMessage.error(res.error.message)
  }
}

const handleFileChange: UploadProps["onChange"] = (file, uploadFiles) => {
  console.log(uploadFiles, "uploadFiles")
  console.log(fileList, "fileList")
}

const handleChangeData = (row: any, i: number) => {
  data.laboratoryFeeModels.forEach((item: any, index: number) => {
    if (i === index) {
      item.unit = row.unit
      item.unitPrice = row.price
      item.projectName = row.query
    }
  })
}

watch(
  () => data.laboratoryFeeModels,
  (val) => {
    val.forEach((item: any) => {
      item.allCost =
        item.unitPrice *
        (item.coefficient || 0) *
        ((item.countBottomingOut || 0) + (item.countDV || 0) + (item.countPV || 0))
    })
  },
  {
    deep: true
  }
)

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
.card-warp {
  margin-top: 20px;
}
.uploadBtn {
  margin-top: 8px;
}
</style>
