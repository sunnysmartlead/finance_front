<template>
  <el-card class="" header="产品识别分析表">
    <el-row justify="end">
      <ProcessVertifyBox :onSubmit="handleSubmit" processType="complianceProcessType" />
      <el-button type="primary" @click="handleDownload" m="2">贸易不合规下载</el-button>
    </el-row>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="产品名称"> {{ data.tradeComplianceCheck.productName }} </el-descriptions-item>
      <el-descriptions-item label="最终出口地国家"> {{ data.tradeComplianceCheck.country }} </el-descriptions-item>
      <el-descriptions-item label="产品小类"> {{ data.tradeComplianceCheck.productType }} </el-descriptions-item>
      <el-descriptions-item label="产品公允售价">
        {{ data.tradeComplianceCheck.productFairValue }}
      </el-descriptions-item>
    </el-descriptions>
    <el-card header="产品组成物料" class="card-margin">
      <el-table :data="data.productMaterialInfos" style="width: 100%" height="500" border>
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column label="物料编码" prop="materialCode" />
        <el-table-column label="物料种类" prop="materialName" />
        <el-table-column label="材料名称" prop="materialDetailName" />
        <el-table-column label="数量" prop="count" />
        <el-table-column label="单价" prop="unitPrice" />
        <el-table-column label="金额" prop="amount" />
        <el-table-column label="物料管制状态分类" prop="controlStateType" />
      </el-table>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ECCN成分价值占比">
          {{ (Number(data.tradeComplianceCheck.eccnPricePercent) * 100).toFixed(2) + "%" }}
        </el-descriptions-item>
        <el-descriptions-item label="待定成分价值占比">
          {{ (Number(data.tradeComplianceCheck.pendingPricePercent) * 100).toFixed(2) + "%" }}
        </el-descriptions-item>
        <el-descriptions-item label="合计价值占比">
          {{ (Number(data.tradeComplianceCheck.amountPricePercent) * 100).toFixed(2) + "%" }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-descriptions class="card-margin" :column="2" border>
      <el-descriptions-item label="分析结论" :span="22">
        {{ data.tradeComplianceCheck.analysisConclusion }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="做成/日期"> {{ data.tradeComplianceCheck.creationTime }} </el-descriptions-item>
      <!-- <el-descriptions-item label="审核/日期"> {{ data.tradeComplianceCheck.deletionTime }} </el-descriptions-item> -->
    </el-descriptions>

  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { GetTradeComplianceCheckFromDateBase, IsTradeComplianceCheck,SubmitNode, PostExportOfTradeForm } from "./service"
import { TradeComplianceCheck } from "./data.type"
import { ElMessage, ElLoading } from "element-plus"
import { downloadFileExcel } from "@/utils"
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"

const { jumpTodoCenter } = useJump()
const { auditFlowId = 1, productId = 1 }: any = getQuery()

/**
 * 数据部分
 */
const data = reactive<{
  productMaterialInfos: any[]
  tradeComplianceCheck: TradeComplianceCheck
}>({
  productMaterialInfos: [],
  tradeComplianceCheck: {}
})

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  if (auditFlowId && productId) {
    initFetch()
  }
})

const initFetch = async () => {
  const { result } = await GetTradeComplianceCheckFromDateBase({ AuditFlowId: auditFlowId, SolutionId: productId })
  data.productMaterialInfos = result.productMaterialInfos || []
  data.tradeComplianceCheck = result.tradeComplianceCheck || {}
  console.log(result, "res")
}
// const agree = async (isAgree: boolean) => {
//   ElMessageBox[isAgree ? "prompt" : "confirm"]("确定执行该操作吗", "请审核", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning"
//   }).then(async (val) => {
//     let res: any = await IsTradeComplianceCheck({
//       AuditFlowId: auditFlowId,
//       opinionDescription: isAgree ? val.value : "",
//       isAgree
//     })
//     if (res.success) {
//       ElMessage({
//         type: "success",
//         message: "操作成功"
//       })
//       jumpTodoCenter()
//     }
//   })
// }
const handleSubmit = async ({ comment, opinion, nodeInstanceId }:any) => {
  let res: any = await SubmitNode({
    AuditFlowId: auditFlowId,
    opinionDescription: comment,
    comment,
    nodeInstanceId,
    isAgree: opinion.includes("Done") ? true : false,
    financeDictionaryDetailId: opinion
  })
  if (res.success) {
    ElMessage({
      type: "success",
      message: "操作成功"
    })
    jumpTodoCenter()
  }
}


const handleDownload = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在下载中..., 请稍等',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const res = await PostExportOfTradeForm({
      auditFlowId,
      solutionId: productId
    })
    downloadFileExcel(res, "贸易不合规")
    loading.close()
  } catch {
    loading.close()
  }
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.card-margin {
  margin-top: 10px;
}
</style>
