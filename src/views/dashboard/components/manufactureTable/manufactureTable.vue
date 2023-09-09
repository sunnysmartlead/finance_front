<template>
  <el-table :data="manufactureData" border height="675">
    <!-- <el-table-column prop="sapItemNum" label="项目" width="180" /> -->
    <el-table-column prop="costItem" label="成本项目" width="180">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.costItem" />
      </template>
    </el-table-column>
    <!-- <el-table-column prop="typeName" label="年份" width="180" /> -->
    <el-table-column prop="manufacturingCostDirect" label="直接制造成本" :formatter="toFixedTwo">
      <el-table-column prop="manufacturingCostDirect.directLabor" label="直接人工" width="175" :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostDirect.directLabor" />
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingCostDirect.equipmentDepreciation" label="设备折旧" width="175"
        :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostDirect.equipmentDepreciation" />
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingCostDirect.lineChangeCost" label="换线成本" width="175" :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostDirect.lineChangeCost" />
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingCostDirect.manufacturingExpenses" label="制造费用" width="175"
        :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostDirect.manufacturingExpenses" />
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingCostDirect.subtotal" label="小计" width="175" :formatter="toFixedTwo" />
    </el-table-column>
    <el-table-column prop="manufacturingCostIndirect" label="间接制造成本">
      <el-table-column prop="manufacturingCostIndirect.directLabor" label="直接人工" width="175" :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostIndirect.directLabor" />
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingCostIndirect.equipmentDepreciation" label="设备折旧" width="175"
        :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostIndirect.equipmentDepreciation" />
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingCostIndirect.manufacturingExpenses" label="制造费用" width="175"
        :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostIndirect.manufacturingExpenses" />
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingCostIndirect.subtotal" label="小计" width="175" :formatter="toFixedTwo">
        <template #default="{ row }">
          <el-input-number v-if="isEdit" controls-position="right" :min="0"
            v-model="row.manufacturingCostIndirect.subtotal" />
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="合计" prop="subtotal" :formatter="toFixedTwo" />
    <el-table-column label="操作" width="120" fixed="right" v-if="!hideEdit">
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
  manufactureData: {
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
  hideEdit: Boolean
})

const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}
</script>
