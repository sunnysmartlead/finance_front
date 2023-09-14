<template>
  <el-card class="marketingQuotation-page" header="报价审核表" m="2">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="直接客户名称">
        {{ data.resa.directCustomerName }}
      </el-descriptions-item>
      <el-descriptions-item label="客户性质"> {{ data.resa.clientNature }} </el-descriptions-item>
      <el-descriptions-item label="终端客户名称">
        {{ data.resa.terminalCustomerName }}
      </el-descriptions-item>
      <el-descriptions-item label="终端客户性质">
        {{ data.resa.terminalClientNature }}
      </el-descriptions-item>
      <el-descriptions-item label="开发计划">
        <el-input v-model="data.resa.developmentPlan" />
      </el-descriptions-item>
      <el-descriptions-item label="SOP时间">
        <el-input v-model="data.resa.sopTime" />
      </el-descriptions-item>
      <el-descriptions-item label="项目生命周期">
        <el-input v-model="data.resa.projectCycle" />
      </el-descriptions-item>
      <el-descriptions-item label="销售类型">
        <el-input v-model="data.resa.forSale" />
      </el-descriptions-item>
      <el-descriptions-item label="贸易方式">
        <el-input v-model="data.resa.modeOfTrade" />
      </el-descriptions-item>
      <el-descriptions-item label="付款方式">
        <el-input v-model="data.resa.paymentMethod" />
      </el-descriptions-item>
      <el-descriptions-item label="报价币种">
        <el-input v-model="data.resa.quoteCurrency" />
      </el-descriptions-item>
      <el-descriptions-item label="汇率"> {{ data.resa.exchangeRate }} </el-descriptions-item>
    </el-descriptions>
    <!-- sop走量信息 -->
    <el-card header="sop走量信息" m="2">
      <el-table :data="data.resa.motionMessage" border>
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
    <!-- 核心部件 -->
    <el-card header="核心部件：" m="2">
      <template v-for="item in data.resa.componenSocondModels" :key="item.coreComponent">
        <el-card :header="item.componentName" class="m-2">
          <el-table :data="item.productSubclass" border>
            <el-table-column type="expand">
              <template #default="props">
                <el-table :data="props.row.specifications" border>
                  <el-table-column label="方案名" prop="solutionname" />
                  <el-table-column label="specification" prop="specification" />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="核心部件" prop="coreComponent" />
            <!-- <el-table-column label="型号" prop="model" /> -->
            <el-table-column label="类型" prop="type" />
            <el-table-column label="备注" prop="remark" />
          </el-table>
        </el-card>
      </template>
    </el-card>
    <!-- nre -->
    <el-card v-for="(nre, index) in data.resa.nres" :key="index">
      <p>{{ nre.solutionName }}</p>
      <p>线体数量：{{ nre.numberLine }} 共线分摊率：{{ nre.collinearAllocationRate }}</p>
      <el-table
        :data="nre.models"
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
      <el-table :data="nre.devices" style="width: 100%" border height="500px">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="devicePrice" label="设备单价" />
        <el-table-column prop="number" label="设备数量" />
        <el-table-column prop="equipmentMoney" label="设备金额" />
      </el-table>
    </el-card>
    <el-card header="内部核价信息：" m="2">
      <template v-for="item in data.resa.pricingMessage" :key="item.messageName">
        <el-card :header="item.pricingMessageName" class="m-2">
          <el-table :data="item.pricingMessageModels" border>
            <el-table-column type="expand">
              <template #default="props">
                <el-table :data="props.row.sops" border>
                  <el-table-column label="sop" prop="sop" />
                  <el-table-column label="梯度" prop="gradientValue" />
                  <el-table-column label="全周期" prop="all" />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="100" />
            <el-table-column label="费用类别" prop="name" />
            <el-table-column label="成本值" prop="costValue" :formatter="formatThousandths" />
          </el-table>
        </el-card>
      </template>
    </el-card>
    <el-card header="报价策略：" m="2">
      <el-table :data="data.resa.biddingStrategySecondModels" border>
        <el-table-column type="index" width="100" />
        <el-table-column label="产品" prop="product" />
        <el-table-column label="Sop年成本" prop="sopCost" />
        <el-table-column label="全生命周期成本" prop="fullLifeCyclecost" />
        <el-table-column label="毛利率" prop="grossMargin">
          <template #default="{ row }">
            {{ `${row.grossMargin?.toFixed(2) || 0} %` }}
          </template>
        </el-table-column>
        <el-table-column label="Sop年毛利率" prop="sopGrossMargin">
          <template #default="{ row }">
            {{ `${row.sopGrossMargin?.toFixed(2) || 0} %` }}
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
    <!-- 样品 -->
    <p>样品报价</p>
    <el-card v-for="sample in data.resa.sampleOffer" :key="sample.solutionName">
      <span>{{ sample.solutionName }}</span>
      <el-table :data="sample.onlySampleModels" style="width: 100%" border height="500px">
        <el-table-column prop="sampleName" label="样品阶段" />
        <el-table-column prop="pcs" label="需求量（pcs）" />
        <el-table-column prop="cost" label="成本" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="grossMargin" label="毛利率" />
        <el-table-column prop="salesRevenue" label="销售收入" />
      </el-table>
    </el-card>
    <!-- <el-card header="费用表：" m="2">
      <el-table :data="data.resa.expensesStatement" border>
        <el-table-column type="index" width="100" />
        <el-table-column label="费用类别" prop="formName" />
        <el-table-column label="核价金额" prop="pricingMoney" :formatter="formatThousandths" />
        <el-table-column label="报价系数" prop="offerCoefficient" :formatter="formatThousandths" />
        <el-table-column label="报价金额" prop="offerMoney" :formatter="formatThousandths" />
        <el-table-column label="备注" prop="remark" />
      </el-table>
    </el-card> -->
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
  motionMessageSop: [],
  resa: {
    date: "2023-09-02T18:02:33.445Z",
    recordNumber: "string", //
    versions: 0,
    offerForm: "string", //报价形式
    sampleQuotationType: "string", //样品报价类型
    directCustomerName: "string", //直接客户名称
    clientNature: "string", //客户性质
    terminalCustomerName: "string", //终端客户名称
    terminalClientNature: "string", //终端客户性质
    developmentPlan: "string", //开发计划
    sopTime: 0, //Sop时间
    projectCycle: 0, // 项目声明周期
    forSale: "string", //销售类型
    modeOfTrade: "string", //贸易方式
    paymentMethod: "string", //付款方式
    quoteCurrency: "string", //报价币种
    exchangeRate: 0, //汇率
    motionMessage: [
      //走量信息
      {
        messageName: "string", //名称
        sop: [
          {
            year: 0,
            value: 0
          }
        ]
      }
    ],
    projectName: "string", //项目名称
    nres: [
      {
        solutionName: "string", //方案名
        solutionId: 0, //
        auditFlowId: 0, //
        models: [
          {
            id: 0, //
            formName: "string", //表单名称
            pricingMoney: 0, //核价金额
            offerCoefficient: 0, //报价系数
            offerMoney: 0, //报价金额
            remark: "string" //备注
          }
        ],
        devices: [
          //
          {
            deviceName: "string",
            devicePrice: 0,
            number: 0,
            equipmentMoney: 0
          }
        ],
        numberLine: 0, //线体数量
        collinearAllocationRate: 0 //共线分摊率
      }
    ],
    sampleOffer: [
      //样品报价
      {
        solutionName: "string",
        auditFlowId: 0,
        solutionId: 0,
        onlySampleModels: [
          {
            sampleName: "string",
            pcs: 0,
            cost: 0,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0
          }
        ]
      }
    ],
    componenSocondModels: [
      //核心部件
      {
        coreComponent: "string", //核心部件
        type: "string",
        remark: "string",
        specifications: [
          {
            solutionname: "string", //方案名
            specification: "string"
          }
        ]
      }
    ],
    pricingMessageSecondModels: [
      //内部核价信息
      {
        solutionName: "string",
        solutionId: "string",
        name: "string",
        sops: [
          {
            gradientValue: 0, //梯度
            sop: 0, //sop值
            all: 0 //全周期
          }
        ]
      }
    ],
    biddingStrategySecondModels: [
      //报价策略
      {
        gradientId: 0,
        productId: 0,
        product: "string",
        sopCost: 0, //Sop年成本
        fullLifeCyclecost: 0, //全生命周期成本
        grossMargin: 0, //毛利率
        price: 0, //价格
        commission: 0, //佣金
        sopGrossMargin: 0, //Sop年毛利率
        grossMarginCommission: 0 //含佣金的毛利率
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
