<template>
  <el-card class="marketingQuotation-page" header="报价审核" m="2">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="直接客户名称">
        {{ data.marketingQuotationData.directCustomerName }}
      </el-descriptions-item>
      <el-descriptions-item label="客户性质"> {{ data.marketingQuotationData.clientNature }} </el-descriptions-item>
      <el-descriptions-item label="终端客户名称">
        {{ data.marketingQuotationData.terminalCustomerName }}
      </el-descriptions-item>
      <el-descriptions-item label="终端客户性质">
        {{ data.marketingQuotationData.terminalClientNature }}
      </el-descriptions-item>
      <el-descriptions-item label="开发计划">
        <el-input v-model="data.marketingQuotationData.developmentPlan" />
      </el-descriptions-item>
      <el-descriptions-item label="汇率"> {{ data.marketingQuotationData.exchangeRate }} </el-descriptions-item>
    </el-descriptions>
    <el-card header="走量信息" m="2">
      <el-table :data="data.marketingQuotationData.motionMessage" border>
        <el-table-column type="index" width="100" />
        <el-table-column label="名称" prop="messageName" />
        <el-table-column
          v-for="(item, index) in data.motionMessageSop"
          :key="item.year"
          :label="item.year"
          :prop="`sop[${index}].value`"
          :formatter="formatMarketingQuotationDatas"
        />
      </el-table>
    </el-card>
    <el-card header="核心部件：" m="2">
      <!-- <div>
        产品名称：{{ data.marketingQuotationData. }}
      </div> -->
      <template v-for="item in data.marketingQuotationData.coreComponent" :key="item.messageName">
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
      <template v-for="item in data.marketingQuotationData.nreCost" :key="item.messageName">
        <el-card :header="item.nreCostModuleName" class="m-2">
          <el-table :data="item.nreCostModels" border>
            <el-table-column type="index" width="100" />
            <el-table-column label="费用类别" prop="name" />
            <el-table-column label="成本" prop="cost" :formatter="formatThousandths" />
          </el-table>
        </el-card>
      </template>
    </el-card>
    <el-card header="内部核价信息：" m="2">
      <template v-for="item in data.marketingQuotationData.pricingMessage" :key="item.messageName">
        <el-card :header="item.pricingMessageName" class="m-2">
          <el-table :data="item.pricingMessageModels" border>
            <el-table-column label="序号" type="index" width="100" />
            <el-table-column label="费用类别" prop="name" />
            <el-table-column label="成本值" prop="costValue" :formatter="formatThousandths" />
          </el-table>
        </el-card>
      </template>
    </el-card>
    <el-card header="报价策略：" m="2">
      <el-table :data="data.marketingQuotationData.biddingStrategy" border>
        <el-table-column type="index" width="100" />
        <el-table-column label="产品" prop="product" />
        <el-table-column label="成本" prop="cost" />
        <el-table-column label="毛利率" prop="grossMargin">
          <template #default="{ row }">
            {{ `${row.grossMargin?.toFixed(2) || 0} %` }}
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price" />
        <el-table-column label="佣金" prop="commission" width="180">
          <template #default="scope">
            <el-input-number
              controls-position="right"
              v-model="scope.row.commission"
              placeholder="请输入佣金"
              @change="(val: any) => changeCommission(scope.row, scope.$index)"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column label="含佣金的毛利率" prop="grossMarginCommission">
          <template #default="{ row }">
            {{ `${row.grossMarginCommission?.toFixed(2) || 0} %` }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card header="费用表：" m="2">
      <el-table :data="data.marketingQuotationData.expensesStatement" border>
        <el-table-column type="index" width="100" />
        <el-table-column label="费用类别" prop="formName" />
        <el-table-column label="核价金额" prop="pricingMoney" :formatter="formatThousandths" />
        <el-table-column label="报价系数" prop="offerCoefficient" :formatter="formatThousandths" />
        <el-table-column label="报价金额" prop="offerMoney" :formatter="formatThousandths" />
        <el-table-column label="备注" prop="remark" />
      </el-table>
    </el-card>
    <el-row justify="end" m="2">
      <el-button @click="save" type="primary">保存</el-button>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { GetQuotationList } from "../marketingQuotation/service"
import getQuery from "@/utils/getQuery"
import { getYears } from "../pmDepartment/service"
import { PostAuditQuotationListSave } from "./service"
import { ElMessage } from "element-plus"
// import { ElMessageBox } from "element-plus"

const { auditFlowId = 1 }: any = getQuery()
/**
 * 数据部分
 */
const data = reactive<any>({
  projectName: "",
  developmentPlan: "",
  marketingQuotationData: {},
  motionMessageSop: []
})

const columns = reactive({
  sopData: []
})

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  initFetch()
  fetchSopYear()
})

const formatMarketingQuotationDatas = (record: any, _row: any, cellValue: any) => {
  if (record.messageName.includes("%")) return `${cellValue.toFixed(2)} %`
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const initFetch = async () => {
  const { result } = await GetQuotationList({ Id: auditFlowId })
  data.marketingQuotationData = result
  data.motionMessageSop = result.motionMessage[0].sop.map((item: any) => item)
  console.log(result, "result")
}

// 计算含佣金的毛利率
const changeCommission = (row: any, index: number) => {
  console.log(row, index, "changeCommission")
  data.marketingQuotationData.biddingStrategy[index].grossMarginCommission =
    (1 - (row.commission + row.cost) / row.price) * 100
}

const fetchSopYear = async () => {
  const { result } = (await getYears(auditFlowId)) || {}
  columns.sopData = result || []
}

const save = async () => {
  const { success }: any =
    (await PostAuditQuotationListSave({
      auditFlowId,
      ...data.marketingQuotationData
    })) || {}
  if (success) ElMessage.success("保存成功！")
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
</style>
