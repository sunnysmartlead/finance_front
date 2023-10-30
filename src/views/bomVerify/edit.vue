<template>
  <el-row class="m-2" justify="end" style="margin-top: 20px">
    <el-button type="primary" @click="jumpToDashboard">返回核价看板</el-button>
  </el-row>
  <el-card header="电子料单价" class="m-2">
    <ElectronicTable isMergeEdit ref="electronicRef" />
  </el-card>
  <el-card header="结构BOM单价" class="m-2">
    <ConstructionTable isMergeEdit ref="constructionRef" />
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import ElectronicTable from "@/components/ElectronicTable/index.vue"
import ConstructionTable from "@/components/ConstructionTable/index.vue"
import { ElMessage } from "element-plus" //  ElMessageBox,
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const { auditFlowId }: any = getQuery()
const { closeSelectedTag } = useJump()

const jumpToDashboard = () => {
  closeSelectedTag(route.path)
  router.push({
    path: "/dashboard/index",
    query: {
      auditFlowId
    }
  })
}

</script>
