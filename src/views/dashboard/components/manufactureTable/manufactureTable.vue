<template>
  <el-table :data="manufactureData" border height="675">
    <!-- <el-table-column prop="sapItemNum" label="项目" width="180" /> -->
    <el-table-column prop="costItem" label="成本项目" width="180" />
    <!-- <el-table-column prop="typeName" label="年份" width="180" /> -->
    <el-table-column prop="manufacturingCostDirect" label="直接制造成本" :formatter="toFixedTwo">
      <el-table-column
        prop="manufacturingCostDirect.directLabor"
        label="直接人工"
        width="150"
        :formatter="toFixedTwo"
      />
      <el-table-column
        prop="manufacturingCostDirect.equipmentDepreciation"
        label="设备折旧"
        width="150"
        :formatter="toFixedTwo"
      />
      <el-table-column
        prop="manufacturingCostDirect.lineChangeCost"
        label="换线成本"
        width="150"
        :formatter="toFixedTwo"
      />
      <el-table-column
        prop="manufacturingCostDirect.manufacturingExpenses"
        label="制造费用"
        width="150"
        :formatter="toFixedTwo"
      />
      <el-table-column prop="manufacturingCostDirect.subtotal" label="小计" width="150" :formatter="toFixedTwo" />
    </el-table-column>
    <el-table-column prop="manufacturingCostIndirect" label="间接制造成本">
      <el-table-column
        prop="manufacturingCostIndirect.directLabor"
        label="直接人工"
        width="150"
        :formatter="toFixedTwo"
      />
      <el-table-column
        prop="manufacturingCostIndirect.equipmentDepreciation"
        label="设备折旧"
        width="150"
        :formatter="toFixedTwo"
      />
      <!-- <el-table-column prop="manufacturingCostIndirect.typeName" label="换线成本" width="180" /> -->
      <el-table-column
        prop="manufacturingCostIndirect.manufacturingExpenses"
        label="制造费用"
        width="150"
        :formatter="toFixedTwo"
      />
      <el-table-column prop="manufacturingCostIndirect.subtotal" label="小计" width="150" :formatter="toFixedTwo" />
    </el-table-column>
    <el-table-column label="合计" prop="subtotal" :formatter="toFixedTwo" />
    <el-table-column label="操作" width="200">
      <template #default="{ row }">
        <el-row >
          <el-button type="primary" v-if="!isEdit" @click="handleEdit" link>修改</el-button>
          <el-button type="primary" v-if="isEdit" link>确认</el-button>
          <el-button link type="primary" v-if="isEdit" @click="handleUpload">上传佐证资料</el-button>
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
  onUpload: {
    type: Function as PropType<any>
  }
})

const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}
const handleEdit = () => {
  props.onEdit()
}

const handleUpload = () => {
  props.onUpload()
}
</script>
