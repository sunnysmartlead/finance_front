<template>
  <!-- 总经理审批1 -->
  <el-card header="报价审核表">
    <!-- 单价汇总 -->
    <p>单价汇总</p>
    <el-table :data="data.resa.unitPriceSum" border>
      <!-- <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.solutuionAndValues" border>
            <el-table-column label="solutionId" prop="solutionId" />
            <el-table-column label="value" prop="value" />
          </el-table>
        </template>
      </el-table-column> -->
      <el-table-column label="产品名称" prop="product" />
      <el-table-column label="价格" prop="price" />
    </el-table>
    <!-- NRE汇总 -->
    <p>NRE汇总</p>
    <el-table :data="data.resa.nreUnitSumModels" border>
      <!-- <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.solutuionAndValues" border>
            <el-table-column label="solutionId" prop="solutionId" />
            <el-table-column label="value" prop="value" />
          </el-table>
        </template>
      </el-table-column> -->
      <el-table-column label="产品名称" prop="product" />
      <el-table-column label="花费" prop="cost" />
      <el-table-column label="数量" prop="number" />
    </el-table>
    <!-- nre -->
    <el-card v-for="(item, index) in data.resa.managerApprovalOfferNres" :key="index">
      <p>报价毛利率测算-实际数量</p>
      <el-table :data="item.managerApprovalOfferModels" style="width: 100%" border max-height="500px">
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
      <!-- <p>{{ item.analyseBoardNreDto.solutionName }}</p> -->
      <!-- <p>
        线体数量：{{ item.analyseBoardNreDto.numberLine }} 共线分摊率：{{
          item.analyseBoardNreDto.collinearAllocationRate
        }}
      </p> -->
      <!-- <el-table
        :data="item.analyseBoardNreDto.models"
        style="width: 100%"
        border
        max-height="500px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="序号" type="index" />
        <el-table-column prop="formName" label="费用名称" />
        <el-table-column prop="pricingMoney" label="核价金额" />
        <el-table-column label="报价系数">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.offerCoefficient"
              controls-position="right"
              @change="offerCoefficientChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="offerMoney" label="报价金额" />
        <el-table-column label="备注">
          <template #default="scope">
            <el-input v-model="scope.row.remark" type="textarea" />
          </template>
        </el-table-column>
      </el-table> -->
      <p>专用设备</p>
      <el-table :data="item.analyseBoardNreDto.devices" style="width: 100%" border max-height="500px">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="devicePrice" label="设备单价" />
        <el-table-column prop="number" label="设备数量" />
        <el-table-column prop="equipmentMoney" label="设备金额" />
      </el-table>
    </el-card>
    <!-- <el-row justify="end" m="2">
      <el-button @click="save" type="primary">保存</el-button>
    </el-row> -->
    <el-row justify="end" m="2">
      <el-button @click="save" type="primary">总经理审批2</el-button>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"

import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { GetQuotationList } from "./service"
import getQuery from "@/utils/getQuery"
import { getYears } from "../pmDepartment/service"
import { PostAuditQuotationListSave, GetManagerApprovalOfferOne } from "./service"
// import { ElMessageBox } from "element-plus"

const router = useRouter()
const route = useRoute()
const { auditFlowId } = getQuery()
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
      {
        product: "前视-AR0820",
        solutuionAndValues: [
          {
            solutionId: 115,
            value: 5
          }
        ]
      }
    ],
    nreUnitSumModels: [
      {
        product: "前视-AR0820",
        solutuionAndValues: [
          {
            solutionId: 115,
            value: 5
          }
        ]
      }
    ],
    managerApprovalOfferNres: [
      {
        solutionName: "AR0820",
        solutionId: 115,
        analyseBoardNreDto: {
          solutionName: "NRE AR0820",
          solutionId: 0,
          auditFlowId: 0,
          models: [
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "手板件费",
              pricingMoney: 4000,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5843489+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "模具费",
              pricingMoney: 193000,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845263+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "生产设备费",
              pricingMoney: 0,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845277+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "工装费",
              pricingMoney: 0,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845281+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "治具费",
              pricingMoney: 0,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845311+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "检具费",
              pricingMoney: 0,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845328+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "实验费",
              pricingMoney: 372770,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845332+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "测试软件费",
              pricingMoney: 0,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845336+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "差旅费",
              pricingMoney: 800,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845339+08:00",
              creatorUserId: null,
              id: 0
            },
            {
              auditFlowId: 0,
              solutionId: null,
              formName: "其他费用",
              pricingMoney: 50000,
              offerCoefficient: 0,
              offerMoney: 0,
              remark: null,
              isDeleted: false,
              deleterUserId: null,
              deletionTime: null,
              lastModificationTime: null,
              lastModifierUserId: null,
              creationTime: "2023-09-14T02:02:49.5845345+08:00",
              creatorUserId: null,
              id: 0
            }
          ],
          devices: [],
          numberLine: 0,
          collinearAllocationRate: 0
        },
        managerApprovalOfferModels: [
          {
            product: "前视-AR0820",
            sopCost: 4,
            fullLifeCyclecost: 5,
            salesRevenue: 5,
            sellingCost: 6,
            grossMargin: 12,
            price: 10,
            commission: 1,
            sopGrossMargin: 11,
            grossMarginCommission: 11,
            clientGrossMargin: 12,
            nreGrossMargin: 10
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
  // fetchSopYear()
})

const formatMarketingQuotationDatas = (record: any, _row: any, cellValue: any) => {
  if (record.messageName.includes("%")) return `${cellValue.toFixed(2)} %`
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const initFetch = async () => {
  if (auditFlowId) {
    const { result } = await GetManagerApprovalOfferOne({ auditFlowId, version: 0 })
    data.resa = result
    console.log(result, "result")
  }
}
//报价值change
const offerCoefficientChange = (row: any) => {
  row.offerMoney = row.offerCoefficient * row.pricingMoney
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

// const save = async () => {
//   const { success }: any =
//     (await PostAuditQuotationListSave({
//       auditFlowId,
//       ...data.resa
//     })) || {}
//   if (success) ElMessage.success("保存成功！")
// }
const save = async () => {
  let query = route.query
  debugger
  router.push({ path: "/marketingQuotation/indexSecond", query })
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
</style>
