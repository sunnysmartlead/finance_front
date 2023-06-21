<template>
  <div style="padding: 0 10px">
    <el-card class="margin-top">
      <template #header> 营销部 - 业务员 </template>
      <el-table :data="mouldInventoryData" style="width: 100%" border :summary-method="getMouldSummaries" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column label="费用名称" prop="formName" width="180" />
        <el-table-column prop="pricingMoney" label="核价金额" width="180" />
        <el-table-column label="报价系数" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.offerCoefficient" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="报价金额" width="180">
          <template #default="{ row }">
            {{ row.pricingMoney * row.offerCoefficient }}
          </template>
        </el-table-column>
        <el-table-column label="备注" width="180">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div style="float: right; margin: 20px 0">
      <el-button type="primary" @click="submit" v-havedone>提交</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watchEffect } from "vue"
import { GetInitialSalesDepartment, PostSalesDepartment, GetReturnInitialSalesDepartment } from "./common/request"
import { getMouldSummaries } from "./common/mouldSummaries"
import { NreMarketingDepartmentModel } from "./data.type"
import { ElMessage } from "element-plus"
import getQuery from "@/utils/getQuery"
const { auditFlowId, right = 1 }: any = getQuery()

const mouldInventoryData = ref<NreMarketingDepartmentModel[]>([])

const initFetch = async () => {
  const { result } = await GetInitialSalesDepartment(auditFlowId)
  console.log(result, "result")
  mouldInventoryData.value = result
}

const queryDoneData = async () => {
  const { result } = await GetReturnInitialSalesDepartment(auditFlowId)
  console.log(result, "result")
  mouldInventoryData.value = result
}

const submit = async () => {
  const { success } = await PostSalesDepartment(
    mouldInventoryData.value?.map((item) => ({
      ...item,
      offerMoney: (item.pricingMoney || 0) * (item.offerCoefficient || 0)
    })) || []
  )
  success && ElMessage.success("提交成功~")
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  right === 1 ? queryDoneData() : initFetch()
})

watchEffect(() => {})
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
