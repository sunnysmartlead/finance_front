<template>
  <el-select
    remote
    reserve-keyword
    :remote-method="handleSearch"
    :loading="data.loading"
    v-model="value"
    placeholder="试验项目（根据与客户协定项目）"
    filterable
    @change="hanleChange"
  >
    <el-option v-for="item in data.options" :key="item.id" :label="item.displayName" :value="item.id" />
  </el-select>
</template>
<script lang="ts" setup>
import { reactive, PropType } from "vue"
import { GetFoundationreliableList } from "../../common/request"
import { map } from "lodash"

const props = defineProps({
  value: String,
  onChange: {
    type: Object as PropType<Record<string, any>>,
    required: false
  },
  request: {
    type: Object as PropType<Record<string, any>>,
    required: false
  }
})

const data = reactive<any>({
  options: [],
  searchDetail: []
})

const handleSearch = async (query: string) => {
  if (query) {
    const { result } = (await GetFoundationreliableList({ Name: query })) || {}
    console.log(result, "result")
    if (result?.length) {
      data.options = map(result, (item) => {
        return {
          id: item.name,
          displayName: item.name
        }
      })
      data.searchDetail = result
    }
  }
}

const hanleChange = (query: any) => {
  const currntItem = data.searchDetail.find((item: any) => query === item.name)
  // emit("onChange", currntItem)
  props.onChange({ ...currntItem, query })
}
</script>
