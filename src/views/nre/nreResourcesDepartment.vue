<template>
  <el-card>
    <InterfaceRequiredTime :ProcessIdentifier="Host" />
    <el-card class="margin-top">
      <el-table :data="data.resourceData" border :summary-method="getMouldSummaries" show-summary height="72vh">
        <el-table-column type="index" width="50" />
        <el-table-column label="模具名称" prop="modelName" width="180">
          <!-- <template #default="{ row }">
              <el-input v-model="row.modelName" />
            </template> -->
        </el-table-column>
        <el-table-column label="模穴数" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.moldCavityCount" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="模次数" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.modelNumber" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="count" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.count" controls-position="right" :min="0" />
            <!-- <el-input-number
              v-model="row.count"
              controls-position="right"
              :min="0"
              v-if="row.modelName === '吸塑/包材'"
            />
            <div v-else>
              {{ row.count }}
            </div> -->
          </template>
        </el-table-column>
        <el-table-column label="单价" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.unitPrice" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="费用">
          <template #default="{ row }">
            <!-- <el-input v-model="row.cost" /> -->
            {{ row.unitPrice * row.count }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-button type="primary" @click="handleCalculation" v-havedone>计算</el-button>
        <el-button type="primary" @click="submit" v-havedone>提交</el-button>
      </div>
    </el-card>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { PostResourcesManagement, GetInitialResourcesManagement, PostCalculateMouldInventory } from "./common/request"
import { getMouldSummaries } from "./common/mouldSummaries"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"
import router from "@/router"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host: string = "NreInputMould"

const { auditFlowId, productId }: any = getQuery()

const data = reactive<any>({
  resourceData: [],
  resourcesManagementModels: []
})

const initFetch = async () => {
  const { result } = await GetInitialResourcesManagement(auditFlowId, productId)
  data.resourceData = result?.mouldInventoryModels || []
  data.resourcesManagementModels = result?.mouldInventoryModels
}

const submit = async () => {
  const { success } = await PostResourcesManagement({
    auditFlowId,
    resourcesManagementModels: {
      mouldInventory: data.resourceData.map((item: any) => ({
        ...item,
        cost: (item.unitPrice || 0) * (item.count || 0)
      })),
      productId
    }
  })
  if (success) ElMessage.success("提交成功！")
}

const handleCalculation = async () => {
  try {
    const { result, success } = await PostCalculateMouldInventory({
      mouldInventory: data.resourceData,
      productId
    })
    if (!success) ElMessage.success("计算成功")
    const { mouldInventory = [] }: any = result || []
    data.resourceData = mouldInventory.map((item: any, index: number) => {
      if (item.modelName === "吸塑/包材") return data.resourceData[index]
      return item
    })
    console.log(result, "[PostCalculateMouldInventory res]")
  } catch (err) {
    console.log(err, "[PostCalculateMouldInventory err ]")
    ElMessage.error("计算失败")
  }
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  initFetch()
})

watchEffect(() => {})
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
