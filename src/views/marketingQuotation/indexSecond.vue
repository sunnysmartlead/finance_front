<!-- 财务中标确认、总经理中标查看、总经理审批2的界面是一样的 -->
<template>
  <div>
    <el-card>
      <!-- 财务中标确认才会存在流程组件 -->
      <ProcessVertifyBox :onSubmit="handleSubmit" v-if="data.pageType === 3" />
      <!-- 财务中标确认 -->
      <el-row justify="end" style="margin-top: 20px" v-if="data.pageType === 3">
        <el-button-group>
          <el-button type="primary" @click="cwSave(true)" v-havedone>财务中标确认</el-button>
          <el-button type="primary" @click="cwSave(false)" v-havedone>财务中标确认拒绝</el-button>
          <!-- <el-button type="primary" @click="cwSave(false)" v-havedone>财务中标确认提交</el-button>
          <el-button type="primary" @click="cwSave(false)" v-havedone>财务中标确认提交拒绝</el-button> -->
        </el-button-group>
      </el-row>
      <div v-if="data.pageType !== 1">
        <h4 mb-20px>已保存的方案版本</h4>
        <div mb-20px>
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
                <el-button
                  @click="selectVersion(scope.row)"
                  type="primary"
                  v-loading.fullscreen.lock="fullscreenLoading"
                >
                  加载该版本</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- v-if="data.isShowBtn" -->
      <div style="margin: 20px 0; float: right" >
        <el-button class="m-2" type="primary" @click="downLoadSOR">SOR下载</el-button>
        <!-- :disabled="data.isdirectSpeed" -->
        <el-button class="m-2" type="primary" @click="downLoad3DExploded"  :disabled="data.isdirectSpeed"
          >3D爆炸图下载</el-button
        >
        <el-button class="m-2" type="primary" @click="downTrFile">TR-主方案下载</el-button>
        <el-button type="primary" @click="jumpToAnalysis">点击查看报价分析看板</el-button>
        <el-button class="m-2" type="primary" @click="jumpToElec" :disabled="data.isdirectSpeed"
          >点击查看电子料返利金额</el-button
        >
        <el-button class="m-2" type="primary" @click="jumpToStru" :disabled="data.isdirectSpeed"
          >点击查看结构料返利金额</el-button
        >
        <el-button class="m-2" @click="toNREPriceList" type="primary">在线预览NRE核价表</el-button>
        <el-button class="m-2" @click="toProductPriceList" type="primary">在线预览核价表</el-button>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="直接客户名称">
          {{ data.resa.directCustomerName }}
        </el-descriptions-item>
        <el-descriptions-item label="客户性质">
          {{ typeMapGetText("customerNatureOptions", data.resa.clientNature) }}
        </el-descriptions-item>
        <el-descriptions-item label="终端客户名称">
          {{ data.resa.terminalCustomerName }}
        </el-descriptions-item>
        <el-descriptions-item label="终端客户性质">
          {{ typeMapGetText("terminalNatureOptions", data.resa.terminalClientNature) }}
        </el-descriptions-item>
        <el-descriptions-item label="开发计划">
          {{ data.resa.developmentPlan }}
          <!-- <el-input v-model="data.resa.developmentPlan" /> -->
        </el-descriptions-item>
        <!-- <el-descriptions-item label="SOP时间">
          <el-input v-model="data.resa.sopTime" />
        </el-descriptions-item>
        <el-descriptions-item label="项目生命周期">
          <el-input v-model="data.resa.projectCycle" />
        </el-descriptions-item> -->
        <!-- <el-descriptions-item label="销售类型">
          {{ typeMapGetText("salesTypeOptions", data.resa.forSale) }}
        </el-descriptions-item>
        <el-descriptions-item label="贸易方式">
          {{ typeMapGetText("TradeMethodOptions", data.resa.modeOfTrade) }}
        </el-descriptions-item>
        <el-descriptions-item label="付款方式">
          <el-input v-model="data.resa.paymentMethod" />
        </el-descriptions-item>
        <el-descriptions-item label="报价币种">
          <el-input v-model="data.resa.quoteCurrency" />
        </el-descriptions-item> -->
        <el-descriptions-item label="汇率"> {{ data.resa.exchangeRate }} </el-descriptions-item>
      </el-descriptions>
      <!-- sop走量信息 -->
      <el-card header="sop走量信息" m="2">
        <el-table :data="data.resa.motion" border>
          <el-table-column type="index" width="100" label="序号" align="center"/>
          <el-table-column prop="gradient" label="梯度" align="center"/>
          <el-table-column prop="key" label="年份" align="center"/>
          <el-table-column prop="value" label="走量" align="center"/>
        </el-table>
        <el-table :data="data.resa.sops" border>
          <el-table-column type="index" width="100" label="序号" align="center"/>
          <el-table-column prop="year" label="年份" align="center"/>
          <el-table-column prop="annualDeclineRate" label="年降率(%)" align="center"/>
          <el-table-column prop="annualRebateRequirements" label="年度返利要求(%)" align="center"/>
          <el-table-column prop="oneTimeDiscountRate" label="一次性折让(%)" align="center"/>
          <el-table-column prop="commissionRate" label="年度佣金比例(%)" align="center"/>
        </el-table>
      </el-card>
      <!-- 核心部件 -->
      <el-card header="核心部件：" m="2">
        <el-table :data="data.resa.componenSocondModels" border>
          <el-table-column label="方案名称" prop="solutionName" align="center"/>
          <el-table-column label="核心部件" prop="partsName" align="center"/>
          <el-table-column label="型号" prop="model" align="center"/>
          <el-table-column label="类型" prop="type" align="center"/>
          <el-table-column label="备注" prop="remark" align="center"/>
        </el-table>
      </el-card>
      <h3>NRE</h3>
      <el-card v-for="(nre, index) in data.resa.nres" :key="index">
        <p>{{ nre.solutionName }}</p>
        <!-- <p>线体数量：{{ nre.numberLine }} 共线分摊率：：{{ nre.collinearAllocationRate }}</p> -->
        <el-table
          :data="nre.models"
          style="width: 100%"
          border
          height="400px"
          :summary-method="getSummaries"
          show-summary
          align="center"
        >
          <el-table-column type="index" label="序号" align="center"/>
          <el-table-column prop="formName" label="费用名称" align="center"/>
          <el-table-column prop="pricingMoney" label="核价金额" :formatter="formatThousandths" align="center" />
          <el-table-column label="报价系数" prop="offerCoefficient" align="center">
            <!-- <template #default="scope">
              <el-input v-model="scope.row.offerCoefficient" type="number" />
            </template> -->
          </el-table-column>
          <el-table-column prop="offerMoney" label="报价金额" :formatter="formatThousandths" align="center" />
          <el-table-column label="备注" prop="remark" align="center">
            <!-- <template #default="scope">
              <el-input v-model="scope.row.remark" type="textarea" />
            </template> -->
          </el-table-column>
        </el-table>
        <p>专用设备</p>
        <el-table :data="nre.devices" style="width: 100%" border height="250px">
          <el-table-column prop="deviceName" label="设备名称" align="center"/>
          <el-table-column prop="devicePrice" label="设备单价" :formatter="formatThousandths" align="center" />
          <el-table-column prop="number" label="设备数量" align="center" />
          <el-table-column prop="equipmentMoney" label="设备金额" :formatter="formatThousandths" align="center" />
        </el-table>
      </el-card>
      <el-card header="内部核价成本明细：" m="2">
        <el-table :data="data.resa.pricingMessageSecondModels" border align="center">
          <el-table-column label="序号" type="index" width="50" align="center"/>
          <el-table-column label="梯度" prop="gradient" width="100" align="center"/>
          <el-table-column label="方案名称" prop="solutionName" width="180" align="center"/>
          <el-table-column label="BOM成本" align="center">
            <el-table-column label="SOP年成本" prop="bomSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="bomfull" width="100" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column label="生产成本" align="center">
            <el-table-column label="SOP年成本" prop="scSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="scfull" width="100" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column label="良损率、良损成本" align="center">
            <el-table-column label="SOP年成本" prop="lsSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="lsfull" width="100" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column label="运费" align="center">
            <el-table-column label="SOP年成本" prop="yfSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="yffull" width="100" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column label="MOQ分摊成本" align="center">
            <el-table-column label="SOP年成本" prop="moqSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="moqfull" width="100" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column label="质量成本" align="center">
            <el-table-column label="SOP年成本" prop="quSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="qufull" width="100" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column label="分摊成本" align="center">
            <el-table-column label="SOP年成本" prop="ftSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="ftfull" width="100" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column label="总成本" align="center">
            <el-table-column label="SOP年成本" prop="allSop" width="100" :formatter="formatThousandths" />
            <el-table-column label="全生命周期成本" prop="allfull" width="100" :formatter="formatThousandths" />
          </el-table-column>
        </el-table>
      </el-card>
      <el-card header="梯度报价信息：" m="2">
        <el-table :data="data.resa.biddingStrategySecondModelsGradent" border align="right">
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column label="梯度" prop="gradient" width="100" align="center"/>
          <el-table-column label="产品" prop="product" align="center"/>
          <el-table-column label="Sop年成本" prop="sopCost" :formatter="formatThousandths" align="center"/>
          <el-table-column label="全生命周期成本" prop="fullLifeCyclecost" :formatter="formatThousandths" align="center"/>
          <!-- <el-table-column label="价格" prop="price" :formatter="formatThousandths" /> -->
          <el-table-column label="价格" prop="price" align="center">
            <template #default="{ row }">
              <span font-bold>{{ formatThousandths(null, null, row.price) }}</span>
            </template>
          </el-table-column>
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
      <el-card header="实际报价策略：" m="2">
        <el-table :data="data.resa.biddingStrategySecondModelsAct" border align="right">
          <el-table-column type="index"  label="序号" width="50" align="center"/>
          <el-table-column label="梯度" prop="gradient"  width="100" align="center"/>
          <el-table-column label="产品" prop="product" align="center"/>
          <el-table-column label="Sop年成本" prop="sopCost" :formatter="formatThousandths" align="center"/>
          <el-table-column label="全生命周期成本" prop="fullLifeCyclecost" :formatter="formatThousandths" align="center"/>
          <!-- <el-table-column label="毛利率" prop="grossMargin">
            <template #default="{ row }">
              {{ `${row.grossMargin?.toFixed(2) || 0} %` }}
            </template>
          </el-table-column> -->
          <el-table-column label="价格" prop="price" :formatter="formatThousandths" align="center"/>
          <el-table-column label="销售收入" prop="salesRevenue" :formatter="formatThousandths" align="center"/>
          <el-table-column label="销售成本" prop="sellingCost" :formatter="formatThousandths" align="center"/>
          <!-- <el-table-column label="佣金" prop="commission" :formatter="formatThousandths" /> -->
          <!-- <el-table-column label="含佣金毛利率" prop="grossMarginCommission ">
            <template #default="{ row }">
              {{ `${row.grossMarginCommission?.toFixed(2) || 0} %` }}
            </template>
          </el-table-column> -->
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
      <el-card v-for="sample in data.resa.sampleOffer" :key="sample.solutionName">
        <div mb-20px>{{ sample.solutionName }}</div>
        <el-table :data="sample.onlySampleModels" style="width: 100%" border height="500px" align="center">
          <el-table-column prop="name" label="样品阶段" align="center"/>
          <el-table-column prop="pcs" label="需求量（pcs）" align="center"/>
          <el-table-column prop="cost" label="成本" :formatter="formatThousandths" align="center"/>
          <el-table-column prop="unitPrice" label="单价" :formatter="formatThousandths" align="center"/>
          <el-table-column prop="grossMargin" label="毛利率" align="center">
            <template #default="{ row }">
              {{ `${row.grossMargin?.toFixed(2) || 0} %` }}
            </template>
          </el-table-column>
          <el-table-column prop="salesRevenue" label="销售收入" :formatter="formatThousandths" align="center"/>
        </el-table>
      </el-card>
    </el-card>
    <!-- <OperationList /> -->
    <!-- 总经理审批 -->
    <el-row justify="end" style="margin-top: 20px" v-if="data.pageType === 1">
      <el-button type="primary" @click="save" v-havedone>保存</el-button>
    </el-row>
    <el-dialog v-model="dialogVisible" title="3D爆炸图下载(请选择零件)" width="40%" align-center>
      <el-space wrap>
        <div v-for="prop in ProductByAuditFlowId" :key="prop">
          <el-button type="success" plain @click="downLoad3D(prop.id)">{{ prop.product }}</el-button>
        </div>
      </el-space>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
