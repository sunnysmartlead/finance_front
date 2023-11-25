<template>
  <!-- 核心器件，nre拆分 -->
  <el-row>
    <el-form inline>
      <el-form-item label="梯度:" prop="gradientId">
      <el-select v-model="data.form.gradientId" placeholder="请选择梯度" @change="init">
        <el-option v-for="item in data.gradientList" :key="item.id" :label="`${item.gradientValue} ${item.upDown === 0 ? '(K/Y)' : '(K/HY)'}`"
          :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="年份:" prop="projectName">
      <el-select v-model="data.year" placeholder="请选择年份" @change="init">
        <el-option v-for="item in data.yearsOptions" :key="item.id"
          :label="`${item.name} ${upDownEnum[item.upDown]}`" :value="`${item.id}-${item.upDown}`" />
      </el-select>
    </el-form-item>
    </el-form>
     <el-button type="primary" class="m-2" @click="downFile" v-if="!hideBtn">核心器件、Nre费用拆分下载</el-button>
  </el-row>
  <div>
    <el-card header="核心器件" m="2">
      <el-table
        :data="data.productAndGradients"
        style="width: 100%"
        border
        height="500px"
      >
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="unitPrice" label="单价" :formatter="formatNum" />
        <el-table-column prop="number" label="数量" width="100" :formatter="formatNum" />
        <el-table-column prop="rate" label="汇率" width="100" :formatter="formatNum" />
        <el-table-column prop="sum" label="合计" />
      </el-table>
    </el-card>
    <el-card header="NRE" m="2">
      <el-descriptions :column="1" border>
        <el-descriptions-item v-for="(key, label) in Object.keys(columns)" :key="key"
          :label="columns[key]">
          {{ data.nres[key] }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { GetCoreComponentAndNreList, GetCoreNRE } from "@/views/quoteAnalysis/service"
import {
  GetGradient,
  GetPricingPanelTimeSelectList,
  GetPriceEvaluationTableInputCount,
} from "../dashboard/service"
import {GetDownloadCoreComponentAndNre} from "./service"
import {downloadFileExcel } from "@/utils"
import getQuery from "@/utils/getQuery"
import { isEmpty } from "lodash"
import map from 'lodash/map'
import { ElMessage, ElMessageBox } from "element-plus"


enum upDownEnum {
  "全年",
  "上半年",
  "下半年"
}

const columns = {
  handPieceCostTotal: "手板件费用",
  mouldInventoryTotal: "模具费用",
  toolingCostTotal: "工装费用",
  fixtureCostTotal: "治具费用",
  qaqcDepartmentsTotal: "检具费用",
  productionEquipmentCostTotal: "生产设备费用",
  deviceStatusSpecial: "专用生产设备",
  deviceStatus: "非专用生产设备",
  laboratoryFeeModelsTotal: "实验费用",
  softwareTestingCostTotal: "测试软件费用",
  travelExpenseTotal: "差旅费",
  restsCostTotal: "其他费用",
  remark: "备注",
  sum: "合计",
}

/**
 * 数据部分
 */
let { auditFlowId, productId: solutionId ,hideBtn} = getQuery()
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
const data = reactive({
  productAndGradients: [],
  nres: {},
  gradientList : [],
  yearsOptions: [],
  form: {
    gradientId: 0,
  },
  year: '',
  priceEvaluationTableInputCount: []
})


const filterYearData = computed(() => {
  if (!data.year) return {}
  const filterYearItem = data.year.split('-')
  console.log(filterYearItem, "filterYearItem")
  return {
    year: Number(filterYearItem[0]),
    upDown: Number(filterYearItem[1])
  }
})

const inputCount = computed(() =>  data.priceEvaluationTableInputCount.reduce((a, b: any) => a + (b.inputCount || 0), 0))

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

const init = async () => {
  if (isEmpty(filterYearData)) return
  console.log(data.form, "filterYearData")
  // return
  const params = { auditFlowId, inputCount: inputCount.value, ...data.form, solutionId, ...filterYearData.value }
  let { result, success }: any = await GetCoreComponentAndNreList({ ...params })
  if (success) {
    console.log(result, "result")
    data.productAndGradients = result
  }
}

const getCoreNRE = async () => {
  const { result, success }: any = await GetCoreNRE({ auditFlowId, solutionId })
  if (success) {
    data.nres = result
  }
}

// 核价看板-[时间选择]下拉框下拉数据
const getPricingPanelTimeSelectList = async () => {
  try {
    const PanelTimeSelectRes: any = await GetPricingPanelTimeSelectList({ AuditFlowId: auditFlowId })
    data.yearsOptions = PanelTimeSelectRes?.result?.items
    const firstItem = data.yearsOptions[0]
    if (firstItem) {
      data.year = `${firstItem.id}-${firstItem.upDown}`
      console.log(data.year, data.yearsOptions[0], "getPricingPanelTimeSelectList")
    }
  } catch (err: any) {
    console.log(err, "[ 获取时间选择下拉数据失败 ]")
  }
}

// 获取核价表模组的InputCount（投入量）和年份
const getPriceEvaluationTableInputCount = async () => {
  const {
    result: { items = [] }
  }: any = await GetPriceEvaluationTableInputCount(auditFlowId)
  data.priceEvaluationTableInputCount = items
  console.log(items, "getPriceEvaluationTableInputCount")
}

const formatNum = (_r: any, _c: any, val: any) => {
  if (!val) return '/'
  return val
}


// 下载核心器件、Nre费用拆分
const downFile = async () => {
  const params = { auditFlowId, inputCount: inputCount.value, ...data.form, solutionId, ...filterYearData.value }
  try {
    let res: any = await GetDownloadCoreComponentAndNre(params)
    downloadFileExcel(res, "核心器件、Nre费用拆分")
    ElMessage.success("下载成功！")
    console.log(res, "NreTableDownload")
  } catch (err: any) {
    console.log(err, "[ NRE核价表下载 失败 ]")
  }


}

onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  if (auditFlowId) {
    await getPriceEvaluationTableInputCount()
    await getPricingPanelTimeSelectList()
    await queryGradientList()
    init()
    getCoreNRE()
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
