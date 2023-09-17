<template>
  <div>
    <el-card m="2" header="制造成本">
      <manufactureTable :manufactureData="manufactureData" :onEdit="handleEdit" :hideEdit="hideEdit" />
    </el-card>
    <el-card m="2" v-if="!hideEdit">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-row v-if="!hideEdit">
            <el-button type="primary" m="2" @click="addEditList">新增</el-button>
            <el-button type="primary" m="2" @click="handleSubmit">提交</el-button>
            <el-upload :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'" :on-success="handleSuccess"
              show-file-list :on-progress="handleGetUploadProgress" :on-error="handleUploadError"
              v-model:file-list="fileList" :limit="1">
              <el-button type="primary" m="2">上传佐证资料</el-button>
            </el-upload>
          </el-row>
        </el-row>
      </template>
      <manufactureTable :isEdit="!hideEdit" :manufactureData="modifyData" :on-delete="handleDelete" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItemManufacturingCost, SetUpdateItemManufacturingCost, GetManufacturingCost } from "../../service"
import manufactureTable from "./manufactureTable.vue"
import getQuery from "@/utils/getQuery"
import { cloneDeep, isEmpty } from "lodash"
import type { UploadProps, UploadUserFile } from "element-plus"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { ElMessage } from "element-plus"


const { auditFlowId, productId: SolutionId } = getQuery()

const props = defineProps({
  manufactureData: {
    type: Array as PropType<any[]>
  },
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: Number,
  hideEdit: Boolean
})

const modifyData = ref<any>([])
const manufactureData = ref<any>([])
const fileList = ref<UploadUserFile[]>([])

// 获取 制造成本汇总表
const getManufacturingCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetManufacturingCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    manufactureData.value = result
    console.log(result, "getManufacturingCost")
  } catch (err: any) {
    console.log(err, "[ 获取 制造成本汇总表据失败 ]")
  }
}

const getModifyData = async () => {
  const res = (await GetUpdateItemManufacturingCost({
    AuditFlowId: auditFlowId,
    GradientId: props.gradientId,
    SolutionId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
}

const init = () => {
  if (props.gradientId && !isEmpty(props.yearData)) {
    getManufacturingCost()
    getModifyData()
  }
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
  const fileIds = fileList.value.map((item: any) => item.response.result?.fileId) || []
  if (!fileIds.length) {
    ElMessage({
      type: 'error',
      message: '请先上传佐证资料！'
    })
    return
  }
  if (!modifyData.value.length) {
    ElMessage({
      type: 'error',
      message: '请先添加修改项数据再操作！'
    })
    return
  }
  const { success } = await SetUpdateItemManufacturingCost({
    updateItem: modifyData.value,
    auditFlowId,
    gradientId: props.gradientId,
    file: fileIds[0],
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })
  if (success) {
    ElMessage({
      type: 'success',
      message: '提交成功！'
    })
  }
}

const handleEdit = (row: any) => {
  console.log(row, "row123")
  modifyData.value.push(cloneDeep(row))
}

const addEditList = () => {
  modifyData.value.push({
    costType: 0,
    costItem: "",
    gradientKy: 0,
    manufacturingCostDirect: {
      directLabor: 0,
      equipmentDepreciation: 0,
      lineChangeCost: 0,
      manufacturingExpenses: 0,
      subtotal: 0,
    },
    manufacturingCostIndirect: {
      directLabor: 0,
      equipmentDepreciation: 0,
      manufacturingExpenses: 0,
      subtotal: 0,
    },
    subtotal: 0,
  })
}

watch(
  () => [props.gradientId, props.yearData],
  (val) => {
    init()
  },
  {
    deep: true
  }
)

const handleDelete = (index: number) => {
  modifyData.value.splice(index, 1)
}

watch(
  () => modifyData.value,
  (val) => {
    modifyData.value.forEach((item: any) => {
      item.manufacturingCostDirect.subtotal = (item.manufacturingCostDirect.directLabor || 0) +
        (item.manufacturingCostDirect.equipmentDepreciation || 0) +
        (item.manufacturingCostDirect.lineChangeCost || 0) +
        (item.manufacturingCostDirect.manufacturingExpenses || 0)
      item.manufacturingCostIndirect.subtotal = (item.manufacturingCostIndirect.directLabor || 0) +
        (item.manufacturingCostIndirect.equipmentDepreciation || 0) +
        (item.manufacturingCostIndirect.lineChangeCost || 0) +
        (item.manufacturingCostIndirect.manufacturingExpenses || 0)
      item.subtotal = item.manufacturingCostIndirect.subtotal + item.manufacturingCostDirect.subtotal
    })
  },
  {
    deep: true
  }
)

onMounted(() => {
  init()
})
const toFixedThree = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}
</script>
