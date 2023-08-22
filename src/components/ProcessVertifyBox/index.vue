<!-- 全部的录入类都继承了ToExamineDto，前端需要传这3个字段，完成工作流流转

1、节点实例Id：NodeInstanceId
从待办列表获取，传待办列表的Id。
（营销部录入是第一个页面，此值传0）

2、审批意见：Opinion，从字典表获取。每个流程字典名都不同。字典常用值【YesOrNo】、【Done】。需要退回的节点，前端同事开发到时和我对接，我来提供具体的字典值。

3、审批评论：Comment 由用户填写 -->

<template>
  <el-row justify="end">
    <el-button type="primary" v-havedone m="2" @click="data.dialogVisible = true">流程确认</el-button>
    <el-dialog v-model="data.dialogVisible" title="流程确认" width="30%">
      <el-form>
        <el-form-item label="选择类型">
          <el-select v-model="data.opinion">
            <el-option v-for="item in data['processType']" :key="item.val" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input
            v-model="data.comment"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, PropType } from "vue"
import { ElMessage } from "element-plus"
import {
  baseProcessType,
  quoteFeedbackProcessType,
  complianceProcessType,
  electronicBomProcessType,
  structBomProcessType,
  bomCostProcessType
} from "@/constant/approvalProcess"

const data = reactive({
  dialogVisible: false,
  comment: "",
  opinion: "",
  baseProcessType,
  quoteFeedbackProcessType,
  complianceProcessType,
  electronicBomProcessType,
  structBomProcessType,
  bomCostProcessType
})

const props = defineProps({
  onSubmit: {
    type: Function as PropType<any>
  },
  processType: {
    type: String,
    default: "baseProcessType"
  },
  nodeInstanceId: {
    type: Number,
    default: 0
  }
})

const onSubmit = () => {
  props.onSubmit({
    comment: data.comment,
    opinion: data.opinion,
    nodeInstanceId: props.nodeInstanceId
  })
}
</script>
