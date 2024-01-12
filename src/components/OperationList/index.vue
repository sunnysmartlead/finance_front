<template>
  <el-card v-if="auditFlowId" style="margin-top: 80px">
    <div style="background-color: #ffffff">
      <el-table :data="tableData" height="300px">
        <el-table-column prop="userName" label="用户名称" width="200" />
        <el-table-column prop="userDepartmentName" label="用户部门" width="200" />
        <el-table-column prop="nodeName" label="工作流节点名称" width="200" />
        <el-table-column prop="displayName" label="流转意见" />
        <el-table-column prop="comment" label="审批评论" />
        <el-table-column prop="creationTime" label="创建时间" />
      </el-table>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getInstanceHistoryById } from "./service"
import getQuery from "@/utils/getQuery"

import { formatDateTime } from "@/utils"

const tableData = ref<any[]>([])
const { auditFlowId } = getQuery()

export interface LogListAPI {
  onRefresh: () => void
}

onMounted(async () => {
  if (auditFlowId) {
    let res: any = await getInstanceHistoryById(auditFlowId)
    res?.result.items.forEach((item: any) => {
      tableData.value.push(item)
    })
  }
})
</script>

<style lang="scss" scoped>
.content-wrap {
  max-height: 600px;
  overflow-y: auto;
}
</style>
