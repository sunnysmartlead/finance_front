<template>
  <div>
    <ProcessVertifyBox  :onSubmit="handleSetBomState" processType="baseProcessType" />
    <bulletinBoard hideEdit />
  </div>
</template>
<script setup lang="ts">
  import bulletinBoard from "../components/bulletinBoard/index.vue"
  import { SetBomState } from "@/api/bom"
  import getQuery from "@/utils/getQuery"
  import useJump from "@/hook/useJump"
  import { ElMessage } from "element-plus"
  import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"

  const { auditFlowId, productId }: any = getQuery()
  const { jumpTodoCenter } = useJump()

  const handleSetBomState = async ({ comment, opinion, nodeInstanceId }:any) => {
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

</style>
