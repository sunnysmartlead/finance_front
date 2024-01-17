<template>
  <div class="bomView">
    <div style="margin: 10px 0; float: right">
        <ProcessVertifyBox :onSubmit="handleSetBomState" processType="baseProcessType" />
      </div>
    <CustomerSpecificity />
    <div class="bomView__btn">
      <ProductInfo :auditFlowId="data.auditFlowId" m="2" />
      <ThreeDImage m="2" />
      <TrView />
      <LogisticsInfo m="2" />
    </div>
    <el-card class="bomView__child">
      <el-button type="primary" @click="filterTableData">筛选涉及项</el-button>
      <h4>结构料</h4>
      <!-- <el-button type="primary" @click="jumpToImport(2)" style="float: right; margin: 10px 0">结构料导入</el-button> -->
      <el-table :data="data.structuralData" border style="width: 100%" height="500">
        <el-table-column prop="categoryName" label="物料大类"  width="210" fixed="left" align="center"/>
      <el-table-column prop="typeName" label="物料种类"  width="130"  fixed="left" align="center"/>
      <el-table-column prop="isInvolveItem" label="是否涉及" width="80"  fixed="left" align="center"/>
      <el-table-column prop="drawingNumName" label="图号名称"  width="210"  fixed="left" align="center"/>
      <el-table-column prop="sapItemNum" label="物料编号"  width="180"  fixed="left" align="center"/>
      <el-table-column prop="assemblyQuantity" label="装配数量" width="80"  fixed="left" :formatter="(_record, _row,cellValue) => formatThousandthsIndex(_record, _row,cellValue, 5)"/>
      <el-table-column prop="overallDimensionSize" label="外形尺寸mm" width="120" align="center"/>
      <el-table-column prop="materialName" label="材料名称"  width="130" align="center"/>
      <el-table-column prop="weightNumber" label="重量" width="80" align="center"  :formatter="(_record, _row,cellValue) => formatThousandthsIndex(_record, _row,cellValue, 2)"/>
      <el-table-column prop="moldingProcess" label="成型工艺"  width="130" align="center"/>
      <el-table-column prop="isNewMouldProduct" label="是否新开模" width="80" align="center"/>
      <el-table-column prop="secondaryProcessingMethod" label="二次加工方法"  width="130" align="center"/>
      <el-table-column prop="surfaceTreatmentMethod" label="表面处理"  width="130" align="center"/>
      <el-table-column prop="dimensionalAccuracyRemark" label="关键尺寸精度及重要要求" width="200" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import CustomerSpecificity from "@/components/CustomerSpecificity/index.vue"
import ProductInfo from "@/components/ProductInfo/index.vue"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
import LogisticsInfo from "@/components/LogisticsInfo/index.vue"
import TrView from "@/components/TrView/index.vue"

import { GetStructionBom, SetBomState } from "@/api/bom"
import { ElMessage } from "element-plus"
import { sortBy } from "lodash"
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { useRoute } from "vue-router"
import { formatThousandths,formatThousandthsIndex} from "@/utils/number"
const route = useRoute()

const { closeSelectedTag } = useJump()
const { auditFlowId, productId }: any = getQuery()

/**
 * 数据部分
 */
const data = reactive<any>({
  structuralData: [],
  auditFlowId: auditFlowId,
  isFilter: false
})

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
    closeSelectedTag(route.path)
    ElMessage.success("操作成功")
  }
}

const filterTableData = () => {
  data.isFilter = !data.isFilter
  data.structuralData = sortBy(data.structuralData, (item) => {
    return item.isInvolveItem === (data.isFilter ? "否" : "是")
  })
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  let resStruction: any = await GetStructionBom({ auditFlowId,productId, solutionId:productId })
  data.structuralData = resStruction.result
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
  &__btn {
    display: flex;
  }
}
</style>
