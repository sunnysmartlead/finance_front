<template>
  <div class="nre-table">
    <!-- nre汇总table -->
    <el-card>
      <p>{{ nreData.solutionName }}</p>
      <p>线体数量：{{ nreData.numberLine }} 共线分摊率：{{ nreData.collinearAllocationRate }}</p>
      <el-table
        :data="nreData.models"
        style="width: 100%"
        border
        height="500px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="index" label="序号" />
        <el-table-column prop="costName" label="费用名称" />
        <el-table-column prop="pricingMoney" label="核价金额" />
        <el-table-column label="报价系数">
          <template #default="scope">
            <el-input v-model="scope.row.offerCoefficient" type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="offerMoney" label="报价金额" />
        <el-table-column label="备注">
          <template #default="scope">
            <el-input v-model="scope.row.remark" type="textarea" />
          </template>
        </el-table-column>
      </el-table>
      <p>专用设备</p>
      <el-table :data="nreData.devices" style="width: 100%" border height="500px">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="devicePrice" label="设备单价" />
        <el-table-column prop="number" label="设备数量" />
        <el-table-column prop="equipmentMoney" label="设备金额" />
      </el-table>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from "vue"
defineProps({
  nreData: {
    type: Object as PropType<any>
  }
})
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = "合计"
      return
    }
    if (index === 2 || index === 4) {
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
      } else {
        sums[index] = "N/A"
      }
    }
  })

  return sums
}
</script>
<style scoped></style>
