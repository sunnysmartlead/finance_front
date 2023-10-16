<template>
  <div>
    <el-button type="primary" @click="data.visible = true">查看项目走量</el-button>
    <el-dialog v-model="data.visible" title="项目走量" width="90vw">
      <div v-for="(item, Findex) in data.gradientModelTable" :key="Findex">
        <p class="mx-1" size="large">{{ `${item.kv} ${data.quoteForm.updateFrequency == updateFrequency.HalfYear ?
          '(K/HY)' : '(K/Y)'}` }} </p>
        <el-table :data="item.children" style="width: 100%" border>
          <el-table-column type="index" width="80" label="序号" />
          <el-table-column label="客户零件号" prop="number" width="180" />
          <el-table-column label="子项目代码" prop="code" width="180" />
          <el-table-column label="产品名称" prop="name" width="180" />
          <el-table-column label="产品大类" width="180">
            <template #default="{ row }">
              <el-select v-model="row.type" placeholder="产品大类" disabled>
                <el-option v-for="item in data.productTypeOptions" :key="item.id" :label="item.displayName"
                  :value="item.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="year + yearNote(index)" v-for="(year, index) in data.yearCols"
            :key="`gradientModelTable-${year}-${index}`" width="180">
            <template #default="{ row }">
              {{ formatThousandths(null, null, row.gradientModelYear?.[index]?.count) }}
            </template>
          </el-table-column>
          <el-table-column prop="rowSum" label="合计" width="150">
            <template #default="{ row }">
              {{ formatThousandths(null, null, getRowSum(row, "gradientModelYear", "count")) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, ref } from "vue"
import getQuery from "@/utils/getQuery"
import { getPriceEvaluationStartData } from "@/views/demandApply/service"
import { productTypeMap, YearListItem, updateFrequency } from "@/views/demandApply/data.type"
import { getDictionaryAndDetail } from "@/api/dictionary"
import { GetAllProjectSelf } from "@/views/financeDepartment/common/request"
import { map, sortedUniq } from 'lodash'
const { auditFlowId }: any = getQuery()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive<any>({
  gradientModelTable: [], // 项目走量
  moduleNumberSop: [],
  quoteForm: {},
  yearCols: [],
  visible: false,
  productTypeOptions: [], // 产品大类
  roleOptions: [
    { id: "1", displayName: "一供" },
    { id: "2", displayName: "二供" },
    { id: "3", displayName: "三供" },
    { id: "4", displayName: "四供" }
  ]
})

const isDisabled = true
const moduleTableDataV2 = ref<any>([])
// 获取项目走量的数据
const fetchModuleNumberData = async () => {
  if (auditFlowId) {
    // 查看
    let viewDataRes: any = await getPriceEvaluationStartData(auditFlowId)
    if (viewDataRes.result) {
      data.quoteForm = viewDataRes.result
      yearChange(viewDataRes.result.projectCycle)
      const gradientValueData = sortedUniq(map(viewDataRes.result.gradientModel, item => item.gradientValue))
      data.gradientModelTable = map(gradientValueData, (item) => {
        return {
          kv: item,
          children: viewDataRes.result.gradientModel.filter((v: any) => v.gradientValue === item),
        }
      })
      console.log("第一次渲染: ", moduleTableDataV2.value)
    }
  }
}

const getProjectCodeOptions = async (filter?: any) => {
  const { result }: any = await GetAllProjectSelf({
    filter: filter || '',
    skipCount: 0,
    maxResultCount: 100
  })
  if (result?.items) {
    data.projectCodeOptions = result?.items
  }
}

const init = async () => {
  let productType: any = await getDictionaryAndDetail("ProductType") // 产品大类
  data.productTypeOptions = productType.result.financeDictionaryDetailList
}

const yearChange = (val: number) => {
  let i = data.quoteForm.projectCycle
  data.yearCols = []
  let arr = []
  for (let j = 0; j < i; j++) {
    if (data.quoteForm.updateFrequency == updateFrequency.HalfYear) {
      arr.push(Number(data.quoteForm.sopTime) + j)
    }
    arr.push(Number(data.quoteForm.sopTime) + j)
  }
  data.yearCols = arr
  console.log(data.yearCols, "state.yearCols ")
}

const price = (row: any) => {
  let modelTotal = 0
  row.modelCountYearList?.forEach((item: any) => {
    modelTotal += Number(item.quantity || 0)
  })
  return formatThousandths(null, null, modelTotal)
}

const yearNote = (index: number) => {
  if (data.quoteForm.updateFrequency != updateFrequency.HalfYear) return "年"
  if (index % 2) {
    return "年下"
  } else {
    return "年上"
  }
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}

const getRowSum = (row: any, key?: string, childkey?: string) => {
  if (Array.isArray(row[key || "pcsYearList"]) && row[key || "pcsYearList"].length > 0) {
    return row[key || "pcsYearList"]
      .map((item: any) => item[childkey || "quantity"])
      .reduce((prev: any, curr: any) => Number(prev) + Number(curr))
  }
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  init()
  getProjectCodeOptions()
  fetchModuleNumberData() //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
</script>
<style scoped lang="scss"></style>
