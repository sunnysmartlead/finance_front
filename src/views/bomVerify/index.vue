<template>
  <el-row class="m-2" justify="end" style="margin-top: 20px">
    <!-- <el-button type="primary" @click="handleSetBomState(true)" v-havedone>同意</el-button>
    <el-button type="danger" @click="handleSetBomState(false)" v-havedone>拒绝</el-button> -->
    <ProcessVertifyBox :onSubmit="handleSetBomState" processType="bomCostProcessType" />
  </el-row>
  <el-card header="结构BOM单价" class="m-2">
    <ConstructionTable isVertify isMergeVertify />
  </el-card>
  <el-card header="电子料单价" class="m-2">
    <ElectronicTable isVertify isMergeVertify />
  </el-card>
</template>

<script lang="ts" setup>
import ElectronicTable from "@/components/ElectronicTable/index.vue"
import ConstructionTable from "@/components/ConstructionTable/index.vue"
import { ElMessage } from "element-plus" //  ElMessageBox,
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { BomReview } from "@/components/ElectronicTable/common/request"
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"

// const handleSetBomState = (isAgree: boolean) => {
//   var construction = [[]]
//   var people = [[]]
//   var prop = window.sessionStorage.getItem("construction")
//   if (!prop && !isAgree) {
//     ElMessage({
//       message: "请选择要退回那些条数据!",
//       type: "warning"
//     })
//     return
//   } else {
//     if (prop) {
//       var constructionProp = JSON.parse(prop)
//       constructionProp.forEach((p: any) => {
//         construction.push(p.constructionId)
//         people.push(p.peopleId)
//       })
//     }
//   }
//   // electronicId.value = [...new Set(construction.flat(Infinity))]
//   // peopleId.value = [...new Set(people.flat(Infinity))]

//   // if (!isAgree && (!electronicId.value.length || !peopleId.value.length)) {
//   //   ElMessage({
//   //     message: "请选择要退回那些条数据!",
//   //     type: "warning"
//   //   })
//   //   return
//   // }
//   // let text = isAgree ? "您确定要同意嘛？" : "请输入拒绝理由"
//   // ElMessageBox[!isAgree ? "prompt" : "confirm"](text, "请审核", {
//   //   confirmButtonText: "确定",
//   //   cancelButtonText: "取消",
//   //   type: "warning"
//   // }).then(async (val) => {
//   //   const { success } = await SetBomState({
//   //     isAgree,
//   //     auditFlowId,
//   //     bomCheckType: 3,
//   //     opinionDescription: !isAgree ? val?.value : "",
//   //     unitPriceId: electronicId.value,
//   //     peopleId: peopleId.value
//   //   })
//   //   if (success) jumpTodoCenter()
//   // })
// }
const { auditFlowId }: any = getQuery()
const { jumpTodoCenter } = useJump()

const handleSetBomState = async ({ comment, opinion, nodeInstanceId }: any) => {
  const { success } = await BomReview({
    auditFlowId,
    bomCheckType: 5, //3：“电子Bom单价审核”，4：“结构Bom单价审核”,5:"Bom单价审核"
    comment,
    opinion,
    nodeInstanceId
  })
  if (success) jumpTodoCenter()
}
</script>
