<template>
  <div class="dashboard">
    <el-card class="m-2">
      <el-row justify="end" align="middle">
        <el-upload
          :action="$baseUrl + 'api/services/app/PriceEvaluation/EvalTableImport'"
          :on-success="handleBomimportSuccess"
          show-file-list
          :on-progress="handleGetUploadProgress"
          :on-error="handleUploadError"
          name="excle"
          v-if="['EvalReason_Ffabg', 'EvalReason_Qt'].includes(data.opinion)"
        >
          <el-button type="primary" style="margin: 10px 10px 0 0;">上传bom成本</el-button>
        </el-upload>
        <el-upload v-if="!hideEdit" v-model:file-list="fileList" show-file-list
          :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'" :on-success="handleSuccess"
          :on-change="handleFileChange" style="float: right" :on-progress="handleGetUploadProgress"
          :on-error="handleUploadError">
          <el-button type="primary" style="margin: 10px 10px 0 0;">TR方案上传</el-button>
        </el-upload>
        <TrDownLoad v-if="hideEdit" />
        <el-button type="primary" class="m-2" @click="handlePathFethNreTable">NRE核价表</el-button>
        <el-button type="primary" class="m-2" @click="handleFetchPriceEvaluationTableDownload"> 核价表下载 </el-button>
        <SchemeCompare :upDown="filterYearData.upDown" :year="filterYearData.year" :gradientId="data.form.gradientId" />
        <slot name="header" />
      </el-row>
      <el-row class="m-2">
        <el-form inline :model="data.form" ref="refForm" :rules="data.rules">
          <el-form-item label="梯度:" prop="gradientId">
            <el-select v-model="data.form.gradientId" placeholder="请选择梯度" @change="initGradientId">
              <el-option v-for="item in data.gradientList" :key="item.id" :label="`${item.gradientValue} ${item.upDown === 0 ? '(K/Y)' : '(K/HY)'}`"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="年份:" prop="projectName">
            <el-select v-model="data.form.year" placeholder="请选择年份" @change="fetchAllData">
              <el-option v-for="item in data.yearsOptions" :key="item.id"
                :label="`${item.name} ${upDownEnum[item.upDown]}`" :value="`${item.id}-${item.upDown}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="m-2">
        <el-radio-group v-model="data.mode">
          <template v-for="item in dashboardPannel" :key="item.title">
            <el-radio :label="item.value" size="large" border>
              {{ item.title }}
            </el-radio>
          </template>
        </el-radio-group>
      </el-row>
    </el-card>

    <el-card m="2">
      <!-- Bom成本  -->
      <bomTable :hideEdit="hideEdit" v-if="data.mode === '1'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="initPage" />
      <!-- 损耗成本  -->
      <lossTable :hideEdit="hideEdit" v-if="data.mode === '2'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="fetchAllData" />
      <!-- 制造成本  -->
      <manufactureTable :hideEdit="hideEdit" v-if="data.mode === '3'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="fetchAllData" />
      <!-- 物流成本  -->
      <logisticsTable :hideEdit="hideEdit" v-if="data.mode === '4'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="fetchAllData" />
      <!-- 质量成本  -->
      <qualityTable :hideEdit="hideEdit" v-if="data.mode === '5'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="fetchAllData" />
      <!-- 其他成本  -->
      <otherCostTable :hideEdit="hideEdit" v-if="data.mode === '6'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="fetchAllData" />
        <el-descriptions :column="1" border m="2">
          <el-descriptions-item label="总成本：">
            {{ data.totalCost?.toFixed(2) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    <el-card style="margin-top: 10px" m="2">
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
    <el-card style="margin-top: 10px" m="2">
      <!-- 产品总成本推移图 -->
      <div id="selectCostChart" />
    </el-card>

  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, onBeforeMount, ref, computed } from "vue"
import { dashboardPannel, percentageCostChartData, costChartData, selectCostChartData } from "../../common/const"
import {
  GetGradient,
  // GetPricingPanelProductSelectList,
  GetPricingPanelTimeSelectList,
  GetPricingPanelProportionOfProductCost,
  GetPricingPanelProfit,
  GetGoTable,
  addPricingPanelTrProgrammeId,
  GetPriceEvaluationTableInputCount,
  CreatePriceEvaluationTable,
  GetIsTradeCompliance,
  PriceEvaluationTableDownload,
} from "../../service"
import { getPriceEvaluationTable } from '../../../demandApply/service'
import getQuery from "@/utils/getQuery"
import type { UploadProps, UploadUserFile, FormInstance } from "element-plus"
import { ElMessage, ElLoading } from "element-plus"
import debounce from "lodash/debounce"
import * as echarts from "echarts"
import router from "@/router"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { useRoute } from "vue-router"
import bomTable from "../bomTable/index.vue"
import lossTable from "../lossTable/index.vue"
import manufactureTable from "../manufactureTable/index.vue"
import logisticsTable from "../logisticsTable/index.vue"
import qualityTable from "../qualityTable/index.vue"
import otherCostTable from "../otherCostTable/index.vue"
import useJump from "@/hook/useJump"
import SchemeCompare from "@/components/SchemeCompare/index.vue"
import TrDownLoad from "@/components/TrDownLoad/index.vue"
import { formatThousandths } from '@/utils/number'
import { getPriceEvaluationStartData } from "../../../demandApply/service"

enum upDownEnum {
  "全年",
  "上半年",
  "下半年"
}

const props = defineProps({
  hideEdit: Boolean
})

const route = useRoute()
const { closeSelectedTag } = useJump()
const { auditFlowId, productId }: any = getQuery()
let isHandleCreatePriceEvaluation: any = true
let costChart: any = null
let percentageCostChart: any = null
let selectCostChart: any = null
const fileList = ref<UploadUserFile[]>([])
const refForm = ref<FormInstance>()
const data = reactive<any>({
  year: "",
  mode: "1",
  yearsOptions: [],
  productInputs: 0,
  createVisible: false,
  compliance: false,
  totalCost: 0,
  form: {
    year: "",
    projectCode: "",
    projectName: "",
    gradientId: ""
  },
  gradientList: [],
  rules: {
    projectName: [{ required: true, message: "请输入该值", trigger: "blur" }],
    projectCode: [{ required: true, message: "请输入该值", trigger: "blur" }]
  },
  priceEvaluationTableInputCount: [], //核价表投入量和年份
  opinion: null,
})

const filterYearData = computed(() => {
  if (!data.form.year) return {}
  const filterYearItem = data.form.year.split('-')
  return {
    year: Number(filterYearItem[0]),
    upDown: Number(filterYearItem[1])
  }
})

const getTotal = async () => {
  const { upDown, year } = filterYearData.value
  if (!productId || !auditFlowId || !year) return
  const { result } = await getPriceEvaluationTable({
    InputCount: data.productInputs,
    Year: year,
    AuditFlowId: auditFlowId,
    SolutionId: productId,
    UpDown: upDown,
    GradientId: data.form.gradientId,
  }) || {}
  const { totalCost } = result
  data.totalCost = totalCost
}

const handleSuccess: UploadProps["onSuccess"] = async (res: any) => {
  let response: any = await addPricingPanelTrProgrammeId(auditFlowId, res.result.fileId)
  if (response.success) {
    console.log(response, "response")
    console.log("上传成功")
  }
}

const queryGradientList = async () => {
  if (!auditFlowId) return
  const res: any = await GetGradient({
    auditFlowId
  })
  if (res.result?.items) {
    data.gradientList = res.result?.items
    data.form.gradientId = data.gradientList[0].id
  }
  console.log(res, "[获取梯度]")
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

const initGradientId = async () => {
  if (!productId) return false
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    await fetchAllData()
    await getGoTableChartData()

    loading.close()
  } catch {
    loading.close()
  }
}

const init = async () => {
  if (!auditFlowId) return false
  await initChart()
  await fetchOptionsData()
  await initGradientId()
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

// 获取核价表模组的InputCount（投入量）和年份
const getPriceEvaluationTableInputCount = async () => {
  const {
    result: { items = [] }
  }: any = await GetPriceEvaluationTableInputCount(auditFlowId)
  data.priceEvaluationTableInputCount = items
}

// 初始化下拉项数据
const fetchOptionsData = async () => {
  await getPricingPanelTimeSelectList()
  await queryGradientList()
}

// 核价看板-[时间选择]下拉框下拉数据
const getPricingPanelTimeSelectList = async () => {
  try {
    const PanelTimeSelectRes: any = await GetPricingPanelTimeSelectList({ AuditFlowId: auditFlowId })
    data.yearsOptions = PanelTimeSelectRes?.result?.items
    const firstItem = data.yearsOptions[0]
    if (firstItem) {
      data.form.year = `${firstItem.id}-${firstItem.upDown}`
      console.log(data.form.year, data.yearsOptions[0], "getPricingPanelTimeSelectList")
    }
  } catch (err: any) {
    console.log(err, "[ 获取时间选择下拉数据失败 ]")
  }
}

// 产品核价表下载
const handleFetchPriceEvaluationTableDownload = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '下载中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const result: any = await PriceEvaluationTableDownload({
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      GradientId: data.form.gradientId,
    })
    const blob = result
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function () {
      let url = URL.createObjectURL(new Blob([blob]))
      let a = document.createElement("a")
      document.body.appendChild(a) //此处增加了将创建的添加到body当中
      a.href = url
      a.download = '产品核价表.xlsx'
      a.target = "_blank"
      a.click()
      a.remove() //将a标签移除
    }
    loading.close()
  } catch {
    loading.close()
  }
}

