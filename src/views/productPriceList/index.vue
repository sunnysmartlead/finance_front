<template>
  <el-card m="2" v-loading="loading">
    <el-tabs v-model="data.pageType" class="demo-tabs" @tab-change="handleChangePageType">
      <el-tab-pane label="项目核价表" name="normal">
        <EZFilter :filterNnum="data.filterNnum" :show-btn="true" :onSubmit="fetchPriceEvaluationTable" />
      </el-tab-pane>
      <el-tab-pane label="生成的项目核价表" name="result" :disabled="data.disabled">
        <el-row justify="space-between">
          <div>
            是否为全生命周期：
            <el-select placeholder="请选择" v-model="data.isAll" @change="fetchPriceEvaluationTableResult">
              <el-option v-for="opt in options" :key="opt.label" :label="opt.label" :value="opt.value" />
            </el-select>
          </div>
          <el-button type="primary" class="m-2" @click="handleFetchPriceEvaluationTableDownload">
            产品核价表下载
          </el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>项目核价表（量产/样品）</span>
        </div>
      </template>

      <el-table :data="data.material" border height="500">
        <el-table-column type="index" width="50" />
        <el-table-column label="超级大种类" prop="superType" width="180" />
        <el-table-column label="超级大类" prop="categoryName" width="180" />
        <el-table-column label="sap" prop="sap" width="180" />
        <el-table-column label="材料名称" prop="materialName" width="180" />
        <el-table-column label="装配数量" prop="assemblyCount" width="180" />
        <el-table-column label="材料单价（原币）" prop="materialPrice" width="180" :formatter="toFixedTwo" />
        <el-table-column label="币别" prop="currencyText" width="180" />
        <el-table-column label="汇率" prop="exchangeRate" width="180" />
        <el-table-column label="材料单价（人民币）" prop="materialPriceCyn" width="180" :formatter="toFixedTwo" />
        <el-table-column label="合计金额（人民币）" prop="totalMoneyCyn" width="180" :formatter="toFixedTwo" />
        <el-table-column label="损耗" prop="loss" width="180" :formatter="toFixedTwo" />
        <el-table-column label="材料成本（含损耗）" prop="materialCost" width="180" :formatter="toFixedTwo" />
        <el-table-column label="投入量" prop="inputCount" width="180" />
        <el-table-column label="采购量" prop="purchaseCount" width="180" />
        <el-table-column label="MOQ分摊成本" prop="moqShareCount" width="180" :formatter="toFixedTwo" />
        <el-table-column label="MOQ" prop="moq" width="180" />
        <el-table-column label="可用库存" prop="availableInventory" width="180" />
        <el-table-column label="备注" prop="remarks" width="180" />
      </el-table>
      <el-descriptions title="" border :column="3">
        <el-descriptions-item label="材料成本合计">{{ data.allTotalMoneyCyn }}</el-descriptions-item>
        <el-descriptions-item label="电子料大类成本合计">{{ data.allPrice }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="card">
      <el-table :data="data.manufacturingCost" style="width: 100%" border>
        <el-table-column label="成本项目" prop="costItem" width="180" />
        <el-table-column label="直接制造成本" prop="">
          <!-- <el-table-column label="直接人工" prop="" />
          <el-table-column label="设备折旧" prop="" />
          <el-table-column label="换线成本" prop="" />
          <el-table-column label="制造费用" prop="" />
          <el-table-column label="小计" prop="" /> -->
          <el-table-column label="直接人工" prop="manufacturingCostDirect.directLabor" :formatter="toFixedTwo" />
          <el-table-column
            label="设备折旧"
            prop="manufacturingCostDirect.equipmentDepreciation"
            :formatter="toFixedTwo"
          />
          <el-table-column label="换线成本" prop="manufacturingCostDirect.lineChangeCost" :formatter="toFixedTwo" />
          <el-table-column
            label="制造费用"
            prop="manufacturingCostDirect.manufacturingExpenses"
            :formatter="toFixedTwo"
          />
          <el-table-column label="小计" prop="manufacturingCostDirect.subtotal" :formatter="toFixedTwo" />
        </el-table-column>
        <el-table-column label="间接制造成本" prop="">
          <el-table-column label="直接人工" prop="manufacturingCostIndirect.directLabor" :formatter="toFixedTwo" />
          <el-table-column
            label="设备折旧"
            prop="manufacturingCostIndirect.equipmentDepreciation"
            :formatter="toFixedTwo"
          />
          <!-- <el-table-column label="换线成本" prop="manufacturingCostIndirect.lineChangeCost" /> -->
          <el-table-column
            label="制造费用"
            prop="manufacturingCostIndirect.manufacturingExpenses"
            :formatter="toFixedTwo"
          />
          <el-table-column label="小计" prop="manufacturingCostIndirect.subtotal" :formatter="toFixedTwo" />
        </el-table-column>
        <el-table-column label="合计" prop="subtotal" :formatter="toFixedTwo" />
      </el-table>
    </el-card>
    <el-card class="card" header="损耗成本">
      <el-table :data="data.lossCost" border>
        <el-table-column type="index" width="50" />
        <el-table-column label="成本项目" prop="name" />
        <el-table-column label="损耗成本" prop="wastageCost" :formatter="toFixedTwo" />
        <el-table-column label="MOQ分摊成本" prop="moqShareCount" />
        <!-- <el-table-column label="结构料" prop="" width="180" />
        <el-table-column label="胶水" prop="" width="180" />
        <el-table-column label="外协加工" prop="" width="180" />
        <el-table-column label="包装材料" prop="" width="180" />
        <el-table-column label="合计" prop="" width="180" /> -->
      </el-table>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="损耗成本合计"> {{ data.lossCount }} </el-descriptions-item>
        <el-descriptions-item label="MOQ分摊成本合计"> {{ data.moqShareCountCount }} </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="card">
      <el-table :data="data.otherCostItem" border>
        <el-table-column label="夹具" prop="fixture" width="180" />
        <el-table-column label="物流费" prop="logisticsFee" width="180" :formatter="toFixedTwo" />
        <el-table-column label="质量成本" prop="" width="180">
          <el-table-column label="产品类别" prop="productCategory" width="180" />
          <el-table-column label="成本比例" prop="costProportion" width="180">
            <template #default="{ row }">
              {{ `${(row.costProportion * 100).toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="质量成本" prop="qualityCost" width="180" :formatter="toFixedTwo" />
        </el-table-column>
        <el-table-column label="财务成本" prop="financialCost" width="180">
          <!-- <el-table-column label="账期" prop="accountingPeriod" width="180" />
          <el-table-column label="资金成本率" prop="capitalCostRate" width="180" />
          <el-table-column label="财务成本" prop="financialCost" width="180" /> -->
        </el-table-column>
        <el-table-column label="账期" prop="accountingPeriod" width="180" />
        <el-table-column label="资金成本率" prop="capitalCostRate" width="180">
          <template #default="{ row }">
            {{ `${(row.capitalCostRate || 0).toFixed(2)} %` }}
          </template>
        </el-table-column>
        <el-table-column label="财务成本" prop="financialCost" width="180" :formatter="toFixedTwo" />
        <el-table-column label="税务成本" prop="taxCost" width="180" :formatter="toFixedTwo" />
        <el-table-column label="合计" prop="total" width="180" :formatter="toFixedTwo" />
      </el-table>
    </el-card>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="产品总成本">{{ formatThousandths(data.totalCost) }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="编制/日期："> {{ data.preparedDate }} </el-descriptions-item>
      <el-descriptions-item label="审核/日期："> {{ data.auditDate }} </el-descriptions-item>
      <el-descriptions-item label="批准/日期："> {{ data.approvalDate }} </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
// import { useRoute, useRouter } from "vue-router"
import { getPriceEvaluationTable, getPriceEvaluationTableResult, PriceEvaluationTableDownload } from "./service"
import getQuery from "@/utils/getQuery"
import EZFilter from "@/components/EZFilter/index.vue"
import { GetPricingPanelTimeSelectList } from "../pmDepartment/service"
import { downloadFileZip } from "@/utils/index"
import { formatDateTime } from "@/utils/index"

const { auditFlowId, productId, disabled } = getQuery()

/**
 * 路由对象
 */
// const route = useRoute()
// /**
//  * 路由实例
//  */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const changeYears = (val: any) => (data.year = val)

const loading = ref(false)

const data = reactive<any>({
  material: [],
  manufacturingCost: [],
  lossCost: [],
  otherCostItem: [],
  isAll: false,
  date: "",
  inputCount: "",
  requiredCount: "",
  year: "",
  filterNnum: [
    {
      label: "年份",
      key: "year",
      role: "select",
      options: [],
      onchange: changeYears
    },
    {
      label: "投入量",
      key: "inputCount"
    }
  ],
  pageType: "normal",
  preparedDate: "",
  auditDate: "",
  approvalDate: "",
  disabled: false
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

const fetchPriceEvaluationTableResult = async () => {
  const { result }: any = await getPriceEvaluationTableResult({
    auditFlowId,
    modelCountId: productId,
    isAll: String(!!data.isAll)
  })
  setData(result)
  console.log(result, "fetchPriceEvaluationTableResult")
}

const setData = (result: any) => {
  let { material, manufacturingCost, lossCost, otherCostItem } = result || {}
  data.material = material || []
  data.allPrice = result.electronicSumValue?.toFixed(2) || 0
  data.totalCost = result.totalCost?.toFixed(2) || 0
  data.lossCount = result.lossCount?.toFixed(2) || 0
  data.allTotalMoneyCyn = result.totalMoneyCynCount?.toFixed(2) || 0
  data.moqShareCountCount = result.moqShareCountCount?.toFixed(2) || 0
  data.manufacturingCost = manufacturingCost || []
  data.lossCost = lossCost || []
  data.otherCostItem = [otherCostItem] || []
  data.preparedDate = formatDateTime(result.preparedDate)
  data.auditDate = formatDateTime(result.auditDate)
  data.approvalDate = formatDateTime(result.approvalDate)
}

const formatThousandths = (cellValue: any) => {
  return (cellValue + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const fetchPriceEvaluationTable = async (props?: any) => {
  try {
    loading.value = true
    const { inputCount, year } = props
    data.inputCount = inputCount
    data.year = year
    let { result }: any =
      (await getPriceEvaluationTable({
        auditFlowId,
        modelCountId: productId,
        inputCount,
        year
      })) || {}
    setData(result)
    loading.value = false
    console.log(result, "fetchPriceEvaluationTableResult")
  } catch {
    loading.value = false
  }
}

const fetchSopYear = async () => {
  const res: any = (await GetPricingPanelTimeSelectList(auditFlowId)) || {}
  console.log(res)
  data.filterNnum[0].options = res.result.items.map((item: any) => ({ label: item.name, value: item.id })) || []
}

// 产品核价表下载
const handleFetchPriceEvaluationTableDownload = async () => {
  try {
    const res: any = await PriceEvaluationTableDownload({
      // Year: data.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })

    downloadFileZip(res, "产品核价表")
    // console.log(result, "产品核价表下载")
  } catch (err: any) {
    console.log(err, "[ 产品核价表下载据失败 ]")
  }
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(async () => {
  fetchSopYear()
  // handleChangePageType(data.pageType)
  data.disabled = disabled
})

const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return ""
}

const handleChangePageType = async (pageType: any) => {
  try {
    loading.value = true
    data.material = []
    data.manufacturingCost = []
    data.lossCost = []
    if (pageType === "result") {
      await fetchPriceEvaluationTableResult()
    } else {
      const { inputCount, year } = data
      await fetchPriceEvaluationTable({ inputCount, year })
    }
    loading.value = false
  } catch {
    loading.value = false
  }
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.card {
  margin: 20px 0;
}
</style>
