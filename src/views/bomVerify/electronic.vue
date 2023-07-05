<template>
  <el-card class="wrap m-2">
    <el-card class="table-wrap" header="电子料单价">
      <el-table :data="electronicBomList" style="width: 100%" v-loading="loading" height="75vh" ref="multipleTableRef"
        @selection-change="selectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="categoryName" label="物料大类" width="60" fixed="left" />
        <el-table-column prop="typeName" label="物料种类" width="80" fixed="left" />
        <el-table-column prop="sapItemNum" label="物料编号" width="80" fixed="left" />
        <el-table-column prop="sapItemName" label="材料名称" width="120" fixed="left" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="120" fixed="left" />
        <el-table-column prop="materialsUseCount" label="项目物料的使用量">
          <el-table-column align="center" :class-name="`column-class-${index}`"
            v-for="(item, index) in allColums?.materialsUseCountYears" prop="materialsUseCount" width="175"
            :label="`${item?.kv} K/Y`">
            <el-table-column width="100" v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
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
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" width="175">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]"
              :prop="`systemiginalCurrency.${index}.yearOrValueModes.${iIndex}.value`" width="175">
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="inTheRate" label="年降率">
          <el-table-column v-for="(item, index) in allColums?.inTheRateYears" align="center"
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" width="175">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]"
              :prop="`inTheRate.${index}.yearOrValueModes.${iIndex}.value`" width="175">
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
          <el-table-column v-for="(item, index) in allColums?.standardMoneyYears" align="center"
            :class-name="`column-class-${index}`" :label="`${item.kv} K/Y`" width="175">
            <el-table-column v-for="(yearItem, iIndex) in item?.yearOrValueModes" :key="iIndex"
              :label="yearItem.year + upDownEunm[yearItem.upDown]" width="175"
              :prop="`standardMoney.${index}.yearOrValueModes.${iIndex}.value`" :formatter="filterStandardMoney" />
          </el-table-column>
        </el-table-column>
        <el-table-column prop="moq" label="MOQ" width="120">
        </el-table-column>
        <el-table-column prop="rebateMoney" label="物料返利金额" width="120">
          <el-table-column v-for="(item, index) in allColums?.rebateMoneyYears" align="center" :label="`${item.kv} K/Y`"
            width="175" :prop="`rebateMoney.${index}.value`">
          </el-table-column>
        </el-table-column>
        <el-table-column label="备注" width="100" prop="remark" />
        <el-table-column label="物料管制状态" width="130">
          <template #default="{ row }">
            <el-select v-model="row.materialControlStatus" disabled>
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
              {{ yearItem.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
      </div>
      <!-- <el-row justify="end">
        <el-button class="margin-top" @click="handleCalculation" type="primary"> 计算 </el-button>
      </el-row> -->
    </el-card>
    <el-row justify="end" style="margin-top: 20px" v-if="data.auditFlowId && data.productId">
      <el-button type="primary" @click="handleSetBomState(true)" v-havedone :disabled="!isAll">同意</el-button>
      <el-button type="danger" @click="handleSetBomState(false)" v-havedone>拒绝</el-button>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, onMounted, watchEffect, computed, watch, nextTick } from "vue"
import { ElectronicDto } from "../resourcesDepartment/data.type"
import { GetBOMElectronicSingle, SetBomState } from "./service"
import { getExchangeRate } from "./../demandApply/service"
import { getYears } from "../pmDepartment/service"
import getQuery from "@/utils/getQuery"
import { ElMessageBox, ElMessage, ElTable } from "element-plus"
import useJump from "@/hook/useJump"
import { useRouter } from "vue-router"
import { cloneDeep } from 'lodash'

let router = useRouter()
let isAll = ref(false)
const { jumpTodoCenter } = useJump()
const { auditFlowId, productId }: any = getQuery()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// 电子料 - table数据
const electronicBomList = ref<ElectronicDto[]>([])
const loading = ref(true)
const electronicId = ref<any[]>([])
const peopleId = ref<any[]>([])
// 表单子列
const allColums = reactive<any>({
  sop: []
})

enum upDownEunm {
  '全年',
  '上半年',
  '下半年'
}

const data = reactive({
  auditFlowId,
  productId,
  allStandardMoney: 0
})

const exchangeSelectOptions = ref<any>([])

onBeforeMount(() => {
  fetchOptionsData()
  fetchSopYear()
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  window.sessionStorage.setItem("placePath", router.currentRoute.value.path)
  fetchElectronicInitData().then(() => {
    const construction = window.sessionStorage.getItem("construction")
    if (construction) {
      let porp = JSON.parse(construction)
      if (!porp) return
      let isExist = porp.filter((p: any) => p.key == productId)
      if (!isExist.length) return
      const value = isExist[0].constructionId
      toggleSelection(value) //数据反填
    }
  })
})
const toggleSelection = (Ids: any) => {
  nextTick(() => {
    Ids.forEach((id: any) => {
      const row = electronicBomList.value.filter((p: any) => p.id == id)
      if (row[0]) {
        multipleTableRef.value!.toggleRowSelection(row[0], true)
      }
    })
  })
}
const fetchOptionsData = async () => {
  try {
    loading.value = true
    const exchangeSelect: any = await getExchangeRate({
      maxResultCount: 100,
      skipCount: 0
    })
    exchangeSelectOptions.value = exchangeSelect.result.items || []
    loading.value = false
  } catch {
    loading.value = false
  }
}
watch(
  () => router.currentRoute.value.path,
  (newValue, oldValue) => {
    const path = window.sessionStorage.getItem("placePath")
    if (path) {
      //比较两个值是否一致
      if (newValue != path) {
        window.sessionStorage.removeItem("construction")
      }
    }
  },
  { immediate: true }
)

const allStandardMoney = computed(() => {
  try {
    const arr = electronicBomList.value
    const rowOne = cloneDeep(arr?.[0]?.standardMoney) || []
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
    console.log(err, '报错啦13123')
    return []
  }
})

// 获取电子料初始化数据
const fetchElectronicInitData = async () => {
  const { result } = await GetBOMElectronicSingle(auditFlowId, productId)
  console.log(result, "获取初始化数据")
  electronicBomList.value = result.electronicDtos
  isAll.value = result.isAll
  // 初始化表头数据
  const { materialsUseCount, systemiginalCurrency, inTheRate, iginalCurrency, standardMoney } =
    electronicBomList?.value[0] || {}
  allColums.materialsUseCountYears = materialsUseCount || []
  allColums.systemiginalCurrencyYears = systemiginalCurrency || []
  allColums.inTheRateYears = inTheRate || []
  allColums.iginalCurrencyYears = iginalCurrency || []
  allColums.standardMoneyYears = standardMoney || []
}

const fetchSopYear = async () => {
  const { result } = (await getYears(auditFlowId)) || {}
  allColums.sop = result || []
}

const handleSetBomState = (isAgree: boolean) => {
  var construction = [[]]
  var people = [[]]
  var prop = window.sessionStorage.getItem("construction")
  if (!prop && !isAgree) {
    ElMessage({
      message: "请选择要退回那些条数据!",
      type: "warning"
    })
    return
  } else {
    if (prop) {
      var constructionProp = JSON.parse(prop)
      constructionProp.forEach((p: any) => {
        construction.push(p.constructionId)
        people.push(p.peopleId)
      })
    }
  }
  electronicId.value = [...new Set(construction.flat(Infinity))]
  peopleId.value = [...new Set(people.flat(Infinity))]

  if (!isAgree && (!electronicId.value.length || !peopleId.value.length)) {
    ElMessage({
      message: "请选择要退回那些条数据!",
      type: "warning"
    })
    return
  }
  let text = isAgree ? "您确定要同意嘛？" : "请输入拒绝理由"
  ElMessageBox[!isAgree ? "prompt" : "confirm"](text, "请审核", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async (val) => {
    const { success } = await SetBomState({
      isAgree,
      auditFlowId,
      bomCheckType: 3,
      opinionDescription: !isAgree ? val?.value : "",
      unitPriceId: electronicId.value,
      peopleId: peopleId.value
    })
    if (success) jumpTodoCenter()
  })
}

//selectionChange 当选择项发生变化时会触发该事件
const selectionChange = async (selection: any) => {
  electronicId.value = selection.map((p: any) => p.id)
  peopleId.value = [...new Set(selection.map((p: any) => p.peopleId))]
  //multipleTableRef.value!.clearSelection()
  var prop = window.sessionStorage.getItem("construction")
  var ConstructionId = [
    {
      key: productId,
      constructionId: electronicId.value,
      peopleId: peopleId.value
    }
  ]
  if (prop) {
    ConstructionId = JSON.parse(prop)
    //判断有没有这个key
    let isExist = ConstructionId.filter((p: any) => p.key == productId)
    //console.log("ConstructionId", isExist)
    if (isExist.length) {
      ConstructionId.forEach((item: any, index: number) => {
        //console.log("修改", item, productId)
        if (item.key == productId) {
          ConstructionId[index].constructionId = electronicId.value
          ConstructionId[index].peopleId = peopleId.value
        }
      })
    } else {
      let propConstructionId = {
        key: productId,
        constructionId: electronicId.value,
        peopleId: peopleId.value
      }
      ConstructionId.push(propConstructionId)
      //console.log("添加")
    }
  } else {
    let propConstructionId = {
      key: productId,
      constructionId: electronicId.value,
      peopleId: peopleId.value
    }
    ConstructionId = []
    ConstructionId.push(propConstructionId)
    //console.log("直接添加")
  }
  //console.log("结果", ConstructionId)
  window.sessionStorage.setItem("construction", JSON.stringify(ConstructionId))
}

const filterStandardMoney = (record: any, _row: any, cellValue: any) => {
  return cellValue.toFixed(5) || ''
}

const formatDatas = (record: any, _row: any, cellValue: any) => {
  return cellValue || ''
}

watchEffect(() => { })
</script>
<style scoped lang="scss">
.wrap {
  margin-bottom: 20px;
}

.table-wrap {
  margin-top: 10px;
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
