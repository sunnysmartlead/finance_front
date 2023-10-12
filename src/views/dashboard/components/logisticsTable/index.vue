<template>
  <div>
    <el-card m="2" header="物流成本">
      <logisticsTable :logisticsData="logisticsData" :hideEdit="hideEdit" :on-edit="handleEdit" />
    </el-card>
    <el-card m="2" v-if="!hideEdit">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-row v-if="!hideEdit">
            <el-button type="primary" m="2" @click="addEditList">新增</el-button>
            <el-button type="primary" m="2" @click="handleSubmit">提交</el-button>
            <el-upload
              :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
              :on-success="handleSuccess"
              show-file-list
              :on-progress="handleGetUploadProgress"
              :on-error="handleUploadError"
              v-model:file-list="fileList"
              :limit="1"
            >
              <el-button type="primary" m="2">上传佐证资料</el-button>
            </el-upload>
          </el-row>
        </el-row>
      </template>
      <logisticsTable :isEdit="!hideEdit" :logisticsData="modifyData" :onDelete="handleDelete" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetLogisticsCost, SetUpdateItemMaterial, GetUpdateItemLogisticsCost } from "../../service"
import logisticsTable from "./logisticsTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"
import type { UploadProps, UploadUserFile } from "element-plus"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { ElMessage } from "element-plus"


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
  hideEdit: Boolean
})

const modifyData = ref<any>([])
const logisticsData = ref<any>([])
const fileList = ref<any>([])

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
    logisticsData.value = result
    console.log(result, "物流成本汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 物流成本汇总表数据失败 ]")
  }
}

const getModifyData = async () => {
  const { success, result }: any = (await GetUpdateItemLogisticsCost({
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
  modifyData.value.push(row)
}

const addEditList = () => {
  modifyData.value.push({})
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
  const fileIds =  fileList.value.map((item: any) => item.response.result?.fileId) || []
  if (!fileIds.length) {
    ElMessage({
      type: 'error',
      message: '请先上传佐证资料！'
    })
    return
  }
  if (!modifyData.value.length) {
    ElMessage({
      type: 'error',
      message: '请先添加修改项数据再操作！'
    })
    return
  }
  const { success } = await SetUpdateItemMaterial({
    updateItem: modifyData.value,
    auditFlowId,
    modifyData,
    gradientId: props.gradientId,
    file: fileIds[0],
    Year: props.yearData.year,
    UpDown: props.yearData.upDown,
  })
  if (success) {
    ElMessage({
      type: 'success',
      message: '提交成功！'
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
