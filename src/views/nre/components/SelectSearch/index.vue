<template>
  <el-select
    v-model="value"
    placeholder="试验项目（根据与客户协定项目）"
    filterable
    @change="hanleChange"
    :options="data.searchDetail"
  >
    <el-option v-for="item in data.options" :key="item.id" :label="item.displayName" :value="item.id" />
  </el-select>
</template>
<script lang="ts" setup>
import { reactive, PropType, watch, ref, onMounted } from "vue"
import { map } from "lodash"
const value = ref("")
const props = defineProps({
  onChange: {
    type: Function as PropType<any>,
    required: false
  },
  request: {
    type: Function as PropType<any>,
    required: false
  }
})
onMounted(() => {
  handleSearch(' ')
})
const emit = defineEmits(["update:modelValue"])
watch(value, (val) => {
  console.log(val, props)
  emit("update:modelValue", val)
})
const data = reactive<any>({
  options: [],
  searchDetail: []
})

const handleSearch = async (query: string) => {
  if (query) {
    const { result } = (await props.request({ Name: query })) || {}
    console.log(result, "result")
    data.options = map(result, (item) => {
      return {
        id: item.name,
        displayName: item.name
      }
    })|| []
    data.searchDetail = result || []
  }
}

const hanleChange = (query: any) => {
  const currntItem = data.searchDetail.find((item: any) => query === item.name)
  // emit("onChange", currntItem)
  props.onChange({ ...currntItem, query })
}
</script>
