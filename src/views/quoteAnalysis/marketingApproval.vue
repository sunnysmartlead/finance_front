<template>
  <!-- 营销部审批 -->

  <el-card class="marketingQuotation-page" header="报价审核表" m="2">
    <ProcessVertifyBox :onSubmit="handleSubmit" processType="confirmProcessType" v-if="isShowBtn" />
    <h4 mb-20px v-if="isShowBtn">已保存的方案版本</h4>
    <div mb-20px v-if="isShowBtn">
      <el-table :data="versionList" border max-height="300px">
        <el-table-column label="版本号" width="200" align="center" prop="version" />
        <el-table-column label="提交次数" width="200" align="center" prop="ntime" />
        <el-table-column label="组合方案" width="300" align="center">
          <template #default="scope">
            <div v-for="item in scope.row.solutionList" :key="item.product">
              {{ item.product }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="selectVersion(scope.row)" type="primary">加载该版本</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="isShowBtn">
      <div>已保存的审批表（仅查看）</div>
      <div my-20px>
        <!-- <el-button>切换到当前版本</el-button> -->
        <el-table :data="quotationList" border max-height="300px">
          <el-table-column label="序号" width="200" align="center" type="index" />
          <el-table-column label="创建时间" width="200" align="center" prop="creationTime" />
          <!-- <el-table-column label="提交次数" width="200" align="center" prop="ntime" /> -->
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="selectQuotation(scope.row)" type="primary">查看该审批表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div float-right mb-20px>
      <el-button type="primary" @click="downLoadTable">审批表下载</el-button>
    </div>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="直接客户名称">
        {{ data.resa.directCustomerName }}
      </el-descriptions-item>
      <el-descriptions-item label="客户性质">
        <!-- {{ data.resa.clientNature }} -->
        {{ typeMapGetText("customerNatureOptions", data.resa.clientNature) }}
      </el-descriptions-item>
      <el-descriptions-item label="终端客户名称">
        {{ data.resa.terminalCustomerName }}
      </el-descriptions-item>
      <el-descriptions-item label="终端客户性质">
        <!-- {{ data.resa.terminalClientNature }} -->
        {{ typeMapGetText("terminalNatureOptions", data.resa.terminalClientNature) }}
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
        <!-- {{ data.resa.forSale }} -->
        {{ typeMapGetText("salesTypeOptions", data.resa.forSale) }}
        <!-- <el-input v-model="data.resa.forSale" /> -->
      </el-descriptions-item>
      <el-descriptions-item label="贸易方式">
        <!-- {{ data.resa.modeOfTrade }} -->
        {{ typeMapGetText("TradeMethodOptions", data.resa.modeOfTrade) }}
        <!-- <el-input v-model="data.resa.modeOfTrade" /> -->
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
      <el-table :data="data.resa.mess" border>
        <el-table-column type="index" width="100" label="序号" align="center"/>
        <el-table-column prop="gradient" label="梯度" align="center"/>
        <el-table-column prop="key" label="年份" align="center"/>
        <el-table-column prop="value" label="走量" align="center"/>
      </el-table>
      <el-table :data="data.resa.sop" border>
        <el-table-column type="index" width="100" label="序号" align="center"/>
        <el-table-column prop="year" label="年份" align="center"/>
        <el-table-column prop="annualDeclineRate" label="年降率" align="center"/>
        <el-table-column prop="annualRebateRequirements" label="年度返利要求" align="center"/>
        <el-table-column prop="oneTimeDiscountRate" label="一次性折让" align="center"/>
        <el-table-column prop="commissionRate" label="年度佣金比例" align="center"/>
      </el-table>
    </el-card>
    <!-- 核心部件 -->
    <el-card header="核心部件：" m="2">
      <el-table :data="data.resa.componenSocondModels" border>
        <!-- <el-table-column type="expand">
            <template #default="props">
              <el-table :data="props.row.specifications" border>
                <el-table-column label="方案名" prop="solutionName" />
                <el-table-column label="specification" prop="specification" />
              </el-table>
            </template>
          </el-table-column> -->
        <el-table-column label="方案名" prop="solutionName" align="center"/>
        <el-table-column label="核心部件" prop="partsName" align="center"/>
        <el-table-column label="型号" prop="model" align="center"/>
        <el-table-column label="类型" prop="type" align="center"/>
        <el-table-column label="备注" prop="remark" align="center"/>
      </el-table>
    </el-card>
    <!-- nre -->
    <h3>NRE</h3>
    <!-- {
        "solutionName": null,
        "index": null,
        "costName": null,
        "pricingMoney": "线体数量：",
        "offerCoefficient": "1",
        "offerMoney": "共线分摊率：",
        "remark": "24.96"
      },
      {
        "solutionName": "方案名",
        "index": "序号",
        "costName": "费用名称",
        "pricingMoney": "核价金额",
        "offerCoefficient": "报价系数",
        "offerMoney": "报价金额",
        "remark": "备注"
      }, -->
    <el-table :data="data.resa.nres" style="width: 100%" border height="400px" :show-header="false">
      <el-table-column prop="solutionName" label="" align="center"/>
      <el-table-column prop="index" label="" align="center"/>
      <el-table-column prop="costName" label="" :formatter="formatThousandths" align="center"/>
      <el-table-column prop="pricingMoney" label="" :formatter="formatThousandths" align="center"/>
      <el-table-column prop="offerCoefficient" label="" :formatter="formatThousandths" align="center"/>
      <el-table-column prop="offerMoney" label="" :formatter="formatThousandths" align="center"/>
      <el-table-column prop="remark" label="" align="center"/>
    </el-table>
    <!-- <el-card v-for="(nre, index) in data.resa.nres" :key="index">
      <p>{{ nre.solutionName }}</p>
      <p>线体数量：{{ nre.numberLine }} 共线分摊率：：{{ nre.collinearAllocationRate }}</p>
      <el-table
        :data="nre.models"
        style="width: 100%"
        border
        height="400px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column type="index" />
        <el-table-column prop="formName" label="费用名称" />
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
      <el-table :data="nre.devices" style="width: 100%" border height="250px">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="devicePrice" label="设备单价" />
        <el-table-column prop="number" label="设备数量" />
        <el-table-column prop="equipmentMoney" label="设备金额" />
      </el-table>
    </el-card> -->
    <el-card header="内部核价信息：" m="2">
      <el-table :data="data.resa.pricingMessageSecondModels" border align="center">
        <el-table-column label="序号" type="index" width="50" align="center"/>
        <el-table-column label="梯度" prop="gradient" width="100" align="center"/>
        <el-table-column label="方案名称" prop="solutionName" width="180" align="center"/>
        <el-table-column label="BOM成本" align="center">
          <el-table-column label="SOP年成本" prop="bomSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="bomfull" width="100" align="center"/>
        </el-table-column>
        <el-table-column label="生产成本" align="center">
          <el-table-column label="SOP年成本" prop="scSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="scfull" width="100" align="center"/>
        </el-table-column>
        <el-table-column label="良损率、良损成本" align="center">
          <el-table-column label="SOP年成本" prop="lsSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="lsfull" width="100" align="center"/>
        </el-table-column>
        <el-table-column label="运费" align="center">
          <el-table-column label="SOP年成本" prop="yfSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="yffull" width="100" align="center"/>
        </el-table-column>
        <el-table-column label="MOQ分摊成本" align="center">
          <el-table-column label="SOP年成本" prop="moqSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="moqfull" width="100" align="center"/>
        </el-table-column>
        <el-table-column label="质量成本" align="center">
          <el-table-column label="SOP年成本" prop="quSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="qufull" width="100" align="center"/>
        </el-table-column>
        <el-table-column label="分摊成本" align="center">
          <el-table-column label="SOP年成本" prop="ftSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="ftfull" width="100" align="center"/>
        </el-table-column>
        <el-table-column label="总成本" align="center">
          <el-table-column label="SOP年成本" prop="allSop" width="100" align="center"/>
          <el-table-column label="全生命周期成本" prop="allfull" width="100" align="center"/>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card header="报价策略：" m="2">
      <el-table :data="data.resa.biddingStrategySecondModels" border>
        <el-table-column type="index" width="100" label="序号" align="center"/>
        <el-table-column label="梯度" prop="gradient" align="center"/>
        <el-table-column label="产品" prop="product" align="center"/>
        <el-table-column label="Sop年成本" prop="sopCost" :formatter="formatThousandths" align="center"/>
        <el-table-column label="全生命周期成本" prop="fullLifeCyclecost" :formatter="formatThousandths" align="center"/>
        <el-table-column label="价格" prop="price" :formatter="formatThousandths" align="center"/>
        <el-table-column label="Sop年毛利率" prop="sopGrossMargin" align="center">
          <template #default="{ row }">
            {{ `${row.sopGrossMargin?.toFixed(2) || 0} %` }}
          </template>
        </el-table-column>
        <el-table-column label="全生命周期毛利率" prop="totallifeCyclegrossMargin" align="center">
          <template #default="{ row }">
            {{ `${row.totallifeCyclegrossMargin?.toFixed(2) || 0} %` }}
          </template>
        </el-table-column>
        <el-table-column label="增加客供料毛利率" prop="clientGrossMargin" align="center">
          <template #default="{ row }">
            {{ `${row.clientGrossMargin?.toFixed(2) || 0} %` }}
          </template>
        </el-table-column>
        <el-table-column label="剔除分摊费用毛利率" prop="nreGrossMargin" align="center">
          <template #default="{ row }">
            {{ `${row.nreGrossMargin?.toFixed(2) || 0} %` }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 样品 -->
    <p>样品报价</p>

    <el-table :data="data.resa.samples" style="width: 100%" border max-height="500px" :show-header="false">
      <!-- <el-table-column prop="solutionName" label="方案名" />
      <el-table-column prop="solutionName" label="样品阶段" />
      <el-table-column prop="pcs" label="需求量（pcs）" />
      <el-table-column prop="cost" label="成本" />
      <el-table-column prop="unitPrice" label="单价" />
      <el-table-column prop="grossMargin" label="毛利率" />
      <el-table-column prop="salesRevenue" label="销售收入" /> -->
      <el-table-column prop="solutionName" label="" align="center"/>
      <el-table-column prop="name" label="" align="center"/>
      <el-table-column prop="pcs" label="" align="center"/>
      <el-table-column prop="cost" label="" align="center"/>
      <el-table-column prop="unitPrice" label="" align="center"/>
      <el-table-column prop="grossMargin" label="" align="center"/>
      <el-table-column prop="salesRevenue" label="" align="center"/>
    </el-table>
    <el-row justify="end" style="margin-top: 20px">
      <el-button type="primary" @click="save">保存</el-button>
    </el-row>
    <!-- <el-card v-for="sample in data.resa.sampleOffer" :key="sample.solutionName">
      <div mb-20px>{{ sample.solutionName }}</div>
      <el-table :data="sample.onlySampleModels" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="样品阶段" />
        <el-table-column prop="pcs" label="需求量（pcs）" />
        <el-table-column prop="cost" label="成本" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="grossMargin" label="毛利率" />
        <el-table-column prop="salesRevenue" label="销售收入" />
      </el-table>
    </el-card> -->
    <!-- <el-row justify="end" style="margin-top: 20px">
      <el-button type="primary" @click="save">保存</el-button>
    </el-row> -->
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
// import { GetQuotationList } from "../marketingQuotation/service"
import getQuery from "@/utils/getQuery"
import { getYears } from "../pmDepartment/service"
// import { PostAuditQuotationListSave } from "./service"
import {
  getQuotationApprovedMarketing,
  GeCatalogue,
  GetDownloadAuditQuotationList,
  PostQuotationApprovedMarketingSave,
  SubmitNode,
  GetQuotationList,
  GetQuotation,
  GetDownloadAuditQuotationExcel,
  PostQuotationApproved,
  PostQuotationApprovedSave
} from "./service"
import { getDictionaryAndDetail } from "@/api/dictionary"
import { ElLoading } from "element-plus"
import { ElMessage } from "element-plus"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
// import { ElMessageBox } from "element-plus"

const { auditFlowId, version, showBtn }: any = getQuery()
/**
 * 数据部分
 */
let versionList = reactive<any[]>([])
let versionChosen: any = null // 选中的以前版本
let quotationList = reactive<any[]>([])
let quotationCur: any = reactive<any>(null) //当前的报价审批表单项 临时保存
let quotationChosen: any = null //选中的报价审批表单项
const isShowBtn = ref(true)
if (showBtn === "false") {
  isShowBtn.value = false
}
const data = reactive<any>({
  resa: {
    date: "2023-09-13T01:04:17.6054181+08:00",
    recordNumber: "BJHJ-ZL20230831-001",
    versions: 0,
    offerForm: null,
    sampleQuotationType: null,
    directCustomerName: "理想",
    clientNature: null,
    terminalCustomerName: "理想",
    terminalClientNature: null,
    developmentPlan: null,
    sopTime: 2024,
    projectCycle: 3,
    forSale: "SalesType_ForTheDomesticMarket",
    modeOfTrade: "TradeMethodDDU",
    paymentMethod: "月结60天",
    quoteCurrency: null,
    exchangeRate: 0,
    motionMessage: [
      {
        messageName: "25K/Y",
        sop: [
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          }
        ]
      }
    ],
    motion: [
      {
        gradient: "",
        key: "",
        value: ""
      }
    ],
    sops: [
      {
        id: 0,
        year: "2031上半年",
        motion: 0.0,
        annualDeclineRate: 0.0,
        annualRebateRequirements: 1.0,
        oneTimeDiscountRate: 1.0,
        commissionRate: 2.0
      }
    ],
    projectName: "流程测试OK，测试数据1",
    nres: [
      {
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
            creationTime: "2023-09-13T01:04:19.6239762+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241366+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241372+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241374+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241376+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241386+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241388+08:00",
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
            creationTime: "2023-09-13T01:04:19.624139+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241391+08:00",
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
            creationTime: "2023-09-13T01:04:19.6241396+08:00",
            creatorUserId: null,
            id: 0
          }
        ],
        devices: [],
        numberLine: 0,
        collinearAllocationRate: 0
      }
    ],
    samples: [],
    // sampleOffer: [
    //   {
    //     solutionName: "AR0820",
    //     auditFlowId: 0,
    //     solutionId: 0,
    //     onlySampleModels: [
    //       {
    //         auditFlowId: 0,
    //         solutionId: 0,
    //         name: "SampleName_A",
    //         pcs: 200,
    //         cost: 1866.5904956533819,
    //         unitPrice: 0,
    //         grossMargin: 0,
    //         salesRevenue: 0,
    //         isDeleted: false,
    //         deleterUserId: null,
    //         deletionTime: null,
    //         lastModificationTime: null,
    //         lastModifierUserId: null,
    //         creationTime: "2023-09-13T01:04:22.8913946+08:00",
    //         creatorUserId: null,
    //         id: 0
    //       },
    //       {
    //         auditFlowId: 0,
    //         solutionId: 0,
    //         name: "SampleName_B",
    //         pcs: 300,
    //         cost: 1866.5904956533819,
    //         unitPrice: 0,
    //         grossMargin: 0,
    //         salesRevenue: 0,
    //         isDeleted: false,
    //         deleterUserId: null,
    //         deletionTime: null,
    //         lastModificationTime: null,
    //         lastModifierUserId: null,
    //         creationTime: "2023-09-13T01:04:22.8919079+08:00",
    //         creatorUserId: null,
    //         id: 0
    //       },
    //       {
    //         auditFlowId: 0,
    //         solutionId: 0,
    //         name: "SampleName_C",
    //         pcs: 400,
    //         cost: 1866.5904956533819,
    //         unitPrice: 0,
    //         grossMargin: 0,
    //         salesRevenue: 0,
    //         isDeleted: false,
    //         deleterUserId: null,
    //         deletionTime: null,
    //         lastModificationTime: null,
    //         lastModifierUserId: null,
    //         creationTime: "2023-09-13T01:04:22.8919094+08:00",
    //         creatorUserId: null,
    //         id: 0
    //       }
    //     ]
    //   }
    // ],
    componenSocondModels: [
      {
        coreComponent: "Sensor",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "Lens",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "ISP",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "串行芯片",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "线缆",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      }
    ],
    pricingMessageSecondModels: [
      {
        solutionName: "延锋科技前装车内1M-舱内",
        gradientId: 599,
        solutionId: 664,
        gradient: "2664.9",
        bomSop: 370.34, //BOM成本 sop
        bomfull: 368.58, //全生命周期成本
        scSop: 94.95, //  生产成本 sop
        scfull: 99.92, //生产成本 全生命周期成本
        lsSop: 16.72, // sop  良损率、良损成本
        lsfull: 9.42, //良损率、良损成本 全生命周期成本
        yfSop: 0.23, // 运费 sop
        yffull: 0.23, //运费 全生命周期成本
        moqSop: 0.01, // MOQ分摊成本 sop
        moqfull: 0.06, //MOQ分摊成本 全生命周期成本
        quSop: 2.79, //  质量成本 sop
        qufull: 1.84, //质量成本 全生命周期成本
        ftSop: 0.81, // 分摊成本 sop
        ftfull: 1.24, //分摊成本 全生命周期成本
        allSop: 485.85, //  总成本 sop
        allfull: 481.28 //总成本 全生命周期成本
      }
    ],
    biddingStrategySecondModels: [
      {
        gradientId: 599,
        gradient: "2664.9k/y",
        productId: 0,
        product: "延锋科技前装车内1M",
        sopCost: 1669950.5306498313, //Sop年成本
        fullLifeCyclecost: 6551899.356798569, //全生命周期成本
        price: 1111, //价格

        sopGrossMargin: 40.41033099014627, //SOP年毛利率
        totallifeCyclegrossMargin: 40.37, //
        clientGrossMargin: -44.58, //增加客供料毛利率
        nreGrossMargin: 40.4 //剔除分摊费用毛利率
      }
    ]
  },
  curData: null,
  version: 1
})
const typeMap = reactive<any>({
  customerNatureOptions: [],
  terminalNatureOptions: [],
  salesTypeOptions: [],
  TradeMethodOptions: []
})
/**
 * 营销部报价审批 报价审核表 下载
 */
