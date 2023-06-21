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
        <el-table-column prop="materialsUseCount" label="项目物料的使用量">
          <el-table-column
            v-for="(item, index) in allColums?.materialsUseCountYears"
            :key="item"
            :label="`${item}`"
            :prop="`materialsUseCount[${index}].value`"
            width="80"
          />
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
            :key="item"
            :label="`${item}`"
            :prop="`systemiginalCurrency[${index}].value`"
            width="100"
          />
        </el-table-column>
        <el-table-column prop="inTheRate" label="年降率">
          <el-table-column
            v-for="(item, index) in allColums?.inTheRateYears"
            :key="item"
            :label="`${item}`"
            :prop="`inTheRate[${index}].value`"
            width="150"
          >
            <template #default="scope">
              <el-input
                v-if="scope.row.isEdit"
                v-model="scope.row.inTheRate[index].value"
                @keyup.enter="handleCalculation(scope.row, scope.$index)"
                type="number"
              >
                <template #append> % </template>
              </el-input>
              <span v-else>{{ scope.row?.inTheRate[index]?.value }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="iginalCurrency" label="原币">
          <el-table-column
            v-for="(item, index) in allColums?.iginalCurrencyYears"
            :key="item"
            :label="`${item?.toString()}`"
            :prop="`iginalCurrency[${index}].value`"
            width="120"
          >
            <template #default="scope">
              <el-input-number
                v-if="scope.row.isEdit"
                v-model="scope.row.iginalCurrency[index].value"
                controls-position="right"
                :min="0"
                @keyup.enter="handleCalculationIginalCurrency(scope.row, scope.$index)"
              />
              <span v-if="!scope.row.isEdit">{{ scope.row.iginalCurrency[index].value.toFixed(5) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="standardMoney" label="本位币">
          <el-table-column
            v-for="(item, index) in allColums?.standardMoneyYears"
            :key="item"
            :label="`${item?.toString()}`"
            :prop="`standardMoney[${index}].value`"
            width="120"
          >
            <template #default="{ row }">
              {{ row.standardMoney[index]?.value?.toFixed(5) || 0 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="moq" label="MOQ" width="120">
          <template #default="{ row }">
            <el-input-number v-if="row.isEdit" v-model="row.moq" controls-position="right" :min="0" />
            <span v-if="!row.isEdit">{{ row.moq }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rebateMoney" label="物料返利金额" width="120">
          <template #default="{ row }">
            <el-input-number v-if="row.isEdit" v-model="row.rebateMoney" controls-position="right" :min="0" />
            <span v-if="!row.isEdit">{{ row.rebateMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="100">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.remark" />
            <span v-if="!row.isEdit">{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料管制状态" width="130">
          <template #default="{ row }">
            <el-select v-model="row.eccnCode" :disabled="row.isSubmit">
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
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="item in allColums?.standardMoneyYears" :key="item" :label="`${item} 本位币汇总`">
          {{ allStandardMoney[item].toFixed(5) || 0 }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- <el-row justify="end">
        <el-button class="margin-top" @click="handleCalculation" type="primary"> 计算 </el-button>
      </el-row> -->
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
let Host: string = "ElectronicPriceInput"
const { auditFlowId = 1, productId }: any = getQuery()

// // 获取仓库的值
// const store = useUserStore()

const tableLoading = ref(false)

// 电子料 - table数据
const electronicBomList = ref<ElectronicDto[]>([])

// 计算总值
const reduceArr = (arr: any[]) => {
  if (!arr?.length) return 0
  return arr.reduce((a, b) => a + b)
}

const allStandardMoney = computed(() => {
  let obj: any = {}
  const standardMoney = electronicBomList.value?.map((item: any) => item.standardMoney) || []
  const flatArr = standardMoney.flat(Infinity)
  allColums?.standardMoneyYears.forEach((item: any) => {
    const arr: any = []
    flatArr.forEach((y: any) => {
      if (y.year === item) {
        arr.push(y.value || 0)
      }
    })
    obj[item] = reduceArr(arr)
  })
  return obj
})

// 表单子列数据
const allColums = reactive<any>({
  materialsUseCountYears: [], // 项目物料的使用量
  systemiginalCurrencyYears: [], // 系统单价（原币）
  inTheRateYears: [], // 年降率
  iginalCurrencyYears: [], // 原币
  standardMoneyYears: [] // 本位币
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
  const { result } = await GetElectronic(auditFlowId, productId)
  if (!result) return false
  console.log(result, "获取初始化数据")

  // 初始化表头数据
  const { materialsUseCount, systemiginalCurrency, inTheRate, iginalCurrency, standardMoney } = result[0] || {}
  allColums.materialsUseCountYears = materialsUseCount?.map((item: any) => item.year) || []
  allColums.systemiginalCurrencyYears = systemiginalCurrency?.map((item: any) => item.year) || []
  allColums.inTheRateYears = inTheRate?.map((item: any) => item.year) || []
  allColums.iginalCurrencyYears = iginalCurrency?.map((item: any) => item.year) || []
  allColums.standardMoneyYears = standardMoney?.map((item: any) => item.year) || []
  electronicBomList.value = result
}

// 提交电子料单价行数据
const handleSubmit = async (record: ElectronicDto, isSubmit: number, index: number) => {
  if (isSubmit) {
    //提交
    await submitFun(record, isSubmit, index)
  } else {
    //确认
    await handleSubmitcalculate(record, isSubmit, index)
  }
}

const handleSubmitcalculate = async (record: ElectronicDto, isSubmit: number, index: number) => {
  //判断是根据年将率计算还是根据原币计算
  var iszero = false
  electronicBomList.value[index].iginalCurrency
    ?.map((item: any) => {
      return item.value
    })
    ?.forEach((a) => {
      if (a) {
        iszero = true
      }
      return iszero
    })

  if (iszero) {
    //根据原币计算
    await handleCalculationIginalCurrency(record, index).then(async () => {
      await SubmitJudge(record, isSubmit, index)
    })
  } else {
    await handleCalculation(record, index).then(async () => {
      await SubmitJudge(record, isSubmit, index)
    })
    //根据年将率计算
  }
}

const SubmitJudge = async (record: ElectronicDto, isSubmit: number, index: number) => {
  const prop = electronicBomList.value[index].standardMoney?.filter((p: any) => !p.value).length
  if (prop) {
    ElMessageBox.confirm("该条数据本位币数据有0的存在,是否继续执行", "确认提醒", {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await submitFun(record, isSubmit, index)
      })
      .catch(async () => {
        fetchInitData()
      })
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

// 根据汇率计算
const handleCalculation = async (row: any, index: number) => {
  try {
    tableLoading.value = true
    const { success, result } = await PostElectronicMaterialCalculate(row)
    if (!success && !result.length) throw Error()
    electronicBomList.value[index] = { ...(result || {}), isEdit: true }
    tableLoading.value = false
  } catch (err) {
    ElMessage.error("计算失败~")
    tableLoading.value = false
  }
}

// 根据原币计算
const handleCalculationIginalCurrency = async (row: any, index: number) => {
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
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-span {
  color: red;
  font-weight: bold;
}
</style>
