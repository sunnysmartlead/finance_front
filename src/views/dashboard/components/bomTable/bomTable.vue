<template>
  <el-table :data="bomData" border height="500">
    <el-table-column align="center" prop="superType" label="超级大种类" width="175">
      <template #default="{ row }">
        <el-input v-model="row.superType" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="materialName" label="材料名称" width="175">
      <template #default="{ row }">
        <el-input v-model="row.materialName" v-if="isEdit" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="isCustomerSupply" label="是否客供" width="175">
      <template #default="{ row, $index }">
        <el-select @change="(v) => onChange(v, $index, 1)" v-model="row.isCustomerSupply" placeholder="是否客供">
          <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="typeName" label="物料种类" width="175">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.typeName" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="categoryName" label="物料大类" width="150">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.categoryName" />
      </template>
    </el-table-column>
    <el-table-column class="more-oprate" align="center" prop="assemblyCount" width="175" label="装配数量">
      <template #header>
        <span class="header-icon"> 装配数量 </span>
        <el-button text bg @click="showColumn = !showColumn">{{ !showColumn ? "+" : "-" }}</el-button>
      </template>
      <template #default="{ row }" v-if="isEdit">
        <el-input-number @mousewheel.native.prevent controls-position="right" :min="0" v-model="row.assemblyCount" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="overallDimensionSize" label="外形尺寸mm" width="175" v-if="showColumn">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.overallDimensionSize" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="materialName" label="材料名称" width="175" v-if="showColumn">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.materialName" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="weightNumber" label="重量" width="175" v-if="showColumn">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.weightNumber" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="moldingProcess" label="成型工艺" width="175" v-if="showColumn">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.moldingProcess" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="isNewMouldProduct" label="是否新开模" width="175" v-if="showColumn">
      <template #default="{ row, $index }">
        <el-select @change="(v) => onChange(v, $index, 2)" v-model="row.isNewMouldProduct" placeholder="是否新开模">
          <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="secondaryProcessingMethod" label="二次加工方法" width="175" v-if="showColumn">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.secondaryProcessingMethod" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="surfaceTreatmentMethod" label="表面处理" width="175" v-if="showColumn">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.surfaceTreatmentMethod" />
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="dimensionalAccuracyRemark"
      label="关键尺寸精度及重要要求"
      width="175"
      v-if="showColumn"
    >
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.dimensionalAccuracyRemark" />
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="materialPrice"
      label="材料单价（原币）"
      width="175"
      :formatter="formatThousandths"
    >
      <template #default="{ row }" v-if="isEdit">
        <el-input-number @mousewheel.native.prevent controls-position="right" :min="0" v-model="row.materialPrice" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="currencyText" label="币别" width="150">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.currencyText" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="exchangeRate" label="汇率" width="175" :formatter="formatThousandths">
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.exchangeRate"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="materialPriceCyn"
      label="材料单价（人民币）"
      width="175"
      :formatter="formatThousandths"
    >
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.materialPriceCyn"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="totalMoneyCyn"
      label="合计金额（人民币）- bom成本"
      width="175"
      :formatter="formatThousandths"
    >
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.totalMoneyCyn"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="totalMoneyCynNoCustomerSupply"
      label="合计金额（人民币）- 不含客供"
      width="175"
      :formatter="formatThousandths"
    >
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.totalMoneyCynNoCustomerSupply"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="loss" label="损耗" width="175" :formatter="formatThousandths">
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.loss"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="materialCost"
      label="材料成本（含损耗）"
      width="175"
      :formatter="formatThousandths"
    >
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.materialCost"
          v-if="isEdit"
        />
      </template>
    </el-table-column>

    <el-table-column align="center" prop="inputCount" label="投入量" width="175" :formatter="formatThousandths">
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.inputCount"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="purchaseCount" label="采购量" width="175" :formatter="formatThousandths">
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.purchaseCount"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="moqShareCount" label="MOQ分摊成本" width="175" :formatter="formatThousandths">
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.moqShareCount"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="moq" label="MOQ" width="175" :formatter="formatThousandths">
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.moq"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="availableInventory" label="可用库存" width="175">
      <template #default="{ row }">
        <el-input-number
          @mousewheel.native.prevent
          controls-position="right"
          :min="0"
          v-model="row.availableInventory"
          v-if="isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="remarks" label="备注" width="150">
      <template #default="{ row }" v-if="isEdit">
        <el-input v-model="row.remarks" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="modificationComments" label="修改意见" width="150" />
  </el-table>
</template>
<script lang="ts" setup>
import { PropType, ref, h } from "vue"
import { formatThousandths } from "@/utils/number"
var showColumn = ref<boolean>(false)
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
  hideEdit: Boolean,
  onChange: {
    type: Function as PropType<any>
  }
})
const options = [
  {
    label: "是",
    value: true
  },
  {
    label: "否",
    value: false
  }
]
</script>
