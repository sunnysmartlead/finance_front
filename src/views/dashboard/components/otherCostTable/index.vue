<template>
  <div>
    <el-card m="2" header="bom成本">
      <otherCostTable :manufactureData="manufactureData" />
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
      <otherCostTable isEdit :manufactureData="modifyData" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItemOtherCost, SetUpdateItemOtherCost, GetOtherCostItem } from "../../service"
import otherCostTable from "./otherCostTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"
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
  gradientId:  String
})

const otherCostData = ref<any>([])
const modifyData = ref<any>([])
const fileList =ref<UploadUserFile[]>([])

const getModifyData = async () => {
  const res = (await GetUpdateItemOtherCost({
    AuditFlowId: auditFlowId,
    GradientId: props.gradientId,
    SolutionId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
}

const getOtherCost = async () => {
  try {
  const { yearData, gradientId } = props
    const { result }: any = await GetOtherCostItem({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    }) || {}
    otherCostData.value = result || []
    console.log(result, "获取其他成本")
  } catch (err: any) {
    console.log(err, "[ 获取其他成本失败 ]")
  }
}

const init = () => {
  if (props.gradientId && !isEmpty(props.yearData)) {
    getOtherCost()
    getModifyData()
  }
}

const handleSubmit = async () => {
  const res = await SetUpdateItemOtherCost({
    updateItem: modifyData.value,
    auditFlowId,
    SolutionId,
    gradientId: props.gradientId,
    file: fileList
  })
}

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  if (res.success) {
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
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

onMounted(() => {
  init()
})

const toFixedThree = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}
</script>
