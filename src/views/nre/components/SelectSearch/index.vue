<template>
  <el-select
    remote
    reserve-keyword
    :remote-method="handleSearch"
    :loading="data.loading"
    v-model="value"
    multiple
    placeholder="试验项目（根据与客户协定项目）"
    filterable
  >
    <el-option v-for="item in data.options" :key="item.id" :label="item.displayName" :value="item.id" />
  </el-select>
</template>
<script lang="ts" setup>
import { reactive } from "vue"
import { GetFoundationreliableList } from "../../common/request"
import { map } from "lodash"

const props = defineProps({
  value: String
})

const data = reactive<any>({
  options: [],
  searchDetail: []
})

const handleSearch = async (query: string) => {
  if (query) {
    const { result } = GetFoundationreliableList({ Name: "" }) || {}
    if (result?.length) {
      data.option = map(result, (item) => {
        return {
          id: item.name,
          displayName: item.name
        }
      })
      data.searchDetail = result
    }
  }
}
</script>
