<template>
  <div class="margin-top" v-loading="tableLoading">
    <el-card>
      <div v-for="(item, bomIndex) in constructionBomList" :key="item.superTypeName">
        <el-card m="2" v-loading="item.loading">
          <el-table :ref="setTableRefs" :data="item.structureMaterial" style="width: 100%" height="75vh"
            @selection-change="selectionChange($event, bomIndex)">
            <el-table-column type="selection" width="55" v-if="isVertify" />
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
            <el-table-column prop="assemblyQuantity" :formatter="formatThousandths" label="装配数量" fixed="left" />
            <el-table-column prop="materialsUseCount" label="项目物料的使用量">
              <el-table-column align="center" :label="`${c.kv} K/Y`" :class-name="`column-class-${i}`"
                v-for="(c, i) in item.structureMaterial[0]?.materialsUseCount" prop="materialsUseCount"
                :key="`materialsUseCount${i}`">
                <el-table-column width="80" v-for="(yearItem, iIndex) in c?.yearOrValueModes" :key="iIndex"
                  :prop="`materialsUseCount.${i}.yearOrValueModes.${iIndex}.value`"
                  :label="yearItem.year + upDownEnum[yearItem.upDown]" :formatter="formatDatas" />
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
                :class-name="`column-class-${i}`" :label="`${c.kv} K/Y`" width="150" :key="`systemiginalCurrency${i}`">
                <el-table-column v-for="(yearItem, iIndex) in c?.yearOrValueModes" :key="iIndex"
                  :label="yearItem.year + upDownEnum[yearItem.upDown]" width="150">
                  <template #default="scope">
                    <el-input-number size="small" v-if="scope.row.isEdit"
                      v-model="scope.row.systemiginalCurrency[i].yearOrValueModes[iIndex].value" controls-position="right"
                      :min="0" @input="handleCalculation(scope.row, bomIndex, scope.$index)" />
                    <span v-if="!scope.row.isEdit">{{
                      scope.row.systemiginalCurrency[i]?.yearOrValueModes[iIndex]?.value.toFixed(5)
                    }}</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="inTheRate" label="年降率">
              <el-table-column v-for="(c, i) in item.structureMaterial[0]?.inTheRate" align="center"
                :class-name="`column-class-${i}`" :label="`${c.kv} K/Y`" :key="`inTheRate${i}`"
                >
                <el-table-column v-for="(yearItem, yIndex) in c?.yearOrValueModes" :key="yIndex"
                  :label="yearItem.year + upDownEnum[yearItem.upDown]" :prop="`inTheRate.${i}.yearOrValueModes.${yIndex}.value`" width="100" :formatter="filterinTheRate">
                  <template #default="scope">
                    <el-input size="small" v-if="scope.row.isEdit" v-model="scope.row.inTheRate[i].yearOrValueModes[yIndex].value"
                      type="number">
                    </el-input>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="standardMoney" label="本位币">
              <el-table-column v-for="(c, i) in item.structureMaterial[0]?.standardMoney" align="center"
                :class-name="`column-class-${i}`" :label="`${c.kv} K/Y`" :key="`standardMoney${i}`">
                <el-table-column v-for="(yearItem, yIndex) in c?.yearOrValueModes" :key="yIndex"
                  :label="yearItem.year + upDownEnum[yearItem.upDown]" width="100"
                  :prop="`standardMoney.${i}.yearOrValueModes.${yIndex}.value`" :formatter="filterStandardMoney" />
              </el-table-column>
            </el-table-column>
            <el-table-column prop="moq" label="MOQ" width="150">
              <template #default="{ row }">
                <el-input-number size="small" v-if="row.isEdit" v-model="row.moq" controls-position="right" :min="0" />
                <span v-if="!row.isEdit">{{ row.moq }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rebateMoney" label="物料返利金额" width="150">
              <el-table-column v-for="(c, i) in item.structureMaterial[0]?.rebateMoney" align="center"
                :label="`${c.kv} K/Y`" width="150" :key="`rebateMoney${i}`" :prop="`rebateMoney.${i}.value`"
                :formatter="formatThousandths">
                <template #default="{ row }">
                  <el-input-number size="small" v-if="row.isEdit" v-model="row.rebateMoney[i].value" controls-position="right"
                    :min="0" />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="备注" width="120">
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
          </el-table>

          <div>
            <h5>本位币汇总：</h5>
            <el-row class="descriptions-box" v-for="c in computeStandardMoney(item.structureMaterial)" :key="c?.kv">
              <span class="descriptions-label">{{ `${c.kv} K/Y` }}</span>
              <el-descriptions direction="vertical" :column="c.yearOrValueModes.length" border>
                <el-descriptions-item v-for="yearItem in c.yearOrValueModes" :key="yearItem.year"
                  :label="yearItem.year + upDownEnum[yearItem.upDown]">
                  {{ yearItem.value.toFixed(4) }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watchEffect, computed, shallowRef, reactive, nextTick, watch } from "vue"
import { ConstructionModel } from "../ElectronicTable/data.type"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
// import VertifyBox from "@/components/VertifyBox/index.vue"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import {
  GetStructural,
  PostStructuralMemberEntering,
  GetBOMStructuralSingle,
  PostStructuralMaterialCalculate,
  SetBomState,
  BomReview
} from "../ElectronicTable/common/request"
import { useRouter } from "vue-router"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host = "StructPriceInput"
import { getExchangeRate } from "@/views/demandApply/service"
import getQuery from "@/utils/getQuery"
// import { useUserStore } from "@/store/modules/user"
import { ElMessage, ElMessageBox } from "element-plus"
import { cloneDeep, debounce } from "lodash"
import useJump from "@/hook/useJump"
import { useRoute } from "vue-router"
import { setSessionStorage, getSessionStorage, removeSessionStorage } from "@/utils/seeionStrorage"
import { map } from "lodash"
const { auditFlowId, productId }: any = getQuery()
const route = useRoute()
const props = defineProps({
  isVertify: Boolean,
  isMergeVertify: Boolean
})

