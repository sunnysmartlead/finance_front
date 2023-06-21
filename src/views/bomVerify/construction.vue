<template>
  <el-card class="wrap m-2" header="结构bom单价审核">
    <div>
      <ThreeDImage style="margin-left: 30px" />
    </div>
    <el-card
      v-for="(item, index) in constructionBomList"
      :header="item.superTypeName"
      :key="index"
      class="table-wrap"
    >
      <div v-if="item.structureMaterial.length">
        <el-table
          ref="multipleTableRef"
          :data="item.structureMaterial"
          style="width: 100%"
          height="75vh"
          v-loading="loading"
          @selection-change="selectionChange($event, index)"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="70" fixed />
          <el-table-column prop="categoryName" label="物料大类" fixed width="80" />
          <el-table-column prop="typeName" label="物料种类" fixed width="80" />
          <el-table-column prop="sapItemNum" label="物料编号" fixed width="80" />
          <el-table-column prop="drawingNumName" label="图号名称" fixed width="80" />
          <el-table-column prop="overallDimensionSize" label="外形尺寸" width="80" />
          <el-table-column prop="materialName" label="材料" width="80" />
          <el-table-column prop="weightNumber" label="重量g" width="80" />
          <el-table-column prop="moldingProcess" label="成型工艺" width="80" />
          <el-table-column prop="secondaryProcessingMethod" label="二次加工方法" width="80" />
          <el-table-column prop="surfaceTreatmentMethod" label="表面处理" width="80" />
          <el-table-column prop="dimensionalAccuracyRemark" label="关键尺寸精度及重要要求" width="80" />
          <el-table-column prop="materialsUseCount" label="项目物料的使用量">
            <el-table-column
              v-for="(item, iginalCurrencyIndex) in allColums?.sop"
              :key="item"
              :label="`${item?.toString()}`"
              width="80"
            >
              <template #default="scope">
                <span>{{ scope.row?.materialsUseCount[iginalCurrencyIndex]?.value || 0 }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="currency" label="币种" width="80">
            <template #default="scope">
              <el-select v-if="scope.row.isEdit" v-model="scope.row.currency" placeholder="选择币种">
                <el-option
                  v-for="item in exchangeSelectOptions"
                  :key="item.id"
                  :label="item.exchangeRateKind"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="systemiginalCurrency" label="系统单价（原币）">
            <el-table-column
              v-for="(item, iginalCurrencyIndex) in allColums?.sop"
              :key="item"
              :label="`${item?.toString()}`"
              :prop="`systemiginalCurrency[${iginalCurrencyIndex}].value`"
              width="80"
            >
              <template #default="scope">
                <span>{{ scope.row?.systemiginalCurrency[iginalCurrencyIndex]?.value || 0 }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="inTheRate" label="年降率">
            <el-table-column
              v-for="(item, iginalCurrencyIndex) in allColums?.sop"
              :key="`construction-iginalCurrency${item}`"
              :label="`${item?.toString()}`"
              :prop="`inTheRate[${iginalCurrencyIndex}].value`"
              width="80"
            >
              <template #default="scope">
                <span>{{ scope.row?.inTheRate[iginalCurrencyIndex]?.value }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column prop="materialsSystemPrice" label="系统单价" width="150">
            <template #default="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.materialsSystemPrice" />
              <span v-if="!scope.row.isEdit">{{ scope.row.materialsSystemPrice }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="Sop" align="center" v-if="allColums?.sop.length">
          <el-table-column
            v-for="(item, index) in allColums?.sop"
            :key="item"
            :label="`${item}`"
            :prop="`sop[${index}].value`"
            width="150"
          />
        </el-table-column> -->
          <el-table-column prop="iginalCurrency" label="原币">
            <el-table-column
              v-for="(item, iginalCurrencyIndex) in allColums?.sop"
              :key="`construction-iginalCurrency${item}`"
              :label="`${item?.toString()}`"
              :prop="`iginalCurrency[${iginalCurrencyIndex}].value`"
              width="80"
            >
              <template #default="{ row }">
                {{ (row?.iginalCurrency && row?.iginalCurrency[iginalCurrencyIndex]?.value).toFixed(3) || 0 }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="standardMoney" label="本位币">
            <el-table-column
              v-for="(item, index) in allColums?.sop"
              :key="`construction-standardMoney${item}`"
              :label="`${item?.toString()}`"
              :prop="`standardMoney[${index}].value`"
              width="80"
            >
              <template #default="{ row }">
                {{ (row.standardMoney && row.standardMoney[index]?.value).toFixed(3) || 0 }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="moq" label="MOQ" width="80" />
          <el-table-column prop="rebateMoney" label="物料返利金额" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="eccnCode" label="物料管制状态" />
          <el-table-column prop="peopleName" fixed="right" label="确认人" />
        </el-table>
        <el-descriptions :column="2" border>
          <el-descriptions-item
            v-for="standardMoneyItem in allColums.sop"
            :key="standardMoneyItem"
            :label="`${standardMoneyItem} 本位币汇总`"
          >
            {{ calculationAllStandardMoney(item.structureMaterial)[standardMoneyItem] || 0 }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-row justify="end" style="margin-top: 20px" v-if="data.auditFlowId && data.productId">
      <el-button type="primary" @click="handleSetBomState(true)" v-havedone :disabled="!isAll">同意</el-button>
      <el-button type="danger" @click="handleSetBomState(false)" v-havedone>拒绝</el-button>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, onMounted, watchEffect, watch, nextTick, computed } from "vue"
import { GetBOMStructuralSingle, SetBomState } from "./service"
import { getExchangeRate } from "./../demandApply/service"
import { getYears } from "../pmDepartment/service"
import getQuery from "@/utils/getQuery"
import { ElMessageBox, ElMessage } from "element-plus"
import useJump from "@/hook/useJump"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
import { useRouter } from "vue-router"
let isAll = ref(false)
let router = useRouter()
const { jumpTodoCenter } = useJump()

const { auditFlowId, productId }: any = getQuery()

// 结构料 - table数据
const constructionBomList = ref<any[]>([])
const constructionId = ref<any[]>([])
const construction = ref<any[]>([])
const peopleId = ref<any[]>([])
const people = ref<any[]>([])
const loading = ref(false)
// 表单子列
const allColums = reactive<any>({
  sop: []
})

const data = reactive({
  auditFlowId,
  productId,
  construction,
  people,
  constructionId,
  peopleId
})

const exchangeSelectOptions = ref<any>([])
const multipleTableRef = ref<any>()
onBeforeMount(() => {
  fetchOptionsData()
  fetchSopYear()
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  window.sessionStorage.setItem("placePath", router.currentRoute.value.path)
  fetchConstructionInitData().then(() => {
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
      constructionBomList.value.forEach((item: any, index: number) => {
        const row = item.structureMaterial.filter((p: any) => p.id == id)
        if (row[0]) {
          multipleTableRef.value[index]!.toggleRowSelection(row[0], true)
        }
      })
    })
  })
}

const constructionBomListfilter = computed(() => {
  return constructionBomList.value.filter((item) => item.structureMaterial.length)
})
// const toFixedThree = (_recoed: any, _row: any, val: any) => {
//   if (typeof val === "number" && val > 0) return val.toFixed(3)
//   return val
// }
const fetchOptionsData = async () => {
  const exchangeSelect: any = await getExchangeRate({
    maxResultCount: 100,
    skipCount: 0
  })
  exchangeSelectOptions.value = exchangeSelect.result.items || []
}

// 计算总值
const reduceArr = (arr: any[]) => {
  return arr.reduce((a, b) => a + b)
}

// 获取结构料初始化数据
const fetchConstructionInitData = async () => {
  try {
    loading.value = true
    const { result } = await GetBOMStructuralSingle(auditFlowId, productId)
    //console.log(result, "获取初始化数据")
    constructionBomList.value = result.constructionDtos
    isAll.value = result.isAll
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

const calculationAllStandardMoney = (structureMaterial: any) => {
  let obj: any = {}
  const standardMoney = structureMaterial?.map((item: any) => item.standardMoney) || []
  const flatArr = standardMoney.flat(Infinity)
  allColums?.sop.forEach((item: any) => {
    const arr: any = []
    flatArr.forEach((y: any) => {
      if (y.year === item) {
        arr.push(y.value || 0)
      }
    })
    obj[item] = reduceArr(arr).toFixed(5)
  })
  return obj
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
  data.constructionId = [...new Set(construction.flat(Infinity))]
  data.peopleId = [...new Set(people.flat(Infinity))]
  if (!isAgree && (!data.constructionId.length || !data.peopleId.length)) {
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
      bomCheckType: 4,
      opinionDescription: !isAgree ? val.value : "",
      unitPriceId: data.constructionId,
      peopleId: data.peopleId
    })
    if (success) jumpTodoCenter()
  })
}

//selectionChange 当选择项发生变化时会触发该事件
const selectionChange = async (selection: any, index: number) => {
  data.construction[index] = selection.map((p: any) => p.id)
  data.people[index] = selection.map((p: any) => p.peopleId)
  data.constructionId = data.construction.flat(Infinity) //上一个和下一个相加
  data.peopleId = [...new Set(data.people.flat(Infinity))] //上一个和下一个相加
  var prop = window.sessionStorage.getItem("construction")
  var ConstructionId = [
    {
      key: productId,
      constructionId: data.constructionId,
      peopleId: data.peopleId
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
          ConstructionId[index].constructionId = data.constructionId
          ConstructionId[index].peopleId = data.peopleId
        }
      })
    } else {
      let propConstructionId = {
        key: productId,
        constructionId: data.constructionId,
        peopleId: data.peopleId
      }
      ConstructionId.push(propConstructionId)
      //console.log("添加")
    }
  } else {
    let propConstructionId = {
      key: productId,
      constructionId: data.constructionId,
      peopleId: data.peopleId
    }
    ConstructionId = []
    ConstructionId.push(propConstructionId)
    //console.log("直接添加")
  }
  //console.log("结果", ConstructionId)
  window.sessionStorage.setItem("construction", JSON.stringify(ConstructionId))
}

const fetchSopYear = async () => {
  const { result } = (await getYears(auditFlowId)) || {}
  allColums.sop = result || []
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
