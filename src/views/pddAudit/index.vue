<template>
  <div>
    <!-- <VertifyBox :onSubmit="handleSubmit" /> -->
    <ProcessVertifyBox :onSubmit="handleSubmit" v-havedone />
    <el-card class="pddAudit">
      <template #header>
        <div class="card-header">
          <span>核价系统</span>
        </div>
      </template>
      <el-button type="primary" class="pddAudit_but" @click="data.dialogTableVisible = true">查看设计方案</el-button>
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
// import VertifyBox from "@/components/VertifyBox/index.vue"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import useJump from "@/hook/useJump"
import { useRoute, useRouter } from "vue-router"
import { ProductDevelopmentDepartmentReview } from "./service"
let route = useRoute()
const { closeSelectedTag } = useJump()
const data = reactive({
  dialogTableVisible: false,
  dialogVisible: false,
  activeName: "first",
  reson: ""
})

// 审核
const handleSubmit =async ({ comment, opinion, nodeInstanceId }: any) => {
  try {
    let res: any =await ProductDevelopmentDepartmentReview({
      opinionDescription: comment,
      opinion,
      nodeInstanceId
    })
    if (res.success) {
      ElMessage({
        type: "success",
        message: "保存成功"
      })
      closeSelectedTag(route.path)
    }
  } catch (error) {}
}

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
