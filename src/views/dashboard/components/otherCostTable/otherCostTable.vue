<template>
  <el-table :data="otherCostData" border height="675">
    <el-table-column prop="itemName" label="成本项目">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.itemName" />
      </template>
    </el-table-column>
    <el-table-column prop="total" label="总费用">
      <template #default="{ row }">
        <el-input-number v-if="isEdit" controls-position="right" :min="0" v-model="row.total" />
      </template>
    </el-table-column>
    <el-table-column prop="count" label="分摊数量">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.count" />
      </template>
    </el-table-column>
    <el-table-column prop="note" label="备注">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.note" />
      </template>
    </el-table-column>
    <el-table-column prop="isShare" label="是否分摊" :formatter="formatter">
      <template #default="{ row }">
        <el-select v-model="row.isShare" placeholder="是否分摊">
              <el-option v-for="item in options" :key="item.label" :label="item.label"
                :value="item.value" />
            </el-select>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200" v-if="!hideEdit">
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
  hideEdit: Boolean
})

const options = [
  {
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
  }
]

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
