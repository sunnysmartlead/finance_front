<template>
  <el-table
    :data="lossData"
    height="675"
    :summary-method="(val: any) => getSummaries(val, '损耗成本', 'wastageCost')"
    show-summary
  >
    <el-table-column type="index" width="50" />
    <el-table-column prop="name" label="成本项目" >
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.name"  />
      </template>
    </el-table-column>
    <el-table-column prop="wastageCost" label="损耗成本" :formatter="toFixedTwo" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.wastageCost" />
      </template>
    </el-table-column>
    <el-table-column prop="moqShareCount" label="MOQ分摊成本" :formatter="toFixedTwo" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.moqShareCount" />
      </template>
    </el-table-column>
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
import { getSummaries } from "../../common/getSummaries"

const props = defineProps({
  lossData: {
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
