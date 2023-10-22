<template>
  <div>
    <ProcessVertifyBox :onSubmit="handleSetBomState" processType="priceEvaluationBoard" />
    <bulletinBoard ref="bulletinBoardRef" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import bulletinBoard from "../components/bulletinBoard/index.vue"
import { SetBomState } from "@/api/bom"
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"
import { ElMessage } from "element-plus"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
const bulletinBoardRef = ref()
const { auditFlowId, productId }: any = getQuery()
const { jumpTodoCenter } = useJump()

const handleSetBomState = async ({ comment, opinion, nodeInstanceId }: any) => {
  const fileList = bulletinBoardRef.value.getFileList()
  if (opinion === 'HjkbSelect_Yes' && !fileList.length) {
    return ElMessage.warning('请先上传TR方案！')
  }
  let res: any = await SetBomState({
    auditFlowId: auditFlowId,
    productId: productId,
    bomCheckType: 2,
    isAgree: !opinion.includes("_No"),
    opinionDescription: comment,
    opinion,
    nodeInstanceId
  })
  if (res.success) {
    jumpTodoCenter()
    ElMessage.success("操作成功")
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  #costChart {
    margin: 10px 0;
    height: 400px;
  }

  #selectCostChart {
    margin: 10px 0;
    height: 400px;
  }

  #percentageCostChart {
    margin: 10px 0;
    height: 300px;
  }
}
</style>
