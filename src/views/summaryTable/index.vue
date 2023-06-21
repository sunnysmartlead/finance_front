<template>
  <div>
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>bom成本（含损耗）汇总表</span>
        </div>
      </template>
      <el-table :data="data.bomData" border style="width: 100%" height="500">
        <el-table-column prop="sapItemNum" label="物料编号" width="180" />
        <el-table-column prop="sapItemName" label="材料名称" width="180" />
        <el-table-column prop="typeName" label="物料种类" width="180" />
        <el-table-column prop="categoryName" label="物料大类" width="180" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180" />
        <el-table-column prop="assemblyQuantity" label="单价" width="180" />
        <el-table-column prop="assemblyQuantity" label="币别" width="180" />
        <el-table-column prop="assemblyQuantity" label="汇率" width="180" />
        <el-table-column prop="assemblyQuantity" label="材料单价（人民币）" width="180" />
        <el-table-column prop="assemblyQuantity" label="合计金额（人民币）" width="180" />
        <el-table-column prop="isInvolveItem" label="损耗率" width="180" />
        <el-table-column prop="encapsulationSize" label="损耗" width="180" />
        <el-table-column prop="encapsulationSize" label="材料成本（含损耗）" />
      </el-table>
    </el-card>
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>制造成本汇总表</span>
        </div>
      </template>
      <el-table :data="data.manufactureData" border style="width: 100%" height="500">
        <el-table-column prop="sapItemNum" label="项目" width="180" />
        <el-table-column prop="sapItemName" label="梯度K/Y" width="180" />
        <el-table-column prop="typeName" label="年份" width="180" />
        <el-table-column prop="categoryName" label="直接制造成本">
          <el-table-column prop="typeName" label="直接人工" width="180" />
          <el-table-column prop="typeName" label="设备折旧" width="180" />
          <el-table-column prop="typeName" label="换线成本" width="180" />
          <el-table-column prop="typeName" label="制造费用" width="180" />
          <el-table-column prop="typeName" label="小计" width="180" />
        </el-table-column>
        <el-table-column prop="categoryName" label="间接制造成本">
          <el-table-column prop="typeName" label="直接人工" width="180" />
          <el-table-column prop="typeName" label="设备折旧" width="180" />
          <el-table-column prop="typeName" label="换线成本" width="180" />
          <el-table-column prop="typeName" label="制造费用" width="180" />
          <el-table-column prop="typeName" label="小计" width="180" />
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>物流成本汇总表</span>
        </div>
      </template>
      <el-table :data="data.logisticsData" border style="width: 100%" height="500">
        <el-table-column prop="typeName" label="年份" width="180" />
        <el-table-column prop="sapItemNum" label="单PCS包装价格/元" />
        <el-table-column prop="sapItemName" label="单PCS运输费" />
        <el-table-column prop="typeName" label="单PCS总物流料成本" />
      </el-table>
    </el-card>

    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>质量成本汇总表</span>
        </div>
      </template>
      <el-table :data="data.qualityData" border style="width: 100%" height="500">
        <el-table-column prop="typeName" label="产品类别" />
        <el-table-column prop="sapItemNum" label="成本比例" />
        <el-table-column prop="sapItemName" label="质量成本（MAX）" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
/**
 * 仓库
 */
/**
 * 路由对象
 */

//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  bomData: [],
  manufactureData: [],
  logisticsData: [],
  qualityData: []
})
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.card {
  margin: 10px 0;
}
</style>
