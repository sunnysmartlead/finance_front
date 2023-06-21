<template>
  <div style="padding: 0 10px">
    <el-card class="margin-top">
      <template #header>
        <el-row style="width: 100%" justify="space-between" align="middle">
          工装类
          <el-button type="primary" @click="addHandboardCost" v-havedone>新增</el-button>
        </el-row>
      </template>
      <el-table
        :data="data.handPieceCost"
        :summary-method="getHandPieceCostSummaries"
        show-summary
        style="width: 100%"
        border
        height="300"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="零件名" width="150">
          <template #default="{ row }">
            <el-input v-model="row.partName" />
          </template>
        </el-table-column>
        <el-table-column label="料号" width="150">
          <template #default="{ row }">
            <el-input v-model="row.partNumber" />
          </template>
        </el-table-column>
        <el-table-column label="单价" width="175">
          <template #default="{ row }">
            <el-input-number v-model="row.unitPrice" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="175">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column label="费用" prop="cost" width="175">
          <template #default="{ row }">
            {{ row.unitPrice * row.quantity }}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template #default="{ $index }">
            <el-button @click="deletehandboardCost($index)" type="danger" v-havedone>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="margin-top">
      <template #header>
        <el-row style="width: 100%" justify="space-between" align="middle">
          治具类
          <el-button type="primary" @click="addOtherCostData" v-havedone>新增</el-button>
        </el-row>
      </template>
      <el-table
        :data="data.restsCost"
        style="width: 100%"
        border
        :summary-method="getOtherCostSummaries"
        show-summary
        height="300"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="费用名称" width="150">
          <template #default="{ row }">
            <el-input v-model="row.rroject" />
          </template>
        </el-table-column>
        <el-table-column label="费用" width="175">
          <template #default="{ row }">
            <el-input-number v-model="row.cost" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template #default="{ $index }">
            <el-button @click="deleteOtherCostData($index)" type="danger" v-havedone>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="margin-top">
      <template #header>
        <el-row style="width: 100%" justify="space-between" align="middle">
          软件类
          <el-button type="primary" @click="addTravelCostData" v-havedone>新增</el-button>
        </el-row>
      </template>
      <el-table :data="data.travelExpense" style="width: 100%" border height="300">
        <el-table-column type="index" width="50" />
        <el-table-column label="事由" width="150">
          <template #default="{ row }">
            <el-input v-model="row.reasonsId" />
          </template>
        </el-table-column>
        <el-table-column label="人数" width="175">
          <template #default="{ row }">
            <el-input-number controls-position="right" v-model="row.peopleCount" :min="0" />
          </template>
        </el-table-column>
        <el-table-column label="费用/天" width="175">
          <template #default="{ row }">
            <el-input-number v-model="row.costSky" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="天数" width="175">
          <template #default="{ row }">
            <el-input-number v-model="row.skyCount" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="费用" width="175">
          <template #default="{ row }">
            <el-input-number v-model="row.cost" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template #default="{ $index }">
            <el-button @click="deleteTravelCostData($index)" type="danger" v-havedone>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="margin-top">
      <template #header>
        <el-row style="width: 100%" justify="space-between" align="middle">
          生产设备
          <el-button type="primary" @click="addTravelCostData" v-havedone>新增</el-button>
        </el-row>
      </template>
      <el-table :data="data.travelExpense" style="width: 100%" border height="300">
        <el-table-column type="index" width="50" />
        <el-table-column label="事由" width="150">
          <template #default="{ row }">
            <el-input v-model="row.reasonsId" />
          </template>
        </el-table-column>
        <el-table-column label="人数" width="150">
          <template #default="{ row }">
            <el-input v-model="row.peopleCount" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="费用/天" width="150">
          <template #default="{ row }">
            <el-input v-model="row.costSky" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="天数" width="150">
          <template #default="{ row }">
            <el-input v-model="row.skyCount" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="费用" width="150">
          <template #default="{ row }">
            <el-input v-model="row.cost" :min="0" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template #default="{ $index }">
            <el-button @click="deleteTravelCostData($index)" type="danger" v-havedone>删除</el-button>
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
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { HandPieceCostModel, RestsCostModel, TravelExpenseModel } from "./data.type"
import { PostProjectManagement, GetReturnProjectManagement } from "./common/request"
import { getHandPieceCostSummaries, getOtherCostSummaries } from "./common/projetManageSummaries"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"

const { auditFlowId = 1, productId = 1 } = getQuery()
/**
 * 数据部分
 */
const data = reactive({
  handPieceCost: [] as HandPieceCostModel[],
  restsCost: [] as RestsCostModel[],
  travelExpense: [] as TravelExpenseModel[]
})

const deletehandboardCost = (i: number) => {
  data.handPieceCost.splice(i, 1)
}

const deleteTravelCostData = (i: number) => {
  data.handPieceCost.splice(i, 1)
}

const deleteOtherCostData = (i: number) => {
  data.restsCost.splice(i, 1)
}

const addHandboardCost = () => {
  data.handPieceCost.push({ partName: "", partNumber: "", unitPrice: 0, quantity: 0 })
}

const addOtherCostData = () => {
  data.restsCost.push({ rroject: "", cost: 0, remark: "" })
}

const addTravelCostData = () => {
  data.travelExpense.push({ reasonsId: "123", peopleCount: 0, costSky: 0, skyCount: 0, cost: 0, remark: "" })
}

const submit = async () => {
  try {
    const { success } = await PostProjectManagement({
      projectManagement: {
        ...data,
        handPieceCost: data.handPieceCost.map((item: HandPieceCostModel) => {
          return {
            ...item,
            cost: (item.unitPrice || 0) * (item.quantity || 0)
          }
        }),
        productId
      },
      auditFlowId
    })
    if (success) ElMessage.success("提交成功！")
  } catch (err) {
    console.log(err, "[PostProjectManagement ERROR]")
  }
}

const initFetch = async () => {
  const { result } = await GetReturnProjectManagement(productId, auditFlowId)
  if (!result) return
  const { handPieceCost, restsCost, travelExpense } = result || {}
  data.handPieceCost = handPieceCost || []
  data.restsCost = restsCost || []
  data.travelExpense = travelExpense || []
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  initFetch()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

watchEffect(() => {})
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
