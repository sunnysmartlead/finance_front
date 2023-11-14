<template>
  <el-row justify="end">
    <el-button type="primary" m="2" @click="data.dialogVisible = true" v-if="!notShow">重置流程</el-button>
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
import { useRoute } from "vue-router"

import { GetAll, ResetTask } from "./service"
import getQuery from "@/utils/getQuery"

const route = useRoute()

const loading = ref(false)
let { nodeInstanceId } = getQuery()

const notShowRoutes = [
  "/nre/nreResourcesDepartment",
  "/resourcesDepartment/electronic",
  "/resourcesDepartment/construction",
  "/demandApply/index"
]
let notShow = computed(() => {
  if (notShowRoutes.includes(route.path)) {
    return true
  } else {
    return false
  }
})
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
</script>
