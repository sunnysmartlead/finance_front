<template>
  <el-upload
    v-model="value"
    show-file-list
    :action="$baseUrl + path"
    :on-success="onSuccess"
    name="fileName"
    :on-error="handleUploadTemplateError"
    :headers="data"
  >
    <el-button style="margin-top: 8px" m="2">{{ btnText }}</el-button>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref, PropType, watch } from "vue"
import { handleUploadTemplateError } from "@/utils/upload"
import { getToken } from "@/utils/cookies"

const data = {
  Authorization: "Bearer " + getToken()
}
const value = ref([])
const props = defineProps({
  fileList: {
    type: Array as PropType<any[]>
  },
  modelValue: {
    type: Array as PropType<any[]>
  },
  path: String,
  onSuccess: {
    type: Function as PropType<any>
  },
  btnText: String
})
const emit = defineEmits(["update:modelValue"])
watch(value, (val) => {
  console.log(val, props)
  emit("update:modelValue", val)
})
</script>
