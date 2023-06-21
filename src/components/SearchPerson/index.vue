/* eslint-disable vue/no-mutating-props */
<template>
  <div>
    <el-select
      v-model="value"
      :multiple="multiple"
      filterable
      remote
      reserve-keyword
      placeholder="请输入姓名"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, watch } from "vue"
import { getUserList, UserParams } from "@/api/user"
// import { useRoute, useRouter } from "vue-router"
// import { GetUserInput } from "@/api/partEntry"
const value = ref("")
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ""
  }
})
const emit = defineEmits(["update:modelValue"])
watch(value, (val) => {
  console.log(val, props)
  emit("update:modelValue", val)
})
// interface ListItem {
//   value: string
//   label: string
// }
interface user {
  id: number
  name: string
}
// const list = ref<ListItem[]>([])
const options = ref<user[]>([])
const loading = ref(false)

// /**
//  * 路由对象
//  */
// const route = useRoute()
// /**
//  * 路由实例
//  */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({})
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
  // list.value = states.map((item) => {
  //   return { value: `value:${item}`, label: `label:${item}` }
  // })
})
const getList = async (query: string) => {
  let params: UserParams = {
    keyword: "",
    maxResultCount: 20,
    skipCount: 0
  }
  params.keyword = query
  let res: any = await getUserList(params)
  loading.value = false
  options.value = res.result.items
}
// const states = []
const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    await getList(query)
    loading.value = false
    // setTimeout(() => {
    //   loading.value = false
    //   options.value = list.value.filter((item) => {
    //     return item.label.toLowerCase().includes(query.toLowerCase())
    //   })
    // }, 200)
    // let res = await GetUserInput()
    // console.log(res)
  } else {
    options.value = []
  }
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
