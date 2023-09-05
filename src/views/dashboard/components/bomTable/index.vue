<template>
  <div>
    <el-card m="2" header="bom成本">
      <bomTable :bomData="bomData" :onEdit="handleEdit" />
    </el-card>
    <el-card m="2">
      <template #header>
        <el-row justify-between>
          <span>修改项：</span>
          <el-row>
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
      <bomTable isEdit v-model:bomData="bomModifyData" :onDelete="handleDelete" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, onMounted, watch } from "vue"
import { GetUpdateItemMaterial, GetBomCost, SetUpdateItemMaterial } from "../../service"
import type { UploadProps, UploadUserFile } from "element-plus"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { ElMessage } from "element-plus"
import bomTable from "./bomTable.vue"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"

const { auditFlowId, productId: solutionId } = getQuery()

const props = defineProps({
  bomData: {
    type: Array as PropType<any[]>
  },
  yearData: {
    type: Object as PropType<any>
  },
  gradientId:  String
})

const fileList = ref<UploadUserFile[]>([])

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

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  if (res.success) {
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
}

onMounted(() => {
  init()
})

const getBomLogData = async () => {
  const { success, result }: any = (await GetUpdateItemMaterial({
    AuditFlowId: auditFlowId,
    ProductId: 532,
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

const addEditList = () => {
  bomModifyData.value.push({})
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
  if (!bomModifyData.value.length) {
    ElMessage({
      type: 'error',
      message: '请先添加修改项数据再操作！'
    })
    return
  }
  const { success } = await SetUpdateItemMaterial({
    updateItem: bomModifyData.value,
    auditFlowId,
    solutionId,
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

const handleDelete = (index: number) => {
  bomModifyData.value.splice(index, 1)
}
</script>
