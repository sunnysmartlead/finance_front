<template>
  <div>
    <el-card m="2" header="bom成本">
      <logisticsTable :logisticsData="logisticsData" />
    </el-card>
    <el-card m="2">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-button type="primary">新增</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-upload
            :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
            :on-success="handleSuccess"
            show-file-list
            :on-progress="handleGetUploadProgress"
            :on-error="handleUploadError"
            v-model:file-list="fileList"
          >
            <el-button type="primary">上传佐证资料</el-button>
          </el-upload>
        </el-row>
      </template>
      <logisticsTable isEdit :logisticsData="modifyData" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetLogisticsCost, SetUpdateItemMaterial, GetUpdateItemMaterial } from "../../service"
import logisticsTable from "./logisticsTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"
import type { UploadProps, UploadUserFile } from "element-plus"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { ElMessage } from "element-plus"

const { auditFlowId, productId: solutionId } = getQuery()

const props = defineProps({
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: Number,
  isEdit: {
    type: Boolean
  },
  onEdit: {
    type: Function as PropType<any>
  },
  onUpload: {
    type: Function as PropType<any>
  }
})

const modifyData = ref<any>([])
const logisticsData = ref<any>([])
const fileList = ref<any>([])

// 获取 物流成本汇总表
const getLogisticsCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetLogisticsCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      solutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    logisticsData.value = result
    console.log(result, "物流成本汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 物流成本汇总表数据失败 ]")
  }
}

const getModifyData = async () => {
  const { success, result }: any = (await GetUpdateItemMaterial({
    AuditFlowId: auditFlowId,
    GradientId: props.gradientId,
    solutionId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
  if (success) {
    modifyData.value = result || []
  }
}

const handleEdit = (row: any) => {
  modifyData.value.push(row)
}

const addEditList = () => {
  modifyData.value.push({})
}

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  if (res.success) {
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
}

const handleSubmit = async () => {
  const res = await SetUpdateItemMaterial({
    updateItem: modifyData.value,
    auditFlowId,
    solutionId,
    gradientId: props.gradientId,
    file: fileList
  })
}

watch(
  () => [props.gradientId, props.yearData],
  (val) => {
    const [gradientId, yearData] = val
    if (gradientId && !isEmpty(yearData)) {
      init()
    }
  },
  {
    deep: true
  }
)

const init = () => {
  getLogisticsCost()
  getModifyData()
}

onMounted(() => {
  init()
})

const toFixedThree = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}
</script>
