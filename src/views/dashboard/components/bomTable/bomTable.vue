<template>
  <el-table :data="bomData" border height="500">
    <el-table-column align="center"  prop="superType" label="超级大种类" width="175">
      <template #default="{ row }">
        <el-input v-model="row.superType" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="materialName" label="材料名称" width="175">
      <template #default="{ row }">
        <el-input v-model="row.materialName" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="isCustomerSupply" label="是否客供" width="175">
      <template #default="{ row }">
        <el-select v-model="row.isCustomerSupply" :disabled="!hideEdit" placeholder="是否客供">
              <el-option v-for="item in options" :key="item.label" :label="item.label"
                :value="item.value" />
            </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="typeName" label="物料种类" width="175">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.typeName" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="categoryName" label="物料大类" width="150">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.categoryName" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="assemblyCount" width="175" label="装配数量">
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.assemblyCount" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="materialPrice" label="材料单价（原币）" width="175" :formatter="toFixedThree">
      <template #default="{ row }" v-if="isEdit">
        <el-input-number controls-position="right" :min="0" v-model="row.materialPrice" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="currencyText" label="币别" width="150">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.currencyText" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="exchangeRate" label="汇率" width="175" :formatter="toFixedThree">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.exchangeRate" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="materialPriceCyn" label="材料单价（人民币）" width="175" :formatter="toFixedThree">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.materialPriceCyn" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="totalMoneyCyn" label="合计金额（人民币）- bom成本" width="175" :formatter="toFixedThree">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.totalMoneyCyn" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="totalMoneyCynNoCustomerSupply" label="合计金额（人民币）- 不含客供" width="175" :formatter="toFixedThree">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.totalMoneyCynNoCustomerSupply" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="loss" label="损耗" width="175" :formatter="toFixedThree">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.loss" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="materialCost" label="材料成本（含损耗）" width="175" :formatter="toFixedThree">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.materialCost" v-if="isEdit" />
      </template>
    </el-table-column>

    <el-table-column align="center"  prop="inputCount" label="投入量" width="175">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.inputCount" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="purchaseCount" label="采购量" width="175">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.purchaseCount" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="moqShareCount" label="MOQ分摊成本" width="175" :formatter="toFixedThree">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.moqShareCount" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="moq" label="MOQ" width="175">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.moq" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="availableInventory" label="可用库存" width="175">
      <template #default="{ row }">
        <el-input-number controls-position="right" :min="0" v-model="row.availableInventory" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center"  prop="remarks" label="备注" width="150">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.remarks" />
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { PropType } from "vue"

const props = defineProps({
  bomData: {
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

const toFixedThree = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}

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

</script>
