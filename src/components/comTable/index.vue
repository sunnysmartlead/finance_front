<template>
  <div>
    <el-card class="table-wrap" v-loading="tableLoading">
      <el-table :data="electronicBomList" height="75vh" @selection-change="selectionChange" ref="multipleTableRef">
        <el-table-column type="selection" width="55" v-if="isVertify" />
        <el-table-column prop="categoryName" label="物料大类" width="100" fixed="left" />
        <el-table-column prop="typeName" label="物料种类" width="80" fixed="left" />
        <el-table-column prop="sapItemNum" label="物料编号" width="80" fixed="left" />
        <el-table-column prop="sapItemName" label="材料名称" width="120" fixed="left" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="80" fixed="left" />
        <el-table-column prop="materialsUseCount" label="项目物料的使用量">
          <el-table-column align="center" :class-name="`column-class-${index}`"
            v-for="(item, index) in allColums?.materialsUseCountYears" prop="materialsUseCount"
            :label="`${item.kv} K/Y`" :key="`materialsUseCount${index}`">
            <el-table-column width="80" v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :prop="`materialsUseCount.${index}.yearOrValueModes.${iIndex}.value`"
              :label="yearItem.year + upDownEunm[yearItem.upDown]" :formatter="formatDatas" />
          </el-table-column>
        </el-table-column>
        <el-table-column prop="currency" label="币种" width="100">
          <template #default="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.currency" placeholder="选择币种">
              <el-option v-for="item in exchangeSelectOptions" :key="item.id" :label="item.exchangeRateKind"
                :value="item.exchangeRateKind" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="systemiginalCurrency" label="系统单价（原币）">
          <el-table-column v-for="(item, index) in allColums?.systemiginalCurrencyYears" align="center"
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" width="150"
            :key="`systemiginalCurrency${index}`">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]" width="150">
              <template #default="scope">
                <el-input-number @mousewheel.native.prevent size="small" v-if="scope.row.isEdit"
                  v-model="scope.row.systemiginalCurrency[index].yearOrValueModes[iIndex].value" controls-position="right"
                  :min="0" @change="handleCalculation(scope.row, scope.$index)" />
                <span v-if="!scope.row.isEdit">{{
                  scope.row.systemiginalCurrency[index]?.yearOrValueModes[iIndex]?.value.toFixed(5)
                }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="inTheRate" label="年降率">
          <el-table-column v-for="(item, index) in allColums?.inTheRateYears" align="center"
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" :key="`inTheRate${index}`">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]" width="100"
              :prop="`inTheRate.${index}.yearOrValueModes.${iIndex}.value`" :formatter="filterinTheRate">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isEdit" v-model="scope.row.inTheRate[index].yearOrValueModes[iIndex].value"
                  type="number">
                </el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="standardMoney" label="本位币">
          <el-table-column v-for="(item, index) in allColums?.standardMoneyYears" align="center"
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" :key="`standardMoney${index}`">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]" width="100"
              :prop="`standardMoney.${index}.yearOrValueModes.${iIndex}.value`" :formatter="filterStandardMoney" />
          </el-table-column>
        </el-table-column>
        <el-table-column prop="moq" label="MOQ" width="150">
          <template #default="{ row }">
            <el-input-number @mousewheel.native.prevent size="small" v-if="row.isEdit" v-model="row.moq" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column prop="rebateMoney" label="物料返利金额" width="120">
          <el-table-column v-for="(item, index) in allColums?.rebateMoneyYears" align="center" :label="`${item.kv} K/Y`"
            width="150" :key="`rebateMoney${index}`" :prop="`rebateMoney.${index}.value`"
            :formatter="formatThousandths">
            <template #default="{ row }">
              <el-input-number @mousewheel.native.prevent size="small" v-if="row.isEdit" v-model="row.rebateMoney[index].value"
                controls-position="right" :min="0" />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="100">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="物料管制状态" width="130">
          <template #default="{ row }">
            <el-select v-model="row.materialControlStatus" :disabled="row.isSubmit">
              <el-option label="ECCN" value="ECCN" />
              <el-option label="EAR99" value="EAR99" />
              <el-option label="待定" value="待定" />
              <el-option label="不涉及" value="不涉及" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="peopleName" label="确认人" />
      </el-table>
      <div>
        <h5>本位币汇总：</h5>
        <el-row class="descriptions-box" v-for="c in allStandardMoney" :key="c?.kv">
          <span class="descriptions-label">{{ `${c.kv} K/Y` }}</span>
          <el-descriptions direction="vertical" :column="c.yearOrValueModes.length" border>
            <el-descriptions-item v-for="yearItem in c.yearOrValueModes" :key="yearItem.year"
              :label="yearItem.year + upDownEunm[yearItem.upDown]">
              {{ yearItem.value.toFixed(4) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script lang="tsx" setup>
import { ref, reactive, onMounted, computed, shallowRef, nextTick, watch } from "vue"
import { ElectronicDto } from "./data.type"
import { ElMessage, ElMessageBox } from "element-plus"
import {
  GetElectronic,
  PostElectronicMaterialEntering,
  PosToriginalCurrencyCalculate,
  BomReview,
  GetBOMElectronicSingle
} from "./common/request"
import { useRoute } from "vue-router"
import { getExchangeRate } from "@/views/demandApply/service"
import getQuery from "@/utils/getQuery"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
import { cloneDeep, debounce } from "lodash"
import { useRouter } from "vue-router"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { setSessionStorage, getSessionStorage, removeSessionStorage } from "@/utils/seeionStrorage"
import { map } from "lodash"

const router = useRouter()
const Host = "ElectronicPriceInput"
const { auditFlowId, productId }: any = getQuery()

const route = useRoute()
const props = defineProps({
  isVertify: Boolean,
  isMergeVertify: Boolean
})

const STORAGE_KEY = "electronicVertify" // 浏览器缓存key
const MERGE_STORAGE_KEY = "electronicMergeVertify"

const tableLoading = ref(false)

// 电子料 - table数据
const electronicBomList = shallowRef<any>([])

// 表单子列数据
const allColums = reactive<any>({
  materialsUseCountYears: [], // 项目物料的使用量
  systemiginalCurrencyYears: [], // 系统单价（原币）
  inTheRateYears: [], // 年降率
  iginalCurrencyYears: [], // 原币
  standardMoneyYears: [], // 本位币
  rebateMoneyYears: [] // 物料返利金额
})
const isAll = ref(false)
const multipleTableRef = ref<InstanceType<any>>()
const multipleSelection = ref<any>()
const exchangeSelectOptions = ref<any>([])

const fetchOptionsData = async () => {
  const exchangeSelect: any = await getExchangeRate({
    maxResultCount: 100,
    skipCount: 0
  })
  exchangeSelectOptions.value = exchangeSelect.result.items || []
}

const toggleSelection = () => {
  nextTick(() => {
    const storageData = getSessionStorage(props.isMergeVertify ? MERGE_STORAGE_KEY : STORAGE_KEY)
    let parseData: any = null
    console.log(storageData, 'storageData')
    if (!storageData) return
    try {
      parseData = JSON.parse(storageData)
    } catch (err) {
      console.log(err, '[电子单价审核界面赋值浏览器缓存失败]')
    }
    if (parseData) {
      const ids = parseData[productId]
      ids.forEach((id: number) => {
        const findItem = electronicBomList.value?.find(c => c.id === id)
        if (findItem) {
          multipleTableRef.value && multipleTableRef.value!.toggleRowSelection(findItem, true)
        }
      })
    }
  })
}

enum upDownEunm {
  "全年",
  "上半年",
  "下半年"
}

const allStandardMoney = computed(() => {
  try {
    const arr = electronicBomList.value
    const rowOne = cloneDeep(arr?.[0]?.standardMoney) || []
    console.log(arr, "allStandardMoney")
    arr?.forEach?.((item: any, index: number) => {
      if (index > 1) {
        const { standardMoney } = item
        standardMoney?.forEach((s: any, sIndex: number) => {
          const { yearOrValueModes } = s
          yearOrValueModes.forEach((y: any, yIndex: number) => {
            rowOne[sIndex].yearOrValueModes[yIndex].value += y.value
          })
        })
      }
    })

    return rowOne
  } catch (err) {
    console.log(err, "报错啦13123")
    return []
  }
})

const formatDatas = (record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue).toFixed() + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return ''
  }
}

const filterStandardMoney = (record: any, _row: any, cellValue: any) => {
  return cellValue?.toFixed(5) || 0
}

const toFixedTwo = (record: any, _row: any, cellValue: any) => {
  return cellValue?.toFixed(2) || ""
}

const filterinTheRate = (record: any, _row: any, cellValue: any) => {
  return `${(cellValue || 0).toFixed(2)} %`
}

onMounted(async () => {
  if (!auditFlowId && !productId) return
  if (props.isVertify) {
    window.sessionStorage.setItem("placePath", router.currentRoute.value.path)
    fetchElectronicInitData().then(() => {
      setTimeout(() => {
        toggleSelection()
      }, 500)
    })
  } else {
    fetchInitData()
  }
  fetchOptionsData()
})

watch(
  () => router.currentRoute.value.path,
  (newValue) => {
    if (props.isVertify) {
      const path = window.sessionStorage.getItem("placePath")
      if (path) {
        //比较两个值是否一致
        if (newValue != path) {
          window.sessionStorage.removeItem("construction")
        }
      }
    }
  },
  { immediate: true }
)
const handleDealWithColumn = (columns: any) => {
  // 初始化表头数据
  const { materialsUseCount, systemiginalCurrency, inTheRate, iginalCurrency, standardMoney, rebateMoney } =
    columns || {}
  allColums.materialsUseCountYears = materialsUseCount || []
  allColums.systemiginalCurrencyYears = systemiginalCurrency || []
  allColums.inTheRateYears = inTheRate || []
  allColums.iginalCurrencyYears = iginalCurrency || []
  allColums.standardMoneyYears = standardMoney || []
  allColums.rebateMoneyYears = rebateMoney || []
}
// 获取初始化数据
const fetchInitData = async () => {
  tableLoading.value = true
  const { result } = await GetElectronic(auditFlowId, productId)
  if (!result) return false
  console.log(result, "获取初始化数据")

  handleDealWithColumn(result[0])
  setTimeout(() => {
    electronicBomList.value = result
    tableLoading.value = false
  }, 300)
}

// 获取电子料初始化数据
const fetchElectronicInitData = async () => {
  tableLoading.value = true
  const { result } = await GetBOMElectronicSingle(auditFlowId, productId)
  console.log(result, "获取初始化数据")
  const { electronicDtos } = result || {}
  // 初始化表头数据
  handleDealWithColumn(electronicDtos[0] || [])

  setTimeout(() => {
    electronicBomList.value = result.electronicDtos
    isAll.value = result.isAll
    tableLoading.value = false
  }, 500)
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}

// 提交电子料单价行数据
const handleSubmit = async (record: ElectronicDto, isSubmit: number, index: number) => {
  if (isSubmit) {
    //提交
    await submitFun(record, isSubmit, index)
  } else {
    //确认
    // await handleSubmitcalculate(record, isSubmit, index)
    await SubmitJudge(record, isSubmit, index)
  }
}

const debounceHandleCalculation = debounce(async (row: any, index: number) => {
  try {
    row.loading = true
    const { success, result } = await PosToriginalCurrencyCalculate(row)
    if (!success && !result.length) throw Error()
    electronicBomList.value[index] = { ...(result || {}), isEdit: true }
    row.loading = false
  } catch (err) {
    console.log(err, "[根据原币计算 计算失败]")
    row.loading = false
    ElMessage.error("计算失败~")
  }
}, 300)

// 根据汇率计算
const handleCalculation = (row: any, index: number) => {
  row.loading = true
  return debounceHandleCalculation(row, index)
}

const SubmitJudge = async (record: any, isSubmit: number, index: number) => {
  await submitFun(record, isSubmit, index)
}

const submitFun = async (record: ElectronicDto, isSubmit: number, index: number) => {
  let { nodeInstanceId } = route.query
  const { success } = await PostElectronicMaterialEntering({
    isSubmit,
    electronicDtoList: [electronicBomList.value[index]],
    auditFlowId,
    opinion: "Done",
    nodeInstanceId
  })
  if (success) ElMessage.success(`${isSubmit ? "提交" : "确认"}成功`)
  fetchInitData()
}

// 修改
const handleEdit = (row: any, isEdit: boolean) => {
  row.isEdit = isEdit
}

const handleSetBomState = async ({ comment, opinion, nodeInstanceId }: any) => {
  if (!opinion.includes("_Yes") && (!multipleSelection.value.length)) {
    ElMessage({
      message: "请选择要退回那些条数据!",
      type: "warning"
    })
    return
  }
  console.log(multipleSelection.value, "[电子料审核ids]")
  await BomReview({
    auditFlowId,
    bomCheckType: 3, //3：“电子Bom单价审核”，4：“结构Bom单价审核”,5:"Bom单价审核"
    comment,
    opinion,
    nodeInstanceId,
    electronicsUnitPriceId: multipleSelection.value
  })
}
//selectionChange 当选择项发生变化时会触发该事件
const selectionChange = async (selection: any) => {
  const ids = map(selection, v => v.id)
  multipleSelection.value = ids
  const storageData = {
    [productId]: ids
  }
  setSessionStorage(props.isMergeVertify ? MERGE_STORAGE_KEY : STORAGE_KEY, JSON.stringify(storageData))
}

defineExpose({
  getSelection: () => multipleSelection.value
})
</script>

<style lang="scss" scoped>
.table-wrap {
  margin-top: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-span {
  color: red;
  font-weight: bold;
}

.descriptions {
  &-box {
    width: 100%;
    height: 80px;
    align-items: center;

    .el-descriptions {
      width: calc(100% - 200px);
    }
  }

  &-label {
    display: block;
    line-height: 80px;
    text-align: center;
    width: 200px;
    border: 1px solid #f5f5f5;
    background-color: #f5f7fa;
  }
}
</style>
<style lang="scss">
.column-class {
  &-0 {
    background-color: aliceblue !important;
  }

  &-1 {
    background-color: rgb(194, 220, 242) !important;
  }

  &-2 {
    background-color: rgb(182, 215, 243) !important;
  }

  &-3 {
    background-color: rgb(167, 207, 242) !important;
  }

  &-4 {
    background-color: rgb(151, 200, 242) !important;
  }

  &-5 {
    background-color: rgb(140, 197, 247) !important;
  }

  &-6 {
    background-color: rgb(116, 122, 128) !important;
  }

  &-7 {
    background-color: rgb(109, 141, 168) !important;
  }
}
</style>
