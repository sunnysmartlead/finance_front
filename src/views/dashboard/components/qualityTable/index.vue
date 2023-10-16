<template>
  <div>
    <el-card m="2" header="质量成本">
      <qualityTable :qualityData="qualityData" :onEdit="handleEdit" :hideEdit="hideEdit" />
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
      <qualityTable :isEdit="!hideEdit" :qualityData="modifyData" :on-delete="handleDelete" />
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
import { GetUpdateItemQualityCost, SetUpdateItemQualityCost, GetQualityCost } from "../../service"
import qualityTable from "./qualityTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty, cloneDeep } from "lodash"
import type { UploadProps, UploadUserFile } from "element-plus"
import { ElMessage } from "element-plus"
import { getEditTotal } from '../../common/util'

const { auditFlowId, productId: SolutionId } = getQuery()

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

const qualityData = ref<any>([])
const modifyData = ref<any>([])

const editTotal = computed(() => {
  const total = getEditTotal(qualityData.value || [], modifyData.value || [], 'qualityCost')
  return total
})

// 获取 质量成本
const getQualityCost = async () => {
  try {
    const { yearData, gradientId } = props
    const { result }: any = await GetQualityCost({
      Year: yearData.year,
      AuditFlowId: auditFlowId,
      SolutionId,
      UpDown: yearData.upDown,
      GradientId: gradientId,
    })
    qualityData.value = [result] || []
  } catch (err: any) {
    console.log(err, "[ 获取 质量成本数据失败 ]")
  }
}

const getLogData = async () => {
  const { result } = (await GetUpdateItemQualityCost({
    AuditFlowId: auditFlowId,
    ProductId: 532,
    GradientId: props.gradientId,
    SolutionId,
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })) || {}
  modifyData.value = result || []
}

const handleDelete = (index: number) => {
  modifyData.value.splice(index, 1)
}

const init = () => {
  if (props.gradientId && !isEmpty(props.yearData)) {
    getQualityCost()
    getLogData()
  }
}


const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  if (res.success) {
    ElMessage({
      message: "上传成功",
      type: "success"
    })
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
  const { success } = await SetUpdateItemQualityCost({
    updateItem: modifyData.value,
    auditFlowId,
    SolutionId,
    gradientId: props.gradientId,
    Year: props.yearData.year,
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

onMounted(() => {
  init()
})
</script>
