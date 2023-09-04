<template>
  <el-table :data="otherCostData" border height="675">
    <el-table-column prop="fixture" label="夹具">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.fixture" />
      </template>
    </el-table-column>
    <el-table-column prop="logisticsFee" label="物流费">
      <template #default="{ row }">
        <el-input-number v-if="isEdit" controls-position="right" :min="0" v-model="row.logisticsFee" />
      </template>
    </el-table-column>
    <el-table-column prop="productCategory" label="产品类别">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.productCategory" />
      </template>
    </el-table-column>
    <el-table-column prop="accountingPeriod" label="账期（天）">
      <template #default="{ row }">
        <el-input-number v-if="isEdit" controls-position="right" :min="0" v-model="row.accountingPeriod" />
      </template>
    </el-table-column>
    <el-table-column prop="capitalCostRate" label="资金成本率" :formatter="formatter">
      <template #default="{ row }">
        <el-input v-model="row.capitalCostRate" v-if="isEdit" type="number">
          <template #append>%</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column prop="taxCost" label="税务成本">
      <template #default="{ row }">
        <el-input-number v-if="isEdit" controls-position="right" :min="0" v-model="row.taxCost" />
      </template>
    </el-table-column>
    <el-table-column prop="total" label="合计" />
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
  otherCostData: {
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
  },
})

const formatter = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return `${val * 100} %`
  return val
}

const handleEdit = () => {
  props.onEdit()
}

const handleUpload = () => {
  props.onUpload()
}
</script>
