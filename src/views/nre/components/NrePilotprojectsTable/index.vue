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
            <SelectSearch
              :request="GetFoundationEmc"
              :onChange="(record: any) => handleChangeData(record, $index)"
              v-model:value="row.testItem"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否指定第三方" width="150">
          <template #default="{ row }">
            <el-select v-model="row.isThirdParty">
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="unitPrice" width="175" />
        <el-table-column label="单位" prop="unit" width="180" />
        <!-- <el-table-column label="数量" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.count" :min="0" controls-position="right" />
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

        <!-- <el-table-column label="时间" width="250">
          <template #default="{ row }">
            <el-date-picker size="small" v-model="row.time" type="datetime" />
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="时间-摸底" width="180">
        <template #default="{ row }">
          <el-input v-model="row.time" />
        </template>
      </el-table-column>
      <el-table-column label="时间-DV" width="180">
        <template #default="{ row }">
          <el-input v-model="row.carModel" />
        </template>
      </el-table-column>
      <el-table-column label="时间-PV" width="180">
        <template #default="{ row }">
          <el-input v-model="row.carModel" />
        </template>
      </el-table-column> -->
        <!-- <el-table-column label="单位" width="180">
        <template #default="{ row }">
          <el-input v-model="row.carModel" />
        </template>
      </el-table-column> -->
        <el-table-column label="总费用" width="150">
          <template #default="{ row }">
            ￥ {{ (row.unitPrice || 0) * ((row.dataThoroughly || 0) + (row.dataDV || 0) + (row.dataPV || 0)) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="单位" width="180">
        <template #default="{ row }">
          <el-input v-model="row.carModel" />
        </template>
      </el-table-column> -->
        <el-table-column label="备注" width="180">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template #default="{ $index }">
            <el-button @click="deleteLaboratoryFeeModel($index)" type="danger" v-havedone>删除</el-button>
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
import {
  PostProductDepartment,
  GetProductDepartment,
  PostExperimentItemsSingleDownloadExcel,
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

let Host = "NreInputEmc"
const fileList = ref<UploadUserFile[]>([])

const props = defineProps({
  isVertify: Boolean
})

const deleteLaboratoryFeeModel = (i: number) => {
  data.laboratoryFeeModels.splice(i, 1)
}
let { auditFlowId, productId } = getQuery()
const addLaboratoryFeeModel = () => {
  data.laboratoryFeeModels.push({ unitPrice: 0, allCost: 0, dataThoroughly: 0, dataDV: 0, dataPV: 0 })
}

/**
 * 数据部分
 */
const data = reactive<{
  laboratoryFeeModels: any[]
}>({
  laboratoryFeeModels: []
})

const initFetch = async () => {
  const { result } = (await GetProductDepartment(auditFlowId, productId)) || {}
  data.laboratoryFeeModels = result.laboratoryFeeModels || []
}

const submit = async () => {
  try {
    const { success } = await PostProductDepartment({
      auditFlowId,
      productDepartmentModels: {
        productId,
        laboratoryFeeModels:
          data.laboratoryFeeModels.map((item: any) => ({
            ...item,
            allCost: (item.unitPrice || 0) * (item.dataThoroughly + item.dataDV + item.dataPV)
          })) || []
      }
    })
    if (success) ElMessage.success("提交成功")
    console.log(success, "[PostProductDepartment RES]")
  } catch (err) {
    console.log(err, "[PostProductDepartment err]")
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
      item.testItem = row.query
    }
  })
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
.card-warp {
  margin-top: 20px;
}
.uploadBtn {
  margin-top: 8px;
}
</style>
