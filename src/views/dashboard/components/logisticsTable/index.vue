<template>
  <div>
    <el-card m="2" header="物流成本">
      <logisticsTable :logisticsData="logisticsData" :hideEdit="hideEdit" :on-edit="handleEdit" />
    </el-card>
    <el-card m="2">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-row v-if="!hideEdit">
            <el-button type="primary" m="2" @click="handleSubmit">提交</el-button>
          </el-row>
        </el-row>
      </template>
      <logisticsTable :isEdit="!hideEdit" :logisticsData="modifyData" :onDelete="handleDelete" />
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
import { GetLogisticsCost, SetUpdateItemLogisticsCost, GetUpdateItemLogisticsCost } from "../../service"
import logisticsTable from "./logisticsTable.vue"
import getQuery from "@/utils/getQuery"
import { cloneDeep, isEmpty, map } from "lodash"
import type { UploadProps, UploadUserFile } from "element-plus"
import { ElMessage } from "element-plus"
import { getEditTotal, saveAfterUpdateSum } from '../../common/util'

const { auditFlowId, productId: solutionId } = getQuery()

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
  },
  hideEdit: Boolean,
  onRefresh: {
    type: Function as PropType<any>
  }
})

const modifyData = ref<any>([])
const logisticsData = ref<any>([])

const editTotal = computed(() => {
  const total = getEditTotal(logisticsData.value || [], modifyData.value || [], 'perTotalLogisticsCost')
  return total
})

// 获取 物流成本汇总表
const getLogisticsCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetLogisticsCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      solutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    logisticsData.value =  map(result, (item, index) => ({ ...item, editId: item.editId || (index + 1) })) || []
    console.log(result, "物流成本汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 物流成本汇总表数据失败 ]")
  }
}

const getModifyData = async () => {
  const { result }: any = (await GetUpdateItemLogisticsCost({
    AuditFlowId: auditFlowId,
    GradientId: props.gradientId,
    solutionId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
  modifyData.value = result || []
}

const handleEdit = (row: any) => {
  modifyData.value.push(cloneDeep(row))
}

const handleSubmit = async () => {
  const params = {
    auditFlowId,
    SolutionId: solutionId,
    gradientId: props.gradientId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  }
  const { success } = await SetUpdateItemLogisticsCost({
    ...params,
    updateItem: modifyData.value,
  })
  if (success) {
    ElMessage({
      type: 'success',
      message: '提交成功！'
    })
    props.onRefresh()
    saveAfterUpdateSum({
      ...params,
      logisticsAfterSum: editTotal.value
    })
  }
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
  getModifyData()
}

onMounted(() => {
  init()
})

const handleDelete = (index: number) => {
  modifyData.value.splice(index, 1)
}
</script>
