<template>
  <el-card header="项目走量" m="2">
    <el-table :data="data.moduleNumber" height="500">
      <el-table-column prop="productName" label="产品" width="150" />
      <el-table-column prop="productTypeName" label="产品小类" width="150" />
      <!-- <el-table-column prop="marketShare" label="市场份额" width="150" />
      <el-table-column prop="moduleCarryingRate" label="模组搭载率" width="150" />
      <el-table-column prop="singleCarProductsQuantity" label="单车产品数量" width="150" /> -->
      <el-table-column
        v-for="(item, index) in data?.moduleNumberSop"
        :key="`construction-moduleNumberSop${item}`"
        :label="`${item?.year.toString()}`"
        :prop="`modelCountYear[${index}].value`"
        width="180"
      />
      <el-table-column prop="modelTotal" label="模组总量" width="150" />
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted } from "vue"
import { GetProjectGoQuantity } from "./common/request"
import getQuery from "@/utils/getQuery"

const { auditFlowId }: any = getQuery()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive<any>({
  moduleNumber: [], // 项目走量
  moduleNumberSop: []
})

// 获取项目走量的数据
const fetchModuleNumberData = async () => {
  const { result } = await GetProjectGoQuantity({ Id: auditFlowId })
  data.moduleNumberSop = result[0]?.modelCountYear
  data.moduleNumber = result
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  fetchModuleNumberData() //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
</script>
<style scoped lang="scss"></style>
