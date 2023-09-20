<template>
  <el-tag class="tagsize" :type="isQualified(value)" round
    >时间要求:&lt;{{ formatDateTimeDLY(value, "YYYY-MM-DD") }}</el-tag
  >
</template>

<script lang="ts" setup>
import { reactive, PropType, ref, watch, onMounted } from "vue"
import type { FormInstance } from "element-plus"
import { getPermissionList } from "./InterfaceRequiredTime"
import { formatDateTimeDLY } from "@/utils"
import getQuery from "@/utils/getQuery"
let { auditFlowId } = getQuery()
const value = ref<string>("")
const props = defineProps({
  ProcessIdentifier: {
    type: String,
    required: true
  }
})

const isQualified = (prop: string) => {
  //判断是是否存在
  if (!prop) {
    return "warning"
  }
  //判断是否大于当前时间
  if (new Date() > new Date(prop)) {
    return "danger"
  }
  return ""
}

onMounted(async () => {
  console.log(auditFlowId, props.ProcessIdentifier)
  if (!auditFlowId) return
  let { success, result } = await getPermissionList({
    auditFlowId: auditFlowId,
    processIdentifier: props.ProcessIdentifier
  })
  if (success) {
    value.value = result
  }
})
</script>
<style scoped lang="scss">
.EZFilter-wrap {
  margin-top: 20px;
}
.tagsize {
  font-size: 21px;
}
</style>
