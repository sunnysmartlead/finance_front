<template>
  <div>
    <el-card>
      <p>请选择报价方案组合：</p>
      <el-button type="primary" @click="addNewPlan" mb-20px>新增</el-button>
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
    <el-card>
      <p>NRE-前视方案一</p>
      <p>线体数量：2 共线分摊率：2</p>
      <el-table :data="data.tableData" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="序号" width="180" />
        <el-table-column prop="name" label="费用名称" width="180" />
        <el-table-column prop="name" label="核价金额" width="180" />
        <el-table-column label="报价系数" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.projectsPlan" type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="报价金额" width="180" />
        <el-table-column label="备注" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.projectsPlan" type="textarea" />
          </template>
        </el-table-column>
      </el-table>
      <p>专用设备</p>
      <el-table :data="data.tableData" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="设备名称" width="180" />
        <el-table-column prop="name" label="设备单价" width="180" />
        <el-table-column prop="name" label="设备数量" width="180" />
        <el-table-column prop="name" label="设备金额" width="180" />
      </el-table>
    </el-card>
    <p>单价表（sop年）</p>
    <el-table :data="data.tableData" style="width: 100%" border height="500px">
      <el-table-column prop="name" label="梯度" width="180" />
      <el-table-column prop="name" label="产品" width="180" />
      <el-table-column prop="name" label="10%" width="180" />
      <el-table-column prop="name" label="20%" width="180" />
    </el-table>
    <p>项目全生命周期汇总分析表-实际数量</p>
    <el-table :data="data.tableData" style="width: 100%" border height="500px">
      <el-table-column prop="name" label="项目名称" width="180" />
      <el-table-column prop="name" label="10%" width="180" />
      <el-table-column prop="name" label="20%" width="180" />
    </el-table>
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
  debugger
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
watchEffect(() => { })
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
