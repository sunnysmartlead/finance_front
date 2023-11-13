<template>
  <!-- 营销部审批 -->
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
      <div v-for="item in data.resa.motionMessage" :key="item.messageName">
        <p>{{ item.messageName }}</p>
        <el-table :data="item.yearValues" border>
          <el-table-column type="index" width="100" />
          <el-table-column prop="key" label="年份" />
          <el-table-column prop="value" />
          <!-- <el-table-column prop="sopValue" label="sop" />
          <el-table-column prop="fullValue" /> -->
        </el-table>
      </div>
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
        <el-table-column label="型号" prop="model" />
        <el-table-column label="核心部件" prop="partsName" />
        <el-table-column label="方案名" prop="solutionName" />
        <!-- <el-table-column label="型号" prop="model" /> -->
        <el-table-column label="类型" prop="type" />
        <el-table-column label="备注" prop="remark" />
      </el-table>
    </el-card>
    <!-- nre -->
    <h3>NRE</h3>
    <el-card v-for="(nre, index) in data.resa.nres" :key="index">
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
    </el-card>
    <el-card header="内部核价信息：" m="2">
      <el-table :data="data.resa.pricingMessageSecondModels" border>
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="方案名称" prop="solutionName" width="180" />
        <el-table-column label="费用类别" prop="name" width="100" />
        <el-table-column label="方案名称" prop="allSop" width="100" />
        <el-table-column label="费用类别" prop="allfull" width="100" />
        <el-table-column label="方案名称" prop="bomSop" width="100" />
        <el-table-column label="费用类别" prop="bomfull" width="100" />
        <el-table-column label="方案名称" prop="ftSop" width="100" />
        <el-table-column label="费用类别" prop="ftfull" width="100" />
        <el-table-column label="梯度" prop="gradient" width="100" />
        <el-table-column label="费用类别" prop="lsSop" width="100" />
        <el-table-column label="方案名称" prop="lsfull" width="100" />
        <el-table-column label="费用类别" prop="moqSop" width="100" />
        <el-table-column label="方案名称" prop="moqfull" width="100" />
        <el-table-column label="费用类别" prop="quSop" width="100" />
        <el-table-column label="梯度" prop="qufull" width="100" />
        <el-table-column label="费用类别" prop="scSop" width="100" />
        <el-table-column label="方案名称" prop="scfull" width="100" />
        <el-table-column label="费用类别" prop="yfSop" width="100" />
        <el-table-column label="方案名称" prop="yffull" width="100" />
      </el-table>
      <!-- <template v-for="item in data.resa.pricingMessage" :key="item.messageName">
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
      </template> -->
    </el-card>
    <el-card header="报价策略：" m="2">
      <el-table :data="data.resa.biddingStrategySecondModels" border>
        <el-table-column type="index" width="100" />
        <el-table-column label="产品" prop="product" />
        <el-table-column label="Sop年成本" prop="sopCost" :formatter="formatThousandths" />
        <el-table-column label="全生命周期成本" prop="fullLifeCyclecost" :formatter="formatThousandths" />
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
        <el-table-column label="价格" prop="price" :formatter="formatThousandths" />
        <el-table-column label="佣金" prop="commission" :formatter="formatThousandths" width="180">
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
      <div mb-20px>{{ sample.solutionName }}</div>
      <el-table :data="sample.onlySampleModels" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="样品阶段" />
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
// import { GetQuotationList } from "../marketingQuotation/service"
import getQuery from "@/utils/getQuery"
import { getYears } from "../pmDepartment/service"
// import { PostAuditQuotationListSave } from "./service"
import { getQuotationApprovedMarketing } from "./service"
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
      },
      {
        messageName: "35K/Y",
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
            creationTime: "2023-09-13T01:04:19.624287+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242871+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242872+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242874+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242878+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242879+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242881+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242882+08:00",
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
            creationTime: "2023-09-13T01:04:19.6242885+08:00",
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
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1866.5904956533819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-13T01:04:22.8919079+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1866.5904956533819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-13T01:04:22.8919094+08:00",
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
        solutionName: "AR0820",
        solutionId: 115,
        name: "BOM成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "制造成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "损耗成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "物流成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "MOQ分摊成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "质量成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "其他成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "总成本",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      },
      {
        solutionName: "AR0820",
        solutionId: 115,
        name: "备注",
        sops: [
          {
            gradientValue: 25,
            sop: 12,
            all: 24
          },
          {
            gradientValue: 35,
            sop: 12,
            all: 24
          }
        ]
      }
    ],
    biddingStrategySecondModels: [
      {
        gradientId: 202,
        gradient: "25K/Y",
        productId: 0,
        product: "前视-AR0820",
        sopCost: 1,
        fullLifeCyclecost: 2,
        salesRevenue: 0,
        sellingCost: 0,
        grossMargin: 0,
        price: 1,
        commission: 0,
        sopGrossMargin: 23,
        grossMarginCommission: 0,
        totallifeCyclegrossMargin: 12,
        clientGrossMargin: 23,
        nreGrossMargin: 10
      },
      {
        gradientId: 203,
        gradient: "35K/Y",
        productId: 0,
        product: "前视-AR0820",
        sopCost: 1,
        fullLifeCyclecost: 2,
        salesRevenue: 0,
        sellingCost: 0,
        grossMargin: 0,
        price: 1,
        commission: 0,
        sopGrossMargin: 23,
        grossMarginCommission: 0,
        totallifeCyclegrossMargin: 12,
        clientGrossMargin: 23,
        nreGrossMargin: 10
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
    const { result } = await getQuotationApprovedMarketing({ auditFlowId, version: 0 })
    data.resa = result
  }
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
  // const { success }: any =
  //   (await PostAuditQuotationListSave({
  //     auditFlowId,
  //     ...data.resa
  //   })) || {}
  // if (success) ElMessage.success("保存成功！")
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
</style>
