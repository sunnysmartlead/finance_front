<template>
  <div>
    <el-card class="pddAudit">
      <template #header>
        <div class="card-header">
          <span>核价系统</span>
        </div>
      </template>
      <el-button type="primary" class="pddAudit_but" @click="dialogTableVisible = true">查看设计方案</el-button>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>流程中心</span>
          </div>
        </template>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="待办(0)" name="first">无</el-tab-pane>
          <el-tab-pane label="转发(0)" name="second">无</el-tab-pane>
          <el-tab-pane label="抄送(0)" name="third">无</el-tab-pane>
          <el-tab-pane label="已办(0)" name="fourth">无</el-tab-pane>
        </el-tabs>
      </el-card>
      <div>
        <el-row :gutter="12" class="pddAudit_row">
          <el-button type="danger" @click="submit(0)">退回</el-button>
          <el-button type="success" @click="submit(1)">提交</el-button>
        </el-row>
      </div>
    </el-card>
    <div>
      <designScheme v-model:dialogTableVisible="dialogTableVisible" @close="dialogTableVisible = false" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import type { TabsPaneContext } from "element-plus"
import { ElMessage } from "element-plus"
import { AuditExport } from "@/views/demandApplyAudit/service"
import getQuery from "@/utils/getQuery"
import { designScheme } from "@/views/demandApplyAudit"
const activeName = ref("first")
let dialogTableVisible = ref(false)
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(async () => {
  let query = getQuery()
  if (query.auditFlowId) {
  }
})
const submit = (isSubmit: number) => {
  if (isSubmit) {
    ElMessage({
      message: "提交",
      type: "success"
    })
  } else {
    ElMessage({
      message: "退回",
      type: "success"
    })
  }
}
</script>

<style lang="scss" scoped>
.pddAudit {
  width: 100%;
  .pddAudit_but {
    margin: 10px;
  }
  .pddAudit_row {
    margin: 10px;
    float: right;
  }
}
</style>
