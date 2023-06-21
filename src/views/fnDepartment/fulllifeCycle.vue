<template>
  <div>
    <el-card class="card">
      <el-table :data="data.tableData" style="width: 100%; margin-top: 25px" border>
        <el-table-column label="年份Sop" prop="year" width="180" />
        <el-table-column label="月工作天数" width="180">
          <template #default="{ row }">
            <el-input v-model="row.monthlyWorkingDays" />
          </template>
        </el-table-column>
        <el-table-column label="人员平均工资" width="180">
          <template #default="{ row }">
            <el-input v-model="row.averageWage" />
          </template>
        </el-table-column>
        <el-table-column label="每班正常工作时间" width="180">
          <template #default="{ row }">
            <el-input v-model="row.workingHours" />
          </template>
        </el-table-column>
        <el-table-column label="嫁动率" width="180">
          <template #default="{ row }">
            <el-input v-model="row.rateOfMobilization" />
          </template>
        </el-table-column>
        <el-table-column label="折旧年限" width="180">
          <template #default="{ row }">
            <el-input v-model="row.usefulLifeOfFixedAssets" />
          </template>
        </el-table-column>
        <el-table-column label="每日班次" width="180">
          <template #default="{ row }">
            <el-input v-model="row.dailyShift" />
          </template>
        </el-table-column>
        <el-table-column label="增值税率" width="180">
          <template #default="{ row }">
            <el-input v-model="row.vatRate">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="人均跟线数量">
          <template #default="{ row }">
            <el-input v-model="row.traceLineOfPerson" />
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
// import { useRoute, useRouter } from "vue-router"
import { getManufacturingCost, saveManufacturingCost } from "./service"
import { ManufacturingCostsItem } from "./data.type"
import { ElMessage } from "element-plus"

// /**
//  * 路由对象
//  */
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
  tableData: [] as ManufacturingCostsItem[],
  years: [] as number[]
})
const years = (index: number) => {
  let sop = new Date().getFullYear()
  let yearList: number[] = [sop]
  for (let i = 1; i < index; i++) {
    yearList.push(sop + i)
  }
  return yearList
}
const submit = async () => {
  let res: any = await saveManufacturingCost({ manufacturingCosts: data.tableData })
  if (res.success) {
    ElMessage({
      type: "success",
      message: "提交成功"
    })
  }
}
onBeforeMount(() => {
  data.years = years(10)
  data.years.forEach((year) => {
    data.tableData.push({
      monthlyWorkingDays: 0,
      averageWage: 0,
      workingHours: 0,
      rateOfMobilization: 0,
      usefulLifeOfFixedAssets: 0,
      dailyShift: 0,
      vatRate: 0,
      traceLineOfPerson: 0,
      year
    })
  })
})
onMounted(async () => {
  let res: any = await getManufacturingCost()
  if (res.result.manufacturingCosts.length > 0) {
    data.tableData = res.result.manufacturingCosts || []
  }
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
  margin: 20px 0;
}
</style>
