<template>
  <el-table :data="logisticsData" border  height="675">
    <el-table-column prop="year" label="年份" width="80" />
    <el-table-column prop="freight" label="运费/月" width="180" :formatter="toFixedTwo" >
    </el-table-column>
    <el-table-column prop="monthEndDemand" label="月底需求量" width="180" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.monthEndDemand" />
      </template>
    </el-table-column>
    <el-table-column prop="storageExpenses" label="仓储费用/元" width="175" :formatter="toFixedTwo" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.storageExpenses" />
      </template>
    </el-table-column>
    <el-table-column prop="perPackagingPrice" label="单PCS包装价格/元" width="175" :formatter="toFixedTwo" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.perPackagingPrice" />
      </template>
    </el-table-column>
    <el-table-column prop="perFreight" label="单PCS运输费" width="175" :formatter="toFixedTwo" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.perFreight" />
      </template>
    </el-table-column>
    <el-table-column prop="perTotalLogisticsCost" label="单PCS总物流料成本" width="180" :formatter="toFixedTwo" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.perTotalLogisticsCost" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="{ row, $index }">
        <el-row>
          <el-button type="primary" v-if="!isEdit" @click="onEdit(row)" link>修改</el-button>
          <el-button type="primary" v-if="isEdit" @click="onDelete($index)" link>删除</el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { PropType } from "vue"

const props = defineProps({
  logisticsData: {
    type: Array as PropType<any[]>
  },
  isEdit: {
    type: Boolean
  },
  onEdit: {
    type: Function as PropType<any>
  },
  onDelete: {
    type: Function as PropType<any>
  }
})

const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}

</script>
