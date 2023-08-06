<template>
  <div>
    <el-card>
      <p>请选择报价方案组合：</p>
      <el-button type="primary" @click="addNewPlan">新增</el-button>
      <el-table :data="data.tableData" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="报价序号" width="180" />
        <el-table-column label="前视" width="180">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案一" :value="1" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="侧视" width="180">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案二" :value="1" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="后视" width="180">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案三" :value="1" />
            </el-select>
          </template>
        </el-table-column>
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
  tableData: [
    // {
    //   projectsPlan: 1,
    //   name: "1/JAN"
    // }
  ]
})
const addNewPlan = () => {
  data.tableData.push({
    projectsPlan: 1,
    name: "1/JAN"
  })
}
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
