<template>
  <el-row class="m-2" justify="end" style="margin-top: 20px">
    <ProcessVertifyBox :onSubmit="handleSetBomState" processType="bomCostProcessType" />
  </el-row>
  <el-card header="结构BOM单价" class="m-2">
    <ConstructionTable isVertify isMergeVertify ref="constructionRef" />
  </el-card>
  <el-card header="电子料单价" class="m-2">
    <ElectronicTable isVertify isMergeVertify ref="electronicRef" />
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import ElectronicTable from "@/components/ElectronicTable/index.vue"
import ConstructionTable from "@/components/ConstructionTable/index.vue"
import { ElMessage } from "element-plus" //  ElMessageBox,
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { BomReview } from "@/components/ElectronicTable/common/request"
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"
import { map } from "lodash"

const { auditFlowId }: any = getQuery()
const { jumpTodoCenter } = useJump()

const constructionRef = ref<any>()
const electronicRef = ref<any>()

const handleSetBomState = async ({ comment, opinion, nodeInstanceId }: any) => {
  const constructionSelection = constructionRef.value.getSelection()
  const electronicSelection = electronicRef.value.getSelection() || []
  const constructionIds: any = []
  map(constructionSelection, (val) => {
    constructionIds.push(...val)
  })
  if (!opinion.includes("_Yes") && !constructionIds.length && electronicSelection.length) {
    ElMessage({
      message: "请选择要退回那些条数据!",
      type: "warning"
    })
    return
  }
  const { success } = await BomReview({
    auditFlowId,
    bomCheckType: 5, //3：“电子Bom单价审核”，4：“结构Bom单价审核”,5:"Bom单价审核"
    comment,
    opinion,
    nodeInstanceId,
    structureUnitPriceId: constructionIds,
    electronicsUnitPriceId: electronicSelection
  })
  if (success) jumpTodoCenter()
}
</script>
