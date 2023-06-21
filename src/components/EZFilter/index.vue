<template>
  <el-card class="EZFilter-wrap">
    <el-form ref="ruleFormRef" :inline="true" :model="formValue">
      <template v-for="item in props.filterNnum" :key="item.key">
        <el-form-item :label="item.label" v-if="!item.role" :prop="item.key">
          <el-input :placeholder="item.placeholder || `请输入${item.label}`" v-model="formValue[item.key]" />
        </el-form-item>
        <el-form-item :label="item.label" v-else-if="item.role === 'select'">
          <el-select
            clearable
            :placeholder="item.placeholder || `请输入${item.label}`"
            v-model="formValue[item.key]"
            :multiple="item.multiple"
            :filterable="item.filterable"
            :remote="item.remote"
            :remote-method="item.remoteMethod"
            :loading="item.loading"
            @change="item.onchange"
          >
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
              :disabled="opt.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="item.label" v-else-if="item.role === 'timePicker'" :prop="item.key">
          <el-date-picker
            :placeholder="item.placeholder || `请选择${item.label}的起始时间`"
            :options="item.options"
            v-model="formValue[item.key]"
            :type="item.dateType || 'daterange'"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item :label="item.label" v-else-if="item.role === 'radioGroup'" :prop="item.key">
          <el-radio-group
            :placeholder="item.placeholder || `请选择${item.label}`"
            :options="item.options"
            v-model="formValue[item.key]"
          />
        </el-form-item>
        <div v-else-if="item.role === 'dom'" v-html="item.dom" />
      </template>
      <el-form-item v-if="props.showBtn">
        <el-button type="primary" @click="handleSubmit">查询</el-button>
        <el-button @click="reset(ruleFormRef)">重置</el-button>
      </el-form-item>
      <el-form-item v-else-if="props.footer">
        <div v-html="props.footer" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, PropType, ref, watch } from "vue"
import type { FormInstance } from "element-plus"
import { EnumDataProps } from "./data.type"

const ruleFormRef = ref<FormInstance>()

const props = defineProps({
  filterNnum: {
    type: Array as PropType<EnumDataProps[]>
  },
  initFilterValue: {
    type: Object as PropType<Record<string, any>>,
    required: false
  },
  onSubmit: {
    type: Function
  },
  showBtn: {
    type: Boolean,
    required: false
  },
  footer: {
    type: HTMLAllCollection,
    required: false
  },
  filterRef: {
    type: Object as PropType<FormInstance>,
    required: false
  }
})

const formValue = reactive({
  ...(props.initFilterValue || {})
})

// watch(
//   () => {
//     return formValue.ProjectName
//   },
//   () => {
//     formValue.Version = 1
//   },
//   { deep: true }
// )

const handleSubmit = () => {
  console.log(formValue)
  const formValueRef = JSON.parse(JSON.stringify(formValue))
  formValueRef.auditFlowId = formValueRef.auditFlowId ? formValueRef.auditFlowId : 0
  formValueRef.Version = formValueRef.Version ? formValueRef.Version : 0
  formValueRef.DraftDate = formValueRef.DraftDate ? formValueRef.DraftDate : []
  formValueRef.FinishedDate = formValueRef.FinishedDate ? formValueRef.FinishedDate : []
  props.onSubmit && props.onSubmit(formValueRef)
}

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style scoped lang="scss">
.EZFilter-wrap {
  margin-top: 20px;
}
</style>
