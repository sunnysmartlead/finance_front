<template>
  <div>
    <el-card m="2" header="bom成本">
      <lossTable :lossData="lossData" />
    </el-card>
    <el-card m="2">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-button type="primary">新增</el-button>
        </el-row>
      </template>
      <lossTable isEdit :lossData="logData" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItem, GetLossCost } from "../../service"
import lossTable from "./lossTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"

const { auditFlowId, productId } = getQuery()

const props = defineProps({
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: Number
})

const lossData = ref<any>([])
const logData = ref<any>([])

// 获取损耗成本
const getLossCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetLossCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    lossData.value = result || []
    console.log(result, "获取损耗成本")
  } catch (err: any) {
    console.log(err, "[ 获取损耗成本数据失败 ]")
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
  console.log(props, "props")
  if (props.gradientId && !isEmpty(props.yearData)) {
    getLossCost()
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

</script>
