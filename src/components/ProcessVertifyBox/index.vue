<!-- 全部的录入类都继承了ToExamineDto，前端需要传这3个字段，完成工作流流转

1、节点实例Id：NodeInstanceId
从待办列表获取，传待办列表的Id。
（营销部录入是第一个页面，此值传0）

2、审批意见：Opinion，从字典表获取。每个流程字典名都不同。字典常用值【YesOrNo】、【Done】。需要退回的节点，前端同事开发到时和我对接，我来提供具体的字典值。

3、审批评论：Comment 由用户填写 -->

<template>
  <el-row justify="end" v-havedone>
    <div v-if="props.processType === 'confirmProcessType'">
      <el-button type="primary" @click="onSubmit('Save', '保存')" m="2">保存</el-button>
      <el-button type="primary" @click="handleEnter('Done', '提交')" m="2">提交</el-button>
    </div>
    <el-button
      v-if="!['confirmProcessType'].includes(props.processType)"
      type="primary"
      m="2"
      @click="data.dialogVisible = true"
      >{{ title }}</el-button
    >
    <el-dialog v-model="data.dialogVisible" title="流程确认" width="30%">
      <el-form>
        <el-form-item label="选择类型" v-if="!['confirmProcessType', 'confirm'].includes(props.processType)">
          <el-select v-model="data.opinion" :disabled="processType === 'confirm'">
            <el-option
              v-for="item in PROGRESSTYPE[props.processType] || []"
              :key="item.val"
              :label="item.label"
              :value="item.val"
              :disabled="item.disabled"
            />
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
        <!-- <el-form-item label="要退回的方案">
          <el-checkbox-group v-model="data.solutionIds">
            <el-checkbox v-for="item in solutionIdOptions" :key="item.id" :label="item.product" :value="item.id" />
            </el-checkbox-group>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, PropType, onMounted } from "vue"

import { useRoute } from "vue-router"
import PROGRESSTYPE from "@/constant/approvalProcess"
import { useProductStore } from "@/store/modules/productList"
import { debounce } from "lodash"
import { handleSubmit } from "@/api/COB"
import { ElMessageBox } from "element-plus"

const productStore = useProductStore()

const data: any = reactive({
  dialogVisible: false,
  comment: "",
  opinion: "",
  solutionIds: []
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
  },
  title: {
    type: String,
    default: "流程确认"
  },
   ElMessageBoxMessage:{
    type:String,
    default:"您确定要提交嘛?"
  }
})

const route = useRoute()

onMounted(() => {
  console.log(props.processType, "props")
  if (props.processType === "confirm") {
    data.opinion = "HjkbSelect_Yes"
  }
})

const handleEnter = (opinion: string, label: string) => {
  ElMessageBox.confirm(props.ElMessageBoxMessage, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => onSubmit(opinion, label))
}

const onSubmit = debounce(async (opinion, label) => {
  let { nodeInstanceId } = route.query
  if (!opinion) {
    opinion = data.opinion
  }
  if (!label) {
    label = PROGRESSTYPE[props.processType]?.find((v: any) => v.val === data.opinion)?.label || ""
  }
  await props.onSubmit({
    comment: data.comment,
    opinion,
    nodeInstanceId: nodeInstanceId,
    label,
    ids: data.solutionIds
  })
  data.dialogVisible = false
}, 350)
</script>
