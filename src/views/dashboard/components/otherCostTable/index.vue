<template>
  <div>
    <el-card m="2" header="其他成本" v-loading="loading">
      <otherCostTable :otherCostData="otherCostData" :hideEdit="hideEdit" :onEdit="handleEdit" />
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
      <otherCostTable :isEdit="!hideEdit" :otherCostData="modifyData" :on-delete="handleDelete" />
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
import { GetUpdateItemOtherCost, SetUpdateItemOtherCost, GetOtherCostItem } from "../../service"
import otherCostTable from "./otherCostTable.vue"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"
import { getEditTotal } from '../../common/util'
const { auditFlowId, productId: SolutionId } = getQuery()
import { cloneDeep, map, isEmpty } from 'lodash'

const props = defineProps({
  manufactureData: {
    type: Array as PropType<any[]>
  },
  yearData: {
    type: Object as PropType<any>
  },
  gradientId:  String,
  hideEdit: Boolean,
  onRefresh: {
    type: Function as PropType<any>
  }
})

const otherCostData = ref<any>([])
const modifyData = ref<any>([])
const loading = ref(false)

const editTotal = computed(() => {
  const total = getEditTotal(otherCostData.value || [], modifyData.value || [], 'cost')
  return total
})

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
    loading.value = true
  const { yearData, gradientId } = props
    const { result, success }: any = await GetOtherCostItem({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    }) || {}
    if (success) {
      otherCostData.value = map(result, (item, index) => ({ ...item, editId: item.editId || (index + 1) })) || []
    }
    loading.value = false
    console.log(result, "获取其他成本")
  } catch (err: any) {
    loading.value = false
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
  if (!modifyData.value.length) {
    ElMessage({
      type: 'error',
      message: '请先添加修改项数据再操作！'
    })
    return
  }
  const { success } = await SetUpdateItemOtherCost({
    updateItem: modifyData.value,
    auditFlowId,
    gradientId: props.gradientId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })
  if (success) {
    props.onRefresh()
    ElMessage({
      type: 'success',
      message: '提交成功！'
    })
  }
}


const handleDelete = (index: number) => {
  modifyData.value.splice(index, 1)
}

const handleEdit = (row: any) => {
  const findData = modifyData.value.find((item: any) => item.editId === row.editId)

  if (!findData) {
    console.log(row, 'findData111')
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

onMounted(() => {
  init()
})

const toFixedThree = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}
</script>
