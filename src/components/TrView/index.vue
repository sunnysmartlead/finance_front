<template>
  <div>
    <el-button m="2" type="primary" class="pddAudit_but" @click="openVisible">{{
      btnText || "查看设计方案"
    }}</el-button>
    <designScheme v-model:dialogTableVisible="dialogTableVisible" @close="dialogTableVisible = false" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { designScheme } from "@/views/demandApplyAudit"

const props = defineProps({
  btnText: String
})

const dialogTableVisible = ref(false)

const openVisible = () => (dialogTableVisible.value = true)
</script>
