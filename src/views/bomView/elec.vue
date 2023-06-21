<template>
  <div class="bomView">
    <CustomerSpecificity />
    <TrDownLoad />
    <ProductInfo :auditFlowId="data.auditFlowId" />
    <div class="bomView__child">
      <h4>电子料</h4>
      <!-- <el-button type="primary" @click="jumpToImport(1)" style="float: right; margin: 10px 0">电子料导入</el-button> -->
      <el-table :data="data.electronicData" border style="width: 100%" height="500">
        <el-table-column prop="categoryName" label="物料大类" width="180" />
        <el-table-column prop="typeName" label="物料种类" width="180" />
        <el-table-column prop="isInvolveItem" label="是否涉及" width="180" />
        <el-table-column prop="sapItemNum" label="物料编号" width="180" />
        <el-table-column prop="sapItemName" label="材料名称" width="180" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180" />
        <el-table-column prop="encapsulationSize" label="封装（需要体现PAD的数量）" />
      </el-table>
      <div style="margin: 10px 0; float: right">
        <el-button type="primary" @click="agree(1, true)" v-havedone>同意</el-button>
        <el-button @click="agree(1, false)" type="danger" v-havedone>拒绝</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
// import { useRouter } from "vue-router"
import { GetElectronicBom, SetBomState } from "@/api/bom"
import { ElMessage, ElMessageBox } from "element-plus"
import CustomerSpecificity from "@/components/CustomerSpecificity/index.vue"
import TrDownLoad from "@/components/TrDownLoad/index.vue"
import ProductInfo from "@/components/ProductInfo/index.vue"
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"

const { jumpTodoCenter } = useJump()

const { auditFlowId, productId }: any = getQuery()

/**
 * 路由对象
 */
// const route = useRoute()
// /**
//  * 路由实例
//  */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  electronicData: [],
  structuralData: [],
  auditFlowId: auditFlowId
})
// const jumpToImport = (type: number) => {
//   if (type === 1) {
//     router.push({
//       path: "/electronicImport/index"
//     })
//   } else {
//     router.push({
//       path: "/structuralMaterialImport/index"
//     })
//   }
// }
const agree = async (bomCheckType: number, isAgree: boolean) => {
  let text = isAgree ? "您确定要同意嘛？" : "请输入拒绝理由"
  ElMessageBox[!isAgree ? "prompt" : "confirm"](text, "请审核", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async (val) => {
    let res: any = await SetBomState({
      auditFlowId: auditFlowId,
      productId: productId,
      bomCheckType,
      isAgree,
      opinionDescription: !isAgree ? val?.value : ""
    })
    if (res.success) {
      jumpTodoCenter()
      ElMessage.success("操作成功")
    }
  })
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  // let resStruction: any = await GetStructionBom()
  let resElectronic: any = await GetElectronicBom({ auditFlowId, productId })
  data.electronicData = resElectronic.result
  // data.structuralData = resStruction.result
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.bomView {
  &__child {
    margin: 20px 0;
  }
}
</style>
