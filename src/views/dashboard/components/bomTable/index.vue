<template>
  <div>
    <el-card m="2" header="bom成本">
      <template #header>
        <el-row justify-between>
          <span>bom成本</span>
          <el-row>
            <el-button v-if="!hideEdit" type="primary" m="2" @click="goEdit">去修改</el-button>
          </el-row>
        </el-row>
      </template>
      <bomTable :bomData="bomData" :hideEdit="hideEdit" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItemMaterial, GetBomCost } from "../../service"
import bomTable from "./bomTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"
import { useRouter } from "vue-router"

const router = useRouter()
const { auditFlowId, productId: solutionId } = getQuery()

const props = defineProps({
  bomData: {
    type: Array as PropType<any[]>
  },
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: String,
  hideEdit: Boolean
})

// 获取 bom成本（含损耗）汇总表
const getBomCost = async () => {
  try {
    const { yearData, gradientId } = props
    if (!props.yearData) return
    const { result }: any = await GetBomCost({
      UpDown: yearData.upDown,
      AuditFlowId: auditFlowId,
      solutionId,
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

const bomModifyData = ref<any>([])
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

const goEdit = () => {
  router.push({
    path: "/resourcesDepartment/electronic",
    query: {
      auditFlowId,
      productId: solutionId
    }
  })
}

onMounted(() => {
  init()
})

const getBomLogData = async () => {
  const { success, result }: any = (await GetUpdateItemMaterial({
    AuditFlowId: auditFlowId,
    GradientId: props.gradientId,
    solutionId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
  if (success) {
    bomModifyData.value = result || []
  }
}

const handleEdit = (row: any) => {
  bomModifyData.value.push(row)
}

</script>
