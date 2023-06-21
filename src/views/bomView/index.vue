<template>
  <div class="bomView">
    <div class="bomView__child">
      <h4>电子料</h4>
      <el-button type="primary" @click="jumpToImport(1)" style="float: right; margin: 10px 0">电子料导入</el-button>
      <el-table :data="data.electronicData" border style="width: 100%" height="500">
        <el-table-column prop="categoryName" label="物料大类" width="180" />
        <el-table-column prop="typeName" label="物料种类" width="180" />
        <el-table-column prop="isInvolveItem" label="是否涉及" width="180" />
        <el-table-column prop="sapItemNum" label="物料编号" width="180" />
        <el-table-column prop="sapItemName" label="材料名称" width="180" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180" />
        <el-table-column prop="encapsulationSize" label="封装（需要体现PAD的数量）" />
      </el-table>
    </div>

    <div class="bomView__child">
      <h4>结构料</h4>
      <el-button type="primary" @click="jumpToImport(2)" style="float: right; margin: 10px 0">结构料导入</el-button>
      <el-table :data="data.structuralData" border style="width: 100%" height="500">
        <el-table-column prop="categoryName" label="物料大类" width="180" />
        <el-table-column prop="typeName" label="物料种类" width="180" />
        <el-table-column prop="isInvolveItem" label="是否涉及" width="180" />
        <el-table-column prop="drawingNumName" label="图号名称" width="180" />
        <el-table-column prop="sapItemNum" label="物料编号" width="180" />
        <el-table-column prop="overallDimensionSize" label="外形尺寸mm" width="180" />
        <el-table-column prop="materialName" label="材料名称" width="180" />
        <el-table-column prop="weightNumber" label="重量" width="180" />
        <el-table-column prop="moldingProcess" label="成型工艺" width="180" />
        <el-table-column prop="isNewMouldProduct" label="是否新开模" width="180" />
        <el-table-column prop="secondaryProcessingMethod" label="二次加工方法" width="180" />
        <el-table-column prop="surfaceTreatmentMethod" label="表面处理" width="180" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180" />
        <el-table-column prop="dimensionalAccuracyRemark" label="关键尺寸精度及重要要求" width="200" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { GetStructionBom, GetElectronicBom } from "@/api/bom"
/**
 * 路由对象
 */
// const route = useRoute()
// /**
//  * 路由实例
//  */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  electronicData: [],
  structuralData: []
})
const jumpToImport = (type: number) => {
  if (type === 1) {
    router.push({
      path: "/electronicImport/index"
    })
  } else {
    router.push({
      path: "/structuralMaterialImport/index"
    })
  }
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  let resStruction: any = await GetStructionBom({})
  let resElectronic: any = await GetElectronicBom({})
  data.electronicData = resElectronic.result
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
  &__child {
    margin: 20px 0;
  }
}
</style>
