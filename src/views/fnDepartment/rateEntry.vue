<template>
  <div>
    <el-card header="作业价格" m="2">
      <el-row wrap="false" justify="space-between">
        <span>作业价格</span>
        <el-row>
          <el-button m="2" type="primary" @click="handleAddYear">新增年</el-button>
          <el-button m="2" type="primary" @click="submit">提交</el-button>
        </el-row>
      </el-row>
      <el-table :data="tableData" style="width: 100%; margin-top: 25px" border>
        <el-table-column label="年份" prop="year" />
        <el-table-column label="直接其他费用作业价格">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.directManufacturingRate" />
          </template>
        </el-table-column>
        <el-table-column label="间接人工作业价格">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.indirectLaborRate" />
          </template>
        </el-table-column>
        <el-table-column label="间接折旧作业价格">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.indirectDepreciationRate" />
          </template>
        </el-table-column>
        <el-table-column label="间接其他费用作业价格">
          <template #default="{ row }">
            <el-input-number controls-position="right" :min="0" v-model="row.indirectManufacturingRate" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="{ $index }">
            <el-button type="danger" @click="handleDelete($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <LogList m="2" :type="16" ref="logListRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watchEffect } from "vue"
import { GetRateEntry, SaveRateEntryInput } from "./service"
import { RateEntryInfo } from "./data.type"
import { ElMessage } from "element-plus"
import LogList, { LogListAPI } from "@/components/LogList/index.vue"

/**
 * 数据部分
 */
const tableData = ref<RateEntryInfo[]>([])
const logListRef = ref<LogListAPI | null>(null)


// 新增年
const handleAddYear = () => {
  const len = tableData.value.length
  const newYear = (tableData.value[len - 1].year || 0) + 1
  tableData.value.push({
    directManufacturingRate: 0,
    indirectLaborRate: 0,
    indirectDepreciationRate: 0,
    indirectManufacturingRate: 0,
    year: newYear
  })
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  initFetch()
})

const handleDelete = (index: number) => {
  tableData.value.splice(index, 1)
}

watchEffect(() => { })

const initFetch = async () => {
  try {
    const { success, result } = await GetRateEntry()
    if (!success) throw Error()
    if (result.rateEntryInfos.length > 0) {
      tableData.value = result.rateEntryInfos || []
    } else {
      tableData.value.push({
        directManufacturingRate: 0,
        indirectLaborRate: 0,
        indirectDepreciationRate: 0,
        indirectManufacturingRate: 0,
        year: new Date().getFullYear()
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
  if (success) {
    logListRef.value?.onRefresh()
    ElMessage.success("提交成功")
  }
}
</script>
<style scoped lang="scss"></style>
