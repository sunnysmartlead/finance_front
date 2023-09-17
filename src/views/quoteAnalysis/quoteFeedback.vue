<!-- eslint-disable prettier/prettier -->
<!-- 报价反馈 -->
<template>
  <div>
    <div>
      <el-button type="primary" @click="downLoad" style="margin-left: 10px">成本信息表下载</el-button>
    </div>
   <!-- nre -->
   <h3>NRE</h3>
    <el-card v-for="(nre, index) in data.allRes.nres" :key="index">
      <p>{{ nre.solutionName }}</p>
      <p>线体数量：{{ nre.numberLine }} 共线分摊率：：{{ nre.collinearAllocationRate }}</p>
      <el-table :data="nre.models" style="width: 100%" border height="400px" :summary-method="getSummaries" show-summary>
        <el-table-column label="序号" type="index" />
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
    <!-- 样品 -->
    <h3>样品报价</h3>
    <el-card v-for="sample in data.allRes.sampleOffer" :key="sample.solutionName">
      <p>{{ sample.solutionName }}</p>
      <el-table :data="sample.onlySampleModels" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="样品阶段" />
        <el-table-column prop="pcs" label="需求量（pcs）" />
        <el-table-column prop="cost" label="成本" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="grossMargin" label="毛利率" />
        <el-table-column prop="salesRevenue" label="销售收入" />
      </el-table>
    </el-card>
    <!-- sop -->
    <h3>单价表（sop年）</h3>
    <el-table :data="data.allRes.sops" style="width: 100%" border height="500px">
      <el-table-column prop="gradientValue" label="梯度" />
      <el-table-column prop="product" label="产品" />
      <el-table-column :label="item.gross" v-for="(item, index) in data.allRes.sops[0].grossValues" :key="item.gross">
        <template #default="scope">
          <el-input v-model="scope.row.grossValues[index].grossvalue" type="number" />
        </template>
      </el-table-column>
    </el-table>
    <p>项目全生命周期汇总分析表-实际数量</p>
    <el-table :data="data.allRes.fullLifeCycle" style="width: 100%" border height="500px">
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column :label="item.grossMargin" v-for="(item, index) in data.allRes.fullLifeCycle[0].grossMarginList"
        :key="index">
        <template #default="scope">
          <el-input v-model="scope.row.grossMarginList[index].grossMarginNumber" type="number" />
        </template>
      </el-table-column>
    </el-table>
    <p>报价毛利率测算-阶梯数量</p>
    <el-row justify="end" m="2">
      <el-button @click="openDialog(null)" type="primary">年份维度对比</el-button>
    </el-row>
    <el-card class="card">
      <el-table :data="data.allRes.gradientQuotedGrossMargins" border>
        <el-table-column label="梯度" prop="gradient" />
        <el-table-column label="产品" prop="product" />
        <el-table-column label="单车产品数量" prop="amount" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率" prop="quotedGrossMarginSimple.interior.grossMargin">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.client.price">
            <template #default="scope">
              <el-input v-model="scope.row.quotedGrossMarginSimple.client.price">
                <!-- <template #append>
                  <el-button @click="
                    calculateFullGrossMargin(
                      scope.row,
                      scope.$index,
                      'clientTargetUnitPrice',
                      'clientTargetGrossMargin'
                    )
                    ">计算</el-button>
                </template> -->
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="quotedGrossMarginSimple.client.grossMargin">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.client.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.client.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.client.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价">
            <template #default="scope">
              <el-input v-model="scope.row.quotedGrossMarginSimple.thisQuotation.price">
                <template #append>
                  <el-button>计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.thisQuotation.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row)" type="primary">年份维度对比</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="card" v-for="(item, index) in data.allRes.quotedGrossMargins" :key="index">
      <p>{{ item.project }}</p>
      <el-row justify="end" m="2">
        <el-button @click="openDialog(null)" type="primary">年份维度对比</el-button>
      </el-row>
      <el-table :data="item.grossMargins" border>
        <el-table-column label="产品" prop="product" />
        <el-table-column label="单车产品数量" prop="amount" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.client.price">
            <template #default="scope">
              <el-input v-model="scope.row.quotedGrossMarginSimple.client.price">
                <!-- <template #append>
                  <el-button @click="
                    calculateFullGrossMargin(
                      scope.row,
                      scope.$index,
                      'clientTargetUnitPrice',
                      'clientTargetGrossMargin'
                    )
                    ">计算</el-button>
                </template> -->
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.client.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价">
            <template #default="scope">
              <el-input v-model="scope.row.quotedGrossMarginSimple.thisQuotation.price">
                <template #append>
                  <el-button @click="calculateFullGrossMargin(
                    scope.row,
                    scope.$index
                  )">计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.thisQuotation.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row)" type="primary">年份维度对比</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- <el-table-column :label="'第' + (index + 1) + '轮'"
          v-for="(item, index) in table.quotedGrossMarginSimple.length > 0 ? table.quotedGrossMarginSimple[0].oldOffer : []" :key="index"
          width="300"
        >
          <el-table-column label="单价" :prop="`oldOffer[${index}].unitPrice`" :formatter="formatThousandths">
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              <div>{{ `${row.oldOffer[index].grossMargin.toFixed(2)} %` }}</div>
            </template>
          </el-table-column>
        </el-table-column> -->
    <!-- <el-card class="card">
      <div v-for="(table, index) in data.allRes.gradientGrossMarginModels" :key="index">
        <p>{{ table.gradient }}</p>
        <el-table :data="table._itemGrossMarginModels" border>
          <el-table-column label="产品" prop="item" />
          <el-table-column label="目标价（内部）" width="300" prop="interior" />
          <el-table-column label="目标价（客户）" prop="client" />
          <el-table-column label="本次报价" prop="thisQuotation" />
          <el-table-column label="上轮报价" prop="lastRound" />
        </el-table>
      </div>
    </el-card> -->
    <el-card class="card">
      <div v-for="(value, key) in gradientTableMap" :key="key">
        <p>{{ key }}</p>
        <el-table :data="value" border>
          <el-table-column label="产品" prop="product" />
          <el-table-column label="目标价（内部）" width="300" prop="quotedGrossMarginSimple.interior.price" />
          <el-table-column label="目标价（客户）" prop="quotedGrossMarginSimple.client.price" />
          <el-table-column label="本次报价" prop="quotedGrossMarginSimple.thisQuotation.price" />
          <el-table-column label="上轮报价" prop="quotedGrossMarginSimple.astRound.price" />
        </el-table>
        <div :id="'unitpriceChart' + key" class="h-400px" />
        <div :id="'revenueGrossMarginChart' + key" class="h-400px" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import debounce from "lodash/debounce"
