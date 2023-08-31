<template>
  <el-table :data="otherCostData"  border height="675">
    <el-table-column prop="fixture" label="夹具" />
    <el-table-column prop="logisticsFee" label="物流费" />
    <el-table-column prop="productCategory" label="产品类别" />
    <el-table-column prop="accountingPeriod" label="账期（天）" />
    <el-table-column prop="logisticsFee" label="物流费" />
    <el-table-column prop="logisticsFee" label="成本比例" />
    <el-table-column prop="capitalCostRate" label="资金成本率" :formatter="formatter" />
    <el-table-column prop="taxCost" label="税务成本" />
    <el-table-column prop="total" label="合计" />
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
  otherCostData: {
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
