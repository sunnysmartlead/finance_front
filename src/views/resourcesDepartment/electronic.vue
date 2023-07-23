<template>
  <div class="margin-top">
    <InterfaceRequiredTime :ProcessIdentifier="Host" />
    <el-card class="table-wrap" v-loading="tableLoading">
      <template #header>
        <div class="card-header">
          <span>电子料单价录入界面</span>
          <span class="card-span"> 未提交的数量:{{ electronicBomList.filter((p) => !p.isSubmit).length }}</span>
        </div>
      </template>
      <el-table :data="electronicBomList" height="75vh">
        <el-table-column prop="categoryName" label="物料大类" width="60" fixed="left" />
        <el-table-column prop="typeName" label="物料种类" width="80" fixed="left" />
        <el-table-column prop="sapItemNum" label="物料编号" width="80" fixed="left" />
        <el-table-column prop="sapItemName" label="材料名称" width="120" fixed="left" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="120" fixed="left" />
        <el-table-column prop="materialsUseCount" label="项目物料的使用量">
          <el-table-column
            align="center"
            :class-name="`column-class-${index}`"
            v-for="(item, index) in allColums?.materialsUseCountYears"
            prop="materialsUseCount"
            width="175"
            :label="`${item.kv} K/Y`"
          >
            <el-table-column
              width="100"
              v-for="(yearItem, iIndex) in item?.yearOrValueModes"
              :key="iIndex"
              :prop="`materialsUseCount.${index}.yearOrValueModes.${iIndex}.value`"
              :label="yearItem.year + upDownEunm[yearItem.upDown]"
              :formatter="formatDatas"
            />
          </el-table-column>
        </el-table-column>
        <el-table-column prop="currency" label="币种" width="100">
          <template #default="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.currency" placeholder="选择币种">
              <el-option
                v-for="item in exchangeSelectOptions"
                :key="item.id"
                :label="item.exchangeRateKind"
                :value="item.exchangeRateKind"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="systemiginalCurrency" label="系统单价（原币）">
          <el-table-column
            v-for="(item, index) in allColums?.systemiginalCurrencyYears"
            align="center"
            :class-name="`column-class-${index}`"
            :label="`${item.kv} K/Y`"
            width="175"
          >
            <el-table-column
              v-for="(yearItem, iIndex) in item?.yearOrValueModes"
              :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]"
              width="175"
            >
              <template #default="scope">
                <el-input-number
                  v-if="scope.row.isEdit"
                  v-model="scope.row.systemiginalCurrency[index].yearOrValueModes[iIndex].value"
                  controls-position="right"
                  :min="0"
                  @keyup.enter="handleCalculation(scope.row, scope.$index)"
                />
                <span v-if="!scope.row.isEdit">{{
                  scope.row.systemiginalCurrency[index]?.yearOrValueModes[iIndex]?.value.toFixed(5)
                }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="inTheRate" label="年降率">
          <el-table-column
            v-for="(item, index) in allColums?.inTheRateYears"
            align="center"
            :class-name="`column-class-${index}`"
            :label="`${item.kv} K/Y`"
            width="175"
          >
            <el-table-column
              v-for="(yearItem, iIndex) in item?.yearOrValueModes"
              :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]"
              width="175"
            >
              <template #default="scope">
                <el-input
                  v-if="scope.row.isEdit"
                  v-model="scope.row.inTheRate[index].yearOrValueModes[iIndex].value"
                  type="number"
                >
                  <template #append> % </template>
                </el-input>
                <span v-else>{{ scope.row.inTheRate?.[index]?.yearOrValueModes?.[iIndex]?.value }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column prop="iginalCurrency" label="原币">
          <el-table-column v-for="(item, index) in allColums?.iginalCurrencyYears" align="center"
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" width="175">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]" width="175" :formatter="formatDatas">
              <template #default="scope">
                <el-input-number v-if="scope.row.isEdit"
                  v-model="scope.row.iginalCurrency[index].yearOrValueModes[iIndex].value" controls-position="right"
                  :min="0" />
                <span v-if="!scope.row.isEdit">{{
                  scope.row.iginalCurrency[index]?.yearOrValueModes[iIndex]?.value.toFixed(5) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column> -->
        <el-table-column prop="standardMoney" label="本位币">
          <el-table-column
            v-for="(item, index) in allColums?.standardMoneyYears"
            align="center"
            :class-name="`column-class-${index}`"
            :label="`${item.kv} K/Y`"
            width="175"
          >
            <el-table-column
              v-for="(yearItem, iIndex) in item?.yearOrValueModes"
              :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]"
              width="175"
              :prop="`standardMoney.${index}.yearOrValueModes.${iIndex}.value`"
              :formatter="filterStandardMoney"
            />
          </el-table-column>
        </el-table-column>
        <el-table-column prop="moq" label="MOQ" width="120">
          <template #default="{ row }">
            <el-input-number v-if="row.isEdit" v-model="row.moq" controls-position="right" :min="0" />
            <span v-if="!row.isEdit">{{ row.moq }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rebateMoney" label="物料返利金额" width="120">
          <el-table-column
            v-for="(item, index) in allColums?.rebateMoneyYears"
            align="center"
            :label="`${item.kv} K/Y`"
            width="175"
          >
            <template #default="{ row }">
              <el-input-number
                v-if="row.isEdit"
                v-model="row.rebateMoney[index].value"
                controls-position="right"
                :min="0"
              />
              <span v-if="!row.isEdit">{{ row.rebateMoney[index]?.value }}</span>
            </template>
          </el-table-column>
          <!-- <template #default="{ row }">
            <el-input-number v-if="row.isEdit" v-model="row.rebateMoney" controls-position="right" :min="0" />
            <span v-if="!row.isEdit">{{ row.rebateMoney }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="备注" width="100">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.remark" />
            <span v-if="!row.isEdit">{{ row.remark }}</span>
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
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button
              link
              :disabled="scope.row.isSubmit"
              @click="handleSubmit(scope.row, 0, scope.$index)"
              type="danger"
              v-havedone
              >确认</el-button
            >
            <el-button
              v-if="scope.row.isEntering"
              link
              :disabled="scope.row.isSubmit"
              @click="handleSubmit(scope.row, 1, scope.$index)"
              type="warning"
              v-havedone
            >
              提交
            </el-button>
            <el-button
              v-if="!scope.row.isEdit"
              :disabled="scope.row.isSubmit"
              link
              @click="handleEdit(scope.row, true)"
              type="primary"
              v-havedone
            >
              修改
            </el-button>
            <el-button v-if="scope.row.isEdit" link @click="handleEdit(scope.row, false)" v-havedone>取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <h5>本位币汇总：</h5>
        <el-row class="descriptions-box" v-for="c in allStandardMoney" :key="c?.kv">
          <span class="descriptions-label">{{ `${c.kv} K/Y` }}</span>
          <el-descriptions direction="vertical" :column="c.yearOrValueModes.length" border>
            <el-descriptions-item
              v-for="yearItem in c.yearOrValueModes"
              :key="yearItem.year"
              :label="yearItem.year + upDownEunm[yearItem.upDown]"
            >
              {{ yearItem.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, onMounted, computed } from "vue"
// import { useUserStore } from "@/store/modules/user"
import { ElectronicDto } from "./data.type"
import { ElMessage, ElMessageBox } from "element-plus"
import {
  GetElectronic,
  PostElectronicMaterialCalculate,
  PostElectronicMaterialEntering,
  PosToriginalCurrencyCalculate
} from "./common/request"
import { getExchangeRate } from "./../demandApply/service"
import getQuery from "@/utils/getQuery"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
import { cloneDeep } from "lodash"

let Host = "ElectronicPriceInput"
const { auditFlowId = 1, productId }: any = getQuery()

enum upDownEunm {
  "全年",
  "上半年",
  "下半年"
}

// // 获取仓库的值
// const store = useUserStore()

const tableLoading = ref(false)

// 电子料 - table数据
const electronicBomList = ref<any>([])

// 计算总值
const reduceArr = (arr: any[]) => {
  if (!arr?.length) return 0
  return arr.reduce((a, b) => a + b)
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

// 表单子列数据
const allColums = reactive<any>({
  materialsUseCountYears: [], // 项目物料的使用量
  systemiginalCurrencyYears: [], // 系统单价（原币）
  inTheRateYears: [], // 年降率
  iginalCurrencyYears: [], // 原币
  standardMoneyYears: [], // 本位币
  rebateMoneyYears: [] // 物料返利金额
})

const exchangeSelectOptions = ref<any>([])

const fetchOptionsData = async () => {
  const exchangeSelect: any = await getExchangeRate({
    maxResultCount: 100,
    skipCount: 0
  })
  exchangeSelectOptions.value = exchangeSelect.result.items || []
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  fetchInitData()
  fetchOptionsData()
})

// 获取初始化数据
const fetchInitData = async () => {
  tableLoading.value = true
  const { result } = await GetElectronic(auditFlowId, productId)
  if (!result) return false
  console.log(result, "获取初始化数据")

  // 初始化表头数据
  const { materialsUseCount, systemiginalCurrency, inTheRate, iginalCurrency, standardMoney, rebateMoney } =
    result[0] || {}
  allColums.materialsUseCountYears = materialsUseCount || []
  allColums.systemiginalCurrencyYears = systemiginalCurrency || []
  allColums.inTheRateYears = inTheRate || []
  allColums.iginalCurrencyYears = iginalCurrency || []
  allColums.standardMoneyYears = standardMoney || []
  allColums.rebateMoneyYears = rebateMoney || []
  electronicBomList.value = result
  tableLoading.value = false
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

const SubmitJudge = async (record: any, isSubmit: number, index: number) => {
  const { systemiginalCurrency } = record
  let label = ""
  const isPass = systemiginalCurrency.every((s: any) => {
    const isRight = s.yearOrValueModes.every((y: any, i: number) => {
      if (!y.value) label = `系统单价（原币）的 ${s.kv} K/Y 下第${i + 1}列的值为0`
      return y.value
    })
    return isRight
  })
  if (!isPass) {
    ElMessageBox.confirm(`${label},是否继续执行`, "确认提醒", {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      await handleCalculation(record, index).then(async () => {
        await submitFun(record, isSubmit, index)
      })
    })
    // .catch(async () => {
    //   fetchInitData()
    // })
  } else {
    await submitFun(record, isSubmit, index)
  }
}

const submitFun = async (record: ElectronicDto, isSubmit: number, index: number) => {
  const { success } = await PostElectronicMaterialEntering({
    isSubmit,
    electronicDtoList: [electronicBomList.value[index]],
    auditFlowId
  })
  if (success) ElMessage.success(`${isSubmit ? "提交" : "确认"}成功`)
  // if (isSubmit) {
  //   record.isEntering = true
  // } else {
  //   record.isSubmit = true
  // }
  fetchInitData()
}

// 修改
const handleEdit = (row: any, isEdit: boolean) => {
  row.isEdit = isEdit
}

const formatDatas = (record: any, _row: any, cellValue: any) => {
  return cellValue || ""
}

const filterStandardMoney = (record: any, _row: any, cellValue: any) => {
  return cellValue.toFixed(5) || ""
}

// 根据原币计算
const handleCalculation = async (row: any, index: number) => {
  try {
    tableLoading.value = true
    const { success, result } = await PosToriginalCurrencyCalculate(row)
    if (!success && !result.length) throw Error()
    electronicBomList.value[index] = { ...(result || {}), isEdit: true }
    tableLoading.value = false
  } catch (err) {
    console.log(err, "[根据原币计算 计算失败]")
    tableLoading.value = false
    ElMessage.error("计算失败~")
  }
}
</script>
<style lang="scss">
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
      width: calc(100% - 100px);
    }
  }

  &-label {
    display: block;
    line-height: 80px;
    text-align: center;
    width: 100px;
    border: 1px solid #f5f5f5;
    background-color: #f5f7fa;
  }
}

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
