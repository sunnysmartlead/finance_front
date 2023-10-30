<template>
  <el-table :data="logisticsData" border :height="logisticsData.length > 12 ? 675 : 'auto'"  :summary-method="(val: any) => getSummaries(val, '单PCS总物流成本', 'perTotalLogisticsCost', 5)"
    :show-summary="!isEdit">
    <el-table-column align="center"  prop="year" label="年份" width="80" />
    <el-table-column align="center"  prop="freight" label="运费/月" width="180" :formatter="formatThousandths" >
    </el-table-column>
    <el-table-column align="center" width="180"   prop="monthEndDemand" label="月底需求量" :formatter="formatThousandths">
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.monthEndDemand" />
      </template>
    </el-table-column>
    <el-table-column align="center" width="180"  prop="storageExpenses" label="仓储费用/元" :formatter="formatThousandths" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.storageExpenses" />
      </template>
    </el-table-column>
    <el-table-column align="center" width="180"  prop="perPackagingPrice" label="单PCS包装价格/元" :formatter="formatThousandths" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.perPackagingPrice" />
      </template>
    </el-table-column>
    <el-table-column align="center" width="180"  prop="perFreight" label="单PCS运输费" :formatter="formatThousandths" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.perFreight" />
      </template>
    </el-table-column>
    <el-table-column align="center" width="180"  prop="perTotalLogisticsCost" label="单PCS总物流成本" :formatter="formatThousandths" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.perTotalLogisticsCost" />
      </template>
    </el-table-column>
    <el-table-column align="center" v-if="isEdit" width="180" prop="editNotes" label="备注">
      <template #default="{ row }" >
        <el-input v-model="row.editNotes" />
      </template>
    </el-table-column>
    <el-table-column align="center" fixed="right"  label="操作" width="80" v-if="!hideEdit">
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
import { getSummaries } from "../../common/getSummaries"
import { formatThousandths, formatThousandthsNoFixed } from '@/utils/number'

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
  },
  hideEdit: Boolean
})

const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}

</script>
