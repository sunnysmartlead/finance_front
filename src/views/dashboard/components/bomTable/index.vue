<template>
  <div>
    <el-card m="2" header="bom成本">
      <bomTable :bomData="bomData" :onEdit="handleEdit" />
    </el-card>
    <el-card m="2">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-button type="primary" @click="addEditList">新增</el-button>
        </el-row>
      </template>
      <bomTable isEdit v-model:bomData="bomLogData" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItem, GetBomCost } from "../../service"
import bomTable from "./bomTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"

const { auditFlowId, productId } = getQuery()

const props = defineProps({
  bomData: {
    type: Array as PropType<any[]>
  },
  yearData: {
    type: Object as PropType<any>
  },
  gradientId:  String
})

// 获取 bom成本（含损耗）汇总表
const getBomCost = async () => {
  try {
    const { yearData, gradientId } = props
    if (!props.yearData) return
    const { result }: any = await GetBomCost({
      UpDown: yearData.upDown,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      GradientId: gradientId,
      InputCount: 0,
      Year: yearData.year
    })
    bomData.value = result || []
    firstShow.value = false
    console.log(result, "获取 bom成本（含损耗）汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 bom成本（含损耗）汇总表数据失败 ]")
    firstShow.value = false
  }
}

const bomLogData = ref<any>([])
const bomData = ref<any>([])
const firstShow = ref(false)

watch(
  () => [props.gradientId, props.yearData, firstShow.value],
  () => {
    init()
  },
  {
    deep: true
  }
)

const init = () => {
  if (props.gradientId && !isEmpty(props.yearData)) {
    getBomCost()
    getBomLogData()
  }
}

onMounted(() => {
  init()
})

const getBomLogData = async () => {
  const res = (await GetUpdateItem({
    AuditFlowId: auditFlowId,
    ProductId: 532,
    GradientId: props.gradientId,
    SolutionId: productId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
}

const handleEdit = () => {

}

const addEditList = () => {
  bomLogData.value.push({})
}
</script>
