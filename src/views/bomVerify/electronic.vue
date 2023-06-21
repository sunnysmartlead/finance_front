<template>
  <el-card class="wrap m-2">
    <el-card class="table-wrap" header="电子料单价">
      <el-table
        :data="electronicBomList"
        style="width: 100%"
        v-loading="loading"
        height="75vh"
        ref="multipleTableRef"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="categoryName" label="物料大类" fixed="left" width="150" />
        <el-table-column prop="typeName" label="物料种类" fixed="left" width="150" />
        <el-table-column prop="sapItemNum" label="物料编号" fixed="left" width="150" />
        <el-table-column prop="sapItemName" label="材料名称" fixed="left" width="150" />
        <el-table-column prop="materialsUseCount" label="项目物料的使用量">
          <el-table-column
            v-for="(item, index) in allColums?.materialsUseCountYears"
            :key="item"
            :label="`${item}`"
            :prop="`materialsUseCount[${index}].value`"
            width="150"
          >
            <template #default="scope">
              <span>{{ scope.row.materialsUseCount[index].value }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="currency" label="币种" width="150">
          <!-- <template #default="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.currency" placeholder="选择币种">
              <el-option
                v-for="item in exchangeSelectOptions"
                :key="item.id"
                :label="item.exchangeRateKind"
                :value="item.exchangeRateKind"
              />
            </el-select>
          </template> -->
        </el-table-column>
        <el-table-column prop="systemiginalCurrency" label="系统单价（原币）">
          <el-table-column
            v-for="(item, index) in allColums?.systemiginalCurrencyYears"
            :key="item"
            :label="`${item}`"
            :prop="`systemiginalCurrency[${index}].value`"
            width="150"
          >
            <template #default="scope">
              <span>{{ scope.row.systemiginalCurrency[index].value.toFixed(3) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="inTheRate" label="年降率">
          <el-table-column
            v-for="(item, index) in allColums?.inTheRateYears"
            :key="item"
            :label="`${item}`"
            :prop="`inTheRate[${index}].value`"
            width="150"
          />
        </el-table-column>
        <el-table-column prop="iginalCurrency" label="原币">
          <el-table-column
            v-for="(item, index) in allColums?.iginalCurrencyYears"
            :key="item"
            :label="`${item}`"
            :prop="`iginalCurrency[${index}].value`"
            width="150"
          >
            <template #default="{ row }">
              {{ row.iginalCurrency[index]?.value.toFixed(3) || 0 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="standardMoney" label="本位币">
          <el-table-column
            v-for="(item, index) in allColums?.standardMoneyYears"
            :key="item"
            :label="`${item}`"
            :prop="`standardMoney[${index}].value`"
            width="150"
          >
            <template #default="{ row }">
              {{ row.standardMoney[index]?.value.toFixed(5) || 0 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="moq" label="MOQ" width="150" />
        <el-table-column prop="rebateMoney" label="物料返利金额" width="150" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="eccnCode" label="物料管制状态">
          <!-- <template #default="{ row }">
            <el-select v-model="row.ECCNCode">
              <el-option label="ECCN" value="ECCN" />
              <el-option label="EAR99" value="EAR99" />
              <el-option label="待定" value="待定" />
              <el-option label="不涉及" value="不涉及" />
            </el-select>
          </template> -->
        </el-table-column>
        <el-table-column prop="peopleName" fixed="right" label="确认人" />
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
    <el-row justify="end" style="margin-top: 20px" v-if="data.auditFlowId && data.productId">
      <el-button type="primary" @click="handleSetBomState(true)" v-havedone   :disabled="!isAll">同意</el-button>
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
// 计算总值
const reduceArr = (arr: any[]) => {
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

// 获取电子料初始化数据
const fetchElectronicInitData = async () => {
  const { result } = await GetBOMElectronicSingle(auditFlowId, productId)
  console.log(result, "获取初始化数据")
  electronicBomList.value = result.electronicDtos
  isAll.value = result.isAll
  // 初始化表头数据
  const { materialsUseCount, systemiginalCurrency, inTheRate, iginalCurrency, standardMoney } =
    electronicBomList?.value[0] || {}
  allColums.materialsUseCountYears = materialsUseCount?.map((item) => item.year) || []
  allColums.systemiginalCurrencyYears = systemiginalCurrency?.map((item) => item.year) || []
  allColums.inTheRateYears = inTheRate?.map((item) => item.year) || []
  allColums.iginalCurrencyYears = iginalCurrency?.map((item) => item.year) || []
  allColums.standardMoneyYears = standardMoney?.map((item) => item.year) || []
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

watchEffect(() => {})
</script>
<style scoped lang="scss">
.wrap {
  margin-bottom: 20px;
}
.table-wrap {
  margin-top: 10px;
}
</style>
