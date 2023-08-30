<template>
  <el-table :data="qualityData"  border height="675">
    <el-table-column prop="productCategory" label="产品类别" />
    <el-table-column prop="costProportion" label="成本比例" :formatter="formatter">
      <template #default="{ row }">

      </template>
    </el-table-column>
    <el-table-column prop="qualityCost" label="质量成本（MAX）" :formatter="toFixed">
      <template #default="{ row }">

      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="{ row }">
        <el-row>
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
  qualityData: {
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

const handleEdit = () => {
  props.onEdit()
}

const handleUpload = () => {
  props.onUpload()
}

const formatter = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return `${val * 100} %`
  return val
}

const toFixed = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}

</script>