import SORDonwload from "@/components/SORDonwload/index.vue"

import { ElMessageBox, ElMessage } from "element-plus"
import useJump from "@/hook/useJump"
import { useRouter } from "vue-router"

import { ElLoading } from "element-plus"
import { useRoute } from "vue-router"
import { CommonDownloadFile } from "@/api/bom"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"

import { GetPicture3DByAuditFlowId, getProductByAuditFlowId } from "../processImport/service"
import { getSorByAuditFlowId } from "@/components/CustomerSpecificity/service"
import { downloadFile, getAuditFlowVersion } from "../trAudit/service"
import { getDictionaryAndDetail } from "@/api/dictionary"
import {
  GetQuotationList,
  PostAuditQuotationList,
  GetManagerApprovalOfferTwo,
  GetAcceptanceBid,
  GetBidView,
  PostManagerApprovalOfferTwoSave,
  GetQuotationFeedbackManagerApprovalOfferTwo
} from "./service"
import { GeCatalogue, SubmitNode } from "../quoteAnalysis/service"
import getQuery from "@/utils/getQuery"
import { GetPriceEvaluationStartData } from "@/api/processHoursEnter"

const router = useRouter()
const query = useJump()
const route = useRoute()
const { closeSelectedTag, jumpPage } = query

const { auditFlowId, version, productId, right, nodeInstanceId, isQuotation } = getQuery()
const dialogVisible = ref(false)
const ProductByAuditFlowId = ref<any>({})
let versionList = reactive<any[]>([])
let versionChosen: any = null // 选中的版本

