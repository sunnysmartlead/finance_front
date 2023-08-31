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
        </el-row>
      </template>
      <logisticsTable isEdit :logisticsData="logData" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItem, GetLogisticsCost } from "../../service"
import logisticsTable from "./logisticsTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"

const { auditFlowId, productId } = getQuery()

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

const logData = ref<any>([])
const logisticsData = ref<any>([])

// 获取 物流成本汇总表
const getLogisticsCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetLogisticsCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    logisticsData.value = result
    console.log(result, "物流成本汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 物流成本汇总表数据失败 ]")
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
  getLogData()
}

onMounted(() => {
  init()
})

const toFixedThree = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}
</script>
