<template>
  <div>
    <el-card>
      <p>NRE-前视方案一</p>
      <p>线体数量：2 共线分摊率：2</p>
      <el-table :data="data.nres" style="width: 100%" border height="500px">
        <el-table-column prop="nre" label="NRE费用" />
        <el-table-column prop="Amount" label="金额" />
        <el-table-column prop="reMark" label="备注" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  nres: [
    {
      nre: "手板件费用",
      Amount: 100,
      reMark: "1111"
    }
  ]
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
