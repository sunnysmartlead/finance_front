/* eslint-disable vue/no-mutating-props */
<template>
  <div>
    <el-select v-model="value" :multiple="multiple" filterable placeholder="请选择姓名" :disabled="disabled">
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, watch, PropType } from "vue"
import { getUserListByRoleName } from "@/api/user"

const value = ref<number | undefined>(undefined)
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Number,
    default: undefined
  },
  roleName: {
    type: Array as PropType<string[] | string>
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(["update:modelValue"])
watch(value, (val) => {
  emit("update:modelValue", val)
})

watch(
  () => props.modelValue,
  (val) => {
    value.value = val
  }
)

watch(
  () => props.roleName,
  (val) => {
    getList(val)
  }
)

interface user {
  id: number
  name: string
}
const options = ref<user[]>([])

const data = reactive({})
onBeforeMount(() => {
  getList(props.roleName || "")
})

const getList = async (query: string[] | string) => {
  let res: any = await getUserListByRoleName(query)
  options.value = res.result.items
}

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
