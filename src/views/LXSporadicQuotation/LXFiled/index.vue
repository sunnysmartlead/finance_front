<template>
  <div>
    <el-card header="归档">
      <el-table :data="data.tableData" max-height="75vh" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="fileName" label="归档文件名称" />
        <el-table-column prop="productName" label="零件名称" />
        <el-table-column prop="quoteProjectName" label="核报价项目名称" />
        <!-- <el-table-column prop="myProperty" label="表明名" /> -->
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="DownClick(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row m="2" justify="end">
        <el-button type="primary" @click="handleDownload" v-loading.fullscreen.lock="fullscreenLoading">
          批量下载
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { GetDownloadList, PostPigeonholeDownloads, GetPigeonholeDownload } from "./service"
import { PigeonholeDownloadTableModel } from "./data.type"
import { ElMessage } from "element-plus"
import { downloadFileZip, downloadFileExcel } from "@/utils"
import getQuery from "@/utils/getQuery"

const { auditFlowId }: any = getQuery()

//console.log('1-开始创建组件-setup')
const init = async () => {
  if (auditFlowId) {
    const res: any = await GetDownloadList({ auditFlowId })
    data.tableData = res.result || []
  }
}

const fullscreenLoading = ref(false)
/**
 * 数据部分
 */
const data = reactive({
  tableData: [] as PigeonholeDownloadTableModel[]
})

const multipleSelection = ref<PigeonholeDownloadTableModel[]>([])

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  init()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

watchEffect(() => {})

const handleSelectionChange = (val: PigeonholeDownloadTableModel[]) => {
  multipleSelection.value = val
  console.log(val, "val")
}

const handleDownload = async () => {
  const ids = multipleSelection.value.map((item) => item.id) || []
  if (!ids.length) {
    return ElMessage.warning("请选择不少于一项归档项！")
  }
  try {
    fullscreenLoading.value = true
    console.log(ids)
    let res = await PostPigeonholeDownloads(ids)
    downloadFileZip(res, "归档")
    fullscreenLoading.value = false
    // ElMessage.success("下载成功")
  } catch (error) {
    console.error(error)
    fullscreenLoading.value = false
  }
}
const DownClick = async (row: PigeonholeDownloadTableModel) => {
  try {
    fullscreenLoading.value = true
    const id = row.id
    console.log(row, "row", row.id, "row.id")
    let res = await GetPigeonholeDownload({ id })
    downloadFileExcel(res, row.fileName + "")
    fullscreenLoading.value = false
  } catch (error) {
    console.error(error)
    fullscreenLoading.value = false
  }
}
</script>
<style scoped lang="scss"></style>
