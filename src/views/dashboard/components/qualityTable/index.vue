<template>
  <div>
    <el-card m="2" header="bom成本">
      <qualityTable :qualityData="qualityData" />
    </el-card>
    <el-card m="2">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-button type="primary">新增</el-button>
        </el-row>
      </template>
      <qualityTable isEdit :qualityData="logData" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItem, GetQualityCost } from "../../service"
import qualityTable from "./qualityTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"

const { auditFlowId, productId } = getQuery()

const props = defineProps({
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: Number
})
const qualityData = ref<any>([])
const logData = ref<any>([])

// 获取 质量成本
const getQualityCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetQualityCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    qualityData.value = [result] || []
  } catch (err: any) {
    console.log(err, "[ 获取 质量成本数据失败 ]")
  }
}

const getLogData = async () => {
  const res = (await GetUpdateItem({
    AuditFlowId: auditFlowId,
    ProductId: 532,
    GradientId: props.gradientId,
    SolutionId: productId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
}

const init = () => {
  if (props.gradientId && !isEmpty(props.yearData)) {
    getQualityCost()
    getLogData()
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
