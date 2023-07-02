<template>
  <div class="margin-top">
    <InterfaceRequiredTime :ProcessIdentifier="Host" />
    <el-row justify="end">
      <el-button m="2" type="primary" @click="queryModlueNumber">查看项目走量</el-button>
      <ThreeDImage m="2" />
    </el-row>
    <div class="card-div">
      <span class="card-span"> 总未提交数量:{{ SumCount }}</span>
    </div>
    <div v-for="(item, bomIndex) in constructionBomList" :key="item.superTypeName">
      <el-card m="2" v-loading="item.loading">
        <template #header>
          <div class="card-header">
            <span>{{ item.superTypeName }}</span>
            <span class="card-span">
              未提交的数量:{{
                item.structureMaterial.filter((p: any) => !p.isSubmit).length
              }}</span>
          </div>
        </template>
        <el-table :data="item.structureMaterial" height="500">
          <el-table-column type="index" label="序号" width="80" fixed="left" />
          <el-table-column prop="categoryName" label="物料大类" width="80" fixed="left" />
          <el-table-column prop="typeName" label="物料种类" width="80" fixed="left" />
          <el-table-column prop="sapItemNum" label="物料编号" width="80" fixed="left" />
          <el-table-column prop="drawingNumName" label="图号名称" width="100" fixed="left" />
          <el-table-column prop="overallDimensionSize" label="外形尺寸" width="80" />
          <el-table-column prop="materialName" label="材料" width="80" />
          <el-table-column prop="weightNumber" label="重量g" width="80" />
          <el-table-column prop="moldingProcess" label="成型工艺" width="80" />
          <el-table-column prop="secondaryProcessingMethod" label="二次加工方法" width="80" />
          <el-table-column prop="surfaceTreatmentMethod" label="表面处理" width="80" />
          <el-table-column prop="dimensionalAccuracyRemark" label="关键尺寸精度及重要要求" width="100" />
          <el-table-column prop="materialsUseCount" label="项目物料的使用量">
            <el-table-column align="center" :label="`${c.kv} K/Y`" :class-name="`column-class-${i}`" v-for="(c, i) in item.structureMaterial[0]?.materialsUseCount"
              prop="materialsUseCount" width="175" >
              <el-table-column width="100" v-for="(yearItem, iIndex) in c?.yearOrValueModes" :key="iIndex"
                :prop="`materialsUseCount.${i}.yearOrValueModes.${iIndex}.value`"
                :label="yearItem.year + upDownEunm[yearItem.upDown]" :formatter="formatDatas" />
            </el-table-column>
          </el-table-column>
          <el-table-column prop="currency" label="币种" width="120">
            <template #default="scope">
              <el-select v-if="scope.row.isEdit" v-model="scope.row.currency" placeholder="选择币种">
                <el-option v-for="item in exchangeSelectOptions" :key="item.id" :label="item.exchangeRateKind"
                  :value="item.exchangeRateKind" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="systemiginalCurrency" label="系统单价（原币）">
            <el-table-column v-for="(c, i) in item.structureMaterial[0]?.systemiginalCurrency" align="center"
              :class-name="`column-class-${i}`" :label="`${c.kv} K/Y`" width="175">
              <el-table-column v-for="(yearItem, iIndex) in c?.yearOrValueModes" :key="iIndex"
                :label="yearItem.year + upDownEunm[yearItem.upDown]" width="175">
                <template #default="scope">
                  <el-input-number v-if="scope.row.isEdit"
                    v-model="scope.row.systemiginalCurrency[i].yearOrValueModes[iIndex].value" controls-position="right"
                    :min="0" @keyup.enter="handleCalculation(scope.row, bomIndex, scope.$index)" />
                  <span v-if="!scope.row.isEdit">{{
                    scope.row.systemiginalCurrency[i]?.yearOrValueModes[iIndex]?.value.toFixed(5) }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="inTheRate" label="年降率">
            <el-table-column v-for="(c, i) in item.structureMaterial[0]?.inTheRate" align="center"
              :class-name="`column-class-${i}`" :label="`${c.kv} K/Y`" width="175">
              <el-table-column v-for="(yearItem, yIndex) in c?.yearOrValueModes" :key="yIndex"
                :label="yearItem.year + upDownEunm[yearItem.upDown]" width="175">
                <template #default="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.inTheRate[i].yearOrValueModes[yIndex].value"
                    type="number">
                    <template #append> % </template>
                  </el-input>
                  <span v-else>{{ scope.row.inTheRate[i].yearOrValueModes[yIndex].value }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column prop="materialsSystemPrice" label="系统单价" width="150">
            <template #default="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.materialsSystemPrice" />
              <span v-if="!scope.row.isEdit">{{ scope.row.materialsSystemPrice }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="iginalCurrency" label="原币">
            <el-table-column v-for="(c, i) in item.structureMaterial[0]?.iginalCurrency" align="center"
              :class-name="`column-class-${i}`" :label="`${c.kv} K/Y`" width="175">
              <el-table-column v-for="(yearItem, yIndex) in c?.yearOrValueModes" :key="yIndex"
                :label="yearItem.year + upDownEunm[yearItem.upDown]" width="175" :formatter="formatDatas">
                <template #default="scope">
                  <el-input-number v-if="scope.row.isEdit"
                    v-model="scope.row.iginalCurrency[i].yearOrValueModes[yIndex].value" controls-position="right"
                    :min="0" />
                  <span v-if="!scope.row.isEdit">{{
                    scope.row.iginalCurrency[i]?.yearOrValueModes[yIndex]?.value.toFixed(5) }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column> -->
          <el-table-column prop="standardMoney" label="本位币">
            <el-table-column v-for="(c, i) in item.structureMaterial[0]?.standardMoney" align="center"
              :class-name="`column-class-${i}`" :label="`${c.kv} K/Y`" width="175">
              <el-table-column v-for="(yearItem, yIndex) in c?.yearOrValueModes" :key="yIndex"
                :label="yearItem.year + upDownEunm[yearItem.upDown]" width="175"
                :prop="`standardMoney.${i}.yearOrValueModes.${yIndex}.value`" :formatter="filterStandardMoney" />
            </el-table-column>
          </el-table-column>
          <el-table-column prop="moq" label="MOQ" width="175">
            <template #default="{ row }">
              <el-input-number v-if="row.isEdit" v-model="row.moq" controls-position="right" :min="0" />
              <span v-if="!row.isEdit">{{ row.moq }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rebateMoney" label="物料返利金额" width="150">
            <el-table-column v-for="(c, i) in item.structureMaterial[0]?.rebateMoney" align="center"
              :label="`${c.kv} K/Y`" width="175">
              <template #default="{ row }">
                <el-input-number v-if="row.isEdit" v-model="row.rebateMoney[i].value" controls-position="right"
                  :min="0" />
                <span v-if="!row.isEdit">{{ row.rebateMoney[i]?.value }}</span>
              </template>
            </el-table-column>
            <!-- <template #default="{ row }">
              <el-input-number v-if="row.isEdit" v-model="row.rebateMoney" controls-position="right" :min="0" />
              <span v-if="!row.isEdit">{{ row.rebateMoney }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="备注" width="120">
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
          <el-table-column label="操作" fixed="right" width="160">
            <template #default="scope">
              <el-button link :disabled="scope.row.isSubmit" @click="handleSubmit(scope.row, 0, bomIndex, scope.$index)"
                type="danger">确认</el-button>
              <el-button v-if="scope.row.isEntering" :disabled="scope.row.isSubmit" link
                @click="handleSubmit(scope.row, 1, bomIndex, scope.$index)" type="warning">
                提交
              </el-button>
              <el-button v-if="!scope.row.isEdit" :disabled="scope.row.isSubmit" link @click="handleEdit(scope.row, true)"
                type="primary">
                修改
              </el-button>
              <el-button v-if="scope.row.isEdit" link @click="handleEdit(scope.row, false)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div>
          <h5>本位币汇总：</h5>
          <el-row class="descriptions-box" v-for="c in computeStandardMoney(item.structureMaterial)" :key="c?.kv">
            <span class="descriptions-label">{{ `${c.kv} K/Y` }}</span>
            <el-descriptions  direction="vertical" :column="c.yearOrValueModes.length" border>
              <el-descriptions-item  v-for="yearItem in c.yearOrValueModes"
                :key="yearItem.year" :label="yearItem.year + upDownEunm[yearItem.upDown]">
                {{ yearItem.value }}
              </el-descriptions-item>
            </el-descriptions>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { ConstructionModel } from "./data.type"
import ThreeDImage from "@/components/ThreeDImage/index.vue"

import {
  GetStructural,
  PostStructuralMemberEntering,
  ToriginalCurrencyStructural,
  PostStructuralMaterialCalculate,
  GetProjectGoQuantity
} from "./common/request"
import { useRouter } from "vue-router"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host: string = "StructPriceInput"
import { getExchangeRate } from "./../demandApply/service"
import { getYears } from "../pmDepartment/service"
import getQuery from "@/utils/getQuery"
import { useUserStore } from "@/store/modules/user"
import { ElMessage, ElMessageBox } from "element-plus"
import { cloneDeep } from "lodash"

enum upDownEunm {
  '全年',
  '上半年',
  '下半年'
}

// 获取仓库的值
const store = useUserStore()
const router = useRouter()

console.log(store.userInfo, "store")
const { auditFlowId, productId }: any = getQuery()

// 结构料 - table数据
const constructionBomList = ref<any>([])

const allStandardMoney = computed(() => {
  return 1000
})

const exchangeSelectOptions = ref<any>([])

onBeforeMount(() => {
  fetchOptionsData()
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  fetchInitData()
})

const fetchOptionsData = async () => {
  const exchangeSelect: any = await getExchangeRate({
    maxResultCount: 100,
    skipCount: 0
  })
  exchangeSelectOptions.value = exchangeSelect.result.items || []
}

// 获取初始化数据
const fetchInitData = async () => {
  const { result } = (await GetStructural({ auditFlowId, solutionId: productId })) || {}
  constructionBomList.value = result || []
  console.log(constructionBomList.value, "constructionBomList")
}

const formatDatas = (record: any, _row: any, cellValue: any) => {
  return cellValue || ''
}

let SumCount = computed(() => {
  let count = 0
  const prop = constructionBomList.value
  prop.forEach((item: any) => {
    count += item.structureMaterial.filter((p: any) => !p.isSubmit).length
  })
  return count
})

const queryModlueNumber = () => {
  router.push({
    path: "/resourcesDepartment/moduleNumber",
    query: {
      auditFlowId
    }
  })
}

// 确认结构料单价行数据
const handleSubmit = async (record: any, isSubmit: number, bomIndex: number, iginalCurrencyIndex: number) => {
  if (isSubmit) {
    //提交
    await submitFun(record, isSubmit, bomIndex, iginalCurrencyIndex)
  } else {
    //确认
    await handleSubmitcalculate(record, isSubmit, bomIndex, iginalCurrencyIndex)
  }
}

const handleSubmitcalculate = async (record: any, isSubmit: number, bomIndex: number, iginalCurrencyIndex: number) => {
  //判断是根据年将率计算还是根据原币计算
  await handleCalculation(record, bomIndex, iginalCurrencyIndex).then(async () => {
    await SubmitJudge(record, isSubmit, bomIndex, iginalCurrencyIndex)
  })
}

const SubmitJudge = async (record: any, isSubmit: number, bomIndex: number, iginalCurrencyIndex: number) => {
  //判断本位币金额是否是否存在0
  const prop = constructionBomList.value[bomIndex].structureMaterial[iginalCurrencyIndex].standardMoney.filter(
    (p: any) => !p.value
  ).length
  if (prop) {
    ElMessageBox.confirm("该条数据本位币数据有0的存在,是否继续执行", "确认提醒", {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await submitFun(record, isSubmit, bomIndex, iginalCurrencyIndex)
      })
      .catch(async () => {
        fetchInitData()
      })
  } else {
    await submitFun(record, isSubmit, bomIndex, iginalCurrencyIndex)
  }
}

const submitFun = async (
  record: ConstructionModel,
  isSubmit: number,
  bomIndex: number,
  iginalCurrencyIndex: number
) => {
  const row = constructionBomList.value[bomIndex].structureMaterial[iginalCurrencyIndex]
  const { success } = await PostStructuralMemberEntering({
    isSubmit,
    structuralMaterialEntering: [{ ...row, productId }],
    auditFlowId
  })
  if (success) ElMessage.success(`${isSubmit ? "提交" : "确认"}成功！`)
  fetchInitData()
  record.isEdit = false
  // if (isSubmit) {
  //   record.isEntering = true
  // } else {
  //   record.isSubmit = true
  // }
}

const computeStandardMoney = (arr: any[]) => {
  const rowOne = cloneDeep(arr[0].standardMoney)
  arr.forEach((item:any, index) => {
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

  console.log(rowOne, 'computeStandardMoney')
  
  return rowOne
}

const comptedYearOrValueModes = (a, b) => {
  return 
}

// 根据汇率计算
const handleCalculation = async (row: any, bomIndex: number, index: number) => {
  try {
    constructionBomList.value[bomIndex].loading = true
    const { success, result } = await PostStructuralMaterialCalculate(row)
    if (!success && !result.length) {
      constructionBomList.value[bomIndex].loading = false
      throw Error()
    }
    const res = { ...(result || {}), isEdit: true }
    constructionBomList.value[bomIndex].structureMaterial[index] = res
    constructionBomList.value[bomIndex].loading = false
  } catch (err) {
    ElMessage.error("计算失败~")
    constructionBomList.value[bomIndex].loading = false
  }
}

// 根据原币计算
const handleCalculationIginalCurrency = async (row: any, bomIndex: number, iginalCurrencyIndex: number) => {
  try {
    constructionBomList.value[bomIndex].loading = true
    const { success, result } = await ToriginalCurrencyStructural(row)
    if (!success && !result.length) throw Error()
    const res = { ...(result || {}), isEdit: true }
    constructionBomList.value[bomIndex].structureMaterial[iginalCurrencyIndex] = res
    constructionBomList.value[bomIndex].loading = false
  } catch (err) {
    constructionBomList.value[bomIndex].loading = false
    console.log(err, "[根据原币计算 计算失败]")
    ElMessage.error("计算失败~")
  }
}

// 修改
const handleEdit = (row: any, isEdit: boolean) => {
  row.isEdit = isEdit
}

const filterStandardMoney = (record: any, _row: any, cellValue: any) => {
  return cellValue.toFixed(5) || ''
}


watchEffect(() => { })
</script>
<style scoped lang="scss">
.table-wrap {
  margin: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-div {
  margin: 0 auto;
  text-align: center;
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
</style>

<style lang="scss">
.column-class {
  &-0 {
    background-color: aliceblue !important
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
