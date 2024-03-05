<template>
  <div class="demand-apply">
    <el-button-group float-right>
      <el-button type="primary" @click="dialogVisible = true">同意</el-button>
      <el-button type="danger" @click="dialogVisibleR = true"> 退回</el-button>
    </el-button-group>
    <el-dialog v-model="dialogVisible" title="审批意见" width="30%" :before-close="handleClose">
      <el-input type="textarea" rows="4" v-model="confirmText" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="agreeConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisibleR" title="退回" width="30%" :before-close="handleClose">
      <el-form>
        <el-form-item label="退回原因">
          <el-input type="textarea" rows="4" v-model="refuseText" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleR = false">取消</el-button>
          <el-button type="primary" @click="refuseConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    查看报价审批表
  </div>
</template>
<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { SubmitNode } from "@/api/WorkFlows"
import useJump from "@/hook/useJump"
import getQuery from "@/utils/getQuery"
const { closeSelectedTag } = useJump()
const dialogVisible = ref(false)
const dialogVisibleR = ref(false)
const refuseText = ref("")
const router = useRouter()
const route = useRoute()
const confirmText = ref("")

const { auditFlowId, nodeInstanceId } = getQuery()

const refuseConfirm = async () => {
  if (refuseText.value) {
    await SubmitNode({
      comment: refuseText.value,
      nodeInstanceId,
      financeDictionaryDetailId: "YesOrNo_No"
    })
    ElMessage.success("操作成功")
    dialogVisibleR.value = false
    closeSelectedTag(route.path)
  } else {
    ElMessage.warning("退回原因必填！")
  }
}

/**
 * 同意提交流程
 */
const agreeConfirm = async () => {
  /**
   * 保存数据需要确认
   */
  let res = await SubmitNode({
    comment: confirmText.value,
    nodeInstanceId,
    financeDictionaryDetailId: "YesOrNo_Yes"
  })
  if (res.success) {
    ElMessage.success("操作成功")
    closeSelectedTag(route.path)
    dialogVisible.value = false
  }
}
</script>

<style lang="scss" scoped>
</style>
