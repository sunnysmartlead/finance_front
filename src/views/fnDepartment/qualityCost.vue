<template>
  <div>
    <el-card class="card">
      <el-row justify="end">
        <el-button type="primary" @click="addYear" m="2">新增年</el-button>
        <el-button type="primary" @click="addClass" m="2">新增类</el-button>
        <el-button type="primary" @click="handleSubmit" m="2">提交</el-button>
      </el-row>
      <el-row align="middle">
        关键字：
        <el-input v-model="data.tableParams.filter" @change="fetchTableData" style="width: 250px" />
        <el-button m="2" @click="onReset" type="primary">重置</el-button>
      </el-row>
      <el-table :data="data.tableData" style="width: 100%; margin-top: 25px" border>
        <el-table-column type="index" width="80" />
        <el-table-column label="类别" prop="category" width="180">
          <template #default="{ row }">
            <el-select
                v-model="row.category"
                placeholder="价格有效期"
              >
                <el-option
                  v-for="item in data.qualityCostOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否首款产品" width="180">
          <template #default="{ row }">
            <el-select
                v-model="row.isItTheFirstProduct"
                placeholder="价格有效期"
              >
                <el-option
                  v-for="item in data.isItTheFirstProductOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
          </template>
        </el-table-column>
        <el-table-column label="质量成本比例">
          <el-table-column :label="yearItem.yearAlias" v-for="(yearItem, index) in data.years" :key="year" width="200">
            <template #default="{ row }">
              <el-input v-model="row.qualityCostRatioYears[index].value" type="number">
                <template #append>%</template>
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-row justify="end" m="2">
        <el-pagination :page-size="20" :pager-count="data.tableParams.skipCount" layout="prev, pager, next"
          :total="data.selfTabletotal" background @current-change="(val) => changeCurrent(val, data.selfTableParams)" />
      </el-row>
    </el-card>
    <LogList ref="logListRef" :type="14" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, watch, onMounted, watchEffect, ref } from "vue"
import LogList, { LogListAPI } from "@/components/LogList/index.vue"
import { getQualityCost, saveQualityCost } from "./service"
import { ElMessage } from "element-plus"
import { getDictionaryAndDetail } from "@/api/dictionary"
import { clone, cloneDeep } from "lodash"

/**
 * 数据部分
 */
const data = reactive<any>({
  tableData: [],
  years: [] as number[],
  productTypeMap: {},
  tableParams: {
    filter: "",
    skipCount: 1
  },
  total: 0,
  qualityCostOptions: [],
  isItTheFirstProductOptions: [
    {
      id: true,
      displayName: '是'
    },
    {
      id: false,
      displayName: '否'
    }
  ]
})

const logListRef = ref<LogListAPI>()

watch(
  () => data.tableParams.skipCount,
  () => {
    init()
  },
  {
    deep: true
  }
)

const handleSubmit = async () => {
  let res: any = await saveQualityCost(data.tableData)
  if (res.success) {
    ElMessage({
      type: "success",
      message: "保存成功"
    })
  }
}

const changeCurrent = (val: number, row: any) => {
  row.skipCount = val
}

const addYear = () => {
  if (!data.tableData.length) {
    ElMessage.warning('当前没有数据，请先新增类～')
  }
  const len = data.years.length
  const lastOne = data.years[len - 1]

  const filterData = cloneDeep({
    year: lastOne.year + 1,
    yearAlias: `SOP+${lastOne.year + 1}`,
    value: 0
  })
  console.log(filterData, "filterData")
  data.years.push(filterData)
  data.tableData.forEach((item: any) => {
    item.qualityCostRatioYears.push(filterData)
  })
}

const fetchOptionsData = async () => {
  const { success, result }: any = await getDictionaryAndDetail('QualityCostType')
  if (success) {
    data.qualityCostOptions = result?.financeDictionaryDetailList
  }
}

const addClass = () => {
  let qualityCostRatioYears = [{
    yearAlias: "SOP",
    year: 0,
    value: 0
  }]
  if (data.years.length) {
    qualityCostRatioYears = data.years
  } else {
    data.years = qualityCostRatioYears
  }
  data.tableData.push({
    category: "",
    isItTheFirstProduct: false,
    qualityCostRatioYears: cloneDeep(qualityCostRatioYears)
  })
}

const init = async () => {
  const { success, result }: any = (await getQualityCost({
    ...data.tableParams
  })) || {}
  if (success) {
    if (result.items.length) {
      data.years = result.items[0]?.qualityCostRatioYears
    }
    console.log(result.items, 'result.items')
    setTimeout(() => {
      data.tableData = result.items
    }, 200)
  }
}

onMounted(() => {
  init()
  fetchOptionsData()
})
watchEffect(() => { })
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.card {
  margin: 20px 0;
}
</style>