import getQuery from "@/utils/getQuery"
import { calculateRate, getQuotationFeedback } from "./service"
/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
let { auditFlowId, productId } = getQuery()
const data = reactive({
  //仅含样品
  sampleOnlyRes: {
    nre: null,
    unitPrice: null,
    sampleOffer: [
      {
        onlySampleModels: [
          {
            sampleName: "SampleName_C",
            pcs: 200,
            cost: 0,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0
          }
        ],
        solutionName: "样品报价-前是有一"
      }
    ],
    isSuccess: true,
    message: "调用成功"
  },
  allRes: {
    auditFlowId: 0,
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
            creationTime: "2023-09-14T02:31:51.5387967+08:00",
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
            creationTime: "2023-09-14T02:31:51.5390596+08:00",
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
            creationTime: "2023-09-14T02:31:51.539061+08:00",
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
            creationTime: "2023-09-14T02:31:51.5390614+08:00",
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
            creationTime: "2023-09-14T02:31:51.5390617+08:00",
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
            creationTime: "2023-09-14T02:31:51.539063+08:00",
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
            creationTime: "2023-09-14T02:31:51.5390632+08:00",
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
            creationTime: "2023-09-14T02:31:51.5390636+08:00",
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
            creationTime: "2023-09-14T02:31:51.5390639+08:00",
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
            creationTime: "2023-09-14T02:31:51.5390646+08:00",
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
            creationTime: "2023-09-14T02:31:51.5392987+08:00",
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
            creationTime: "2023-09-14T02:31:51.5392998+08:00",
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
            creationTime: "2023-09-14T02:31:51.5393+08:00",
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
            creationTime: "2023-09-14T02:31:51.5393002+08:00",
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
            creationTime: "2023-09-14T02:31:51.539303+08:00",
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
            creationTime: "2023-09-14T02:31:51.5393038+08:00",
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
            creationTime: "2023-09-14T02:31:51.5393039+08:00",
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
            creationTime: "2023-09-14T02:31:51.5393041+08:00",
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
            creationTime: "2023-09-14T02:31:51.5393043+08:00",
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
            creationTime: "2023-09-14T02:31:51.5393047+08:00",
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
            creationTime: "2023-09-14T02:31:38.380174+08:00",
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
            creationTime: "2023-09-14T02:31:38.3801782+08:00",
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
            creationTime: "2023-09-14T02:31:38.3801784+08:00",
            creatorUserId: null,
            id: 0
          }
        ]
      }
    ],
    sops: [
      {
        gradientValue: "25K/Y",
        product: "AR0820",
        grossValues: [
          {
            gross: "5",
            grossvalue: 1964.8321006877703
          },
          {
            gross: "6",
            grossvalue: 1985.734569844023
          },
          {
            gross: "8",
            grossvalue: 2028.9027126667193
          },
          {
            gross: "10",
            grossvalue: 2073.989439614869
          },
          {
            gross: "12",
            grossvalue: 2121.125563242479
          },
          {
            gross: "14",
            grossvalue: 2170.4540647132346
          },
          {
            gross: "16",
            grossvalue: 2222.131542444502
          },
          {
            gross: "18",
            grossvalue: 2276.3298727480266
          },
          {
            gross: "20",
            grossvalue: 2333.238119566727
          },
          {
            gross: "22",
            grossvalue: 2393.0647380171565
          },
          {
            gross: "24",
            grossvalue: 2456.040125859713
          }
        ]
      },
      {
        gradientValue: "35K/Y",
        product: "AR0820",
        grossValues: [
          {
            gross: "5",
            grossvalue: 1964.8321006877703
          },
          {
            gross: "6",
            grossvalue: 1985.734569844023
          },
          {
            gross: "8",
            grossvalue: 2028.9027126667193
          },
          {
            gross: "10",
            grossvalue: 2073.989439614869
          },
          {
            gross: "12",
            grossvalue: 2121.125563242479
          },
          {
            gross: "14",
            grossvalue: 2170.4540647132346
          },
          {
            gross: "16",
            grossvalue: 2222.131542444502
          },
          {
            gross: "18",
            grossvalue: 2276.3298727480266
          },
          {
            gross: "20",
            grossvalue: 2333.238119566727
          },
          {
            gross: "22",
            grossvalue: 2393.0647380171565
          },
          {
            gross: "24",
            grossvalue: 2456.040125859713
          }
        ]
      }
    ],
    quotedGrossMargins: [
      {
        project: "报价毛利率测算-实际数量-X01",
        grossMargins: [
          {
            proudct: "AR0820",
            productNumber: 1,
            quotedGrossMarginSimple: {
              interior: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 20
              },
              client: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 25
              },
              thisQuotation: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 24,
                nreGrossMargin: 25
              },
              lastRound: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 21,
                nreGrossMargin: 25
              }
            }
          }
        ]
      },
      {
        project: "报价毛利率测算-实际数量-X01",
        grossMargins: [
          {
            proudct: "AR0820",
            productNumber: 1,
            quotedGrossMarginSimple: {
              interior: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 20
              },
              client: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 25
              },
              thisQuotation: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 24,
                nreGrossMargin: 25
              },
              lastRound: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 21,
                nreGrossMargin: 25
              }
            }
          }
        ]
      },
      {
        project: "报价毛利率测算-实际数量-X02",
        grossMargins: [
          {
            proudct: "AR0820",
            productNumber: 2,
            quotedGrossMarginSimple: {
              interior: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 20
              },
              client: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 25
              },
              thisQuotation: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 24,
                nreGrossMargin: 25
              },
              lastRound: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 21,
                nreGrossMargin: 25
              }
            }
          }
        ]
      },
      {
        project: "报价毛利率测算-实际数量-X03",
        grossMargins: [
          {
            proudct: "AR0820",
            productNumber: 2,
            quotedGrossMarginSimple: {
              interior: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 20
              },
              client: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 22,
                nreGrossMargin: 25
              },
              thisQuotation: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 24,
                nreGrossMargin: 25
              },
              lastRound: {
                price: 1,
                grossMargin: 20,
                clientGrossMargin: 21,
                nreGrossMargin: 25
              }
            }
          }
        ]
      }
    ],
    gradientQuotedGrossMargins: [
      {
        gradient: "25K/Y",
        proudct: "AR0820",
        quotedGrossMarginSimple: {
          interior: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 22,
            nreGrossMargin: 20
          },
          client: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 22,
            nreGrossMargin: 25
          },
          thisQuotation: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 24,
            nreGrossMargin: 25
          },
          lastRound: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 21,
            nreGrossMargin: 25
          }
        }
      },
      {
        gradient: "35K/Y",
        proudct: "AR0820",
        quotedGrossMarginSimple: {
          interior: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 22,
            nreGrossMargin: 20
          },
          client: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 22,
            nreGrossMargin: 25
          },
          thisQuotation: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 24,
            nreGrossMargin: 25
          },
          lastRound: {
            price: 730,
            grossMargin: 20,
            clientGrossMargin: 21,
            nreGrossMargin: 25
          }
        }
      }
    ],
    fullLifeCycle: [
      {
        projectName: "数量",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 4.21
          },
          {
            grossMargin: 6,
            grossMarginNumber: 4.26
          },
          {
            grossMargin: 8,
            grossMarginNumber: 4.35
          },
          {
            grossMargin: 10,
            grossMarginNumber: 4.44
          },
          {
            grossMargin: 12,
            grossMarginNumber: 4.55
          },
          {
            grossMargin: 14,
            grossMarginNumber: 4.65
          },
          {
            grossMargin: 16,
            grossMarginNumber: 4.76
          },
          {
            grossMargin: 18,
            grossMarginNumber: 4.88
          },
          {
            grossMargin: 20,
            grossMarginNumber: 5
          },
          {
            grossMargin: 22,
            grossMarginNumber: 5.13
          },
          {
            grossMargin: 24,
            grossMarginNumber: 5.26
          }
        ]
      },
      {
        projectName: "销售成本",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0
          }
        ]
      },
      {
        projectName: "单位平均成本",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0
          }
        ]
      },
      {
        projectName: "返利后销售收入",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0
          }
        ]
      },
      {
        projectName: "平均单价",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0
          }
        ]
      },
      {
        projectName: "销售毛利",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0
          }
        ]
      },
      {
        projectName: "毛利率",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0
          }
        ]
      }
    ],
    gradientGrossMarginModels: null
  }
})

