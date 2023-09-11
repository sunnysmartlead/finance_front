<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <el-card>
      <p>请选择报价方案组合：</p>
      <el-button type="primary" @click="addNewPlan" mb-20px>新增</el-button>
      <el-table :data="data.tableData" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="报价序号" />
        <el-table-column label="前视">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案一" :value="1" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="侧视">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案二" :value="1" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="后视">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案三" :value="1" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- nre -->
    <el-card v-for="(nre, index) in data.allRes.nres" :key="index">
      <p>{{ nre.solutionName }}</p>
      <p>线体数量：{{ nre.numberLine }} 共线分摊率：：{{ nre.collinearAllocationRate }}</p>
      <el-table :data="nre.models" style="width: 100%" border height="500px"  :summary-method="getSummaries"
        show-summary>
        <el-table-column label="序号" type="index"/>
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
      <el-table :data="nre.devices" style="width: 100%" border height="500px">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="devicePrice" label="设备单价" />
        <el-table-column prop="number" label="设备数量" />
        <el-table-column prop="equipmentMoney" label="设备金额" />
      </el-table>
    </el-card>
    <!-- 样品 -->
    <p>样品报价</p>
    <el-card v-for="sample in data.allRes.sampleOffer" :key="sample.solutionName">
      <span>{{ sample.solutionName }}</span>
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
    <p>单价表（sop年）</p>
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
    <el-card class="card">
      <el-row justify="end" m="2">
        <el-button @click="openDialog(null)" type="primary">年份维度对比</el-button>
      </el-row>
    </el-card>

    <p>报价毛利率测算-阶梯数量</p>
    <!-- <el-card class="card">
      <el-table :data="listOne" border>
        <el-table-column label="梯度" prop="gradient" />
        <el-table-column label="产品" prop="product" />
        <el-table-column label="单车产品数量" prop="amount" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率" prop="interior.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="client.price">
            <template #default="scope">
              <el-input v-model="scope.row.client.price">
                <template #append>
                  <el-button @click="
                    calculateFullGrossMargin(
                      scope.row,
                      scope.$index,
                      'clientTargetUnitPrice',
                      'clientTargetGrossMargin'
                    )
                    ">计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价">
            <template #default="scope">
              <el-input v-model="scope.row.thisQuotation.price">
                <template #append>
                  <el-button
                    @click="calculateFullGrossMargin(scope.row, scope.$index, 'offerUnitPrice', 'offeGrossMargin')">计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="thisQuotation.grossMargin">
            <template #default="{ row }">
              {{ `${row.thisQuotation.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="'第' + (index + 1) + '轮'"
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
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row)" type="primary">年份维度对比</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card> -->
    
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
                <template #append>
                  <!-- <el-button @click="
                    calculateFullGrossMargin(
                      scope.row,
                      scope.$index,
                      'clientTargetUnitPrice',
                      'clientTargetGrossMargin'
                    )
                    ">计算</el-button> -->
                </template>
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
          <el-table-column label="剔除分摊费用毛利率" >
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
                  <el-button
                    @click="calculateFullGrossMargin(scope.row, scope.$index, 'offerUnitPrice', 'offeGrossMargin')">计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.thisQuotation.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率" >
            <template #default="{ row }">
              {{ `${row.quotedGrossMarginSimple.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率" >
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


    <!-- <el-card class="card" v-for="(table, index) in data.allRes.gradientQuotedGrossMargins" :key="index">
      <el-row justify="end" m="2">
        <el-button @click="openDialog(null)" type="primary">年份维度对比</el-button>
      </el-row>
      <el-table :data="table.quotedGrossMarginSimple" border>
        <el-table-column label="产品" prop="product" />
        <el-table-column label="单车产品数量" prop="amount" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率" prop="interior.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="client.price">
            <template #default="scope">
              <el-input v-model="scope.row.client.price">
                <template #append>
                  <el-button @click="
                    calculateFullGrossMargin(
                      scope.row,
                      scope.$index,
                      'clientTargetUnitPrice',
                      'clientTargetGrossMargin'
                    )
                    ">计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.client.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价">
            <template #default="scope">
              <el-input v-model="scope.row.thisQuotation.price">
                <template #append>
                  <el-button
                    @click="calculateFullGrossMargin(scope.row, scope.$index, 'offerUnitPrice', 'offeGrossMargin')">计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="thisQuotation.grossMargin">
            <template #default="{ row }">
              {{ `${row.thisQuotation.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
         <el-table-column :label="'第' + (index + 1) + '轮'"
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
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row)" type="primary">年份维度对比</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>  -->
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import debounce from "lodash/debounce"
import getQuery from "@/utils/getQuery"
import { useProductStore } from "@/store/modules/productList"

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
const productStore = useProductStore()

const data = reactive({
  tableData: [
    // {
    //   projectsPlan: 1,
    //   name: "1/JAN"
    // }
  ] as any[],
  //被选中的当前方案
  currentPlan: [
    {
      auditFlowId: 1,
      productld: 5,
      moduleName: "1",
      solutionName: "方案二",
      product: "1-方案二",
      isCOB: false,
      elecEngineerId: 92,
      structEngineerId: 51,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 5
    },
    {
      auditFlowId: 1,
      productld: 2,
      moduleName: "侧视",
      solutionName: "方案一",
      product: "侧视-方案一",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 2
    },
    {
      auditFlowId: 1,
      productld: 2,
      moduleName: "侧视",
      solutionName: "方案二",
      product: "侧视-方案二",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 8
    },
    {
      auditFlowId: 1,
      productld: 2,
      moduleName: "侧视",
      solutionName: "方案三",
      product: "侧视-方案三",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 9
    },
    {
      auditFlowId: 1,
      productld: 1,
      moduleName: "前视",
      solutionName: "方案一",
      product: "前视-方案一",
      isCOB: false,
      elecEngineerId: 59,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 1
    },
    {
      auditFlowId: 1,
      productld: 1,
      moduleName: "前视",
      solutionName: "方案二",
      product: "前视-方案二",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 6
    },
    {
      auditFlowId: 1,
      productld: 1,
      moduleName: "前视",
      solutionName: "方案三",
      product: "前视-方案三",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 7
    },
    {
      auditFlowId: 1,
      productld: 3,
      moduleName: "后视",
      solutionName: "方案一",
      product: "后视-方案一",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 3
    },
    {
      auditFlowId: 1,
      productld: 3,
      moduleName: "后视",
      solutionName: "方案二",
      product: "后视-方案二",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 10
    },
    {
      auditFlowId: 1,
      productld: 4,
      moduleName: "环视",
      solutionName: "方案一",
      product: "环视-方案一",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 4
    }
  ],
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
            creationTime: "2023-09-11T00:04:58.7008336+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009635+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009642+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009644+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009649+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009657+08:00",
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
            creationTime: "2023-09-11T00:04:58.700966+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009662+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009665+08:00",
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
            creationTime: "2023-09-11T00:04:58.7009669+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011142+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011147+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011148+08:00",
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
            creationTime: "2023-09-11T00:04:58.701115+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011151+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011156+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011157+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011158+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011159+08:00",
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
            creationTime: "2023-09-11T00:04:58.7011161+08:00",
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
            cost: 100,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-11T00:04:55.984485+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 100,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-11T00:04:55.9848354+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 100,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-11T00:04:55.9848363+08:00",
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
            grossvalue: 105.26315789473684
          },
          {
            gross: "6",
            grossvalue: 106.38297872340425
          },
          {
            gross: "8",
            grossvalue: 108.69565217391305
          },
          {
            gross: "10",
            grossvalue: 111.11111111111111
          },
          {
            gross: "12",
            grossvalue: 113.63636363636364
          },
          {
            gross: "14",
            grossvalue: 116.27906976744185
          },
          {
            gross: "16",
            grossvalue: 119.04761904761905
          },
          {
            gross: "18",
            grossvalue: 121.95121951219512
          },
          {
            gross: "20",
            grossvalue: 125
          },
          {
            gross: "22",
            grossvalue: 128.2051282051282
          },
          {
            gross: "24",
            grossvalue: 131.57894736842104
          }
        ]
      },
      {
        gradientValue: "35K/Y",
        product: "AR0820",
        grossValues: [
          {
            gross: "5",
            grossvalue: 105.26315789473684
          },
          {
            gross: "6",
            grossvalue: 106.38297872340425
          },
          {
            gross: "8",
            grossvalue: 108.69565217391305
          },
          {
            gross: "10",
            grossvalue: 111.11111111111111
          },
          {
            gross: "12",
            grossvalue: 113.63636363636364
          },
          {
            gross: "14",
            grossvalue: 116.27906976744185
          },
          {
            gross: "16",
            grossvalue: 119.04761904761905
          },
          {
            gross: "18",
            grossvalue: 121.95121951219512
          },
          {
            gross: "20",
            grossvalue: 125
          },
          {
            gross: "22",
            grossvalue: 128.2051282051282
          },
          {
            gross: "24",
            grossvalue: 131.57894736842104
          }
        ]
      }
    ],
    quotedGrossMargins: [],
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
            grossMarginNumber: 105.26
          },
          {
            grossMargin: 6,
            grossMarginNumber: 106.38
          },
          {
            grossMargin: 8,
            grossMarginNumber: 108.7
          },
          {
            grossMargin: 10,
            grossMarginNumber: 111.11
          },
          {
            grossMargin: 12,
            grossMarginNumber: 113.64
          },
          {
            grossMargin: 14,
            grossMarginNumber: 116.28
          },
          {
            grossMargin: 16,
            grossMarginNumber: 119.05
          },
          {
            grossMargin: 18,
            grossMarginNumber: 121.95
          },
          {
            grossMargin: 20,
            grossMarginNumber: 125
          },
          {
            grossMargin: 22,
            grossMarginNumber: 128.21
          },
          {
            grossMargin: 24,
            grossMarginNumber: 131.58
          }
        ]
      },
      {
        projectName: "销售成本",
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
      },
      {
        projectName: "单位平均成本",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0.01
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0.01
          }
        ]
      },
      {
        projectName: "返利后销售收入",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 2.11
          },
          {
            grossMargin: 6,
            grossMarginNumber: 2.13
          },
          {
            grossMargin: 8,
            grossMarginNumber: 2.17
          },
          {
            grossMargin: 10,
            grossMarginNumber: 2.22
          },
          {
            grossMargin: 12,
            grossMarginNumber: 2.27
          },
          {
            grossMargin: 14,
            grossMarginNumber: 2.33
          },
          {
            grossMargin: 16,
            grossMarginNumber: 2.38
          },
          {
            grossMargin: 18,
            grossMarginNumber: 2.44
          },
          {
            grossMargin: 20,
            grossMarginNumber: 2.5
          },
          {
            grossMargin: 22,
            grossMarginNumber: 2.56
          },
          {
            grossMargin: 24,
            grossMarginNumber: 2.63
          }
        ]
      },
      {
        projectName: "平均单价",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0.02
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0.03
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0.03
          }
        ]
      },
      {
        projectName: "销售毛利",
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
      },
      {
        projectName: "毛利率",
        grossMarginList: [
          {
            grossMargin: 5,
            grossMarginNumber: 0.53
          },
          {
            grossMargin: 6,
            grossMarginNumber: 0.53
          },
          {
            grossMargin: 8,
            grossMarginNumber: 0.54
          },
          {
            grossMargin: 10,
            grossMarginNumber: 0.56
          },
          {
            grossMargin: 12,
            grossMarginNumber: 0.57
          },
          {
            grossMargin: 14,
            grossMarginNumber: 0.58
          },
          {
            grossMargin: 16,
            grossMarginNumber: 0.6
          },
          {
            grossMargin: 18,
            grossMarginNumber: 0.61
          },
          {
            grossMargin: 20,
            grossMarginNumber: 0.62
          },
          {
            grossMargin: 22,
            grossMarginNumber: 0.64
          },
          {
            grossMargin: 24,
            grossMarginNumber: 0.66
          }
        ]
      }
    ],
    isSuccess: true,
    message: "调用成功"
  }
})
// const listOne = computed(() => {
//   let listOne: any[] = []
//   data.allRes.gradientQuotedGrossMargins.forEach((item) => {
//     item.quotedGrossMarginSimple.forEach((listItem: any) => {
//       listItem.gradient = item.gradient
//       listOne.push(listItem)
//     })
//   })
//   return listOne
// })
const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (typeof cellValue === "number") {
    return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}
// 报价分析看板 单价计算
const calculateFullGrossMargin = debounce(async (row: any, index: number, key1: string, key2: string) => {
  // console.log(data.auditFlowId)
  const productBoards = data.productBoard.map((item: any) => {
    return {
      modelCountId: item.modelCountId,
      unitPrice: item[key1]
    }
  })
  let { result }: any = (await postCalculateFullGrossMargin(productBoards, data.auditFlowId)) || {}
  // row.oldOffer[index].grossMargin = res.result.productBoardGrosses[0].offeGrossMargin

  data.productBoard[index][key2] = result?.productBoardGrosses[index].grossMargin

  if (key2 === "offeGrossMargin") {
    data.allGrossMargin = result.allGrossMargin
    // const grossMarginValue = calculatedValue("offeGrossMargin") // 本次报价整套毛利率
    // const AllUnitPrice = calculatedValue("offerUnitPrice") // 本次报价整套单价
    spreadSheetCalculate(productBoards, "offer")
  } else {
    data.allClientGrossMargin = result.allGrossMargin
    spreadSheetCalculate(productBoards, "clientTarget")
  }
  setData()
}, 300)

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
const addNewPlan = () => {
  data.tableData.push({
    projectsPlan: 1,
    name: "1/JAN"
  })
}

let ProjectUnitPrice: any = {
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
  // yAxis: {
  //   type: "value"
  // },
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
let RevenueGrossMargin: any = {
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

let chart1: any = null
let chart2: any = null
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
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