let fullscreenLoading = ref(false)

/**
 * 数据部分
 */
const data = reactive<any>({
  pageType: 0, //1 总经理审批 2总经理中标查看 3.财务中标确认
  projectName: "",
  developmentPlan: "",
  userInfo: JSON.parse(window.localStorage.getItem("user") || ""),
  marketingQuotationData: {
    motionMessage: [],
    expensesStatement: []
  },
  motionMessageSop: [],
  isShowBtn: false,
  isdirectSpeed: false,
  sor: {
    sorFileName: "",
    fileId: null
  },
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
          }
        ]
      },
      {
        messageName: "35K/Y",
        sop: [
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
          }
        ],
        devices: [],
        numberLine: 0,
        collinearAllocationRate: 0
      },
      {
        solutionName: "NRE 汇总",
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
            creationTime: "2023-09-13T01:04:19.6242865+08:00",
            creatorUserId: null,
            id: 0
          }
        ],
        devices: [],
        numberLine: 0,
        collinearAllocationRate: 0
      }
    ],
    sampleOffer: [
      {
        solutionName: "AR0820",
        auditFlowId: 0,
        solutionId: 0,
        onlySampleModels: [
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_A",
            pcs: 200,
            cost: 1866.5904956533819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-13T01:04:22.8913946+08:00",
            creatorUserId: null,
            id: 0
          }
        ]
      }
    ],
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
  targetUrl: null,
  success: true,
  error: null,
  unAuthorizedRequest: false,
  __abp: true
})

