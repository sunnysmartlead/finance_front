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
    <!-- NRE报价汇总 -->
    <p>NRE报价汇总</p>
    <el-table :data="data.resa.nreUnitSumModels" border>
      <el-table-column label="产品名称" prop="product" />
      <el-table-column label="花费" prop="cost" />
      <el-table-column label="数量" prop="number" />
    </el-table>
    <!-- nre -->
    <el-card>
      <p>报价毛利率测算-实际数量</p>
      <el-table :data="data.resa.managerApprovalOfferNres" style="width: 100%" border max-height="500px">
        <el-table-column prop="solutionName" label="方案名" />
        <el-table-column prop="offerUnitPrice" label="本次报价-单价" :formatter="formatThousandths" />
        <el-table-column prop="offerGrossMargin" label="本次报价-毛利率">
          <template #default="{ row }">
            {{ `${row.offerGrossMargin?.toFixed(2)} %` }}
          </template>
        </el-table-column>
        <el-table-column prop="offerClientGrossMargin" label="本次报价增加客供料毛利率">
          <template #default="{ row }">
            {{ `${row.offerClientGrossMargin?.toFixed(2)} %` }}
          </template>
        </el-table-column>
        <el-table-column prop="offerNreGrossMargin" label="本次报价剔除NRE分摊费用毛利率">
          <template #default="{ row }">
            {{ `${row.offerNreGrossMargin?.toFixed(2)} %` }}
          </template>
        </el-table-column>
        <el-table-column prop="salesRevenue" label="销售收入" :formatter="formatThousandths" />
        <el-table-column prop="sellingCost" label="销售成本" :formatter="formatThousandths" />
        <el-table-column prop="sopCost" label="SOP成本" :formatter="formatThousandths" />
        <el-table-column prop="fullCost" label="全生命周期成本" :formatter="formatThousandths" />
        <!-- <el-table-column prop="equipmentMoney" label="设备金额" /> -->
      </el-table>
      <!-- nre汇总 -->
      <p>线体数量：{{ data.resa.nre.numberLine }} 共线分摊率：{{ data.resa.nre.collinearAllocationRate }}</p>
      <el-table
        :data="data.resa.nre.models"
        style="width: 100%"
        border
        max-height="500px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="序号" type="index" />
        <el-table-column prop="formName" label="费用名称" />
        <el-table-column prop="pricingMoney" label="核价金额" :formatter="formatThousandths" />
        <el-table-column label="报价系数">
          <template #default="scope">
            <el-input-number @mousewheel.native.prevent
              v-model="scope.row.offerCoefficient"
              controls-position="right"
              @change="offerCoefficientChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="offerMoney" label="报价金额" :formatter="formatThousandths" />
        <el-table-column label="备注">
          <template #default="scope">
            <el-input v-model="scope.row.remark" type="textarea" />
          </template>
        </el-table-column>
      </el-table>
      <p>专用设备</p>
      <el-table :data="data.resa.nre.devices" style="width: 100%" border max-height="500px">
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
import { PostAuditQuotationListSave, GetManagerApprovalOfferOne, PostManagerApprovalOfferOneSave } from "./service"
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
    managerApprovalOfferNres: [],
    nre: {
      solutionName: "汇总",
      solutionId: null,
      auditFlowId: 0,
      models: [
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "手板件费",
          pricingMoney: 10739378.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1245986",
          creatorUserId: null,
          id: 263
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "模具费",
          pricingMoney: 514140.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246008",
          creatorUserId: null,
          id: 264
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "生产设备费",
          pricingMoney: 51497385.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246025",
          creatorUserId: null,
          id: 265
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "工装费",
          pricingMoney: 3488767.5,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246042",
          creatorUserId: null,
          id: 266
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "治具费",
          pricingMoney: 5727840.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246058",
          creatorUserId: null,
          id: 267
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "检具费",
          pricingMoney: 0.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246075",
          creatorUserId: null,
          id: 268
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "实验费",
          pricingMoney: 5566242.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246094",
          creatorUserId: null,
          id: 269
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "测试软件费",
          pricingMoney: 2058270.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.124611",
          creatorUserId: null,
          id: 270
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "差旅费",
          pricingMoney: 73048.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246126",
          creatorUserId: null,
          id: 271
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "其他费用",
          pricingMoney: 3950000.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246146",
          creatorUserId: null,
          id: 272
        }
      ],
      devices: [],
      numberLine: 0.0,
      collinearAllocationRate: 0.0
    }
  }
})
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = "合计"
      return
    }
    if (index === 2 || index === 4) {
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
        sums[index] = (Number(sums[index]).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
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
  let res = await PostManagerApprovalOfferOneSave(data.resa)
  console.log(res)
  router.push({ path: "/marketingQuotation/indexSecond", query })
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
</style>
