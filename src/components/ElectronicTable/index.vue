<template>
  <div>
    <el-row justify="end" style="margin-top: 20px" v-if="isVertify && !isMergeVertify">
      <ProcessVertifyBox :onSubmit="handleSetBomState" processType="electronicBomProcessType" />
    </el-row>
    <InterfaceRequiredTime v-if="!isVertify" :ProcessIdentifier="Host" />
    <el-card class="table-wrap" v-loading="tableLoading">
      <template #header v-if="!isVertify">
        <div class="card-header">
          <span>电子料单价录入界面</span>
          <span class="card-span"> 未提交的数量:{{ electronicBomList?.filter((p) => !p.isSubmit)?.length }}</span>
        </div>
      </template>
      <el-table :data="electronicBomList" :height="electronicBomList?.length > 5 ? '75vh' : '46vh'"
        @selection-change="selectionChange" ref="multipleTableRef">
        <el-table-column type="selection" width="55" v-if="isVertify" />
        <el-table-column prop="categoryName" label="物料大类" width="100" fixed="left" />
        <el-table-column prop="typeName" label="物料种类" width="80" fixed="left" />
        <el-table-column prop="sapItemNum" label="物料编号" width="80" fixed="left" />
        <el-table-column prop="sapItemName" label="材料名称" width="120" fixed="left" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="80" fixed="left" />
        <el-table-column prop="materialsUseCount" label="项目物料的使用量">
          <el-table-column align="center" :class-name="`column-class-${index}`"
            v-for="(item, index) in allColums?.materialsUseCountYears" prop="materialsUseCount" :label="`${item.kv} K/Y`"
            :key="`materialsUseCount${index}`">
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
              <template #default="{ row, $index }">
                <el-input-number size="small" v-if="row.isEdit"
                  v-model="row.systemiginalCurrency[index].yearOrValueModes[iIndex].value" controls-position="right"
                  :min="0" @change="handleCalculation(row, $index)" />
                <span v-if="!row.isEdit">{{
                  row.systemiginalCurrency[index]?.yearOrValueModes[iIndex]?.value.toFixed(5)
                }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="inTheRate" label="年降率">
          <el-table-column v-for="(item, index) in allColums?.inTheRateYears" align="center"
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" :key="`inTheRate${index}`">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]" width="150"
              :prop="`inTheRate.${index}.yearOrValueModes.${iIndex}.value`" :formatter="filterinTheRate">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isEdit"
                  v-model="scope.row.inTheRate[index].yearOrValueModes[iIndex].value" type="number">
                  <template #append> % </template>
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
            <el-input-number size="small" v-if="row.isEdit" v-model="row.moq" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column prop="rebateMoney" label="物料返利金额" width="120">
          <el-table-column v-for="(item, index) in allColums?.rebateMoneyYears" align="center" :label="`${item.kv} K/Y`"
            width="150" :key="`rebateMoney${index}`" :prop="`rebateMoney.${index}.value`" :formatter="formatThousandths">
            <template #default="{ row }">
              <el-input-number size="small" v-if="row.isEdit" v-model="row.rebateMoney[index].value"
                controls-position="right" :min="0" />
            </template>
          </el-table-column>
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
        <el-table-column label="备注" width="150">
          <template #default="{ row }">
            <el-input type="textarea" v-if="row.isEdit" v-model="row.remark" />
            <span v-if="!row.isEdit">{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifierName" label="修改人" v-if="isMergeEdit" />
        <el-table-column prop="modificationComments" width="150" label="修改意见" v-if="isMergeEdit">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" type="textarea" v-model="row.modificationComments" />
          </template>
        </el-table-column>
        <el-table-column prop="peopleName" label="确认人" v-else />
        <el-table-column label="操作" fixed="right" v-if="!isVertify" width="180">
          <template #default="{ row, $index }">
            <el-button link :disabled="row.isSubmit" :loading="row.loading" @click="handleSubmit(row, 0, $index)"
              type="danger" v-havedone>确认</el-button>
            <el-button v-if="row.isEntering && !props.isMergeEdit" :loading="row.loading" link :disabled="row.isSubmit"
              @click="handleSubmit(row, 1, $index)" type="warning" v-havedone>
              提交
            </el-button>
            <el-button v-if="!row.isEdit" :disabled="row.isSubmit" link @click="handleEdit(row, true)" type="primary"
              v-havedone>
              修改
            </el-button>
            <el-button v-if="row.isEdit" link @click="handleEdit(row, false)" v-havedone>取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <h5>本位币汇总：</h5>
        <el-row class="descriptions-box" v-for="c in allStandardMoney" :key="c?.kv">
          <span class="descriptions-label">{{ `${formatThousandths(null, null, c.kv)} K/Y` }}</span>
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
  GetBOMElectronicSingle,
  ElectronicUnitPriceCopyingInformationAcquisition,
  PostElectronicMaterialEnteringCopy
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
  isMergeVertify: Boolean,
  isMergeEdit: Boolean
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

const safeParse = (val: any) => {
  try {
    return JSON.parse(val)
  } catch {
    return null
  }
}

const filterMultipleSelectionValue = (idData: any) => {
  return map(idData, v => ([...v]))?.flat(2) || []
}

const toggleSelection = () => {
  nextTick(() => {
    const storageData = getSessionStorage(props.isMergeVertify ? MERGE_STORAGE_KEY : STORAGE_KEY)
    let parseData: any = safeParse(storageData)
    if (!storageData) return
    if (parseData) {
      const ids = parseData[productId]
      multipleSelection.value = parseData
      ids?.forEach((id: number) => {
        const findItem = electronicBomList.value?.find((c: any) => c.id === id)
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
  if (!auditFlowId || !productId) return
  if (!props.isVertify) {
    fetchInitData()
  } else {
    window.sessionStorage.setItem("placePath", router.currentRoute.value.path)
    fetchElectronicInitData().then(() => {
      setTimeout(() => {
        toggleSelection()
      }, 500)
    })
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
  let result: any = []
  if (props.isMergeEdit) {
    const res = await ElectronicUnitPriceCopyingInformationAcquisition(Number(auditFlowId), Number(productId))
    result = res.result
    console.log(result, "获取电子料初始化数据")
  } else {
    const res = await GetElectronic(auditFlowId, productId)
    result = res.result
    console.log(result, "获取电子料初始化数据")
  }

  if (!result) {
    tableLoading.value = false
    return false
  }
  console.log(result, "获取初始化数据")
   // 初始化表头数据
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
  const { electronicDtos } = result || {}
  console.log(electronicDtos, "获取电子料初始化数据 fetchElectronicInitData")
  // 初始化表头数据
  handleDealWithColumn(electronicDtos[0] || [])

  setTimeout(() => {
    tableLoading.value = false
    electronicBomList.value = electronicDtos
    isAll.value = result.isAll
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
    console.log(record, 'handleSubmit111111')
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
    electronicBomList.value[index] = { ...(result || {}), isEdit: true, isEdited: true }
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

const submitFun = async (record: any, isSubmit: number, index: number) => {
  let { nodeInstanceId } = route.query
  const isNotPass = record.systemiginalCurrency?.some((item: any) => {
    return item.yearOrValueModes.some((c: any) => {
      return c?.value
    }) && !record?.remark
  })
  if (isNotPass && record.isEdited && record.isSystemiginal && !props.isMergeEdit) {
    return ElMessage.warning(`请填写备注再${isSubmit ? '提交' : '确认'}`)
  } else if (record.isEdited && !record.peopleName && isSubmit) {
    return ElMessage.warning('请先确认再提交！')
  } else if (props.isMergeEdit && !record.modificationComments) {
    return ElMessage.warning(`请填写修改意见再${isSubmit ? '提交' : '确认'}`)
  }
  let isSuccess = false
  if (props.isMergeEdit) {
    const { success } = await PostElectronicMaterialEnteringCopy({
      isSubmit,
      electronicDtoList: [electronicBomList.value[index]],
      auditFlowId,
      opinion: "Done",
      nodeInstanceId
    })
    isSuccess = success
  } else {
    const { success } = await PostElectronicMaterialEntering({
      isSubmit,
      electronicDtoList: [electronicBomList.value[index]],
      auditFlowId,
      opinion: "Done",
      nodeInstanceId
    })
    isSuccess = success
  }

  if (isSuccess) ElMessage.success(`${isSubmit ? "提交" : "确认"}成功`)
  setTimeout(() => {
    fetchInitData()
  })
}

// 修改
const handleEdit = (row: any, isEdit: boolean) => {
  row.isEdit = isEdit
}

const handleSetBomState = async ({ comment, opinion, nodeInstanceId, label }: any) => {
  const electronicsUnitPriceId = filterMultipleSelectionValue(multipleSelection.value)
  if (!opinion.includes("_Yes") && (!electronicsUnitPriceId?.length)) {
    ElMessage({
      message: "请选择要退回那些条数据!",
      type: "warning"
    })
    return
  }
  console.log(electronicsUnitPriceId, "[电子料审核ids]")
  const { success } = await BomReview({
    auditFlowId,
    bomCheckType: 3, //3：“电子Bom单价审核”，4：“结构Bom单价审核”,5:"Bom单价审核"
    comment,
    opinion,
    nodeInstanceId,
    electronicsUnitPriceId,
  })
  if (success) {
    ElMessage.success(`${label === '同意' ? '同意' : '退回'} 成功！`)
  }
}
//selectionChange 当选择项发生变化时会触发该事件
const selectionChange = async (selection: any) => {
  const oldStorage = getSessionStorage(props.isMergeVertify ? MERGE_STORAGE_KEY : STORAGE_KEY)
  const ids = map(selection, v => v.id)
  const oldStorageData = safeParse(oldStorage) || {}

  const storageData = {
    ...oldStorageData,
    [productId]: ids
  }
  multipleSelection.value = storageData
  setSessionStorage(props.isMergeVertify ? MERGE_STORAGE_KEY : STORAGE_KEY, JSON.stringify(storageData))
}

defineExpose({
  getSelection: () => filterMultipleSelectionValue(multipleSelection.value)
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
      width: calc(100% - 250px);
    }
  }

  &-label {
    display: block;
    height: 80px;
    line-height: 80px;
    text-align: center;
    width: 250px;
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
