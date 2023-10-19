<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <el-card mb-20px>
      <p>请选择报价方案组合：</p>
      <el-button type="primary" @click="addNewPlan" mb-20px float-right>新增方案</el-button>
      <el-table :data="planList" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="报价模组">
          <template #default="scope">
            <el-select clearable v-model="scope.row.value">
              <el-option
                v-for="item in productStore.productList"
                :label="item.product"
                :value="item.id"
                :key="item.id"
                :disabled="hasSelectPlans.includes(item.id)"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否报价">
          <template #default="scope">
            <el-select clearable v-model="scope.row.isOffer">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="deletePlan(scope.$index)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" my-20px float-right v-loading.fullscreen.lock="fullscreenLoading" @click="comfirmPlans"
        >确定</el-button
      >
    </el-card>
    <el-button type="primary" @click="downLoad">成本信息表下载</el-button>
    <el-button-group style="float: right">
      <el-button type="primary" @click="postOffer(1)" v-havedone>报价</el-button>
      <el-button type="primary" @click="postOffer(0)" v-havedone>不报价</el-button>
    </el-button-group>
    <!-- nre -->
    <h3>NRE</h3>
    <el-card v-for="(nre, index) in data.allRes.nres" :key="index">
      <p>{{ nre.solutionName }}</p>
      <p>线体数量：{{ nre.numberLine }} 共线分摊率：：{{ nre.collinearAllocationRate }}</p>
      <el-table
        :data="nre.models"
        style="width: 100%"
        border
        max-height="400px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="序号" type="index" />
        <el-table-column prop="formName" label="费用名称" />
        <el-table-column prop="pricingMoney" label="核价金额" :formatter="formatThousandths" />
        <el-table-column label="报价系数">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.offerCoefficient"
              controls-position="right"
              @change="offerCoefficientChange(scope.row)"
              :precision="2"
              :min="0"
            />
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
      <el-table :data="nre.devices" style="width: 100%" border max-height="250px">
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
      <el-table :data="sample.onlySampleModels" style="width: 100%" border max-height="500px">
        <el-table-column prop="name" label="样品阶段" />
        <el-table-column prop="pcs" label="需求量（pcs）">
          <template #default="scope">
            <el-input v-model="scope.row.pcs" type="number" @change="pcsChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本" :formatter="toFixedTwo" />
        <el-table-column prop="unitPrice" label="单价">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.unitPrice"
              controls-position="right"
              @change="unitPriceChange(scope.row)"
              :precision="2"
            />
          </template>
        </el-table-column>
        <el-table-column prop="grossMargin" label="毛利率" />
        <el-table-column prop="salesRevenue" label="销售收入" />
      </el-table>
    </el-card>
    <!-- sop -->
    <h3>单价表（sop年）</h3>
    <el-table :data="data.allRes.sops" style="width: 100%" border max-height="500px">
      <el-table-column prop="gradientValue" label="梯度" />
      <el-table-column prop="product" label="产品" />
      <el-table-column
        :label="item.gross + '%'"
        v-for="(item, index) in data.allRes.sops[0].grossValues"
        :key="item.gross"
        :formatter="toFixedTwo"
        width="180"
      >
        <template #default="scope">
          <div>{{ scope.row.grossValues[index].grossvalue.toFixed(2) }}</div>
          <!-- <el-input-number v-model="scope.row.grossValues[index].grossvalue" controls-position="right" :precision="2" /> -->
        </template>
      </el-table-column>
    </el-table>
    <p>项目全生命周期汇总分析表-实际数量</p>
    <el-table :data="data.allRes.fullLifeCycle" style="width: 100%" border max-height="500px">
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column
        v-for="(item, index) in data.allRes.fullLifeCycle[0].grossMarginList"
        :label="item.grossMargin + '%'"
        :key="index"
        width="180"
      >
        <template #default="scope">
          <div>
            {{ scope.row.grossMarginList[index].grossMarginNumber.toFixed(2) }}
          </div>
          <!-- <el-input-number
            v-model="scope.row.grossMarginList[index].grossMarginNumber"
            controls-position="right"
            :precision="2"
          /> -->
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
        <!-- <el-table-column label="单车产品数量" prop="productNumber" /> -->
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率" prop="quotedGrossMarginSimple.interior.grossMargin">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.client.price" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.quotedGrossMarginSimple.client.price" :precision="2">
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
          <el-table-column label="单价" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.quotedGrossMarginSimple.thisQuotation.price">
                <template #append>
                  <el-button @click="calculateFullGrossMargin(scope.row, scope.$index)">计算</el-button>
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
        <!-- <el-table-column label="单车产品数量" prop="productNumber" /> -->
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.clientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率剔除NRE分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.nreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="quotedGrossMarginSimple.client.price" width="150">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.quotedGrossMarginSimple.client.price"
                :precision="2"
                controls-position="right"
              >
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
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.client.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.client.clientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率剔除NRE分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.client.nreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.quotedGrossMarginSimple.thisQuotation.price">
                <template #append>
                  <el-button @click="calculateFullGrossMargin(scope.row, scope.$index)">计算</el-button>
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
              {{ `${row.quotedGrossMarginSimple.thisQuotation.clientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率剔除NRE分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.thisQuotation.nreGrossMargin?.toFixed(2)} %` }}
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
    <el-dialog v-model="dialogVisible" title="年份维度对比">
      <el-table :data="data.allRes.gradientQuotedGrossMargins" border>
        <!-- <el-table-column label="梯度" prop="numk" />
        <el-table-column label="产品" prop="prices" /> -->
        <el-table-column type="expand" label="数量K">
          <template #default="props">
            <el-table :data="props.row.specifications" border>
              <el-table-column label="年份" prop="year" />
              <el-table-column label="值" prop="value" />
            </el-table>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import * as echarts from "echarts"
