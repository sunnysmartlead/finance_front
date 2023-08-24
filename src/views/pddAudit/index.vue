<template>
  <div>
    <VertifyBox :onSubmit="handleSubmit" />
    <el-card class="pddAudit">
      <template #header>
        <div class="card-header">
          <span>核价系统</span>
        </div>
      </template>
      <el-button type="primary" class="pddAudit_but" @click="data.dialogTableVisible = true">查看设计方案</el-button>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>流程中心</span>
          </div>
        </template>
        <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="待办(0)" name="first">无</el-tab-pane>
          <el-tab-pane label="转发(0)" name="second">无</el-tab-pane>
          <el-tab-pane label="抄送(0)" name="third">无</el-tab-pane>
          <el-tab-pane label="已办(0)" name="fourth">无</el-tab-pane>
        </el-tabs> -->
      </el-card>
    </el-card>
    <div>
      <designScheme v-model:dialogTableVisible="data.dialogTableVisible" @close="data.dialogTableVisible = false" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import type { TabsPaneContext } from "element-plus"
import { ElMessage } from "element-plus"
import { AuditExport } from "@/views/demandApplyAudit/service"
import getQuery from "@/utils/getQuery"
import { designScheme } from "@/views/demandApplyAudit"
import VertifyBox from "@/components/VertifyBox/index.vue"

const data = reactive({
  dialogTableVisible: false,
  dialogVisible: false,
  activeName: "first",
  reson: ""
})

// 审核
const handleSubmit = () => {}

onMounted(async () => {
  let query = getQuery()
  if (query.auditFlowId) {
  }
})

</script>

<style lang="scss" scoped>
.pddAudit {
  width: 100%;
  .pddAudit_but {
    margin: 10px;
  }
}
.pddAudit_row {
  margin: 20px;
}
</style>
