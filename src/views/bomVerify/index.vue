<template>
  <el-row class="m-2" justify="end" style="margin-top: 20px" >
    <el-button type="primary" @click="handleSetBomState(true)" v-havedone>同意</el-button>
    <el-button type="danger" @click="handleSetBomState(false)" v-havedone>拒绝</el-button>
  </el-row>
  <el-card title="结构BOM" class="m-2">
    <ConstructionTable isVertify isMergeVertify />
  </el-card>
  <el-card title="电子BOM" class="m-2">
    <ElectronicTable isVertify isMergeVertify />
  </el-card>
</template>

<script lang="ts" setup>
import ElectronicTable from "@/components/ElectronicTable/index.vue"
import ConstructionTable from "@/components/ConstructionTable/index.vue"
import { ElMessage } from "element-plus" //  ElMessageBox,

const handleSetBomState = (isAgree: boolean) => {
  var construction = [[]]
  var people = [[]]
  var prop = window.sessionStorage.getItem("construction")
  if (!prop && !isAgree) {
    ElMessage({
      message: "请选择要退回那些条数据!",
      type: "warning"
    })
    return
  } else {
    if (prop) {
      var constructionProp = JSON.parse(prop)
      constructionProp.forEach((p: any) => {
        construction.push(p.constructionId)
        people.push(p.peopleId)
      })
    }
  }
  // electronicId.value = [...new Set(construction.flat(Infinity))]
  // peopleId.value = [...new Set(people.flat(Infinity))]

  // if (!isAgree && (!electronicId.value.length || !peopleId.value.length)) {
  //   ElMessage({
  //     message: "请选择要退回那些条数据!",
  //     type: "warning"
  //   })
  //   return
  // }
  // let text = isAgree ? "您确定要同意嘛？" : "请输入拒绝理由"
  // ElMessageBox[!isAgree ? "prompt" : "confirm"](text, "请审核", {
  //   confirmButtonText: "确定",
  //   cancelButtonText: "取消",
  //   type: "warning"
  // }).then(async (val) => {
  //   const { success } = await SetBomState({
  //     isAgree,
  //     auditFlowId,
  //     bomCheckType: 3,
  //     opinionDescription: !isAgree ? val?.value : "",
  //     unitPriceId: electronicId.value,
  //     peopleId: peopleId.value
  //   })
  //   if (success) jumpTodoCenter()
  // })
}
</script>
