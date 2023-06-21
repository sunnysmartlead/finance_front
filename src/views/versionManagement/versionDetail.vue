<template>
  <div>
    <el-row style="margin-bottom: 20px">
      <el-radio-group v-model="data.mode" @change="handleChangeMode">
        <template v-for="item in modeEnnum" :key="item.title">
          <el-radio :label="item.value" size="large" border>
            {{ item.title }}
          </el-radio>
        </template>
      </el-radio-group>
    </el-row>
    <el-tabs type="border-card" v-if="data.mode === 1">
      <template v-for="(item, index) in props.priceEvaluationTableList" :key="index">
        <el-tab-pane :label="`核价表${index + 1}`">
          标题：{{ item.title }}
          <div m="4">
            <el-card header="项目核价表（量产/样品）" m="2">
              <el-table :data="item.material" style="width: 100%" border>
                <el-table-column type="index" width="50" />
                <el-table-column label="sap" prop="sap" width="180" />
                <el-table-column label="材料名称" prop="materialName" width="180" />
                <el-table-column label="装配数量" prop="" width="180" />
                <el-table-column label="材料单价（原币）" prop="assemblyCount" width="180" />
                <el-table-column label="币别" prop="currencyText" width="180" />
                <el-table-column label="汇率" prop="exchangeRate" width="180" />
                <el-table-column label="材料单价（人民币）" prop="materialPriceCyn" width="180" />
                <el-table-column label="合计金额（人民币）" prop="totalMoneyCyn" width="180" />
                <el-table-column label="损耗" prop="loss" width="180" />
                <el-table-column label="材料成本（含损耗）" prop="materialCost" width="180" />
                <el-table-column label="投入量" prop="inputCount" width="180" />
                <el-table-column label="采购量" prop="purchaseCount" width="180" />
                <el-table-column label="MOQ分摊成本" prop="moqShareCount" width="180" />
                <el-table-column label="MOQ" prop="moq" width="180" />
                <el-table-column label="可用库存" prop="availableInventory" width="180" />
                <el-table-column label="备注" prop="remarks" width="180" />
              </el-table>
            </el-card>
            <el-card m="2">
              <el-table :data="[item.manufacturingCost]" style="width: 100%" border>
                <el-table-column label="梯度K/Y（模组数量）" prop="gradientKy" width="180" />
                <el-table-column label="直接制造成本">
                  <el-table-column label="直接人工" prop="manufacturingCostDirect.directLabor">
                    <template #default="{ row }">
                      {{ row.manufacturingCostDirect?.directLabor?.toFixed(2) || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="设备折旧" prop="manufacturingCostDirect.equipmentDepreciation">
                    <template #default="{ row }">
                      {{ row.manufacturingCostDirect?.equipmentDepreciation?.toFixed(2) || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="换线成本" prop="manufacturingCostDirect.lineChangeCost">
                    <template #default="{ row }">
                      {{ row.manufacturingCostDirect?.lineChangeCost?.toFixed(2) || "-" }}
                    </template>
                  </el-table-column>

                  <el-table-column label="制造费用" prop="manufacturingCostDirect.manufacturingExpenses" />
                  <el-table-column label="小计" prop="subtotal" />
                </el-table-column>
                <el-table-column label="间接制造成本">
                  <el-table-column label="直接人工" prop="manufacturingCostIndirect.directLabor">
                    <template #default="{ row }">
                      {{ row.manufacturingCostIndirect?.directLabor?.toFixed(2) || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="设备折旧" prop="manufacturingCostIndirect.equipmentDepreciation">
                    <template #default="{ row }">
                      {{ row.manufacturingCostIndirect?.equipmentDepreciation?.toFixed(2) || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="换线成本" prop="manufacturingCostIndirect.lineChangeCost">
                    <template #default="{ row }">
                      {{ row.manufacturingCostIndirect?.lineChangeCost?.toFixed(2) || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="制造费用" prop="manufacturingCostIndirect.manufacturingExpenses" />
                  <el-table-column label="小计" prop="subtotal" />
                </el-table-column>
                <el-table-column label="合计" prop="" />
              </el-table>
            </el-card>
            <el-card m="2">
              <el-table :data="item.lossCost" style="width: 100%" border>
                <el-table-column label="成本项目" prop="name" width="180" />
                <el-table-column label="损耗成本" prop="wastageCost" width="180" />
                <el-table-column label="MOQ分摊成本" prop="moqShareCount" width="180" />
                <!-- <el-table-column label="合计" prop="" width="180" /> -->
              </el-table>
            </el-card>
            <el-card m="2">
              <el-table :data="[item.otherCostItem]" style="width: 100%" border>
                <el-table-column label="夹具" prop="fixture" width="180" />
                <el-table-column label="物流费" prop="logisticsFee" width="180" />
                <el-table-column label="质量成本" prop="qualityCost" width="180">
                  <el-table-column label="产品类别" prop="productCategory" width="180" />
                  <el-table-column label="成本比例" prop="costProportion" width="180" />
                  <el-table-column label="质量成本(MAX)" prop="qualityCost" width="180" />
                </el-table-column>
                <el-table-column label="财务成本" prop="financialCost" width="180">
                  <el-table-column label="账期" prop="accountingPeriod" width="180" />
                  <el-table-column label="资金成本率" prop="capitalCostRate" width="180" />
                  <el-table-column label="财务成本" prop="financialCost" width="180" />
                </el-table-column>
                <el-table-column label="税务成本" prop="taxCost" width="180" />
                <el-table-column label="合计" prop="total" width="180" />
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>
    <el-card class="marketingQuotation-page" header="报价表">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="直接客户名称">
          {{ props.marketingQuotationData?.directCustomerName }}
        </el-descriptions-item>
        <el-descriptions-item label="客户性质"> {{ props.marketingQuotationData?.clientNature }} </el-descriptions-item>
        <el-descriptions-item label="终端客户名称">
          {{ props.marketingQuotationData?.terminalCustomerName }}
        </el-descriptions-item>
        <el-descriptions-item label="终端客户性质">
          {{ props.marketingQuotationData?.terminalClientNature }}
        </el-descriptions-item>
        <el-descriptions-item label="开发计划">
          {{ props.marketingQuotationData?.developmentPlan }}
        </el-descriptions-item>
        <el-descriptions-item label="汇率"> {{ props.marketingQuotationData?.exchangeRate }} </el-descriptions-item>
      </el-descriptions>
      <el-card header="走量信息" m="2">
        <el-table :data="props.marketingQuotationData?.motionMessage" border>
          <el-table-column type="index" width="100" />
          <el-table-column label="名称" prop="messageName" />
          <el-table-column
            v-for="(item, index) in data.sopData"
            :key="item.year"
            :label="item.year"
            :prop="`sop${index}.value`"
            :formatter="formatMarketingQuotationDatas"
          />
        </el-table>
      </el-card>
      <el-card header="核心部件：" m="2">
        <!-- <div>
        产品名称：{{ props.marketingQuotationData?. }}
      </div> -->
        <template v-for="item in props.marketingQuotationData?.coreComponent" :key="item.messageName">
          <el-card :header="item.componentName" class="m-2">
            <el-table :data="item.productSubclass" border>
              <!-- <el-table-column type="index" width="100" /> -->
              <el-table-column label="核心部件" prop="coreComponent" />
              <el-table-column label="型号" prop="model" />
              <el-table-column label="类型" prop="type" />
              <el-table-column label="备注" prop="remark" />
            </el-table>
          </el-card>
        </template>
      </el-card>
      <el-card header="NRE费用：" m="2">
        <template v-for="item in props.marketingQuotationData?.nreCost" :key="item.messageName">
          <el-card :header="item.nreCostModuleName" class="m-2">
            <el-table :data="item.nreCostModels" border>
              <el-table-column type="index" width="100" />
              <el-table-column label="费用类别" prop="name" />
              <el-table-column label="成本" prop="cost" />
            </el-table>
          </el-card>
        </template>
      </el-card>
      <el-card header="内部核价信息：" m="2">
        <template v-for="item in props.marketingQuotationData?.pricingMessage" :key="item.messageName">
          <el-card :header="item.pricingMessageName" class="m-2">
            <el-table :data="item.pricingMessageModels" border>
              <el-table-column label="序号" type="index" width="100" />
              <el-table-column label="费用类别" prop="name" />
              <el-table-column label="成本值" prop="costValue" />
            </el-table>
          </el-card>
        </template>
      </el-card>
      <el-card header="报价策略：" m="2">
        <el-table :data="props.marketingQuotationData?.biddingStrategy" border>
          <el-table-column type="index" width="100" />
          <el-table-column label="产品" prop="product" />
          <el-table-column label="成本" prop="cost" />
          <el-table-column label="毛利率" prop="grossMargin" />
          <el-table-column label="样件价格" prop="price" />
        </el-table>
      </el-card>
      <el-card header="费用表：" m="2">
        <el-table :data="props.marketingQuotationData?.expensesStatement" border>
          <el-table-column type="index" width="100" />
          <el-table-column label="费用类别" prop="formName" />
          <el-table-column label="核价金额" prop="offerMoney" />
          <el-table-column label="报价系数" prop="offerCoefficient" />
          <el-table-column label="备注" prop="remark" />
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { getYears } from "../pmDepartment/service"

const props = defineProps({
  priceEvaluationTableList: {
    type: Array
  },
  marketingQuotationData: {
    type: Object
  },
  auditFlowId: {
    type: Number
  }
})

const modeEnnum = [
  {
    title: "核价表",
    value: 1
  },
  {
    title: "报表",
    value: 2
  }
]
const data = reactive<any>({
  mode: 1,
  sopData: []
})

const formatMarketingQuotationDatas = (record: any, _row: any, cellValue: any) => {
  if (record.messageName.includes("%")) return `${cellValue.toFixed(2)} %`
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const handleChangeMode = (val: number) => {
  data.mode = val
}

const fetchSopYear = async () => {
  const { result } = (await getYears(props.auditFlowId)) || {}
  data.sopData = result || []
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  fetchSopYear()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

watchEffect(() => {})
</script>
<style scoped lang="scss"></style>
