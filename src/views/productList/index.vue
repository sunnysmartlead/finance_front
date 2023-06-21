<template>
  <div>
    <el-table :data="data.tableData" style="width: 100%; margin-top: 50px" border>
      <el-table-column type="index" />
      <el-table-column label="零件名称" prop="product" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link type="primary" :href="row.id">点击进入</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import getQuery from "@/utils/getQuery"
import { getProductByAuditFlowId } from "./service"
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  tableData: []
})
onBeforeMount(() => {})
onMounted(async () => {
  let { auditFlowId } = getQuery()
  let id = auditFlowId ? Number(auditFlowId) : 1
  let res: any = await getProductByAuditFlowId(id)
  data.tableData = res.result
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