// 过滤相同梯度的数据
interface stringKeyObj {
  [propName: string]: any
}
const gradientTableMap = computed(() => {
  let gradientTableMap: stringKeyObj = {}
  data.allRes.gradientQuotedGrossMargins.forEach((item) => {
    if (!gradientTableMap[item.gradient]) {
      gradientTableMap[item.gradient] = []
    }
    gradientTableMap[item.gradient].push(item)
  })
  setChartData(gradientTableMap)
  return gradientTableMap
})
const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (typeof cellValue === "number") {
    return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}
// 报价分析看板 单价计算
const openDialog = async (row: any) => {
  // let productBoards: any = []
  // if (!row) {
  //   productBoards = data.productBoard.map((item: any) => {
  //     console.log(item, "123123")
  //     return {
  //       modelCountId: item.modelCountId,
  //       unitPrice: item.offerUnitPrice
  //     }
  //   })
  // } else {
  //   productBoards = [
  //     {
  //       modelCountId: row.modelCountId,
  //       unitPrice: row.offerUnitPrice
  //     }
  //   ]
  // }
  // console.log(productBoards, "data.productBoard")
  // const { result } = await PostYearDimensionalityComparison({
  //   auditFlowId: data.auditFlowId,
  //   grossMargin: 0,
  //   productBoards
  // })
  // console.log(result, "res")
  // data.dialogTable = result
  // dialogVisible.value = true
}
const getSummaries = (param: { columns: any; data: any }) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column: { property: string | number }, index: number) => {
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
// 设置图表
const setChartData = (gradientTableMap: any) => {
  let ProjectUnitPrice: stringKeyObj = {}
  let RevenueGrossMargin: stringKeyObj = {}
  let keys = Object.keys(gradientTableMap)
  keys.forEach((key) => {
    ProjectUnitPrice[key] = {
      title: {
        text: "项目单价对比"
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          // Use axis to trigger tooltip
          type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: ["目标价（内部）", "目标价（客户）", "本次报价"]
      },
      yAxis: [
        {
          type: "value",
          name: "单价",
          min: 0,
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        {
          type: "value",
          name: "毛利率",
          min: 0,
          axisLabel: {
            formatter: "{value}%"
          }
        }
      ],
      series: []
    }
    ProjectUnitPrice[key].xAxis.data = ["目标价（内部）", "目标价（客户）", "本次报价"]
    ProjectUnitPrice[key].series = gradientTableMap[key].map((item: any) => {
      return {
        name: item.product,
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: [
          item.quotedGrossMarginSimple.interior.price,
          item.quotedGrossMarginSimple.client.price,
          item.quotedGrossMarginSimple.thisQuotation.price
        ]
      }
    })
    ProjectUnitPrice[key].series.push({
      yAxisIndex: 1,
      name: "整体毛利率",
      type: "line",
      tooltip: {
        formatter: "{a}{b}{c}%"
      },
      // 临时造的数据没有看到该字段
      data: [Number(111).toFixed(2), Number(2222).toFixed(2), Number(2222).toFixed(2) || 0]
    })
    RevenueGrossMargin[key] = {
      title: {
        text: "收入和毛利率对比"
      },
      xAxis: {
        type: "category",
        data: ["目标价(内部)", "目标价(客户)", "本次报价"]
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          // Use axis to trigger tooltip
          type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {},
      yAxis: [
        {
          type: "value",
          name: "收入",
          min: 0,
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        {
          type: "value",
          name: "毛利率",
          min: 0,
          axisLabel: {
            formatter: "{value}%"
          }
        }
      ],
      series: [
        // {
        //   data: [120, 200, 150],
        //   type: "bar",
        //   name: "OV方案销售收入"
        // },
        // {
        //   data: [0, 0.05, 0.1],
        //   type: "line",
        //   name: "OV方案毛利率",
        //   yAxisIndex: 1
        // }
      ]
    }
    let RevenueGrossMarginSeries = [] as any[]
    gradientTableMap[key].forEach((item: any) => {
      if (item.product === "销售收入") {
        let RevenueGrossMarginData = {
          name: item.product,
          type: "bar",
          stack: "total",
          label: {
            show: true
          },
          emphasis: {
            focus: "series"
          },
          data: [item.quotedGrossMarginSimple.interior.price, item.quotedGrossMarginSimple.client.price]
        }
        if (item.quotedGrossMarginSimple.thisQuotation.price) {
          RevenueGrossMarginData.data.push(item.quotedGrossMarginSimple.thisQuotation.price)
        }
        RevenueGrossMarginSeries.push(RevenueGrossMarginData)
      }
      if (item.product === "毛利率") {
        let RevenueGrossMarginDataY = {
          yAxisIndex: 1,
          name: "毛利率",
          type: "line",
          tooltip: {
            formatter: "{a}{b}{c}%"
          },
          data: [item.quotedGrossMarginSimple.interior.grossMargin, item.quotedGrossMarginSimple.client.grossMargin]
        }
        if (item.quotedGrossMarginSimple.thisQuotation.grossMargin) {
          //这里计算只有grossMarginNumber
          RevenueGrossMarginDataY.data.push(item.quotedGrossMarginSimple.thisQuotation.grossMargin)
        }
        RevenueGrossMarginSeries.push(RevenueGrossMarginDataY)
      }
      RevenueGrossMarginSeries.push({
        yAxisIndex: 1,
        name: "整体毛利率",
        type: "line",
        tooltip: {
          formatter: "{a}{b}{c}%"
        },
        data: [Number(1111).toFixed(2), Number(1111).toFixed(2), Number(2222).toFixed(2) || 0]
      })
    })
    RevenueGrossMargin[key].series = RevenueGrossMarginSeries
    setTimeout(() => {
      initCharts("unitpriceChart" + key, ProjectUnitPrice[key])
      console.log(ProjectUnitPrice[key])
      console.log(RevenueGrossMarginSeries)
      initCharts("revenueGrossMarginChart" + key, RevenueGrossMargin[key])
    }, 500)
  })
}
const initCharts = (id: string, chartOption: any) => {
  // 基于准备好的dom，初始化echarts实例
  let chartEl: HTMLElement | null = document.getElementById(id)
  if (chartEl) {
    var chart = echarts.init(chartEl)
    // 绘制图表
    chart.setOption(chartOption)
    return chart
  }
}
const postOffer = (isOffer: number) => {
  console.log(isOffer)
}

const downLoad = async () => {
  console.log("downLoad")
}
// 计算
const calculateFullGrossMargin = async (row: any, index: any) => {
  let { auditFlowId, gradientId, productId, solutionId } = row
  let res = await calculateRate({ auditFlowId, gradientId, productId, solutionId })
  console.log(res, index)
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  if (auditFlowId) {
    let res = await getQuotationFeedback(auditFlowId)
    console.log(res)
  }
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
