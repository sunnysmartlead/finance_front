<template>
  <el-row justify="end">
    <el-button type="primary" m="2" @click="data.dialogVisible = true">重置流程</el-button>
    <el-dialog v-model="data.dialogVisible" title="重置流程" width="30%">
      <el-form>
        <el-form-item label="选择人员">
          <el-select
            v-model="data.opinion"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option v-for="item in data.userList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
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
import { reactive, PropType, computed, onMounted, ref } from "vue"
import { ElMessage } from "element-plus"

// import { useRoute } from "vue-router"
// import PROGRESSTYPE from "@/constant/approvalProcess"
// import { useProductStore } from "@/store/modules/productList"
// import { debounce } from "lodash"
import { GetAll, ResetTask } from "./service"
import getQuery from "@/utils/getQuery"

// const productStore = useProductStore()
const loading = ref(false)
let { nodeInstanceId } = getQuery()

onMounted(async () => {
  let params: any = {
    keyword: "",
    maxResultCount: 20,
    skipCount: 0
  }
  let res = await GetAll(params)
  data.userList = res.result.items
})
const data: any = reactive({
  dialogVisible: false,
  comment: "",
  opinion: "",
  userList: [],
  solutionIds: []
})
const remoteMethod = async (query: string) => {
  if (query !== "") {
    loading.value = true
    let res = await GetAll({ keyword: query })
    loading.value = false
    data.userList = res.result.items
  }
}
const onSubmit = async () => {
  if (nodeInstanceId && data.opinion) {
    let res = await ResetTask({
      nodeInstanceId,
      targetUserId: data.opinion
    })
    ElMessage.success("重置成功")
    console.log(res.data)
  }
}
// const props = defineProps({
//   onSubmit: {
//     type: Function as PropType<any>
//   },
//   processType: {
//     type: String,
//     default: "baseProcessType"
//   },
//   nodeInstanceId: {
//     type: Number,
//     default: 0
//   }
// })

// const route = useRoute()

// const solutionIdOptions = computed(() => {
//   return productStore?.productList || []
// })

// const onSubmit = debounce(async () => {
//   const label = PROGRESSTYPE[props.processType]?.find((v: any) => v.val === data.opinion)?.label || ""
//   let { nodeInstanceId } = route.query
//   await props.onSubmit({
//     comment: data.comment,
//     opinion: data.opinion,
//     nodeInstanceId: nodeInstanceId,
//     label,
//     ids: data.solutionIds
//   })
//   data.dialogVisible = false
// }, 350)
</script>
