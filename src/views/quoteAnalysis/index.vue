<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <el-card mb-20px>
      <p>请选择报价方案组合：</p>
      <el-button type="primary" @click="addNewPlan" mb-20px float-right>新增方案</el-button>
      <el-table :data="planList" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center" />
        <el-table-column label="报价模组" width="200" align="center">
          <template #default="scope">
            <el-select clearable v-model="scope.row.value">
              <el-option
                v-for="item in productList"
                :label="item.product"
                :value="item.id"
                :key="item.id"
                :disabled="hasSelectPlans.includes(item.id)"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否报价" width="200" align="center">
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
      <h4 mt-100px>方案组合</h4>
      <!-- <el-radio-group v-model="planListArrVal" mt-20px @change="planListArrChange">
        <el-radio :label="index" v-for="(item, index) in planListArr" size="large" border :key="index"
          >方案{{ index + 1 }}</el-radio
        >
      </el-radio-group> -->
      <div v-for="(plan, index) in planListArr" :key="index" mt="20px">
        <el-descriptions :title="`方案${index + 1}`" :column="1" border>
          <template #extra>
            <el-button type="primary" @click="planListArrChange(index)">选择该方案</el-button>
            <el-button type="danger" @click="deletePlanListArr(index)">删除方案</el-button>
          </template>
          <el-descriptions-item label="产品" v-for="item in plan" :key="item.id">
            {{ item.product }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-button type="primary" @click="downLoad">成本信息表下载</el-button>
    <el-button-group style="float: right">
      <el-button type="primary" @click="postOffer(true)" v-havedone>报价</el-button>
      <el-button type="primary" @click="postOffer(false)" v-havedone>不报价</el-button>
    </el-button-group>
    <ProcessVertifyBox :onSubmit="handleSubmit" v-havedone processType="confirmProcessType" />
    <ResetProcess />
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
        table-layout="auto"
      >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column prop="formName" label="费用名称" width="200" align="center" />
        <el-table-column
          prop="pricingMoney"
          label="核价金额"
          :formatter="formatThousandths"
          width="200"
          align="right"
        />
        <el-table-column label="报价系数" width="200" align="center">
          <template #default="scope">
            <el-input-number @mousewheel.native.prevent
              v-model="scope.row.offerCoefficient"
              controls-position="right"
              @change="offerCoefficientChange(scope.row)"
              :precision="2"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column prop="offerMoney" label="报价金额" :formatter="formatThousandths" width="200" align="right" />
        <el-table-column label="备注" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.remark" type="textarea" autosize />
          </template>
        </el-table-column>
      </el-table>
      <p>专用设备</p>
      <el-table :data="nre.devices" border max-height="250px">
        <el-table-column prop="deviceName" label="设备名称" width="200" align="center" />
        <el-table-column prop="devicePrice" label="设备单价" width="200" align="right" :formatter="formatThousandths" />
        <el-table-column prop="number" label="设备数量" width="200" align="center" />
        <el-table-column
          prop="equipmentMoney"
          label="设备金额"
          width="200"
          align="right"
          :formatter="formatThousandths"
        />
      </el-table>
    </el-card>
    <!-- 样品 -->
    <h3>样品报价</h3>
    <el-card v-for="sample in data.allRes.sampleOffer" :key="sample.solutionName">
      <p>{{ sample.solutionName }}</p>
      <el-table :data="sample.onlySampleModels" border max-height="500px">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column prop="name" label="样品阶段" width="200" align="center" />
        <el-table-column prop="pcs" label="需求量（pcs）" width="200" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.pcs" type="number" @change="pcsChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本" :formatter="formatThousandths" width="200" align="right" />
        <el-table-column prop="unitPrice" label="单价" width="200" align="center">
          <template #default="scope">
            <el-input-number @mousewheel.native.prevent
              v-model="scope.row.unitPrice"
              controls-position="right"
              @change="unitPriceChange(scope.row)"
              :precision="2"
            />
          </template>
        </el-table-column>
        <el-table-column prop="grossMargin" label="毛利率" width="200" align="center">
          <template #default="scope"> {{ scope.row.grossMargin }}% </template>
        </el-table-column>
        <el-table-column prop="salesRevenue" label="销售收入" align="center">
          <template #default="scope">
            {{ formatThousandths(null, null, scope.row.unitPrice * scope.row.pcs) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- sop -->
    <h3>单价表（sop年）</h3>
    <el-table :data="data.allRes.sops" style="width: 100%" border max-height="500px">
      <el-table-column prop="gradientValue" label="梯度" width="150" align="center" />
      <el-table-column prop="product" label="产品" width="150" align="center" />
      <el-table-column
        :label="item.gross + '%'"
        v-for="(item, index) in data.allRes.sops[0].grossValues"
        :key="item.gross"
        :formatter="toFixedTwo"
        width="150"
        align="right"
      >
        <template #default="scope">
          <div>{{ scope.row.grossValues[index].grossvalue.toFixed(2) }}</div>
          <!-- <el-input-number @mousewheel.native.prevent v-model="scope.row.grossValues[index].grossvalue" controls-position="right" :precision="2" /> -->
        </template>
      </el-table-column>
    </el-table>
    <p>项目全生命周期汇总分析表-实际数量</p>
    <el-table :data="data.allRes.fullLifeCycle" style="width: 100%" border max-height="500px">
      <el-table-column prop="projectName" label="项目名称" width="150" align="center" />
      <el-table-column
        v-for="(item, index) in data.allRes.fullLifeCycle[0].grossMarginList"
        :label="item.grossMargin + '%'"
        :key="index"
        width="150"
        align="right"
      >
        <template #default="scope">
          <div>
            {{ formatThousandths(null, null, scope.row.grossMarginList[index].grossMarginNumber) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p>报价毛利率测算-阶梯数量</p>
    <el-card class="card">
      <el-table :data="data.allRes.gradientQuotedGrossMargins" border>
        <el-table-column label="梯度" prop="gradient" />
        <el-table-column label="产品" prop="product" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="interiorPrice" :formatter="formatThousandths" />
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.interiorGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.clientPrice" :precision="2">
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
              {{ `${row.clientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.clientClientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.clientNreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.thisQuotationPrice">
                <template #append>
                  <el-button @click="calculateFullGrossMarginNew(scope.row, scope.$index)">计算</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.thisQuotationGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.thisQuotationClientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.thisQuotationNreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="上轮报价">
          <el-table-column label="单价" width="150" prop="lastRoundPrice" :formatter="formatThousandths">
            <!-- <template #default="scope">
              <el-input v-model="scope.row.lastRoundPrice" />
            </template> -->
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.lastRoundGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.lastRoundClientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.lastRoundNreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row, 1)" type="primary">年份维度对比</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="card" v-for="(item, index) in data.allRes.quotedGrossMargins" :key="index">
      <p>{{ item.project }}</p>
      <!-- <el-row justify="end" m="2">
        <el-button type="primary">年份维度对比</el-button>
      </el-row> -->
      <el-table :data="item.quotedGrossMarginActualList" border>
        <el-table-column label="产品" prop="product" />
        <el-table-column label="单车产品数量" prop="carNum" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="interiorPrice" :formatter="formatThousandths" />
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.interiorGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.interiorClientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率剔除NRE分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.interiorNreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="clientPrice" width="180">
            <template #default="scope">
              <el-input-number @mousewheel.native.prevent v-model="scope.row.clientPrice" :precision="2" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.clientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.clientClientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率剔除NRE分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.clientNreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.thisQuotationPrice">
                <template #append>
                  <el-button
                    @click="
                      calculateFullGrossMarginNewSj(scope.row, scope.$index, index, item.quotedGrossMarginActualList)
                    "
                    >计算</el-button
                  >
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              {{ `${row.thisQuotationGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.thisQuotationClientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率剔除NRE分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.thisQuotationNreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row, 2, item.quotedGrossMarginActualList)" type="primary"
                >年份维度对比</el-button
              >
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
      <!-- projectBoard -->
      <div v-for="item in data.allRes.projectBoard" :key="item.title">
        <p>{{ item.title }}</p>
        <el-table :data="item.projectBoardModels" border>
          <el-table-column label="产品" prop="projectName" />
          <el-table-column
            label="目标价（内部）"
            width="300"
            prop="interiorTarget"
            :formatter="formatThousandths"
            align="right"
          />
          <el-table-column label="目标价（客户）" prop="clientTarget" :formatter="formatThousandths" align="right" />
          <el-table-column label="本次报价" prop="offer" :formatter="formatThousandths" align="right" />
          <el-table-column label="上轮报价" prop="oldOffer" :formatter="formatThousandths" align="right" />
        </el-table>
      </div>

      <!-- <div v-for="(value, key) in gradientTableMap" :key="key">
        <p>{{ key }}</p>
        <el-table :data="value" border>
          <el-table-column label="产品" prop="product" />
          <el-table-column
            label="目标价（内部）"
            width="300"
            prop="quotedGrossMarginSimple.interior.price"
            :formatter="formatThousandths"
            align="right"
          />
          <el-table-column
            label="目标价（客户）"
            prop="quotedGrossMarginSimple.client.price"
            :formatter="formatThousandths"
            align="right"
          />
          <el-table-column
            label="本次报价"
            prop="quotedGrossMarginSimple.thisQuotation.price"
            :formatter="formatThousandths"
            align="right"
          />
          <el-table-column
            label="上轮报价"
            prop="quotedGrossMarginSimple.astRound.price"
            :formatter="formatThousandths"
            align="right"
          />
        </el-table>
        <div :id="'unitpriceChart' + key" class="h-400px" />
        <div :id="'revenueGrossMarginChart' + key" class="h-400px" />
      </div> -->
      <div v-for="(value, key) in gradientTableMap" :key="key">
        <div :id="'unitpriceChart' + key" class="h-400px" />
        <div :id="'revenueGrossMarginChart' + key" class="h-400px" />
      </div>
      <div>
        <div :id="'unitpriceChart' + 'shiji'" class="h-400px" />
        <div :id="'revenueGrossMarginChart' + 'shiji'" class="h-400px" />
      </div>
      <el-button @click="toMarketingApproval" type="primary" float-right my-20px>生成审批表</el-button>
    </el-card>
    <!-- <el-button @click="save">保存</el-button> -->
    <el-dialog v-model="dialogVisible" title="年份维度对比">
      <h4>数量K</h4>
      <el-table :data="yearDimension.numk" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="数量K" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>单价</h4>
      <el-table :data="yearDimension.prices" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="单价" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售成本</h4>
      <el-table :data="yearDimension.sellingCost" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="销售成本" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>单位平均成本</h4>
      <el-table :data="yearDimension.averageCost" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="单位平均成本" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售收入</h4>
      <el-table :data="yearDimension.salesRevenue" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="销售收入" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售毛利（千元）</h4>
      <el-table :data="yearDimension.salesMargin" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="销售毛利（千元）" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>佣金</h4>
      <el-table :data="yearDimension.commission" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="佣金" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>毛利率</h4>
      <el-table :data="yearDimension.grossMargin" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="毛利率" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)}% ` }}</div>
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
import { ElMessage } from "element-plus"
// import debounce from "lodash/debounce"
import getQuery from "@/utils/getQuery"
import { useProductStore } from "@/store/modules/productList"
import {
  PostStatementAnalysisBoardSecond,
  GetSolution,
  PostDownloadMessageSecond,
  PostYearDimensionalityComparisonForGradient,
  PostGrossMarginForGradient,
  PostGrossMarginForactual,
  PostYearDimensionalityComparisonForactual,
  PostYearDimensionalityComparisonForactualQt,
  PostGrossMarginForactualQt,
  PostIsOfferSaveSecond,
  PostIsOfferSecond,
  SubmitNode,
  getStatementAnalysisBoardSecond
} from "./service"
import { getProductByAuditFlowId } from "@/views/productList/service"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import ResetProcess from "@/components/ResetProcess/index.vue"

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
let { auditFlowId, productId, nodeInstanceId, right } = getQuery()
interface planListItem {
  value: string
  isOffer: boolean
}
const planList: Array<planListItem> = reactive([])
const productStore = useProductStore()

const productList = ref<any[]>([])
const fullscreenLoading = ref(false)
const dialogVisible = ref(false)
const planListArr = reactive<any[]>([])
let selectPlan = ref<any[]>([])
const planListArrVal = ref(null)
const yearDimension = ref({
  numk: [],
  prices: [],
  sellingCost: [],
  averageCost: [],
  salesRevenue: [],
  salesMargin: [],
  commission: [],
  grossMargin: []
})
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
    isOffer: false,
    noOfferReason: "string",
    auditFlowId: 0,
    grossMarginList: null,
    unitPrice: null,
    nres: [
      {
        solutionName: "NRE AR0820",
        solutionId: 0,
        auditFlowId: 0,
        models: [],
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
        onlySampleModels: []
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
        quotedGrossMarginActualList: [
          {
            carModel: "Y1",
            solutionId: 0,
            product: "延锋科技前装车内1M",
            carNum: 2,
            id: 0,
            version: 0,
            auditFlowId: 337,
            interiorPrice: 0.0,
            interiorGrossMargin: 0.0,
            interiorClientGrossMargin: 0.0,
            interiorNreGrossMargin: 0.0,
            clientPrice: 0.0,
            clientGrossMargin: 0.0,
            clientClientGrossMargin: 0.0,
            clientNreGrossMargin: 0.0,
            thisQuotationPrice: 0.0,
            thisQuotationGrossMargin: 0.0,
            thisQuotationClientGrossMargin: 0.0,
            thisQuotationNreGrossMargin: 0.0,
            lastRoundPrice: 0.0,
            lastRoundGrossMargin: 0.0,
            lastRoundClientGrossMargin: 0.0,
            lastRoundNreGrossMargin: 0.0
          },
          {
            carModel: "Y1",
            solutionId: 0,
            product: "延锋科技-DMS-2M",
            carNum: 1,
            id: 0,
            version: 0,
            auditFlowId: 337,
            interiorPrice: 0.0,
            interiorGrossMargin: 0.0,
            interiorClientGrossMargin: 0.0,
            interiorNreGrossMargin: 0.0,
            clientPrice: 0.0,
            clientGrossMargin: 0.0,
            clientClientGrossMargin: 0.0,
            clientNreGrossMargin: 0.0,
            thisQuotationPrice: 0.0,
            thisQuotationGrossMargin: 0.0,
            thisQuotationClientGrossMargin: 0.0,
            thisQuotationNreGrossMargin: 0.0,
            lastRoundPrice: 0.0,
            lastRoundGrossMargin: 0.0,
            lastRoundClientGrossMargin: 0.0,
            lastRoundNreGrossMargin: 0.0
          }
        ],
        project: "报价毛利率测算-实际数量-Y1"
      }
    ],
    gradientQuotedGrossMargins: [
      {
        gradient: "2664.9k/y",
        gradientId: 599,
        solutionId: 664,
        product: "延锋科技前装车内1M",
        id: 0,
        version: 0,
        auditFlowId: 337,
        interiorPrice: 783.3082529596942, //目标价（内部）单价
        interiorGrossMargin: 20, // 目标价（内部）毛利率
        interiorClientGrossMargin: 86.31, // 目标价（内部）增加客供料毛利率
        interiorNreGrossMargin: 86.31, // 目标价（内部）剔除分摊费用毛利率
        clientPrice: 1000, // 目标价（客户）单价
        clientGrossMargin: 0, // 目标价（客户）毛利率
        clientClientGrossMargin: 0, // 目标价（客户）增加客供料毛利率
        clientNreGrossMargin: 0, // 目标价（客户）剔除分摊费用毛利率
        thisQuotationPrice: 1222, /// 本次报价单价
        thisQuotationGrossMargin: 0, // 本次报价毛利率
        thisQuotationClientGrossMargin: 0, // 本次报价增加客供料毛利率
        thisQuotationNreGrossMargin: 0, // 本次报价剔除NRE分摊费用毛利率
        lastRoundPrice: 0, // 上轮报价单价
        lastRoundGrossMargin: 0, // 上轮报价毛利率
        lastRoundClientGrossMargin: 0, // 上轮报价增加客供料毛利率
        lastRoundNreGrossMargin: 0 // 上轮报价剔除NRE分摊费用毛利率
      },
      {
        gradient: "4000k/y",
        gradientId: 600,
        solutionId: 664,
        product: "延锋科技前装车内1M",
        id: 0,
        version: 0,
        auditFlowId: 337,
        interiorPrice: 783.3082529596942, //目标价（内部）单价
        interiorGrossMargin: 20, // 目标价（内部）毛利率
        interiorClientGrossMargin: 86.31, // 目标价（内部）增加客供料毛利率
        interiorNreGrossMargin: 86.31, // 目标价（内部）剔除分摊费用毛利率
        clientPrice: 1200, // 目标价（客户）单价
        clientGrossMargin: 0, // 目标价（客户）毛利率
        clientClientGrossMargin: 0, // 目标价（客户）增加客供料毛利率
        clientNreGrossMargin: 0, // 目标价（客户）剔除分摊费用毛利率
        thisQuotationPrice: 3333, /// 本次报价单价
        thisQuotationGrossMargin: 0, // 本次报价毛利率
        thisQuotationClientGrossMargin: 0, // 本次报价增加客供料毛利率
        thisQuotationNreGrossMargin: 0, // 本次报价剔除NRE分摊费用毛利率
        lastRoundPrice: 0, // 上轮报价单价
        lastRoundGrossMargin: 0, // 上轮报价毛利率
        lastRoundClientGrossMargin: 0, // 上轮报价增加客供料毛利率
        lastRoundNreGrossMargin: 0 // 上轮报价剔除NRE分摊费用毛利率
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
    projectBoard: [
      {
        title: "2664.9KV",
        projectBoardModels: [
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "数量",
            interiorTarget: 21319.2,
            clientTarget: 21319.2,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "销售成本",
            interiorTarget: 23570070.79,
            clientTarget: 23570070.79,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "单位平均成本",
            interiorTarget: 1105.58,
            clientTarget: 1105.58,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "销售收入",
            interiorTarget: 28985042.52,
            clientTarget: 8438427.92,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "佣金",
            interiorTarget: 590007.46,
            clientTarget: 171769.13,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "平均单价",
            interiorTarget: 6.01,
            clientTarget: 395.81,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "销售毛利",
            interiorTarget: 4824964.28,
            clientTarget: -15303411.98,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            projectName: "毛利率",
            interiorTarget: 16.65,
            clientTarget: -181.35,
            offer: 0.0,
            oldOffer: null
          }
        ]
      },
      {
        title: "4000KV",
        projectBoardModels: [
          {
            version: 0,
            auditFlowId: 0,
            gradientId: 1,
            id: 0,
            projectName: "数量",
            interiorTarget: 32000.0,
            clientTarget: 32000.0,
            offer: 0.0,
            oldOffer: null
          },
          {
            version: 0,
            auditFlowId: 0,
            id: 0,
            gradientId: 2,
            projectName: "销售成本",
            interiorTarget: 34679267.1,
            clientTarget: 34679267.1,
            offer: 0.0,
            oldOffer: null
          }
        ]
      }
    ]
  } as any
})
const planListArrChange = async (val) => {
  fullscreenLoading.value = true
  try {
    selectPlan.value = planListArr[val]
    let res = await PostStatementAnalysisBoardSecond({
      auditFlowId,
      solutionTables: planListArr[val],
      version: 0,
      ntime: 0
    })
    fullscreenLoading.value = false
    data.allRes = res.result
  } catch (error) {
    fullscreenLoading.value = false
  }
}
// 过滤相同梯度的数据
interface stringKeyObj {
  [propName: string]: any
}
const gradientTableMap = computed(() => {
  let gradientTableMap: stringKeyObj = {}
  data.allRes.gradientQuotedGrossMargins.forEach((item) => {
    if (!gradientTableMap[item.gradientId]) {
      gradientTableMap[item.gradientId] = []
    }
    gradientTableMap[item.gradientId].push(item)
  })

  // setChartData(gradientTableMap)
  return gradientTableMap
})
let gradientTableMapResult = ref([])
const hasSelectPlans = computed(() => {
  let ids = planList.map((item) => item.value)
  return ids
})

const deletePlan = (index: number) => {
  planList.splice(index, 1)
}
const deletePlanListArr = (index: number) => {
  planListArr.splice(index, 1)
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (typeof cellValue === "number") {
    return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}
// 报价分析看板 单价计算
const openDialog = async (row: any, type: number, list: any) => {
  dialogVisible.value = true
  if (row.product === "齐套") {
    try {
      const { result } = await PostYearDimensionalityComparisonForactualQt({
        AuditFlowId: auditFlowId,
        CarModel: row.carModel,
        SoltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
          return {
            Gradientid: item.gradientId,
            UnitPrice: item.thisQuotationPrice,
            SolutionId: item.solutionId
          }
        }),
        SolutionIdsAndcarNums: list
          .map((item: any) => {
            return {
              carNum: item.carNum,
              SolutionId: item.solutionId
            }
          })
          .slice(0, list.length - 1)
      })
      console.log(result)
      yearDimension.value = result
    } catch (error) {
      console.log(error)
    }
    return
  }
  if (type === 1) {
    try {
      const { result } = await PostYearDimensionalityComparisonForGradient({
        auditFlowId: auditFlowId,
        gradientId: row.gradientId,
        unitPrice: row.thisQuotationPrice,
        solutionId: row.solutionId
      })
      console.log(result)
      yearDimension.value = result
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const { result } = await PostYearDimensionalityComparisonForactual({
        auditFlowId: auditFlowId,
        gradientId: row.gradientId,
        unitPrice: row.thisQuotationPrice,
        solutionId: row.solutionId,
        carModel: row.carModel,
        soltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
          return {
            gradientId: item.gradientId,
            unitPrice: item.thisQuotationPrice,
            solutionId: item.solutionId
          }
        })
      })
      console.log(result)
      yearDimension.value = result
    } catch (error) {
      console.log(error)
    }
  }
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
        sums[index] = (Number(sums[index]).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
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
const setChartData = () => {
  /**梯度图表 */
  let ProjectUnitPrice: stringKeyObj = {}
  let RevenueGrossMargin: stringKeyObj = {}
  let keys = Object.keys(gradientTableMap.value)
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
    ProjectUnitPrice[key].series = gradientTableMap.value[key].map((item: any) => {
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
        data: [item.interiorPrice, item.clientPrice, item.thisQuotationPrice]
      }
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
      series: []
    }

    data.allRes.projectBoard.forEach((item) => {
      if (item.gradientId === Number(key)) {
        let ritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "毛利率")
        let xssritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "销售收入")

        let ritem = ritems[0]
        let xssritem = xssritems[0]
        ProjectUnitPrice[key].series.push({
          yAxisIndex: 1,
          name: "整体毛利率",
          type: "line",
          tooltip: {
            formatter: "{a}{b}{c}%"
          },
          // 临时造的数据没有看到该字段
          data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
        })
        RevenueGrossMargin[key].series.push({
          yAxisIndex: 1,
          name: "整体毛利率",
          type: "line",
          tooltip: {
            formatter: "{a}{b}{c}%"
          },
          // 临时造的数据没有看到该字段
          data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
        })
        RevenueGrossMargin[key].series.push({
          name: "销售收入",
          type: "bar",
          stack: "total",
          label: {
            show: true
          },
          emphasis: {
            focus: "series"
          },
          data: [xssritem.interiorTarget, xssritem.clientTarget, xssritem.offer]
        })
      }
    })
    setTimeout(() => {
      initCharts("unitpriceChart" + key, ProjectUnitPrice[key])
      initCharts("revenueGrossMarginChart" + key, RevenueGrossMargin[key])
    }, 500)
  })
  /** 实际图表 */
  let length = data.allRes.quotedGrossMargins.length
  let sjTable = data.allRes.quotedGrossMargins[length - 1].quotedGrossMarginActualList
  ProjectUnitPrice["shiji"] = {
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
  ProjectUnitPrice["shiji"].xAxis.data = ["目标价（内部）", "目标价（客户）", "本次报价"]
  ProjectUnitPrice["shiji"].series = sjTable.map((item: any) => {
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
      data: [item.interiorPrice, item.clientPrice, item.thisQuotationPrice]
    }
  })
  RevenueGrossMargin["shiji"] = {
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
    series: []
  }
  data.allRes.projectBoard.forEach((item) => {
    if (!item.gradientId) {
      let ritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "毛利率")
      let xssritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "销售收入")
      let ritem = ritems[0]
      let xssritem = xssritems[0]
      ProjectUnitPrice["shiji"].series.push({
        yAxisIndex: 1,
        name: "整体毛利率",
        type: "line",
        tooltip: {
          formatter: "{a}{b}{c}%"
        },
        // 临时造的数据没有看到该字段
        data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
      })
      RevenueGrossMargin["shiji"].series.push({
        yAxisIndex: 1,
        name: "整体毛利率",
        type: "line",
        tooltip: {
          formatter: "{a}{b}{c}%"
        },
        // 临时造的数据没有看到该字段
        data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
      })
      RevenueGrossMargin["shiji"].series.push({
        name: "销售收入",
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: [xssritem.interiorTarget, xssritem.clientTarget, xssritem.offer]
      })
    }
  })
  setTimeout(() => {
    initCharts("unitpriceChart" + "shiji", ProjectUnitPrice["shiji"])
    initCharts("revenueGrossMarginChart" + "shiji", RevenueGrossMargin["shiji"])
  }, 500)
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

//成本信息表
const downLoad = async () => {
  console.log("downLoad")
  let planMap = {}
  let solutionTables: any[] = []
  productList.value.forEach((item: any) => {
    planMap[item.id as keyof Object] = item
  })
  planList.forEach((item) => {
    if (planMap[item.value as keyof Object] && item.isOffer) {
      solutionTables.push(planMap[item.value as keyof Object])
    }
  })
  try {
    let res: any = await PostDownloadMessageSecond({ auditFlowId, solutionTables, version: 1, ntime: 1 })
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

const calculateFullGrossMarginNew = async (row: any, index: any) => {
  let { result } = await PostGrossMarginForGradient({
    auditFlowId: auditFlowId,
    gradientId: row.gradientId,
    unitPrice: row.thisQuotationPrice,
    solutionId: row.solutionId
  })
  data.allRes.gradientQuotedGrossMargins[index].thisQuotationGrossMargin = result.grossMargin
  data.allRes.gradientQuotedGrossMargins[index].thisQuotationClientGrossMargin = result.clientGrossMargin
  data.allRes.gradientQuotedGrossMargins[index].thisQuotationNreGrossMargin = result.nreGrossMargin
  let grossMargins = data.allRes.gradientQuotedGrossMargins.filter((item) => item.thisQuotationGrossMargin)
  // console.log(grossMargins, grossMargins.length)

  let { sl, xscb, xsml, xssr, yj } = result
  data.allRes.gradientQuotedGrossMargins[index].sl = sl // 数量
  data.allRes.gradientQuotedGrossMargins[index].xscb = xscb // 销售成本
  data.allRes.gradientQuotedGrossMargins[index].xsml = xsml // 销售毛利
  data.allRes.gradientQuotedGrossMargins[index].xssr = xssr // 销售收入
  data.allRes.gradientQuotedGrossMargins[index].yj = yj // 佣金

  console.log(gradientTableMap)
  // 当所有都计算完成时，触发报价毛利率测算-实际数量的联动
  if (grossMargins.length === data.allRes.gradientQuotedGrossMargins.length) {
    data.allRes.quotedGrossMargins.forEach((item, index) => {
      item.quotedGrossMarginActualList.forEach(async (row, rowIndex) => {
        await calculateFullGrossMarginNewSj(row, rowIndex, index, item.quotedGrossMarginActualList)
      })
    })
    gradientTableMapResult.value = []
    data.allRes.projectBoard.forEach((item) => {
      if (gradientTableMap.value[item.gradientId]) {
        let result = gradientTableMap.value[item.gradientId].reduce((pre, cur) => {
          return {
            sl: pre.sl + cur.sl,
            xscb: pre.xscb + cur.xscb,
            yj: pre.yj + cur.yj,
            xssr: pre.xssr + cur.xssr,
            gradientId: item.gradientId
          }
        })
        gradientTableMapResult.value.push(result)
        console.log(result, "result", gradientTableMap.value[item.gradientId])
      }
    })
    data.allRes.projectBoard.forEach((item) => {
      gradientTableMapResult.value.forEach((ritem) => {
        if (item.gradientId === ritem.gradientId) {
          item.projectBoardModels.forEach((row) => {
            if (row.projectName === "数量") {
              row.offer = ritem.sl
            }
            if (row.projectName === "销售成本") {
              row.offer = ritem.xscb
            }
            if (row.projectName === "销售收入") {
              row.offer = ritem.xssr
            }
            if (row.projectName === "单位平均成本") {
              row.offer = ritem.xscb / ritem.sl
            }
            if (row.projectName === "平均单价") {
              row.offer = ritem.xssr / ritem.sl
            }
            if (row.projectName === "销售毛利") {
              row.offer = ritem.xssr - ritem.xscb - ritem.yj
            }
            if (row.projectName === "毛利率") {
              row.offer = ((ritem.xssr - ritem.xscb - ritem.yj) / ritem.xssr) * 100
            }
            if (row.projectName === "佣金") {
              row.offer = ritem.yj
            }
          })
        }
      })
    })
  }
}

const calculateFullGrossMarginNewSj = async (row: any, rowIndex: number, index: number, list: any) => {
  if (row.product === "齐套") {
    try {
      const { result } = await PostGrossMarginForactualQt({
        AuditFlowId: auditFlowId,
        CarModel: row.carModel,
        SoltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
          return {
            Gradientid: item.gradientId,
            UnitPrice: item.thisQuotationPrice,
            SolutionId: item.solutionId
          }
        }),
        SolutionIdsAndcarNums: list
          .map((item: any) => {
            return {
              carNum: item.carNum,
              SolutionId: item.solutionId
            }
          })
          .slice(0, list.length - 1)
      })
      console.log(result)
      // yearDimension.value = result

      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationGrossMargin =
        result.grossMargin
      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationClientGrossMargin =
        result.clientGrossMargin
      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationNreGrossMargin =
        result.nreGrossMargin
      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationPrice = result.unitPrice
    } catch (error) {
      console.log(error)
    }
    return
  }
  let { result } = await PostGrossMarginForactual({
    AuditFlowId: auditFlowId,
    gradientId: row.gradientId,
    // unitPrice: row.thisQuotationPrice,
    SolutionId: row.solutionId,
    CarModel: row.carModel,
    SoltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
      return {
        Gradientid: item.gradientId,
        UnitPrice: item.thisQuotationPrice,
        SolutionId: item.solutionId
      }
    })
  })
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationGrossMargin =
    result.grossMargin
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationClientGrossMargin =
    result.clientGrossMargin
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationNreGrossMargin =
    result.nreGrossMargin
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationPrice = result.unitPrice

  let { sl, xscb, xsml, xssr, yj } = result
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].sl = sl // 数量
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].xscb = xscb // 销售成本
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].xsml = xsml // 销售毛利
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].xssr = xssr // 销售收入
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].yj = yj // 佣金

  if (
    data.allRes.quotedGrossMargins.length === index + 1 &&
    data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.length === rowIndex + 1
  ) {
    let slLenth = data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.filter((item) => item.sl)
    if (slLenth.length === data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.length) {
      let ritem = data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.reduce((pre, cur) => {
        return {
          sl: pre.sl + cur.sl,
          xscb: pre.xscb + cur.xscb,
          yj: pre.yj + cur.yj,
          xssr: pre.xssr + cur.xssr
        }
      })

      data.allRes.projectBoard.forEach((item) => {
        if (!item.gradientId) {
          item.projectBoardModels.forEach((row) => {
            if (row.projectName === "数量") {
              row.offer = ritem.sl
            }
            if (row.projectName === "销售成本") {
              row.offer = ritem.xscb
            }
            if (row.projectName === "销售收入") {
              row.offer = ritem.xssr
            }
            if (row.projectName === "单位平均成本") {
              row.offer = ritem.xscb / ritem.sl
            }
            if (row.projectName === "平均单价") {
              row.offer = ritem.xssr / ritem.sl
            }
            if (row.projectName === "销售毛利") {
              row.offer = ritem.xssr - ritem.xscb - ritem.yj
            }
            if (row.projectName === "毛利率") {
              row.offer = ((ritem.xssr - ritem.xscb - ritem.yj) / ritem.xssr) * 100
            }
            if (row.projectName === "佣金") {
              row.offer = ritem.yj
            }
          })
        }
      })
    }
    setChartData()
  }
}
const comfirmPlans = async () => {
  // fullscreenLoading.value = true
  let planMap = {}
  let solutionTables: any[] = []
  productList.value.forEach((item: any) => {
    planMap[item.id as keyof Object] = item
  })
  planList.forEach((item) => {
    if (planMap[item.value as keyof Object] && item.isOffer) {
      solutionTables.push(planMap[item.value as keyof Object])
    }
  })
  planListArr.push(solutionTables)
  // try {
  //   let res = await PostStatementAnalysisBoardSecond({ auditFlowId, solutionTables })
  //   console.log(res)
  //   console.log(planList)
  //   console.log(solutionTables)
  //   data.allRes = res.result
  //   fullscreenLoading.value = false
  // } catch (error) {
  //   fullscreenLoading.value = false
  // }
}
const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}
const save = async () => {
  // let version = right==='2'?0:
  if (auditFlowId) {
    let saveData = {
      version: 0,
      ntime: 0,
      IsOffer: false,
      Solutions: planListArr,
      ...data.allRes,
      auditFlowId
    }
    let res = await PostIsOfferSaveSecond(saveData)
    console.log(res, "saveData")
  }

  console.log(productList, planListArr, data.allRes)
}
const postOffer = async (isOffer: boolean) => {
  if (auditFlowId) {
    let saveData = {
      version: 0,
      ntime: 1,
      solutions: selectPlan.value,
      ...data.allRes,
      isOffer,
      auditFlowId
    }
    delete saveData.isSuccess
    delete saveData.message
    delete saveData.mes
    let res = await PostIsOfferSecond(saveData)
    console.log(res)
  }
}
const toMarketingApproval = () => {
  debugger
  router.push({
    path: "/quoteAnalysis/marketingApproval",
    query: {
      auditFlowId
    }
  })
}
const handleSubmit = async ({ comment, opinion, nodeInstanceId }: any) => {
  let res: any = await SubmitNode({
    comment,
    nodeInstanceId,
    financeDictionaryDetailId: opinion
    // AuditFlowId: auditFlowId,
    // opinionDescription: comment,
    // isAgree: opinion.includes("Done") ? true : false,
  })
  if (res.success) {
    ElMessage({
      type: "success",
      message: "操作成功"
    })
    // postOffer
  }
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')

  if (auditFlowId) {
    let res = await GetSolution(auditFlowId)
    const resp: any = await getProductByAuditFlowId(auditFlowId)
    productList.value = resp.result
    // await productStore.setProductList(Number(auditFlowId))
    // productStore.setProductList(auditFlowId)
    // let res = await PostStatementAnalysisBoardSecond({ auditFlowId })
    // console.log(res)
  }
  if (right === "1") {
    let res = await getStatementAnalysisBoardSecond({ auditFlowId, version: 0 })
    console.log(res, "getStatementAnalysisBoardSecond")
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
