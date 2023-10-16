<template>
  <div>
    <el-card m="2" header="损耗成本">
      <lossTable :lossData="lossData" :onEdit="handleEdit" :hideEdit="hideEdit" />
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
      <lossTable :isEdit="!hideEdit" :lossData="modifyData" :on-delete="handleDelete" />
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
import { GetUpdateItemLossCost, SetUpdateItemLossCost, GetLossCost } from "../../service"
import lossTable from "./lossTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty, cloneDeep } from "lodash"
import { ElMessage } from "element-plus"
import { map } from 'lodash';
import { getEditTotal } from '../../common/util'

const { auditFlowId, productId: solutionId } = getQuery()

const props = defineProps({
  yearData: {
    type: Object as PropType<any>
  },
  gradientId: Number,
  hideEdit: Boolean,
  onRefresh: {
    type: Function as PropType<any>
  }
})

const lossData = ref<any>([])
const modifyData = ref<any>([])

const editTotal = computed(() => {
  const total = getEditTotal(lossData.value || [], modifyData.value || [], 'wastageCost')
  return total
})

// 获取损耗成本
const getLossCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetLossCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId: solutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    lossData.value = map(result, (item, index) => ({ ...item, editId: item.editId || (index + 1) })) || []
    console.log(result, "获取损耗成本")
  } catch (err: any) {
    console.log(err, "[ 获取损耗成本数据失败 ]")
  }
}

const getModifyData = async () => {
  const { success, result }: any = (await GetUpdateItemLossCost({
    AuditFlowId: auditFlowId,
    GradientId: props.gradientId,
    solutionId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
  if (success) {
    modifyData.value = result || []
  }
}

const handleEdit = (row: any) => {
  const findData = modifyData.value.find((item: any) => item.editId === row.editId)
  if (!findData) {
    modifyData.value.push(cloneDeep(row))
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
  const { success } = await SetUpdateItemLossCost({
    updateItem: modifyData.value,
    auditFlowId,
    gradientId: props.gradientId,
    Year: props.yearData.year,
    SolutionId: solutionId,
    UpDown: props.yearData.upDown,
  })
  if (success) {
    ElMessage({
      type: 'success',
      message: '提交成功！'
    })
    props.onRefresh()
  }
}

const init = () => {
  console.log(props, "props")
  if (props.gradientId && !isEmpty(props.yearData)) {
    getLossCost()
    getModifyData()
  }
}

const handleDelete = (index: number) => {
  modifyData.value.splice(index, 1)
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