const handleSubmit = async ({ comment, opinion, nodeInstanceId }: any) => {
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
const selectVersion = async (row: any) => {
  fullscreenLoading.value = true
  versionChosen = row
  try {
    /**
     * 根据版本号查询该版本数据
     */
    if (data.pageType === 2) {
      // 总经理中标查看
      const { result } = await GetBidView({ auditFlowId, version: row.version })
      data.resa = result
    } else if (data.pageType === 3) {
      // 财务中标确认
      const { result } = await GetAcceptanceBid({ auditFlowId, version: row.version })
      data.resa = result
    }
    fullscreenLoading.value = false
  } catch (error) {
    fullscreenLoading.value = false
  }
}
const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (Number(cellValue) && typeof Number(cellValue).toFixed === "function") {
    return (Number(cellValue).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return cellValue
  }
  // return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}
onBeforeMount(() => {
  if (data.userInfo.userJobs === "总经理") {
    data.isShowBtn = true
  }
  let userRole = data.userInfo.userRole.items.map((item: any) => item.name)
  if (userRole.includes("财务部-财务参数录入员")) {
    data.isShowBtn = true
  }
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  console.log(route.path)
  if (route.path === "/marketingQuotation/indexSecond") {
    data.pageType = 1 // 正常的总经理审批页面 从总经理审批1跳转过来 需要带上当前版本号
  } else if (route.path === "/marketingQuotation/confirmWinningBid") {
    data.pageType = 2 // 总经理审查看中标确认 无需操作，可以选择版本
  } else if (route.path === "/marketingQuotation/bidWinningConfirmation") {
    data.pageType = 3 // 财务中标确认
  }
  initFetch()
  await GetPriceEvaluationStartData({ auditFlowId: auditFlowId }).then((res: any) => {
    console.log("项目走量数据", res)
    if (res.success) {
      let arr = ["EvalReason_Shj", "EvalReason_Qtsclc", "EvalReason_Bnnj"]
      if (arr.includes(res.result.opinion)) {
        //快速核价流程
        data.isdirectSpeed = true
      }
    } else {
      ElMessage({
        type: "warning",
        message: "数据加载失败!"
      })
      return
    }
  })
})
const jumpToAnalysis = () => {
  jumpPage("/quoteAnalysis/index", {
    auditFlowId,
    productId,
    right,
    nodeInstanceId
  })
}
const jumpToElec = () => {
  jumpPage("/bomVerify/electronic", {
    auditFlowId,
    right: 1,
    productId,
    nodeInstanceId
  })
}
const jumpToStru = () => {
  jumpPage("/bomVerify/construction", {
    auditFlowId,
    right: 1
  })
}
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
        sums[index] = (Number(sums[index]).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
      } else {
        sums[index] = "N/A"
      }
    }
  })

  return sums
}
const typeMap = reactive<any>({
  customerNatureOptions: [],
  terminalNatureOptions: [],
  salesTypeOptions: [],
  TradeMethodOptions: []
})

