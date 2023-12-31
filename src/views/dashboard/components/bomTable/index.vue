<template>
  <div>
    <el-card m="2" header="bom成本" v-loading="loading">
      <template #header>
        <el-row justify-between>
          <span>bom成本</span>
          <el-row>
            <el-button v-if="!hideEdit" type="primary" m="2" @click="goEdit">去修改</el-button>
            <el-button v-if="!hideEdit" type="primary" m="2" @click="handleSubmit">提交是否客供修改</el-button>
          </el-row>
        </el-row>
      </template>
      <bomTable :bomData="bomData" :hideEdit="hideEdit" :onChange="handleChange" />
      <el-card style="margin-top: 20px;" header="上传bom成本" v-if="editData.length">
        <bomTable :bomData="editData" :hideEdit="hideEdit" :onChange="handleChange" />
      </el-card>
      <el-descriptions :column="2" border>
      <el-descriptions-item label="材料成本合计：">
        {{ totalCount.totalMoneyCynNoCustomerSupply }}
      </el-descriptions-item>
      <el-descriptions-item label="电子料大类成本合计：">
        {{ totalCount.electMoneyCynNoCustomerSupply }}
      </el-descriptions-item>
    </el-descriptions>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch, computed } from "vue"
import { SetIsCustomerSupply, GetBomCost, GetImportBomCost } from "../../service"
import bomTable from "./bomTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"
import { useRouter } from "vue-router"

const router = useRouter()
const { auditFlowId, productId: solutionId } = getQuery()
import { formatThousandths } from '@/utils/number'
import { ElMessage } from "element-plus"

const props = defineProps({
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: String,
  hideEdit: Boolean,
  onRefresh: {
    type: Function as PropType<any>
  },
  isShowBomEdit: Boolean
})

const loading = ref(false)
const bomData = ref<any>([])
const editData = ref<any>([])

const totalCount = computed(() => {
  let totalMoneyCynNoCustomerSupply = 0
  let electMoneyCynNoCustomerSupply = 0
  bomData.value.forEach((item) => {
    totalMoneyCynNoCustomerSupply += item.totalMoneyCynNoCustomerSupply
    if (item.superType === '电子料') {
      electMoneyCynNoCustomerSupply += item.totalMoneyCynNoCustomerSupply
    }
  })
  return {
    totalMoneyCynNoCustomerSupply: formatThousandths(null, null, totalMoneyCynNoCustomerSupply),
    electMoneyCynNoCustomerSupply: formatThousandths(null, null, electMoneyCynNoCustomerSupply)
  }
})

// 获取 bom成本（含损耗）汇总表
const getBomCost = async () => {
  try {
    loading.value = true
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
    loading.value = false
    console.log(result, "获取 bom成本（含损耗）汇总表")
  } catch (err: any) {
    loading.value = false
    bomData.value = []
    console.log(err, "[ 获取 bom成本（含损耗）汇总表数据失败 ]")
  }
}

watch(
  () => [props.gradientId, props.yearData],
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
    props.isShowBomEdit && initFechEditData()
  }
}

const initFechEditData = async () => {
  try {
    console.log(props.gradientId, "props.gradientId")
    // if (!props.gradientId) return
    const { result }: any = await GetImportBomCost({
      AuditFlowId: auditFlowId,
      solutionId,
      GradientId: props.gradientId,
    })
    editData.value = result || []
    console.log(result, "获取 bom成本（含损耗）汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 bom成本（含损耗）汇总表数据失败 ]")
  }
}

const goEdit = () => {
  router.push({
    path: "/bomVerify/edit",
    query: {
      auditFlowId,
      productId: solutionId
    }
  })
}

onMounted(() => {
  init()
})

const handleChange = (val: any, index: number,count:number) => {
  bomData.value.forEach((item: any, cIndex: number) => {
    if (cIndex === index) {
       if(count==1)item.isCustomerSupply = val
       if(count==2)item.isNewMouldProduct = val
    }
  })
}

const handleSubmit = async () => {
  const ids = bomData.value.map((item: any) => ({
    id: item.id,
    isCustomerSupply: item.isCustomerSupply,
  }))
  const { success } = await SetIsCustomerSupply({
    auditFlowId,
    bomIsCustomerSupplyList: ids
  })
  if (success) {
    props.onRefresh()
    init()
    ElMessage.success('提交成功！')
  }
}

defineExpose({
  initFetch: () => initFechEditData(),
  init: () => getBomCost(),
})
</script>