// NRE核价表下载
const handlePathFethNreTable = async () => {
  router.push({
    path: "/nre/nrePricelist",
    query: {
      year: filterYearData?.value?.year,
      auditFlowId,
      productId,
      upDown: filterYearData?.value?.upDown,
      hideEdit: props.hideEdit ? 1 : 0
    }
  })
}


// 核价看板-产品成本占比图
const getPricingPanelProportionOfProductCost = async () => {
  try {
    const { upDown, year } = filterYearData.value
    if (!year) return
    const { result }: any = await GetPricingPanelProportionOfProductCost({
      Year: year,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      UpDown: upDown,
      GradientId: data.form.gradientId,
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
    const { upDown, year } = filterYearData.value
    const { result }: any = await GetPricingPanelProfit({
      Year: year,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      UpDown: upDown,
      GradientId: data.form.gradientId,
    })
    const val = result?.items?.map((val: any) => formatThousandths(null,null, val?.proportion) || 0)
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
  const { year, upDown } = filterYearData.value
  if (!year) return
  const {
    result: { items = [] }
  }: any = await GetGoTable({
    InputCount: data.productInputs,
    Year: year,
    AuditFlowId: auditFlowId,
    SolutionId: productId,
    UpDown: upDown,
    GradientId: data.form.gradientId,
  })

  const value = items.map((item: any) => item?.value?.toFixed(2) || 0) || []
  const years = items.map((val: any) => val.year + upDownEnum[val.upDown]) || []
  console.log('[获取推移图]', years, value)
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

const initPage = () => {
  getGoTableChartData()
  fetchAllData()
}

const fetchAllData = async () => {
  getTotal()
  getPricingPanelProportionOfProductCost()
  getPricingPanelProfit()
}

const fetchPriceEvaluationStartData = async () => {
  const { result, success } = await getPriceEvaluationStartData(auditFlowId)
  if (success) {
    data.opinion = result.opinion
  }
}

const handleBomimportSuccess: UploadProps["onSuccess"] = (res: any) => {
  console.log(res)
  if (res.success) {

    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
}

onMounted(() => {
  if (!auditFlowId) return false
  fetchPriceEvaluationStartData()
  init()
  getPriceEvaluationTableInputCount()
  getIsTradeCompliance()
})

defineExpose({
  getFileList: () => fileList.value
})
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
}</style>