const typeMapGetText = (key: any, id: any) => {
  let text = ""
  typeMap[key].forEach((item: any) => {
    if (item.id === id) {
      text = item.displayName
    }
  })
  return text
}
const initFetch = async () => {
  if (auditFlowId) {
    // 获取版本数据，只有在中标查看 和 确认里面才会显示
    let res: any = await GeCatalogue({ auditFlowId })
    res.result.forEach((item: any) => {
      /**
       * 总经理2看的数据
       */
      if (data.pageType === 1 && !item.isFirst) {
        versionList.push(item)
      }
      /**
       * 确认中标查看的
       */
      if (data.pageType === 3 && item.isQuotation) {
        versionList.push(item)
      }
    })
    let customerNature: any = await getDictionaryAndDetail("CustomerNature") //客户性质
    typeMap.customerNatureOptions = customerNature.result.financeDictionaryDetailList

    let terminalNature: any = await getDictionaryAndDetail("TerminalNature") //终端性质
    typeMap.terminalNatureOptions = terminalNature.result.financeDictionaryDetailList

    let salesType: any = await getDictionaryAndDetail("SalesType") //销售类型
    typeMap.salesTypeOptions = salesType.result.financeDictionaryDetailList

    let tradeMethodType: any = await getDictionaryAndDetail("TradeMethod") //贸易方式
    typeMap.TradeMethodOptions = tradeMethodType.result.financeDictionaryDetailList

    if (data.pageType === 1 && version && isQuotation === "true") {
      const loading = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.7)"
      })
      try {
        //version 是从总经理审批1带过来的参数
        const { result } = await GetQuotationFeedbackManagerApprovalOfferTwo({ auditFlowId, version: version })
        data.resa = result
        loading.close()
      } catch (error) {
        loading.close()
      }
    }
    if (data.pageType === 1 && version && isQuotation === "false") {
      const loading = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.7)"
      })
      try {
        //version 是从总经理审批1带过来的参数

        const { result } = await GetManagerApprovalOfferTwo({ auditFlowId, version: version })
        data.resa = result
        loading.close()
      } catch (error) {
        loading.close()
      }
    }
  }
}
const toProductPriceList = () => {
  router.push({
    path: "/dashboard/index",
    query: {
      auditFlowId,
      productId,
      right,
      nodeInstanceId,
      showBtn: "false"
    }
  })
}

