<template>
  <el-table :data="qualityData" border height="675">
    <el-table-column align="center"  prop="productCategory" label="产品类别">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.qualityCost" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="costProportion" label="成本比例" :formatter="formatter">
      <template #default="{ row }">
        <el-input v-model="row.costProportion" v-if="isEdit" type="number">
          <template #append>%</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="qualityCost" label="质量成本（MAX）" :formatter="toFixed">
      <template #default="{ row }">
        <el-input-number v-if="isEdit" controls-position="right" :min="0" v-model="row.qualityCost" />
      </template>
    </el-table-column>
    <el-table-column align="center"  label="操作" width="200" v-if="!hideEdit">
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
  qualityData: {
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

const formatter = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return `${val} %`
  return val
}

const toFixed = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}

</script>
