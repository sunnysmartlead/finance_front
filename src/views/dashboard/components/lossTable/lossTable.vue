<template>
  <el-table
    :data="lossData"
    :height="lossData?.length > 10 ? 675 : 'auto'"
    :summary-method="(val: any) => getSummaries(val, '损耗成本', 'wastageCost', 1)"
    :show-summary="!isEdit"
  >
    <el-table-column align="center"  type="index" width="50" />
    <el-table-column align="center"  prop="name" label="成本项目" >
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.name"  />
      </template>
    </el-table-column>
    <el-table-column align="center" :formatter="formatThousandths" prop="wastageCost" label="损耗成本" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number @mousewheel.native.prevent controls-position="right" :min="0" v-model="row.wastageCost" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="moqShareCount" label="MOQ分摊成本" :formatter="formatThousandths" >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number @mousewheel.native.prevent controls-position="right" :min="0" v-model="row.moqShareCount" />
      </template>
    </el-table-column>
    <el-table-column align="center" v-if="isEdit" prop="editNotes" label="备注">
      <template #default="{ row }" >
        <el-input v-model="row.editNotes" />
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
import { getSummaries } from "../../common/getSummaries"
import { formatThousandths, formatThousandthsNoFixed } from '@/utils/number'

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
  onDelete: {
    type: Function as PropType<any>
  },
  hideEdit: Boolean
})

</script>