// SOR下载
const downLoadSOR = async () => {
  const { result }: any = (await getSorByAuditFlowId(auditFlowId)) || {}
  if (!result.sorFileName) return false
  let res: any = await CommonDownloadFile(result.sorFileId)
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = result.sorFileName
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}

// TR主方案下载
const downTrFile = async () => {
  let res: any = await getAuditFlowVersion(Number(auditFlowId))
  const trFileId = res.result.solutionFileIdentifier
  const solutionFileName = res.result.solutionFileName
  if (trFileId) {
    try {
      let res: any = await downloadFile(trFileId)
      const blob = res
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        let url = URL.createObjectURL(new Blob([blob]))
        let a = document.createElement("a")
        document.body.appendChild(a) //此处增加了将创建的添加到body当中
        a.href = url
        a.download = solutionFileName
        a.target = "_blank"
        a.click()
        a.remove() //将a标签移除
      }
    } catch (err) {
      console.log(err, "downLoadError")
    }
  }
}

// 3D爆炸图下载
const downLoad3DExploded = async () => {
  const { result }: any = await getProductByAuditFlowId(auditFlowId)
  ProductByAuditFlowId.value = result
  dialogVisible.value = true
}

const downLoad3D = async (productId: any) => {
  let downRes: any = await GetPicture3DByAuditFlowId(auditFlowId, productId)
  if (!downRes.result.threeDFileId) return false
  let res: any = await CommonDownloadFile(downRes.result.threeDFileId)
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = downRes.result.threeDFileName
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
  dialogVisible.value = false
}

// nre 合计
const calculationNre = (key: string) => {
  const count = data.marketingQuotationData.expensesStatement.map((item: any) => item[key]) || []
  if (!count.length) return 0
  const total = count.reduce((a: number, b: number) => a + b)
  return formatThousandths(null, null, total)
}

const toNREPriceList = () => {
  router.push({
    path: "/nre/nrePricelist",
    query: {
      auditFlowId,
      hideBtn: 1
    }
  })
}

/**
 * 总经理审批2保存
 */
const save = async () => {
  let res = await PostManagerApprovalOfferTwoSave({ ...data.resa, auditFlowId, version }) //保存舍弃
  if (res.success) {
    ElMessage.success("操作成功")
  }
}
/**
 * 财务中标确认
 */
const cwSave = async (isQuotation: boolean) => {
  let res = await PostAuditQuotationList({ ...data.resa, auditFlowId, version: versionChosen.version, isQuotation })
  console.log(res)
}
watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
</style>
