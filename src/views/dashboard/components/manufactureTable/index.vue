<template>
  <div>
    <el-card m="2" header="bom成本">
      <manufactureTable :manufactureData="manufactureData" />
    </el-card>
    <el-card m="2">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-button type="primary">新增</el-button>
        </el-row>
      </template>
      <manufactureTable isEdit :manufactureData="logData" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItem, GetManufacturingCost } from "../../service"
import manufactureTable from "./manufactureTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"

const { auditFlowId, productId } = getQuery()

const props = defineProps({
  manufactureData: {
    type: Array as PropType<any[]>
  },
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: Number
})

const logData = ref<any>([])
const manufactureData =ref<any>([])

// 获取 制造成本汇总表
const getManufacturingCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetManufacturingCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    manufactureData.value = result
    console.log(result, "getPricingPanelProfit")
  } catch (err: any) {
    console.log(err, "[ 获取 制造成本汇总表据失败 ]")
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
    getManufacturingCost()
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
