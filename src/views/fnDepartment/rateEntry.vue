<template>
  <el-card header="作业价格" class="m-2">
    <el-table :data="tableData" style="width: 100%; margin-top: 25px" border>
      <el-table-column label="年份" prop="year" />
      <el-table-column label="直接其他费用作业价格">
        <template #default="{ row }">
          <el-input v-model="row.directManufacturingRate" />
        </template>
      </el-table-column>
      <el-table-column label="间接人工作业价格">
        <template #default="{ row }">
          <el-input v-model="row.indirectLaborRate" />
        </template>
      </el-table-column>
      <el-table-column label="间接折旧作业价格">
        <template #default="{ row }">
          <el-input v-model="row.indirectDepreciationRate" />
        </template>
      </el-table-column>
      <el-table-column label="间接其他费用作业价格">
        <template #default="{ row }">
          <el-input v-model="row.indirectManufacturingRate" />
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right; margin: 20px 0">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watchEffect } from "vue"
import { GetRateEntry, SaveRateEntryInput } from "./service"
import { RateEntryInfo } from "./data.type"
import { ElMessage } from "element-plus"

/**
 * 数据部分
 */
const tableData = ref<RateEntryInfo[]>([])
const getYears = (index: number) => {
  let sop = new Date().getFullYear()
  let yearList: number[] = [sop]
  for (let i = 1; i < index; i++) {
    yearList.push(sop + i)
  }
  return yearList
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  initFetch()
})

watchEffect(() => {})

const initFetch = async () => {
  try {
    const { success, result } = await GetRateEntry()
    if (!success) throw Error()
    if (result.rateEntryInfos.length > 0) {
      tableData.value = result.rateEntryInfos || []
    } else {
      let years = getYears(10)
      years.forEach((year) => {
        tableData.value.push({
          directManufacturingRate: 0,
          indirectLaborRate: 0,
          indirectDepreciationRate: 0,
          indirectManufacturingRate: 0,
          year
        })
      })
    }
  } catch (err: any) {
    console.log("[GetRateEntry Error]", err)
  }
}

const submit = async () => {
  const { success } = await SaveRateEntryInput({
    rateEntryInfos: tableData.value
  })
  success && ElMessage.success("提交成功")
}
</script>
<style scoped lang="scss"></style>
