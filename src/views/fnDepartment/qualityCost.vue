<template>
  <div>
    <el-card class="card">
      <el-table :data="data.tableData" style="width: 100%; margin-top: 25px" border>
        <el-table-column type="index" width="80" />
        <el-table-column label="类别" prop="categoryName" width="180" />
        <el-table-column label="是否首款产品" width="180">
          <template #default="{ row }">
            {{ row.isFirst ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="质量成本比例">
          <el-table-column :label="year + ''" v-for="(year, index) in data.years" :key="year" width="200">
            <template #default="{ row }">
              <el-input v-model="row.qualityCostYearList[index].rate" type="number">
                <template #append>%</template>
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { getDictionaryAndDetail } from "@/api/dictionary"

// import { useRoute, useRouter } from "vue-router"
import { getQualityCost, saveQualityCost } from "./service"
import { QualityCostProportionEntryInfo } from "./data.type"
// import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"

/**
 * 路由对象
 */
// const route = useRoute()
/**
 * 路由实例
 */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  tableData: [
    // {
    //   category: "环境感知",
    //   isFirst: true,
    //   qualityCostYearList: []
    // },
    // {
    //   category: "环境感知",
    //   isFirst: false,
    //   qualityCostYearList: []
    // },
    // {
    //   category: "外摄显像",
    //   isFirst: true,
    //   qualityCostYearList: []
    // },
    // {
    //   category: "外摄显像",
    //   isFirst: false,
    //   qualityCostYearList: []
    // },
    // {
    //   category: "舱内检测",
    //   isFirst: true,
    //   qualityCostYearList: []
    // },
    // {
    //   category: "舱内检测",
    //   isFirst: false,
    //   qualityCostYearList: []
    // }
  ] as any[],
  years: [] as number[],
  productTypeMap: {} as any
})
const years = (index: number) => {
  let sop = new Date().getFullYear()
  let yearList: number[] = [sop]
  for (let i = 1; i < index; i++) {
    yearList.push(sop + i)
  }
  return yearList
}
const submit = async () => {
  let formatData = data.tableData.map((item) => {
    let { category, isFirst, qualityCostYearList } = item
    return {
      category,
      isFirst,
      qualityCostYearList: qualityCostYearList.map((item: any) => {
        return {
          year: item.year,
          rate: (Number(item.rate) / 100).toFixed(4)
        }
      })
    }
  })
  let res: any = await saveQualityCost(formatData as QualityCostProportionEntryInfo[])
  if (res.success) {
    ElMessage({
      type: "success",
      message: "保存成功"
    })
  }
}
onBeforeMount(async () => {
  let productType: any = await getDictionaryAndDetail("ProductType") //客户性质
  let productTypeOptions: any = productType.result.financeDictionaryDetailList
  productTypeOptions.forEach((item: any) => {
    data.productTypeMap[item.id] = item.displayName
    data.tableData.push({
      categoryName: item.displayName,
      category: item.id,
      isFirst: true,
      qualityCostYearList: []
    })
    data.tableData.push({
      categoryName: item.displayName,
      category: item.id,
      isFirst: false,
      qualityCostYearList: []
    })
  })
  // 获取值，后端没返回name需要另外映射
  let res: any = await getQualityCost()
  if (res.result.length > 0) {
    data.years = years(10)
    data.tableData = res.result.map((item: any) => {
      let { category, isFirst, qualityCostYearList } = item
      return {
        category,
        categoryName: data.productTypeMap[category], // 映射name
        isFirst,
        qualityCostYearList: qualityCostYearList.map((item: any) => {
          return {
            year: item.year,
            rate: (Number(item.rate) * 100).toFixed(2)
          }
        })
      }
    })
  } else {
    data.years = years(10)
    data.tableData.forEach((item: any) => {
      item.qualityCostYearList = data.years.map((year) => ({ year, rate: 0 }))
    })
  }
})
onMounted(async () => {})
watchEffect(() => {})
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
