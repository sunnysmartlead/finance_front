<template>
  <el-table :data="otherCostData" border :height="otherCostData.length > 12 ? 675 : 'auto'" :span-method="objectSpanMethod"
    :summary-method="(val: any) => getSummaries(val, '单颗成本', 'cost')" :show-summary="!isEdit">
    <el-table-column align="center" prop="costType" label="费用大类" />
    <el-table-column align="center" prop="itemName" label="成本项目">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.itemName" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="total" label="总费用">
      <template #default="{ row }">
        <el-input-number v-if="isEdit" controls-position="right" :min="0" v-model="row.total" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="yearCount" label="分摊年数">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.yearCount" />
        <span v-else>{{ row.yearCount }} 年</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="count" label="分摊数量" :formatter="formatThousandthsNoFixed">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.count" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="cost" label="单颗成本" :formatter="formatThousandths">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.cost" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="note" label="备注">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.note" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="isShare" label="是否分摊" :formatter="formatter">
      <template #default="{ row }">
        <el-select v-model="row.isShare" placeholder="是否分摊">
          <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="120" v-if="!hideEdit">
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
import { formatThousandths, formatThousandthsNoFixed } from '@/utils/number'
import { getSummaries } from "../../common/getSummaries"

const props = defineProps({
  otherCostData: {
    type: Array as PropType<any[]>,
    default: []
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

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: any) => {
  let num = 1
  // 根据columnIndex判断需要判断值是否相等的字段
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      num = 9
    } else if (rowIndex === 9) {
      num = 3
    } else if (rowIndex === 12) {
      num = 1
    } else {
      num = 0
    }
  }
  return {
    rowspan: num,
    colspan: 1,
  };
}

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
