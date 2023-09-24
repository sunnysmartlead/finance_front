<template>
  <div>
    <el-button type="primary" class="m-2" @click="visiable = true"> 方案成本对比表 </el-button>
    <el-dialog v-model="visiable" :width="1400" title="方案成本对比表">
      <el-form inline>
        <el-form-item label="方案一：">
          <el-select v-model="data.solutionId1" placeholder="选择方案一">
            <el-option v-for="item in solutionIdOptions" :disabled="item.id === data.solutionId2" :key="item.id"
              :label="item.product" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="方案二：">
          <el-select v-model="data.solutionId2" placeholder="选择方案二">
            <el-option v-for="item in solutionIdOptions" :disabled="item.id === data.solutionId1" :key="item.id"
              :label="item.product" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="startCompare">开始对比</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" height="60vh">
        <el-table-column prop="itemName" label="项目" align="center" />
        <el-table-column :label="schemeNameObj.one" align="center">
          <el-table-column prop="price_1" label="单价" :formatter="formatValue" />
          <el-table-column prop="count_1" label="数量" :formatter="formatValue" />
          <el-table-column prop="rate_1" label="汇率" />
          <el-table-column prop="sum_1" label="合计" :formatter="formatValue" />
        </el-table-column>
        <el-table-column :label="schemeNameObj.two" align="center">
          <el-table-column prop="price_2" label="单价" :formatter="formatValue" />
          <el-table-column prop="count_2" label="数量" :formatter="formatValue" />
          <el-table-column prop="rate_2" label="汇率" />
          <el-table-column prop="sum_2" label="合计" :formatter="formatValue" />
        </el-table-column>
        <el-table-column label="差异" align="center" :formatter="compareData" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { GetSolutionContrast } from "@/api/shemeCompare"
import getQuery from "@/utils/getQuery"
import { useProductStore } from "@/store/modules/productList"
import { ElMessage } from 'element-plus'

const { auditFlowId, productId: solutionId } = getQuery()

const productStore = useProductStore()

const props = defineProps({
  /**
   * 梯度Id
   */
  gradientId: Number,
  /**
   * 年份类型
   */
  upDown: {
    type: Number,
    required: false
  },
  /**
   * 年份
   */
  year: {
    type: Number,
    required: false
  }
})

const solutionIdOptions = computed(() => {
  console.log(productStore.productList)
  return productStore?.productList || []
})


const visiable = ref(false)

const data = reactive<any>({
  solutionId1: solutionId,
  solutionId2: null,
})

const schemeNameObj = computed(() => {
  return {
    one: solutionIdOptions.value?.find(item => data.solutionId1 === item.id)?.product || '方案一',
    two: solutionIdOptions.value?.find(item => data.solutionId2 === item.id)?.product || '方案二',
  }
})

const tableData = ref([])

const compareData = (record: any) => {
  if (record && record.sum_1 && record.sum_2) {
    return (record.sum_1 - record.sum_2).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  }
  return ''
}

const formatValue = (_record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return Number(cellValue).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}

const startCompare = () => {
  if (!data.solutionId1) {
    ElMessage({
      type: 'warning',
      message: '请选择方案一'
    })
  } else if (!data.solutionId2) {
    ElMessage({
      type: 'warning',
      message: '请选择方案二'
    })
  } else initFetch()
}

const initFetch = async () => {
  const {
    gradientId,
    upDown,
    year,
  } = props
  if (auditFlowId && gradientId && upDown && year) {
    const { success, result }: any = (await GetSolutionContrast({
      auditFlowId,
      gradientId,
      solutionId_1: data.solutionId1,
      solutionId_2: data.solutionId2,
      upDown,
      year,
    })) || {}
    if (success) {
      tableData.value = result || []
    }
  }
}
</script>