// import debounce from "lodash/debounce"
import getQuery from "@/utils/getQuery"
import { useProductStore } from "@/store/modules/productList"
import {
  calculateRate,
  PostStatementAnalysisBoardSecond,
  PostComparison,
  GetSolution,
  PostDownloadMessageSecond,
  PostSpreadSheetCalculate
} from "./service"
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
let { auditFlowId, productId, nodeInstanceId } = getQuery()
interface planListItem {
  value: string
  isOffer: boolean
}
const planList: Array<planListItem> = reactive([])
const productStore = useProductStore()

const fullscreenLoading = ref(false)
const dialogVisible = ref(false)
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
    grossMarginList: null,
    unitPrice: null,
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
            creationTime: "2023-09-12T02:45:43.9722126+08:00",
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
            creationTime: "2023-09-12T02:45:43.9724113+08:00",
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
            creationTime: "2023-09-12T02:45:43.972412+08:00",
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
            creationTime: "2023-09-12T02:45:43.9724122+08:00",
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
            creationTime: "2023-09-12T02:45:43.9724124+08:00",
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
            creationTime: "2023-09-12T02:45:43.9724133+08:00",
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
            creationTime: "2023-09-12T02:45:43.9724137+08:00",
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
            creationTime: "2023-09-12T02:45:43.9724138+08:00",
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
            creationTime: "2023-09-12T02:45:43.972414+08:00",
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
            creationTime: "2023-09-12T02:45:43.9724144+08:00",
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
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7712274+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.771562+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7715628+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_A",
            pcs: 200,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7712274+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.771562+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7715628+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_A",
            pcs: 200,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7712274+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.771562+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7715628+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_A",
            pcs: 200,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7712274+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.771562+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7715628+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_A",
            pcs: 200,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7712274+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.771562+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7715628+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_A",
            pcs: 200,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7712274+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.771562+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1863.5649316381819,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-12T02:45:38.7715628+08:00",
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
            grossvalue: 1961.647296461244
          },
          {
            gross: "6",
            grossvalue: 1982.51588472147
          },
          {
            gross: "8",
            grossvalue: 2025.6140561284585
          },
          {
            gross: "10",
            grossvalue: 2070.6277018202018
          },
          {
            gross: "12",
            grossvalue: 2117.6874223161158
          },
          {
            gross: "14",
            grossvalue: 2166.9359670211416
          },
          {
            gross: "16",
            grossvalue: 2218.529680521645
          },
          {
            gross: "18",
            grossvalue: 2272.640160534368
          },
          {
            gross: "20",
            grossvalue: 2329.4561645477274
          },
          {
            gross: "22",
            grossvalue: 2389.1858097925406
          },
          {
            gross: "24",
            grossvalue: 2452.059120576555
          }
        ]
      }
    ],
    quotedGrossMargins: [
      {
        project: "报价毛利率测算-实际数量-X01",
        grossMargins: [
          {
            product: "AR0820",
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
      }
    ],
    gradientQuotedGrossMargins: [
      {
        gradient: "25K/Y",
        product: "AR0820",
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
            grossMarginNumber: 1.05
          },
          {
            grossMargin: 6,
            grossMarginNumber: 1.06
          },
          {
            grossMargin: 8,
            grossMarginNumber: 1.09
          },
          {
            grossMargin: 10,
            grossMarginNumber: 1.11
          },
          {
            grossMargin: 12,
            grossMarginNumber: 1.14
          },
          {
            grossMargin: 14,
            grossMarginNumber: 1.16
          },
          {
            grossMargin: 16,
            grossMarginNumber: 1.19
          },
          {
            grossMargin: 18,
            grossMarginNumber: 1.22
          },
          {
            grossMargin: 20,
            grossMarginNumber: 1.25
          },
          {
            grossMargin: 22,
            grossMarginNumber: 1.28
          },
          {
            grossMargin: 24,
            grossMarginNumber: 1.32
          }
        ]
      }
    ],
    isSuccess: true,
    message: "调用成功"
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

