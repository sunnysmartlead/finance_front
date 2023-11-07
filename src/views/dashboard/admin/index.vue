<template>
  <div>
    <el-row justify="end">
      <ProcessVertifyBox :onSubmit="handleSetBomState" title="同意" processType="confirm" />
      <el-button type="danger" m="2" @Click="dialogVisible = true">退回</el-button>
    </el-row>
    <bulletinBoard ref="bulletinBoardRef" />
    <el-dialog v-model="dialogVisible" title="退回选择">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in PROGRESSTYPE.priceEvaluationBoard" :label="item.val" :disabled="checkList.some(v => item.notHas.includes(v) && v !== item.val)">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
      <div>
        <div style="margin: 10px 0">拒绝理由：</div>
        <el-input type="textarea" v-model="opinionDescription" />
      </div>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false" v-havedone>取消</el-button>
          <el-button type="primary" @click="setPriceBoardStateAgree(false)" v-havedone>确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import bulletinBoard from "../components/bulletinBoard/index.vue"
import { SetBomState, panelSubmitNode } from "@/api/bom"
import getQuery from "@/utils/getQuery"
import useJump from "@/hook/useJump"
import { ElMessage, ElMessageBox } from "element-plus"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { useRoute } from "vue-router"
import { filter } from 'lodash'
import PROGRESSTYPE from "@/constant/approvalProcess"
const route = useRoute()

const bulletinBoardRef = ref()
const { auditFlowId, productId, nodeInstanceId }: any = getQuery()
const { closeSelectedTag } = useJump()

const dialogVisible = ref(false)
let checkList = ref([""])
let opinionDescription = ref("")

watch(
  () => dialogVisible.value,
  (val) => {
    if (!val) {
      checkList.value = []
    }
  }
)
const handleSetBomState = async ({ comment, opinion }: any) => {
  const fileList = bulletinBoardRef.value.getFileList()
  if (opinion === 'HjkbSelect_Yes' && !fileList.length) {
    return ElMessage.warning('请先上传TR方案！')
  }
  let res: any = await SetBomState({
    auditFlowId: auditFlowId,
    productId: productId,
    bomCheckType: 2,
    isAgree: !opinion.includes("_No"),
    opinionDescription: comment,
    opinion,
    nodeInstanceId
  })
  if (res.success) {
    closeSelectedTag(route.path)
    ElMessage.success("操作成功")
  }
}

// 同意该审核
const setPriceBoardStateAgree = async (isAgree: boolean) => {
  ElMessageBox["confirm"]("确定执行该操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let res: any
    if (opinionDescription.value) {
        res = await panelSubmitNode({
          auditFlowId,
          opinionDescription: opinionDescription.value,
          financeDictionaryDetailIds: filter(checkList.value, v => !!v),
          nodeInstanceId
        })
      } else {
        ElMessage({
          type: "warning",
          message: "拒绝理由必填"
        })
      }
    if (res.success) {
      closeSelectedTag(route.path)
      ElMessage({
        type: "success",
        message: "操作成功"
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.dashboard {
  #costChart {
    margin: 10px 0;
    height: 400px;
  }

  #selectCostChart {
    margin: 10px 0;
    height: 400px;
  }

  #percentageCostChart {
    margin: 10px 0;
    height: 300px;
  }
}
</style>