enum upDownEnum {
  "全年",
  "上半年",
  "下半年"
}

const tableLoading = ref(false)
const STORAGE_KEY = "constructionVertify" // 浏览器缓存key
const MERGE_STORAGE_KEY = "constructionMergeVertify" // 合并审核浏览器缓存key

const constructionBomList = shallowRef<any[]>([]) // 结构料 - table数据
const exchangeSelectOptions = ref<any>([])
const constructionId = ref<any[]>([])
const construction = ref<any[]>([])
const multipleTableRef = ref<any>([])
const multipleSelection = ref<any>()
const peopleId = ref<any[]>([])
const people = ref<any[]>([])
const isAll = ref(false)

const data = reactive({
  auditFlowId,
  productId,
  construction,
  people,
  constructionId,
  peopleId
})

const router = useRouter()

const { closeSelectedTag } = useJump()

onBeforeMount(() => {
  fetchOptionsData()
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(async () => {
  if (!auditFlowId && !productId) return
  if (props.isVertify) {
    await fetchConstructionInitData()
    toggleSelection() //数据反填
  } else {
    fetchInitData()
  }
})

const setTableRefs = (el: any) => {
  if (el) {
    multipleTableRef.value.push(el)
  }
}

const toggleSelection = () => {
  nextTick(() => {
    const storageData = getSessionStorage(props.isMergeVertify ? MERGE_STORAGE_KEY : STORAGE_KEY)
    let parseData: any = null
    try {
      parseData = JSON.parse(storageData)
    } catch (err) {
      console.log(err, '[结构bom单价审核界面赋值浏览器缓存失败]')
    }
    if (parseData) {
      const productIdData = parseData[productId]
      map(productIdData, (ids, index: number) => {
        multipleSelection.value = {
          [index]: ids
        }
        ids.forEach((id: number) => {
          const findItem = constructionBomList.value[index]?.structureMaterial?.find(c => c.id === id)
          if (findItem) {
            multipleTableRef.value[index]!.toggleRowSelection(findItem, true)
          }
        })
      })
    }
  })
}

const fetchOptionsData = async () => {
  const exchangeSelect: any = await getExchangeRate({
    maxResultCount: 100,
    skipCount: 0
  })
  exchangeSelectOptions.value = exchangeSelect.result.items || []
}

// 获取初始化数据
const fetchInitData = async () => {
  try {
    tableLoading.value = true
    const { result } = (await GetStructural({ auditFlowId, solutionId: productId })) || {}
    constructionBomList.value = result || []
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}

const formatDatas = (record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue).toFixed() + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return ''
  }
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
const handleSubmit = async (record: any, isSubmit: number, bomIndex: number, rowIndex: number) => {
  if (isSubmit) {
    //提交
    await submitFun(record, isSubmit, bomIndex, rowIndex)
  } else {
    //确认
    await SubmitJudge(record, isSubmit, bomIndex, rowIndex)
  }
}

const debounceHandleCalculation = debounce(async (row: any, bomIndex: number, index: number) => {
  try {
    row.loading = true
    const { success, result } = await PostStructuralMaterialCalculate(row)
    if (!success && !result.length) {
      row.loading = false
      throw Error()
    }
    const res = { ...(result || {}), isEdit: true }
    constructionBomList.value[bomIndex].structureMaterial[index] = res
    row.loading = false
  } catch (err) {
    ElMessage.error("计算失败~")
    row.loading = false
  }
}, 300)

// 根据汇率计算
const handleCalculation = (row: any, bomIndex: number, index: number) => {
  row.loading = true
  return debounceHandleCalculation(row, bomIndex, index)
}

const SubmitJudge = async (record: any, isSubmit: number, bomIndex: number, rowIndex: number) => {
  await submitFun(record, isSubmit, bomIndex, rowIndex)
}

const submitFun = async (
  record: ConstructionModel,
  isSubmit: number,
  bomIndex: number,
  iginalCurrencyIndex: number
) => {
  const row = constructionBomList.value[bomIndex].structureMaterial[iginalCurrencyIndex]
  let { nodeInstanceId } = route.query
  const { success } = await PostStructuralMemberEntering({
    isSubmit,
    structuralMaterialEntering: [{ ...row, productId }],
    auditFlowId,
    opinion: "Done",
    nodeInstanceId
  })
  if (success) ElMessage.success(`${isSubmit ? "提交" : "确认"}成功！`)
  fetchInitData()
  record.isEdit = false
}

const computeStandardMoney = (arr: any[]) => {
  const rowOne = cloneDeep(arr?.[0]?.standardMoney)
  arr.forEach((item: any, index) => {
    if (index > 1) {
      const { standardMoney } = item
      standardMoney?.forEach((s: any, sIndex: number) => {
        const { yearOrValueModes } = s
        console.log(yearOrValueModes, "yearOrValueModes")
        yearOrValueModes.forEach((y: any, yIndex: number) => {
          if (rowOne[sIndex]?.yearOrValueModes[yIndex]?.value) rowOne[sIndex].yearOrValueModes[yIndex].value += y.value
        })
      })
    }
  })

  return rowOne
}

// 修改
const handleEdit = (row: any, isEdit: boolean) => {
  row.isEdit = isEdit
}

const filterStandardMoney = (record: any, _row: any, cellValue: any) => {
  return cellValue?.toFixed(5) || ""
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}

const filterinTheRate = (record: any, _row: any, cellValue: any) => {
  return `${(cellValue * 100 || 0).toFixed(2)} %`
}

//selectionChange 当选择项发生变化时会触发该事件
const selectionChange = async (selection: any, index: number) => {
  console.log(selection, "selection123123")
  const ids = map(selection, v => v.id)
  multipleSelection.value = {
    [index]: ids
  }
  const storageData = {
    [productId]: {
      [index]: ids
    }
  }
  setSessionStorage(props.isMergeVertify ? MERGE_STORAGE_KEY : STORAGE_KEY, JSON.stringify(storageData))
}

// 获取结构料初始化数据
const fetchConstructionInitData = async () => {
  try {
    const { result } = await GetBOMStructuralSingle(auditFlowId, productId)
    constructionBomList.value = result.constructionDtos
    isAll.value = result.isAll
    return true
  } catch {
    return false
  }
}

const handleSetBomState = async ({ comment, opinion, nodeInstanceId }: any) => {
  console.log(multipleSelection.value, "multipleSelection.value123")
  let idsData: any = []
  map(multipleSelection.value, (val, index) => {
    idsData.push(...val)
  })
  console.log(idsData, "[结构料审核ids]")
  if (!opinion.includes("_Yes") && !idsData.length) {
    ElMessage({
      message: "请选择要退回那些条数据!",
      type: "warning"
    })
    return
  }
  const { success } = await BomReview({
    // isAgree: !opinion.includes("_No"),
    auditFlowId,
    bomCheckType: 4, //3：“电子Bom单价审核”，4：“结构Bom单价审核”,5:"Bom单价审核"
    // opinionDescription: comment,
    comment,
    opinion,
    nodeInstanceId,
    structureUnitPriceId: idsData,
    // peopleId: data.peopleId
  })

  if (success) {
     closeSelectedTag(route.path)
  }
}
defineExpose({
  getSelection: () => multipleSelection.value
})
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
