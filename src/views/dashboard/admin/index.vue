<template>
  <div class="dashboard">
    <el-card class="m-2">
      <el-row align="middle">
        <!-- <el-select class="m-2" v-model="data.product" placeholder="请选择产品" @change="fetchAllData">
          <el-option v-for="item in data.productOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select> -->
        <el-button type="primary" class="m-2" @click="handleFetchPriceEvaluationTableDownload"> 产品核价表 </el-button>
        <el-button type="primary" class="m-2" @click="handleFethNreTableDownload">NRE核价表</el-button>
        <el-button type="primary" class="m-2" @click="data.createVisible = true"> 生成核价表 </el-button>
      </el-row>
      <el-row class="m-2">
        <el-form inline :model="data.form" ref="refForm" :rules="data.rules">
          <el-form-item label="项目代码:" prop="projectCode">
            <el-input v-model="data.form.projectCode" />
          </el-form-item>
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="data.form.projectCode" />
          </el-form-item>
          <el-form-item label="项目名称:" prop="projectName">
            <el-select v-model="data.form.year" placeholder="请选择年份" @change="fetchAllData">
              <el-option v-for="item in data.yearsOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="m-2">
        <el-radio-group v-model="data.mode" @change="handleChangeMode">
          <template v-for="item in dashboardPannel" :key="item.title">
            <el-radio :label="item.value" size="large" border>
              {{ item.title }}
            </el-radio>
          </template>
        </el-radio-group>
      </el-row>
    </el-card>

    <el-card class="m-2">
      <el-card header="成本明细表">
        <!-- Bom成本  -->
        <div v-if="data.mode === '1'">
          <el-table :data="data.bomData" border height="675">
            <el-table-column prop="superType" label="超级大种类" width="180" />
            <el-table-column prop="materialName" label="材料名称" width="180" />
            <el-table-column prop="typeName" label="物料种类" width="180" />
            <el-table-column prop="categoryName" label="物料大类" width="150" />
            <el-table-column prop="assemblyCount" label="装配数量" />
            <el-table-column prop="materialPrice" label="材料单价（原币）" width="180" :formatter="toFixedThree" />
            <el-table-column prop="currencyText" label="币别" width="150" />
            <el-table-column prop="exchangeRate" label="汇率" width="150" :formatter="toFixedThree" />
            <el-table-column prop="materialPriceCyn" label="材料单价（人民币）" width="180" :formatter="toFixedThree" />
            <el-table-column prop="totalMoneyCyn" label="合计金额（人民币）" width="180" :formatter="toFixedThree" />
            <el-table-column prop="loss" label="损耗" width="150" :formatter="toFixedThree" />
            <el-table-column prop="materialCost" label="材料成本（含损耗）" width="180" :formatter="toFixedThree" />
            <el-table-column prop="inputCount" label="投入量" width="150" />
            <el-table-column prop="purchaseCount" label="采购量" width="150" />
            <el-table-column prop="moqShareCount" label="MOQ分摊成本" width="150" :formatter="toFixedThree" />
            <el-table-column prop="moq" label="MOQ" />
            <el-table-column prop="availableInventory" label="可用库存" width="150" />
            <el-table-column prop="remarks" label="备注" />
          </el-table>
          <el-descriptions title="" border :column="2">
            <el-descriptions-item label="材料成本合计">{{
              data.allTotalMoneyCyn?.toFixed(2) || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="电子料大类成本合计">{{
              data.allPrice?.toFixed(2) || "-"
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 损耗成本  -->
        <el-table
          v-if="data.mode === '2'"
          :data="data.lossData"
          height="675"
          :summary-method="(val: any) => getSummaries(val, '损耗成本', 'wastageCost')"
          show-summary
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="name" label="成本项目" />
          <el-table-column prop="wastageCost" label="损耗成本" :formatter="toFixedTwo" />
          <el-table-column prop="moqShareCount" label="MOQ分摊成本" :formatter="toFixedTwo" />
        </el-table>
        <!-- 制造成本  -->
        <el-table v-if="data.mode === '3'" :data="data.manufactureData" border height="675">
          <!-- <el-table-column prop="sapItemNum" label="项目" width="180" /> -->
          <el-table-column prop="costItem" label="成本项目" width="180" />
          <!-- <el-table-column prop="typeName" label="年份" width="180" /> -->
          <el-table-column prop="manufacturingCostDirect" label="直接制造成本" :formatter="toFixedTwo">
            <el-table-column
              prop="manufacturingCostDirect.directLabor"
              label="直接人工"
              width="150"
              :formatter="toFixedTwo"
            />
            <el-table-column
              prop="manufacturingCostDirect.equipmentDepreciation"
              label="设备折旧"
              width="150"
              :formatter="toFixedTwo"
            />
            <el-table-column
              prop="manufacturingCostDirect.lineChangeCost"
              label="换线成本"
              width="150"
              :formatter="toFixedTwo"
            />
            <el-table-column
              prop="manufacturingCostDirect.manufacturingExpenses"
              label="制造费用"
              width="150"
              :formatter="toFixedTwo"
            />
            <el-table-column prop="manufacturingCostDirect.subtotal" label="小计" width="150" :formatter="toFixedTwo" />
          </el-table-column>
          <el-table-column prop="manufacturingCostIndirect" label="间接制造成本">
            <el-table-column
              prop="manufacturingCostIndirect.directLabor"
              label="直接人工"
              width="150"
              :formatter="toFixedTwo"
            />
            <el-table-column
              prop="manufacturingCostIndirect.equipmentDepreciation"
              label="设备折旧"
              width="150"
              :formatter="toFixedTwo"
            />
            <!-- <el-table-column prop="manufacturingCostIndirect.typeName" label="换线成本" width="180" /> -->
            <el-table-column
              prop="manufacturingCostIndirect.manufacturingExpenses"
              label="制造费用"
              width="150"
              :formatter="toFixedTwo"
            />
            <el-table-column
              prop="manufacturingCostIndirect.subtotal"
              label="小计"
              width="150"
              :formatter="toFixedTwo"
            />
          </el-table-column>
          <el-table-column label="合计" prop="subtotal" :formatter="toFixedTwo" />
        </el-table>
        <!-- 物流成本  -->
        <el-table :data="data.logisticsData" border v-if="data.mode === '4'" height="675">
          <el-table-column prop="year" label="年份" width="80" />
          <el-table-column prop="freight" label="运费/月" width="180" :formatter="toFixedTwo" />
          <el-table-column prop="monthEndDemand" label="月底需求量" width="180" />
          <el-table-column prop="storageExpenses" label="仓储费用/元" width="180" :formatter="toFixedTwo" />
          <el-table-column prop="perPackagingPrice" label="单PCS包装价格/元" width="150" :formatter="toFixedTwo" />
          <el-table-column prop="perFreight" label="单PCS运输费" width="150" :formatter="toFixedTwo" />
          <el-table-column prop="perTotalLogisticsCost" label="单PCS总物流料成本" width="180" :formatter="toFixedTwo" />
        </el-table>
        <!-- 质量成本  -->
        <el-table :data="data.qualityData" v-if="data.mode === '5'" border height="675">
          <el-table-column prop="productCategory" label="产品类别" />
          <el-table-column prop="costProportion" label="成本比例">
            <template #default="{ row }">
              {{ `${row.costProportion * 100} %` }}
            </template>
          </el-table-column>
          <el-table-column prop="qualityCost" label="质量成本（MAX）">
            <template #default="{ row }">
              {{ `${row?.qualityCost.toFixed(2)}` }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card>
        <el-row>
          <el-col :span="12">
            <div class="dashboard__footer">
              <!-- 饼图 -->
              <div id="percentageCostChart" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="dashboard__body">
              <!-- 总成本图 -->
              <div id="costChart" />
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card style="margin-top: 10px">
        <el-upload
          v-model:file-list="fileList"
          show-file-list
          :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
          :on-success="handleSuccess"
          :on-change="handleFileChange"
          style="float: right"
          :on-progress="handleGetUploadProgress"
          :on-error="handleUploadError"
        >
          <el-button type="primary">TR方案上传</el-button>
        </el-upload>
        <!-- 产品总成本推移图 -->
        <div id="selectCostChart" />
        <div style="float: right; margin: 20px 0" v-havedone>
          <el-button type="primary" :disabled="!data.compliance" @click="setPriceBoardStateAgree(true)">同意</el-button>
          <el-button type="primary" @click="dialogVisible = true">退回</el-button>
        </div>
      </el-card>
    </el-card>
    <el-dialog v-model="dialogVisible" title="退回选择">
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="StructBomImport">产品开发部-结构BOM录入</el-checkbox>
        <el-checkbox label="NreInputEmc">产品开发部-EMC实验费录入</el-checkbox>
        <el-checkbox label="ElectronicBomImport">产品开发部-电子BOM录入</el-checkbox>
        <el-checkbox label="NreInputGage">品质保证部-检具费录入</el-checkbox>
        <el-checkbox label="NreInputTest">品质保证部-实验费录入</el-checkbox>
        <el-checkbox label="NreInputOther">项目管理部-NRE费用录入</el-checkbox>
        <el-checkbox label="ElecLossRateInput">工程技术部-电子损耗率录入</el-checkbox>
        <el-checkbox label="StructLossRateInput">工程技术部-结构损耗率录入</el-checkbox>
        <el-checkbox label="ManHourImport">工程技术部-工序工时录入</el-checkbox>
        <el-checkbox label="LogisticsCostInput">生产管理部-物流成本录入</el-checkbox>
        <el-checkbox label="NreInputMould">资源管理课-模具单价录入</el-checkbox>
        <el-checkbox :disabled="checkList.includes('StructBomPriceAudit')" label="StructPriceInput"
          >资源管理课-结构单价录入</el-checkbox
        >
        <el-checkbox :disabled="checkList.includes('ElecBomPriceAudit')" label="ElectronicPriceInput"
          >资源管理课-电子单价录入</el-checkbox
        >
        <el-checkbox :disabled="checkList.includes('StructPriceInput')" label="StructBomPriceAudit"
          >资源管理课-结构单价审核界面</el-checkbox
        >
        <el-checkbox :disabled="checkList.includes('ElectronicPriceInput')" label="ElecBomPriceAudit"
          >资源管理课-电子单价审核</el-checkbox
        >
      </el-checkbox-group>
      <div>
        <div style="margin: 10px 0">拒绝理由：</div>
        <el-input type="textarea" v-model="opinionDescription" />
      </div>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false" v-havedone>取消</el-button>
          <el-button type="primary" @click="setPriceBoardStateAgree(false)" v-havedone>确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="data.createVisible" title="生成核价表">
      <el-table :data="data.priceEvaluationTableInputCount">
        <el-table-column prop="productName" label="产品名称" width="180" />
        <el-table-column prop="year" label="年份">
          <template #default="{ row }">
            <el-select v-model="row.year" class="m-2" placeholder="请选择年份">
              <el-option v-for="item in data.yearsOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="inputCount" label="投入量" width="180">
          <template #default="{ row }">
            <el-input-number controls-position="right" v-model="row.inputCount" placeholder="请输入投入量" />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span>
          <el-button @click="data.createVisible = false">取消</el-button>
          <el-button @click="handleSetPriceEvaluationTableInputCount" :disabled="isPricing" type="primary"
            >设置投入量和年份</el-button
          >
          <el-button
            @click="handleCreatePriceEvaluation"
            type="primary"
            :disabled="isPricing || isHandleCreatePriceEvaluation"
            >生成核价表</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, onBeforeMount, ref, computed } from "vue"
import { dashboardPannel, percentageCostChartData, costChartData, selectCostChartData } from "./common/const"
import {
  GetBomCost,
  GetLossCost,
  GetQualityCost,
  // GetPricingPanelProductSelectList,
  GetPricingPanelTimeSelectList,
  GetPricingPanelProportionOfProductCost,
  GetPricingPanelProfit,
  GetLogisticsCost,
  GetManufacturingCost,
  GetGoTable,
  addPricingPanelTrProgrammeId,
  SetPriceBoardState,
  GetPriceEvaluationTableInputCount,
  SetPriceEvaluationTableInputCount,
  CreatePriceEvaluationTable,
  GetIsTradeCompliance
} from "../service"
import getQuery from "@/utils/getQuery"
import type { UploadProps, UploadUserFile, FormInstance } from "element-plus"
import { ElMessage, ElMessageBox } from "element-plus"
import debounce from "lodash/debounce"
import * as echarts from "echarts"
import useJump from "@/hook/useJump"
import router from "@/router"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { getSummaries } from "./common/getSummaries"
import { useRoute } from "vue-router"

const route = useRoute()
const { closeSelectedTag } = useJump()
const { auditFlowId, productId }: any = getQuery()
let isHandleCreatePriceEvaluation: any = true
let costChart: any = null
let percentageCostChart: any = null
let selectCostChart: any = null
let dialogVisible = ref(false)
let checkList = ref([""])
let opinionDescription = ref("")
const fileList = ref<UploadUserFile[]>([])
const refForm = ref<FormInstance>()
const data = reactive<any>({
  year: "",
  mode: "1",
  yearsOptions: [],
  bomData: [],
  lossData: [],
  manufactureData: [],
  logisticsData: [],
  qualityData: [],
  productInputs: 0,
  createVisible: false,
  compliance: false,
  form: {
    year: "",
    projectCode: "",
    projectName: ""
  },
  rules: {
    projectName: [{ required: true, message: "请输入该值", trigger: "blur" }],
    projectCode: [{ required: true, message: "请输入该值", trigger: "blur" }]
  },
  priceEvaluationTableInputCount: [] //核价表投入量和年份
})

const handleSuccess: UploadProps["onSuccess"] = async (res: any) => {
  let response: any = await addPricingPanelTrProgrammeId(auditFlowId, res.result.fileId)
  if (response.success) {
    console.log(response, "response")
    console.log("上传成功")
  }
}
const handleFileChange: UploadProps["onChange"] = (file, uploadFiles) => {
  console.log(uploadFiles)
  // fileList.value = [{...file. fileName: file.value.filename}]
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

onBeforeMount(() => {})

onMounted(() => {
  if (!auditFlowId) return false
  init()
  getPriceEvaluationTableInputCount()
  getIsTradeCompliance()
})

const toFixedThree = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(3)
  return val
}

const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  return Number(val) ? Number(val).toFixed(2) : 0
}

const init = async () => {
  await initChart()
  await fetchOptionsData()
  if (!productId) return false
  await fetchAllData()
  await getGoTableChartData()
}

const getIsTradeCompliance = async () => {
  const { result }: any = await GetIsTradeCompliance(auditFlowId)
  data.compliance = result
}

onBeforeUnmount(() => {
  console.log("destory")
  costChart?.dispose()
  selectCostChart?.dispose()
  percentageCostChart?.dispose()
})

const initChart = () => {
  costChart = initCharts("costChart", costChartData)
  percentageCostChart = initCharts("percentageCostChart", percentageCostChartData)
  selectCostChart = initCharts("selectCostChart", selectCostChartData)

  window.onresize = function () {
    percentageCostChart.resize()
    selectCostChart.resize()
    costChart.resize()
  }
}

let isPricing = computed(() => {
  let Pricing = data.priceEvaluationTableInputCount.map((p: any) => p.year)
  let inputCount = data.priceEvaluationTableInputCount.map((p: any) => p.inputCount)
  console.log(data.priceEvaluationTableInputCount, "data.priceEvaluationTableInputCount")
  let flag = Pricing.every((item: number) => item != null)
  let flag2 = inputCount.every((item: number) => item != null)
  return !flag || !flag2
})

// 获取核价表模组的InputCount（投入量）和年份
const getPriceEvaluationTableInputCount = async () => {
  const {
    result: { items = [] }
  }: any = await GetPriceEvaluationTableInputCount(auditFlowId)
  data.priceEvaluationTableInputCount = items
  console.log(items, "getPriceEvaluationTableInputCount")
}

// 初始化下拉项数据
const fetchOptionsData = async () => {
  await getPricingPanelTimeSelectList()
  // getPricingPanelProductSelectList()
}

// 核价看板-【产品选择】下拉框下拉数据
// const getPricingPanelProductSelectList = async () => {
//   try {
//     const ProductSelectRes: any = await GetPricingPanelProductSelectList({ AuditFlowId: auditFlowId })
//     data.productOptions = ProductSelectRes?.result?.items
//   } catch (err: any) {
//     console.log(err, "[ 获取下拉数据失败 ]")
//   }
// }

// 核价看板-[时间选择]下拉框下拉数据
const getPricingPanelTimeSelectList = async () => {
  try {
    const PanelTimeSelectRes: any = await GetPricingPanelTimeSelectList({ AuditFlowId: auditFlowId })
    data.yearsOptions = PanelTimeSelectRes?.result?.items
    data.form.year = data.yearsOptions[0].id
    console.log(data.form.year, data.yearsOptions[0].id, "getPricingPanelTimeSelectList")
  } catch (err: any) {
    console.log(err, "[ 获取时间选择下拉数据失败 ]")
  }
}

// 获取 bom成本（含损耗）汇总表
const getBomCost = async () => {
  try {
    const { result }: any = await GetBomCost({
      Year: data.form.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })
    const { material = [], totalMoneyCynCount, electronicCount } = result
    data.bomData = material || []
    data.allPrice = electronicCount
    data.allTotalMoneyCyn = totalMoneyCynCount
    console.log(result, "获取 bom成本（含损耗）汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 bom成本（含损耗）汇总表数据失败 ]")
  }
}

// 获取损耗成本
const getLossCost = async () => {
  try {
    const { result }: any = await GetLossCost({
      Year: data.form.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })
    data.lossData = result || []
    console.log(result, "获取损耗成本")
  } catch (err: any) {
    console.log(err, "[ 获取损耗成本数据失败 ]")
  }
}

// 获取 质量成本
const getQualityCost = async () => {
  try {
    const { result }: any = await GetQualityCost({
      Year: data.form.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })
    data.qualityData = [result] || []
  } catch (err: any) {
    console.log(err, "[ 获取 质量成本数据失败 ]")
  }
}

// 产品核价表下载
const handleFetchPriceEvaluationTableDownload = async () => {
  router.push({
    path: `/nupriceManagement/productPriceList`,
    query: {
      auditFlowId,
      productId,
      year: data.form.year
    }
  })
}

// NRE核价表下载
const handleFethNreTableDownload = async () => {
  router.push({
    path: "/nre/nrePricelist",
    query: {
      year: data.form.year,
      auditFlowId,
      productId
    }
  })
}

// 获取 物流成本汇总表
const getLogisticsCost = async () => {
  try {
    const { result }: any = await GetLogisticsCost({
      Year: data.form.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })
    data.logisticsData = result
    console.log(result, "物流成本汇总表")
  } catch (err: any) {
    console.log(err, "[ 获取 物流成本汇总表数据失败 ]")
  }
}

// 获取 制造成本汇总表
const getManufacturingCost = async () => {
  try {
    const { result }: any = await GetManufacturingCost({
      Year: data.form.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })
    data.manufactureData = result
    console.log(result, "getPricingPanelProfit")
  } catch (err: any) {
    console.log(err, "[ 获取 制造成本汇总表据失败 ]")
  }
}

// 核价看板-产品成本占比图
const getPricingPanelProportionOfProductCost = async () => {
  try {
    const { result }: any = await GetPricingPanelProportionOfProductCost({
      Year: data.form.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })
    const value = result?.items.map((val: any) => ({ value: val.proportion?.toFixed(2) || 0, name: val.name }))
    percentageCostChart.setOption({
      ...percentageCostChartData,
      series: percentageCostChartData.series.map((_, index) => {
        return {
          ...percentageCostChartData.series[index],
          data: value
        }
      })
    })
    console.log(value, "核价看板-产品成本占比图")
  } catch (err: any) {
    console.log(err, "[ 获取核价看板-产品成本占比图数据失败 ]")
  }
}

// 核价看板-利润分布图
const getPricingPanelProfit = async () => {
  try {
    const { result }: any = await GetPricingPanelProfit({
      Year: data.form.year,
      AuditFlowId: auditFlowId,
      ModelCountId: productId
    })
    const val = result?.items?.map((val: any) => val?.proportion?.toFixed(2) || 0)
    console.log(val, "getPricingPanelProfit")
    costChart.setOption({
      ...costChartData,
      series: costChartData.series.map((_, index) => {
        return {
          ...costChartData.series[index],
          data: val
        }
      })
    })
    console.log(result.items, "核价看板-利润分布图")
  } catch (err: any) {
    console.log(err, "[ 获取核价看板-利润分布图数据失败 ]")
  }
}

// 获取推移图
const getGoTableChartData = async () => {
  const {
    result: { items = [] }
  }: any = await GetGoTable({ AuditFlowId: auditFlowId, ModelCountId: productId, InputCount: data.productInputs })
  const value = items.map((item: any) => item?.value?.toFixed(2) || 0) || []
  const years = items.map((val: any) => val.year) || []
  selectCostChart = initCharts("selectCostChart", {
    ...selectCostChartData,
    xAxis: {
      ...selectCostChartData.xAxis,
      data: [...years]
    },
    series: selectCostChartData.series.map((_, index) => {
      return {
        ...selectCostChartData.series[index],
        data: value
      }
    })
  })
}

// 同意该审核
const setPriceBoardStateAgree = async (isAgree: boolean) => {
  ElMessageBox["confirm"]("确定执行该操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let res: any
    if (isAgree) {
      res = await SetPriceBoardState(auditFlowId, isAgree, opinionDescription.value)
    } else {
      if (opinionDescription.value) {
        res = await SetPriceBoardState(auditFlowId, isAgree, opinionDescription.value, checkList.value)
      } else {
        ElMessage({
          type: "warning",
          message: "拒绝理由必填"
        })
      }
    }
    if (res.success) {
      closeSelectedTag(route.path)
      ElMessage({
        type: "success",
        message: "操作成功"
      })
    }
  })
}

const fetchAllData = async () => {
  console.log(data.form.year, "data")
  getPricingPanelProportionOfProductCost()
  getPricingPanelProfit()
  handleChangeMode()
}

const handleChangeMode = () => {
  switch (data.mode) {
    case "1":
      getBomCost()
      break
    case "2":
      getLossCost()
      break
    case "3":
      getManufacturingCost()
      break
    case "4":
      getLogisticsCost()
      break
    case "5":
      getQualityCost()
      break
  }
}

// 生成核价表
const handleCreatePriceEvaluation = debounce(async () => {
  await CreatePriceEvaluationTable(auditFlowId).then((data: any) => {
    if (data.success) {
      ElMessage.success("生成成功！")
    }
  })
}, 500)

// 设置投入量和年份
const handleSetPriceEvaluationTableInputCount = debounce(async () => {
  await SetPriceEvaluationTableInputCount({
    auditFlowId,
    modelCountInputCount: data.priceEvaluationTableInputCount.map((item: any) => ({ ...item, modelCountId: item.id }))
  })
  ElMessage.success("设置成功！")
  isHandleCreatePriceEvaluation = false
  getPriceEvaluationTableInputCount()
}, 500)
</script>

<style lang="scss" scoped>
.dashboard {
  #costChart {
    margin: 10px 0;
    height: 400px;
  }
  #selectCostChart {
    margin: 10px 0;
    height: 400px;
  }
  #percentageCostChart {
    margin: 10px 0;
    height: 300px;
  }
}
</style>
