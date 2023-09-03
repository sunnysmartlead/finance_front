<template>
  <div>
    <el-card class="card">
      <template  #header>
        <el-row wrap="false" justify="space-between">
          <span>制造成本计算-参数</span>
          <el-row>
            <el-button m="2" type="primary" @click="handleAddYear">新增年</el-button>
            <el-button m="2" type="primary" @click="submit">提交</el-button>
          </el-row>
        </el-row>
      </template>
      <el-table :data="data.tableData" style="width: 100%; margin-top: 25px" border>
        <el-table-column label="年份Sop" prop="year" width="180" />
        <el-table-column label="月工作天数" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" v-model="row.monthlyWorkingDays" />
          </template>
        </el-table-column>
        <el-table-column label="人员平均工资" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" v-model="row.averageWage" />
          </template>
        </el-table-column>
        <el-table-column label="每班正常工作时间" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" v-model="row.workingHours" />
          </template>
        </el-table-column>
        <el-table-column label="嫁动率" width="180">
          <template #default="{ row }">
            <el-input type="number" v-model="row.rateOfMobilization">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="折旧年限" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.usefulLifeOfFixedAssets" />
          </template>
        </el-table-column>
        <el-table-column label="每日班次" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.dailyShift" />
          </template>
        </el-table-column>
        <el-table-column label="增值税率" width="180">
          <template #default="{ row }">
            <el-input  type="number" v-model="row.vatRate">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="人均跟线数量" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.traceLineOfPerson" />
          </template>
        </el-table-column>
        <el-table-column label="GP12工序成本(元/pcs)" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.processCost" />
          </template>
        </el-table-column>
        <el-table-column label="产能利用率" width="180">
          <template #default="{ row }">
            <el-input type="number" v-model="row.capacityUtilizationRate">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-card>
    <LogList :type="15" ref="logListRef" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onMounted, watchEffect, ref } from "vue"
import { getManufacturingCost, saveManufacturingCost } from "./service"
import { ManufacturingCostsItem } from "./data.type"
import LogList, { LogListAPI } from "@/components/LogList/index.vue"
import { ElMessage } from "element-plus"

/**
 * 数据部分
 */
const data = reactive({
  tableData: [] as ManufacturingCostsItem[],
})

const logListRef = ref<LogListAPI | null>(null)

// 新增年
const handleAddYear = () => {
  const len = data.tableData.length
  const newYear = (data.tableData[len - 1].year || 0) + 1
  data.tableData.push({
    monthlyWorkingDays: 0,
    averageWage: 0,
    workingHours: 0,
    rateOfMobilization: 0,
    usefulLifeOfFixedAssets: 0,
    dailyShift: 0,
    vatRate: 0,
    traceLineOfPerson: 0,
    year: newYear
  })
}

const submit = async () => {
  let res: any = await saveManufacturingCost({ manufacturingCosts: data.tableData })
  if (res.success) {
    logListRef.value?.onRefresh()
    ElMessage({
      type: "success",
      message: "提交成功"
    })
  }
}

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
