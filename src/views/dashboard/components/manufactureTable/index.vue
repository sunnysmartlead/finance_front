<template>
  <div>
    <el-card m="2" header="制造成本" v-loading="loading">
      <manufactureTable :manufactureData="manufactureData" :onEdit="handleEdit" :hideEdit="hideEdit" />
    </el-card>
    <el-card m="2" v-if="!hideEdit">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-row v-if="!hideEdit">
            <el-button type="primary" m="2" @click="handleSubmit">提交</el-button>
          </el-row>
        </el-row>
      </template>
      <manufactureTable :isEdit="!hideEdit" :manufactureData="modifyData" :on-delete="handleDelete" />
      <el-descriptions :column="1" border>
        <el-descriptions-item label="修改后合计：">
          {{ editTotal }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch, computed } from "vue"
import { GetUpdateItemManufacturingCost, SetUpdateItemManufacturingCost, GetManufacturingCost } from "../../service"
import manufactureTable from "./manufactureTable.vue"
import getQuery from "@/utils/getQuery"
import { cloneDeep, isEmpty, map } from "lodash"
import { ElMessage } from "element-plus"
import { formatThousandths } from "@/utils/number"
import { saveAfterUpdateSum } from "../../common/util"

const { auditFlowId, productId: SolutionId } = getQuery()

const props = defineProps({
  manufactureData: {
    type: Array as PropType<any[]>
  },
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: Number,
  hideEdit: Boolean,
  onRefresh: {
    type: Function as PropType<any>
  }
})

const modifyData = ref<any>([])
const manufactureData = ref<any>([])
const loading = ref(false)

const editTotal = computed(() => {
  const originArr = manufactureData.value
  const originLen = originArr.length
  if (!originLen) {
    return 0
  }
  let total = 0
  console.log(originArr, "originArr")
  originArr.forEach((item: any) => {
    const findData = modifyData.value?.find((c: any) => c.editId === item.editId)
    if (findData) {
      total += Number(findData.subtotal)
    } else if (!item.costItem.includes("制造成本合计")) total += Number(item.subtotal)
  })
  return formatThousandths(null, null, total)
})

// 获取 制造成本汇总表
const getManufacturingCost = async () => {
  try {
    loading.value = true
    const { yearData, gradientId } = props
    const { result }: any = await GetManufacturingCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId
    })
    manufactureData.value = map(result, (item, index) => ({ ...item, editId: item.editId || index + 1 })) || []
    console.log(result, "getManufacturingCost")
    loading.value = false
  } catch (err: any) {
    loading.value = false
    console.log(err, "[ 获取 制造成本汇总表据失败 ]")
  }
}

const getModifyData = async () => {
  const { result }: any =
    (await GetUpdateItemManufacturingCost({
      AuditFlowId: auditFlowId,
      GradientId: props.gradientId,
      SolutionId,
      Year: props.yearData.year,
      UpDown: props.yearData.upDown
    })) || {}
  modifyData.value = result || []
}

const init = () => {
  if (props.gradientId && !isEmpty(props.yearData)) {
    getManufacturingCost()
    getModifyData()
  }
}

const handleSubmit = async () => {
  const params = {
    auditFlowId,
    gradientId: props.gradientId,
    Year: props.yearData.year,
    SolutionId,
    UpDown: props.yearData.upDown,
  }
  const { success } = await SetUpdateItemManufacturingCost({
    ...params,
    updateItem: modifyData.value,
  })
  if (success) {
    ElMessage({
      type: "success",
      message: "提交成功！"
    })
    props.onRefresh()
    saveAfterUpdateSum({
      ...params,
      manufacturingAfterSum: editTotal.value
    })
  }
}

const handleEdit = (row: any) => {
  const findData = modifyData.value.find((item: any) => item.editId === row.editId)
  if (!findData) {
    modifyData.value.push(cloneDeep(row))
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

const handleDelete = (index: number) => {
  modifyData.value.splice(index, 1)
}

watch(
  () => modifyData.value,
  (val) => {
    modifyData.value.forEach((item: any) => {
      item.manufacturingCostDirect.subtotal =
        (item.manufacturingCostDirect.directLabor || 0) +
        (item.manufacturingCostDirect.equipmentDepreciation || 0) +
        (item.manufacturingCostDirect.lineChangeCost || 0) +
        (item.manufacturingCostDirect.manufacturingExpenses || 0)
      item.manufacturingCostIndirect.subtotal =
        (item.manufacturingCostIndirect.directLabor || 0) +
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
</script>
