<template>
  <el-row justify="end">
    <el-button type="primary" v-havedone m="2" @click="handleConfirm">同意</el-button>
    <el-button type="danger" m="2" @click="data.dialogVisible = true" v-havedone>退回</el-button>
    <el-dialog v-model="data.dialogVisible" title="退回理由" width="30%">
      <el-input
        v-model="data.reson"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="请输入退回理由"
      />
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

const data = reactive({
  dialogVisible: false,
  reson: ""
})

const props = defineProps({
  onSubmit: {
    type: Function as PropType<any>
  }
})

const onSubmit = () => {
  if (!data.reson) {
    ElMessage({
      message: "请输入退回理由!",
      type: "warning"
    })
  } else {
    props.onSubmit(data.reson, false)
  }
}

const handleConfirm = () => {
  props.onSubmit(data.reson, true)
}
</script>