const downLoadTable = async () => {
  try {
    //从报价审批表跳转过来的下载
    if (!isShowBtn.value) {
      let res: any = await GetDownloadAuditQuotationList({
        auditFlowId: Number(auditFlowId),
        version: version
      })
      const blob = res
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        let url = URL.createObjectURL(new Blob([blob]))
        let a = document.createElement("a")
        document.body.appendChild(a) //此处增加了将创建的添加到body当中
        a.href = url
        a.download = "报价审核表.xlsx"
        a.target = "_blank"
        a.click()
        a.remove() //将a标签移除
      }
    } else {
      // 流程--营销部审批下载
      if (!versionChosen) {
        ElMessage.warning("请先选择数据")
        return false
      }
      // 如果选中子列表审核数据 通过ID去下载历史审批表
      if (quotationChosen) {
        let res: any = await GetDownloadAuditQuotationExcel(quotationChosen.id)
        const blob = res
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function () {
          let url = URL.createObjectURL(new Blob([blob]))
          let a = document.createElement("a")
          document.body.appendChild(a) //此处增加了将创建的添加到body当中
          a.href = url
          a.download = "报价审核表.xlsx"
          a.target = "_blank"
          a.click()
          a.remove() //将a标签移除
        }
      } else {
        // 通过上面加载版本下载数据
        let res: any = await GetDownloadAuditQuotationList({
          auditFlowId: Number(auditFlowId),
          version: versionChosen.version
        })
        const blob = res
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function () {
          let url = URL.createObjectURL(new Blob([blob]))
          let a = document.createElement("a")
          document.body.appendChild(a) //此处增加了将创建的添加到body当中
          a.href = url
          a.download = "报价审核表.xlsx"
          a.target = "_blank"
          a.click()
          a.remove() //将a标签移除
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
const save = async () => {
  try {
    // let res: any = await PostQuotationApprovedMarketingSave({ ...data.resa, version: versionChosen.version })
    let res: any = await PostQuotationApprovedSave({ ...data.resa, version: version })

    console.log(res)
    if (res.success) {
      ElMessage.success("保存成功")
    }
  } catch (error) {
    console.log(error)
  }
}
const handleSubmit = async ({ comment, opinion, nodeInstanceId }: any) => {
  if (!versionChosen) {
    ElMessage.warning("选择数据后再执行")
    return false
  }
  await save() //保存舍弃
  let res: any = await SubmitNode({
    comment,
    nodeInstanceId,
    financeDictionaryDetailId: opinion
  })
  if (res.success) {
    ElMessage({
      type: "success",
      message: "操作成功"
    })
  }
}

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
  if (Number(cellValue) && typeof Number(cellValue).toFixed === "function") {
    return (Number(cellValue).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return cellValue
  }
}

const typeMapGetText = (key: any, id: any) => {
  let text = id
  typeMap[key].forEach((item: any) => {
    if (item.id === id) {
      text = item.displayName
    }
  })
  return text
}
const initFetch = async () => {
  let { result }: any = await GeCatalogue({ auditFlowId })
  result.forEach((item: any) => {
    if (!item.isFirst) {
      versionList.push(item)
    }
  })
  if (version && !isShowBtn.value) {
    /**
     * 报价分析看板跳转过来查看数据 不加载审核列表
     */
    const loadingInstance = ElLoading.service({ fullscreen: true })
    try {
      /**
       * 根据版本号查询该版本数据
       */
      const { result } = await getQuotationApprovedMarketing({ auditFlowId, version: version })

      data.resa = result

      loadingInstance.close()
      //   const res: any = await GetQuotationList({ auditFlowId, version: version })
      // if (res.result) {
      //   res.result.forEach((item: any) => {
      //     quotationList.push(item)
      //   })
      // }
      // console.log(res)
    } catch (error) {
      loadingInstance.close()
    }
  }
  let customerNature: any = await getDictionaryAndDetail("CustomerNature") //客户性质
  typeMap.customerNatureOptions = customerNature.result.financeDictionaryDetailList

  let terminalNature: any = await getDictionaryAndDetail("TerminalNature") //终端性质
  typeMap.terminalNatureOptions = terminalNature.result.financeDictionaryDetailList

  let salesType: any = await getDictionaryAndDetail("SalesType") //销售类型
  typeMap.salesTypeOptions = salesType.result.financeDictionaryDetailList

  let tradeMethodType: any = await getDictionaryAndDetail("TradeMethod") //贸易方式
  typeMap.TradeMethodOptions = tradeMethodType.result.financeDictionaryDetailList
}
/**
 * 加载之前的版本
 */
const selectVersion = async (row: any) => {
  // fullscreenLoading.value = true
  const loadingInstance = ElLoading.service({ fullscreen: true })
  try {
    versionChosen = row
    /**
     * 根据版本号查询当前该版本的审批数据
     */
    const { result } = await getQuotationApprovedMarketing({ auditFlowId, version: versionChosen.version })
    /**
     * 获取该版本下的报价审批表历史
     */
    const res: any = await GetQuotationList({ auditFlowId, version: versionChosen.version })
    data.resa = result
    quotationCur = result //备份当前数据
    quotationList.length = 0
    if (res.result) {
      res.result.forEach((item: any) => {
        quotationList.push(item)
      })
    }
    console.log(res)
    loadingInstance.close()
  } catch (error) {
    loadingInstance.close()
  }
}
/**
 * 加载审批表历史
 */
const selectQuotation = async (row: any) => {
  let res: any = await GetQuotation(row.id)
  data.resa = res.result
  quotationChosen = res.result
  quotationChosen.id = row.id
  // data.resa = JSON.parse(row.auditQuotationListJson)
  // console.log(JSON.parse(row.auditQuotationListJson))
}
watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
</style>