const hasSelectPlans = computed(() => {
  let ids = planList.map((item) => item.value)
  return ids
})

const deletePlan = (index: number) => {
  planList.splice(index, 1)
}
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
  const { result } = await PostComparison({
    auditFlowId: auditFlowId,
    productId
  })
  console.log(result)
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
const addNewPlan = () => {
  planList.push({
    value: "",
    isOffer: true
  })
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

//成本信息表
const downLoad = async () => {
  console.log("downLoad")
  let planMap = {}
  let solutionTables: any[] = []
  productStore.productList.forEach((item) => {
    planMap[item.id as keyof Object] = item
  })
  planList.forEach((item) => {
    if (planMap[item.value as keyof Object] && item.isOffer) {
      solutionTables.push(planMap[item.value as keyof Object])
    }
  })
  try {
    let res: any = await PostDownloadMessageSecond({ auditFlowId, solutionTables })
    const blob = res
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function () {
      let url = URL.createObjectURL(new Blob([blob]))
      let a = document.createElement("a")
      document.body.appendChild(a) //此处增加了将创建的添加到body当中
      a.href = url
      a.download = "成本信息表.xlsx"
      a.target = "_blank"
      a.click()
      a.remove() //将a标签移除
    }
  } catch (error) {
    console.log(error)
  }
}
//报价值change
const offerCoefficientChange = (row: any) => {
  row.offerMoney = row.offerCoefficient * row.pricingMoney
}

const unitPriceChange = (row: any) => {
  row.grossMargin = (((row.unitPrice - row.cost) / row.unitPrice) * 100).toFixed(2)
}
const pcsChange = (row: any) => {
  row.salesRevenue = row.pcs * row.salesRevenue
}
// 计算
const calculateFullGrossMargin = async (row: any, index: any) => {
  let { gradientId, solutionId } = row
  // let res = await calculateRate({ auditFlowId, gradientId, productId, solutionId })
  debugger
  let res = await PostSpreadSheetCalculate({
    auditFlowId: auditFlowId,
    gradientId: gradientId,
    productId: productId,
    solutionId: solutionId
  })
  console.log(res, index)
}

const comfirmPlans = async () => {
  fullscreenLoading.value = true
  console.log(productStore.productList)
  let planMap = {}
  let solutionTables: any[] = []
  productStore.productList.forEach((item) => {
    planMap[item.id as keyof Object] = item
  })
  planList.forEach((item) => {
    if (planMap[item.value as keyof Object] && item.isOffer) {
      solutionTables.push(planMap[item.value as keyof Object])
    }
  })
  try {
    let res = await PostStatementAnalysisBoardSecond({ auditFlowId, solutionTables })
    console.log(res)
    console.log(planList)
    console.log(solutionTables)
    data.allRes = res.result
    fullscreenLoading.value = false
  } catch (error) {
    fullscreenLoading.value = false
  }
}
const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')

  if (auditFlowId) {
    let res = await GetSolution(auditFlowId)
    console.log(res)
    // productStore.setProductList(auditFlowId)
    // let res = await PostStatementAnalysisBoardSecond({ auditFlowId })
    // console.log(res)
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
