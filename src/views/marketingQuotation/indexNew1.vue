<template>
  <el-card class="marketingQuotation-page" header="报价审核表" m="2">
    <!-- 单价汇总 -->
    <el-table :data="data.resa.unitPriceSum" border>
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.solutuionAndValues" border>
            <el-table-column label="solutionId" prop="solutionId" />
            <el-table-column label="value" prop="value" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="product" />
    </el-table>
    <!-- NRE汇总 -->
    <el-table :data="data.resa.nreUnitSumModels" border>
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.solutuionAndValues" border>
            <el-table-column label="solutionId" prop="solutionId" />
            <el-table-column label="value" prop="value" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="product" />
    </el-table>
    <!-- nre -->
    <el-card v-for="(item, index) in data.resa.managerApprovalOfferNres" :key="index">
      <p>报价毛利率测算-实际数量</p>
      <el-table :data="item.managerApprovalOfferModels" style="width: 100%" border height="500px">
        <el-table-column prop="product" label="产品" />
        <el-table-column prop="sopCost" label="SOP年成本" />
        <el-table-column prop="fullLifeCyclecost" label="全生命周期成本" />
        <el-table-column prop="grossMargin" label="毛利率" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="salesRevenue" label="销售收入" />
        <el-table-column prop="sellingCost" label="销售成本" />
        <el-table-column prop="commission" label="佣金" />
        <el-table-column prop="grossMarginCommission" label="含佣金的毛利率" />
        <el-table-column prop="clientGrossMargin" label="增加客供料毛利率" />
        <el-table-column prop="nreGrossMargin" label="剔除分摊费用毛利率" />
        <!-- <el-table-column prop="equipmentMoney" label="设备金额" /> -->
      </el-table>
      <!-- nre汇总 -->
      <p>{{ item.analyseBoardNreDto.solutionName }}</p>
      <p>
        线体数量：{{ item.analyseBoardNreDto.numberLine }} 共线分摊率：{{
          item.analyseBoardNreDto.collinearAllocationRate
        }}
      </p>
      <el-table
        :data="item.analyseBoardNreDto.models"
        style="width: 100%"
        border
        height="500px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="index" label="序号" />
        <el-table-column prop="costName" label="费用名称" />
        <el-table-column prop="pricingMoney" label="核价金额" />
        <el-table-column label="报价系数">
          <template #default="scope">
            <el-input v-model="scope.row.offerCoefficient" type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="offerMoney" label="报价金额" />
        <el-table-column label="备注">
          <template #default="scope">
            <el-input v-model="scope.row.remark" type="textarea" />
          </template>
        </el-table-column>
      </el-table>
      <p>专用设备</p>
      <el-table :data="item.analyseBoardNreDto.devices" style="width: 100%" border height="500px">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="devicePrice" label="设备单价" />
        <el-table-column prop="number" label="设备数量" />
        <el-table-column prop="equipmentMoney" label="设备金额" />
      </el-table>
    </el-card>
    <!-- <el-row justify="end" m="2">
      <el-button @click="save" type="primary">保存</el-button>
    </el-row> -->
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
  motionMessageSop: [],
  resa: {
    unitPriceSum: [
      //单价汇总
      {
        product: "string", //产品名
        solutuionAndValues: [
          {
            solutionId: 0,
            value: 0
          }
        ]
      }
    ],
    nreUnitSumModels: [
      //NR汇总
      {
        product: "string",
        solutuionAndValues: [
          {
            solutionId: 0,
            value: 0
          }
        ]
      }
    ],
    managerApprovalOfferNres: [
      //报价毛利率测算-实际数量
      {
        analyseBoardNreDto: {
          //NRE
          solutionName: "string",
          solutionId: 0,
          auditFlowId: 0,
          models: [
            {
              id: 0,
              formName: "string",
              pricingMoney: 0,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: "string"
            }
          ],
          devices: [
            //设备
            {
              deviceName: "string",
              devicePrice: 0,
              number: 0,
              equipmentMoney: 0
            }
          ],
          numberLine: 0,
          collinearAllocationRate: 0
        },
        managerApprovalOfferModels: [
          {
            product: "string", //产品
            sopCost: 0,
            fullLifeCyclecost: 0, //全周期
            salesRevenue: 0, //销售收入
            sellingCost: 0, //销售成本
            grossMargin: 0, //毛利率
            price: 0, //价格
            commission: 0, //佣金
            sopGrossMargin: 0, //Sop年毛利率
            grossMarginCommission: 0, //含佣金的毛利率
            clientGrossMargin: 0, //增加客供料毛利率
            nreGrossMargin: 0 //剔除NRE分摊费用毛利率
          }
        ]
      }
    ]
  }
})
const getSummaries = (param) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计"
      return
    }
    if (index === 2 || index === 4) {
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
      } else {
        sums[index] = "N/A"
      }
    }
  })

  return sums
}
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
  data.resa = result
  data.motionMessageSop = result.motionMessage[0].sop.map((item: any) => item)
  console.log(result, "result")
}

// 计算含佣金的毛利率
const changeCommission = (row: any, index: number) => {
  console.log(row, index, "changeCommission")
  data.resa.biddingStrategy[index].grossMarginCommission = (1 - (row.commission + row.cost) / row.price) * 100
}

const fetchSopYear = async () => {
  const { result } = (await getYears(auditFlowId)) || {}
  columns.sopData = result || []
}

const save = async () => {
  const { success }: any =
    (await PostAuditQuotationListSave({
      auditFlowId,
      ...data.resa
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
