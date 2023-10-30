<template>
  <div class="bomView">
    <div style="margin: 10px 0; float: right">
      <ProcessVertifyBox :onSubmit="handleSetBomState" processType="baseProcessType" />
    </div>
    <CustomerSpecificity />
    <el-row>
      <TrView />
      <ProductInfo :auditFlowId="data.auditFlowId" m="2" />
    </el-row>
    <el-card class="bomView__child">
      <el-button type="primary" @click="filterTableData">筛选涉及项</el-button>
      <h4>电子料</h4>
      <el-table :data="data.electronicData" border style="width: 100%" height="500">
        <el-table-column prop="categoryName" label="物料大类" />
        <el-table-column prop="typeName" label="物料种类" width="120" />
        <el-table-column prop="isInvolveItem" label="是否涉及" width="120" />
        <el-table-column prop="sapItemNum" label="物料编号" width="120" />
        <el-table-column prop="sapItemName" label="材料名称" width="120" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180" />
        <el-table-column prop="encapsulationSize" label="封装（需要体现PAD的数量）" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { GetElectronicBom, SetBomState } from "@/api/bom"
import { ElMessage, ElMessageBox } from "element-plus"
import CustomerSpecificity from "@/components/CustomerSpecificity/index.vue"
import TrView from "@/components/TrView/index.vue"
import ProductInfo from "@/components/ProductInfo/index.vue"
import getQuery from "@/utils/getQuery"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { sortBy } from "lodash";
import { useRoute } from "vue-router"
import useJump from "@/hook/useJump"
const route = useRoute()

const { closeSelectedTag } = useJump()

const { auditFlowId, productId }: any = getQuery()

/**
 * 数据部分
 */
const data = reactive<any>({
  electronicData: [],
  structuralData: [],
  auditFlowId: auditFlowId,
  isFilter: false,
})

const filterTableData = () => {
  data.isFilter = !data.isFilter
  data.electronicData = sortBy(data.electronicData, (item) => {
    return item.isInvolveItem === (data.isFilter ? "否" : "是")
  })
}

const handleSetBomState = async ({ comment, opinion, nodeInstanceId }:any) => {
  let res: any = await SetBomState({
    auditFlowId: auditFlowId,
    productId: productId,
    bomCheckType: 1,
    isAgree: !opinion.includes("_No"),
    opinionDescription: comment,
    opinion,
    nodeInstanceId
  })
  if (res.success) {
    closeSelectedTag(route.path)
    ElMessage.success("操作成功")
  }
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  // let resStruction: any = await GetStructionBom()
  let resElectronic: any = await GetElectronicBom({ auditFlowId,productId, solutionId:productId })
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
  margin: 20px 0;
}
</style>
