<template>
  <el-card>
    <div style="background-color: #ffffff">
      <el-table :data="tableData">
        <el-table-column prop="userName" label="操作用户名" width="100" fixed="left" />
        <el-table-column prop="nodeName" label="工作流节点名称" width="80" fixed="left" />
        <el-table-column prop="displayName" label="流转意见" width="80" fixed="left" />
        <el-table-column prop="comment" label="审批评论" width="80" fixed="left" />
      </el-table>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getInstanceHistoryById } from "./service"
import { formatDateTime } from "@/utils"

const tableData = ref<any[]>([])
const editLogFlag = ref(false)

export interface LogListAPI {
  onRefresh: () => void
}

const props = defineProps({
  auditFlowId: Number
})

onMounted(async () => {
  let res = await getInstanceHistoryById(props.auditFlowId)
  tableData.value = res.data.items
})
</script>

<style lang="scss" scoped>
.content-wrap {
  max-height: 600px;
  overflow-y: auto;
}
</style>
