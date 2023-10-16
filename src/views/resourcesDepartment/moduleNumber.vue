<template>
  <el-card header="项目走量">
    <el-row justify="space-between" align="middle" style="margin: 10px 0px">
      <h6 style="margin: 0px">客户输入终端走量K（台）</h6>
    </el-row>

    <div v-for="(item, Findex) in moduleTableDataV2" :key="Findex">
      <el-row justify="space-between" align="middle">
        <h6 class="mx-1" size="large">{{ item[0].carModel }} - 模组数量K</h6>
      </el-row>
      <el-table :data="item" style="width: 100%" border>
        <el-table-column type="index" width="80" label="序号" />
        <el-table-column label="客户零件号" width="180">
          <template #default="{ row }">
            <el-input v-model="row.partNumber" placeholder="若没有，填写 /" :disabled="isDisabled" />
          </template>
        </el-table-column>
        <el-table-column label="子项目代码" width="180">
          <template #default="{ row }">
            <el-select v-model="row.code" remote-show-suffix reserve-keyword filterable placeholder="Select"
              :disabled="isDisabled" remote>
              <el-option v-for="item in data.projectCodeOptions" :key="item.subCode" :label="item.subCode"
                :value="item.subCode" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="180">
          <template #default="{ row }">
            <el-input v-model="row.product" :disabled="isDisabled" />
          </template>
        </el-table-column>
        <el-table-column label="产品大类" width="180">
          <template #default="{ row }">
            <el-select v-model="row.productType" placeholder="产品大类" :disabled="isDisabled">
              <el-option v-for="item in data.productTypeOptions" :key="item.id" :label="item.displayName"
                :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="像素" width="180">
          <template #default="{ row }">
            <el-input v-model="row.pixel" placeholder="像素" :disabled="isDisabled" />
          </template>
        </el-table-column>
        <el-table-column label="我司角色" width="180">
          <template #default="{ row }">
            <el-select v-model="row.ourRole" placeholder="我司角色" :disabled="isDisabled">
              <el-option v-for="item in data.roleOptions" :key="item.id" :label="item.displayName" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="市场份额" width="180">
          <template #default="{ row }">
            <el-input v-model="row.marketShare" oninput="value=value.replace(/[^0-9.]/g,'')" :disabled="isDisabled"
              type="number">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="模组搭载率" width="180">
          <template #default="{ row }">
            <el-input v-model="row.moduleCarryingRate" oninput="value=value.replace(/[^0-9.]/g,'')" :disabled="isDisabled"
              type="number">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="单车产品数量" width="180">
          <template #default="{ row }">
            <el-input v-model="row.singleCarProductsQuantity" oninput="value=value.replace(/[^\d]/g,'')"
              :disabled="isDisabled" />
          </template>
        </el-table-column>
        <el-table-column :label="year + yearNote(index)" v-for="(year, index) in data.yearCols"
          :key="`${Findex}-${year}-${index}`" width="180" :formatter="formatThousandths" :prop="`modelCountYearList.${index}.quantity`">
          <template #default="{ row }" >
            <!-- {{ formatThousandths(null, null, row.modelCountYearList?.[index]?.quantity) }} -->
          </template>
        </el-table-column>
        <el-table-column label="模组总量" width="180">
          <template #default="{ row }">
            {{ price(row) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, ref } from "vue"
import getQuery from "@/utils/getQuery"
import { getPriceEvaluationStartData } from "../demandApply/service"
import { productTypeMap, YearListItem, updateFrequency } from "../demandApply/data.type"
import { getDictionaryAndDetail } from "@/api/dictionary"
import { GetAllProjectSelf } from "@/views/financeDepartment/common/request"

const { auditFlowId }: any = getQuery()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive<any>({
  moduleNumber: [], // 项目走量
  moduleNumberSop: [],
  quoteForm: {},
  yearCols: [],
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
      if (viewDataRes.result.carModelCount?.length) {
        moduleTableDataV2.value = Object.values(
          viewDataRes.result.carModelCount?.reduce((result: any, item: any) => {
            if (!result[item.carModel]) {
              result[item.carModel] = []
            }
            result[item.carModel].push(item)
            return result
          }, {})
        )
      }
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
