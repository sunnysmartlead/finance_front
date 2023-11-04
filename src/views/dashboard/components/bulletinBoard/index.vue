<template>
  <div class="dashboard">
    <el-card class="m-2">
      <el-row justify="end" align="middle">
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
          <!-- <el-form-item label="项目代码:" prop="projectCode">
            <el-input v-model="data.form.projectCode" />
          </el-form-item>
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="data.form.projectCode" />
          </el-form-item> -->
          <el-form-item label="梯度:" prop="gradientId">
            <el-select v-model="data.form.gradientId" placeholder="请选择梯度" @change="initGradientId">
              <el-option v-for="item in data.gradientList" :key="item.id" :label="`${item.gradientValue} (K/Y)`"
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
        :gradientId="data.form.gradientId" />
      <!-- 损耗成本  -->
      <lossTable :hideEdit="hideEdit" v-if="data.mode === '2'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="init" />
      <!-- 制造成本  -->
      <manufactureTable :hideEdit="hideEdit" v-if="data.mode === '3'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="init" />
      <!-- 物流成本  -->
      <logisticsTable :hideEdit="hideEdit" v-if="data.mode === '4'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="init" />
      <!-- 质量成本  -->
      <qualityTable :hideEdit="hideEdit" v-if="data.mode === '5'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="init" />
      <!-- 其他成本  -->
      <otherCostTable :hideEdit="hideEdit" v-if="data.mode === '6'" :yearData="filterYearData"
        :gradientId="data.form.gradientId" :on-refresh="init" />
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
        <el-checkbox :disabled="checkList.includes('StructBomPriceAudit')"
          label="StructPriceInput">资源管理课-结构单价录入</el-checkbox>
        <el-checkbox :disabled="checkList.includes('ElecBomPriceAudit')"
          label="ElectronicPriceInput">资源管理课-电子单价录入</el-checkbox>
        <el-checkbox :disabled="checkList.includes('StructPriceInput')"
          label="StructBomPriceAudit">资源管理课-结构单价审核界面</el-checkbox>
        <el-checkbox :disabled="checkList.includes('ElectronicPriceInput')"
          label="ElecBomPriceAudit">资源管理课-电子单价审核</el-checkbox>
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
  SetPriceBoardState,
  GetPriceEvaluationTableInputCount,
  SetPriceEvaluationTableInputCount,
  CreatePriceEvaluationTable,
  GetIsTradeCompliance,
  PriceEvaluationTableDownload,
} from "../../service"
import { getPriceEvaluationTable } from '../../../demandApply/service'
import getQuery from "@/utils/getQuery"
import type { UploadProps, UploadUserFile, FormInstance } from "element-plus"
import { ElMessage, ElMessageBox, ElLoading } from "element-plus"
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
import { isEmpty } from "lodash"
import useJump from "@/hook/useJump"
import SchemeCompare from "@/components/SchemeCompare/index.vue"
import TrDownLoad from "@/components/TrDownLoad/index.vue"

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
let dialogVisible = ref(false)
let checkList = ref([""])
let opinionDescription = ref("")
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
  priceEvaluationTableInputCount: [] //核价表投入量和年份
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
  if (!productId || !auditFlowId || !year || !upDown) return
  console.log('运行了111')
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

onBeforeMount(() => { })

onMounted(() => {
  if (!auditFlowId) return false
  init()
  getPriceEvaluationTableInputCount()
  getIsTradeCompliance()
})

const initGradientId = async () => {
  if (!productId) return false
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    await getGoTableChartData()
    await fetchAllData()
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
  await queryGradientList()
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
    if (!upDown || !year) return
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
    if(!upDown || !year) return
    const { result }: any = await GetPricingPanelProfit({
      Year: year,
      AuditFlowId: auditFlowId,
      SolutionId: productId,
      UpDown: upDown,
      GradientId: data.form.gradientId,
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
  const { year, upDown } = filterYearData.value
  if (!year || !upDown) return
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
  getTotal()
  getPricingPanelProportionOfProductCost()
  getPricingPanelProfit()
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
