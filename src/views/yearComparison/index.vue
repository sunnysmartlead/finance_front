<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%" height="500">
      <!-- <el-table-column prop="categoryName" label="整套的毛利率" width="180" /> -->
      <el-table-column prop="categoryName" label="项目" width="180" />
      <el-table-column prop="categoryName" label="2022" width="180" />
      <el-table-column prop="categoryName" label="2023" width="180" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
// import { useRoute, useRouter } from "vue-router"
/**
 * 路由对象
 */
// const route = useRoute()
/**
 * 路由实例
 */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  tableData: []
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
<style scoped lang="scss"></style>
