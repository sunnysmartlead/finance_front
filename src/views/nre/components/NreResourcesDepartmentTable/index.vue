<template>
  <div style="padding: 0 10px">
    <el-row justify="end">
      <ProcessVertifyBox v-if="isVertify" :onSubmit="handleVertify" :processType="'baseProcessType'" />
      <ProcessVertifyBox v-if="!isVertify && isAllNull" :onSubmit="handleSubmit" processType="confirmProcessType" />
      <ThreeDImage m="2" />
    </el-row>
    <el-card class="margin-top">
      <template #header> 资源部 - 业务员 </template>
      <el-table ref="multipleTableRef" :data="mouldInventoryData" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '模具费用', 'cost', '', 5)" show-summary
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" v-if="isVertify" />
        <el-table-column type="index" label="序号" width="70"  align="center"/>
        <el-table-column label="模具费用" prop="modelName" width="180" align="center"/>
        <el-table-column label="模穴数" width="150" prop="moldCavityCount" :formatter="formatThousandths" align="right" header-align="center">
          <template #default="{ row }">
            <el-input v-if="!isVertify && row.isEdit" :disabled="row.isSubmit" v-model="row.moldCavityCount" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="模次数" width="150" prop="modelNumber"  :formatter="formatThousandths" align="right" header-align="center">
          <template #default="{ row }">
            <el-input v-if="!isVertify && row.isEdit" :disabled="row.isSubmit" v-model="row.modelNumber" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="180" prop="count" :formatter="formatThousandths" align="right" header-align="center">
          <template #default="{ row }">
            <el-input-number @mousewheel.native.prevent v-if="!isVertify && row.isEdit" :disabled="row.isSubmit" v-model="row.count" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="单价" width="180" prop="unitPrice" :formatter="formatThousandths" align="right" header-align="center">
          <template #default="{ row }">
            <el-input-number @mousewheel.native.prevent v-if="!isVertify && row.isEdit" :disabled="row.isSubmit" v-model="row.unitPrice" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="cost" width="180" :formatter="formatThousandths" align="right" header-align="center"/>
        <el-table-column label="备注" prop="remark" width="180" align="left" header-align="center">
          <template #default="{ row }">
            <el-input v-if="!isVertify && row.isEdit" v-model="row.remark" :disabled="row.isSubmit" />
          </template>
        </el-table-column>
        <el-table-column label="提交人" prop="peopleName" width="180" align="center"/>
        <el-table-column label="操作" v-if="!isVertify" fixed="right" width="160">
          <template #default="{ row }">
            <el-button link v-if="!row.isSubmit && !row.isEdit" :disabled="row.isSubmit" @click="handleEdit(row)"
              >修改</el-button>
            <el-button link v-if="!row.isSubmit && row.isEdit" :disabled="row.isSubmit" @click="submit(false, row)"
              >确认</el-button>
            <el-button v-if="!row.isSubmit" :disabled="row.isSubmit" link @click="checkData(true, row)"
              type="warning">提交</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watch } from "vue"
import { GetInitialResourcesManagementSingle, PostSalesDepartment, NREToExamine } from "../../common/request"
import { getMouldSummaries } from "../../common/mouldSummaries"
import { NreMarketingDepartmentModel, MouldInventoryModel } from "../../data.type"
import { ElMessage, ElMessageBox } from "element-plus"
import getQuery from "@/utils/getQuery"
import { debounce } from "lodash"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { useRoute } from "vue-router"
import useJump from "@/hook/useJump"
import { setSessionStorage, getSessionStorage, removeSessionStorage } from "@/utils/seeionStrorage"
import { formatThousandths } from '@/utils/number'

const route = useRoute()
const { auditFlowId, right = 1, productId }: any = getQuery()

const { closeSelectedTag } = useJump()

import { ElTable } from 'element-plus'
import { map } from "lodash"

const props = defineProps({
  isVertify: Boolean
})

const mouldInventoryData = ref<NreMarketingDepartmentModel[]>([])
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<any[]>([])
const isAllNull = ref(false)

const initFetch = async () => {
  if (!auditFlowId || !productId) return
  const { result } = await GetInitialResourcesManagementSingle({ auditFlowId, solutionId: productId })

  mouldInventoryData.value = result?.mouldInventoryModels
  isAllNull.value = result.isAllNull
  console.log(props.isVertify, isAllNull.value, "result")
  setTimeout(() => {
    handleToggleSelection()
  }, 300)
}

const safeParse = (val: any) => {
  try {
    return JSON.parse(val)
  } catch {
    return null
  }
}

const handleToggleSelection = () => {
  const selectionData = getSessionStorage('mouldInventorySelection')
  if (selectionData) {
    let filterData: any = safeParse(selectionData)
    const selectionList = filterData?.[productId]
    if (selectionList?.length) {
      multipleSelection.value = selectionList
      selectionList.forEach((item: any) => {
        const findItem = mouldInventoryData.value.find((c: any) => c.id === item)
        if (findItem) {
          multipleTableRef.value!.toggleRowSelection(findItem, true)
        }
      })
    }
  }
}

const handleEdit = (row: any) => {
  row.isEdit = true
}

const handleSelectionChange = (val: MouldInventoryModel[]) => {
  const selectionData = getSessionStorage('mouldInventorySelection')
  let filterData: any = safeParse(selectionData)
  console.log(val, "[handleSelectionChange]")
  const ids = map(val, v => v.id)
  multipleSelection.value = ids
  setSessionStorage('mouldInventorySelection', JSON.stringify({
    ...filterData,
    [productId]: ids
  }))
}

const checkData = (isSubmit: boolean, row: any) => {
  if (!row.cost) {
    ElMessageBox.confirm("当前行的金额为0！,您确定要提交嘛?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
      type: "warning"
    }).then(async () => submit(isSubmit, row))
  } else submit(isSubmit, row)
}

const submit = debounce(async (isSubmit: boolean, row: any) => {
  let { nodeInstanceId } = route.query
  const { success } = await PostSalesDepartment({
    auditFlowId,
    resourcesManagementModels: {
      solutionId: productId,
      mouldInventory: { ...row, isSubmit }
    },
    nodeInstanceId,
    opinion: "Done"
  })
  if (success) {
    row.isEdit = false
    initFetch()
    ElMessage.success(`${isSubmit ? "提交" : "保存"}成功`)
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

const handleVertify = async ({ comment, opinion, nodeInstanceId, label }: any) => {
  const selectionData = getSessionStorage('mouldInventorySelection')
  let filterData: any = safeParse(selectionData)
  const nreId = map(filterData, v => ([...v]))?.flat(2) || []
  if (!nreId.length && opinion === 'YesOrNo_No') {
    return ElMessage.warning(`请选择要${label}的数据！`)
  }
  const { success } = await NREToExamine({
    auditFlowId,
    nreCheckType: 1,
    comment,
    opinion,
    nodeInstanceId,
    nreId,
  })
  if (success) {
    ElMessage.success(`${label}成功`)
    closeSelectedTag(route.path)
    removeSessionStorage('mouldInventorySelection')
  }
}

const handleSubmit = async ({ comment, opinion, nodeInstanceId, label }: any) => {
  const { success } = await NREToExamine({
    auditFlowId,
    nreCheckType: 1,
    comment,
    opinion,
    nodeInstanceId,
    nreId: multipleSelection.value
  })
  if (success) {
    ElMessage.success(`${label}成功`)
  }
}

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
