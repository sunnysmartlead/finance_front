<template>
  <div style="padding: 0 10px">
    <!-- <VertifyBox v-if="isVertify" :onSubmit="handleSubmit" /> -->
    <ProcessVertifyBox v-if="isVertify" :onSubmit="handleSubmit" />
    <ThreeDImage m="3" />
    <el-card class="margin-top">
      <template #header> 资源部 - 业务员 </template>
      <el-table
        :data="mouldInventoryData"
        style="width: 100%"
        border
        :summary-method="(val: any) => getMouldSummaries(val, '模具费用', 'cost')"
        show-summary
      >
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column label="费用名称" prop="modelName" width="180" />
        <el-table-column label="模穴数" width="150">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.moldCavityCount }}</span>
            <el-input
              v-else
              :disabled="row.isSubmit"
              v-model="row.moldCavityCount"
              :min="0"
              controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column label="模次数" width="150">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.modelNumber }}</span>
            <el-input v-else :disabled="row.isSubmit" v-model="row.modelNumber" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.count }}</span>
            <el-input-number v-else :disabled="row.isSubmit" v-model="row.count" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="单价" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.unitPrice }}</span>
            <el-input-number
              v-else
              :disabled="row.isSubmit"
              v-model="row.unitPrice"
              :min="0"
              controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column label="费用" prop="cost" width="180" />
        <el-table-column label="备注" width="180">
          <template #default="{ row }">
            <span v-if="isVertify">{{ row.remark }}</span>
            <el-input v-model="row.remark" :disabled="row.isSubmit" />
          </template>
        </el-table-column>
        <el-table-column label="提交人" prop="peopleId" width="180" />
        <el-table-column label="操作" v-if="!isVertify" fixed="right" width="160">
          <template #default="{ row }">
            <el-button link v-if="!row.isSubmit" :disabled="row.isSubmit" @click="submit(false, row)" type="danger"
              >保存</el-button
            >
            <el-button v-if="!row.isSubmit" :disabled="row.isSubmit" link @click="submit(true, row)" type="warning"
              >提交</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watch } from "vue"
import { GetInitialResourcesManagementSingle, PostSalesDepartment } from "../../common/request"
import { getMouldSummaries } from "../../common/mouldSummaries"
import { NreMarketingDepartmentModel } from "../../data.type"
import { ElMessage } from "element-plus"
import getQuery from "@/utils/getQuery"
import { debounce } from "lodash"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
// import VertifyBox from "@/components/VertifyBox/index.vue"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"

const { auditFlowId, right = 1, productId }: any = getQuery()

const props = defineProps({
  isVertify: Boolean
})

const mouldInventoryData = ref<NreMarketingDepartmentModel[]>([])

const initFetch = async () => {
  const { result } = await GetInitialResourcesManagementSingle({ auditFlowId, solutionId: productId })
  console.log(result, "result")
  mouldInventoryData.value = result?.mouldInventoryModels
}

// const queryDoneData = async () => {
//   const { result } = (await GetReturnInitialSalesDepartment(auditFlowId)) || {}
//   console.log(result, "result")
//   mouldInventoryData.value = result
// }

const submit = debounce(async (isSubmit: boolean, row: any) => {
  const { success } = await PostSalesDepartment({
    auditFlowId,
    resourcesManagementModels: {
      solutionId: productId,
      mouldInventory: { ...row, isSubmit }
    }
  })
  if (success) {
    ElMessage.success(`${isSubmit ? "提交" : "保存"}成功`)
    initFetch()
  }
}, 300)

watch(
  () => mouldInventoryData.value,
  (val) => {
    val?.forEach((item: any) => {
      item.cost = item.count * item.unitPrice
    })
  },
  {
    deep: true
  }
)

const handleSubmit = () => {}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  // right === 1 ? queryDoneData() : initFetch()
  initFetch()
})
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
