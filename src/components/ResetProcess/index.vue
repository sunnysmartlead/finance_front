<template>
  <el-row justify="end">
    <el-button type="primary" m="2" @click="data.dialogVisible = true" v-if="!notShow">重置流程</el-button>
    <el-dialog v-model="data.dialogVisible" title="重置流程" width="30%">
      <el-form :inline="true">
        <el-form-item label="选择部门:">
          <el-select
            v-model="data.departmentId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="departmentChange"
          >
            <el-option v-for="item in data.departmentList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <!-- <el-input v-model="dpartName" @blur="GetUserByDeptNamAction" /> -->
        </el-form-item>
        <el-form-item label="选择人员:">
          <el-select v-model="data.userId" filterable>
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

import { GetUserByDeptName, ResetTask, GetDepartmentByName, GetUserByDepartmentId } from "./service"
import getQuery from "@/utils/getQuery"

const route = useRoute()

const loading = ref(false)
let { nodeInstanceId, showBtn } = getQuery()
const dpartName = ref("")
const name = ref("")
const notShowRoutes = [
  "/nre/nreResourcesDepartment",
  "/resourcesDepartment/electronic",
  "/resourcesDepartment/construction",
  "/demandApply/index",
  "/todoCenter/index",
  "/createProcess/index",
  "/timeliness/index",
  "/departmentManage/index",
  "/role/index",
  "/user/index",
  "/E-mail/index",
  "/dictionary/index",
  "/dictionary/detailList",
  "/fnDepartment/index",
  "/fnDepartment/countryLibrary",
  "/fnDepartment/qualityCost",
  "/fnDepartment/exchangeRate",
  "/fnDepartment/grossProfitMargin",
  "/unitPriceImport/index",
  "/fnDepartment/rateEntry",
  "/engineeringParameters/followLineTangent"
]
let notShow = computed(() => {
  if (showBtn === "false") {
    return true
  }
  if (notShowRoutes.includes(route.path)) {
    return true
  } else {
    return false
  }
})
onMounted(async () => {
  // GetUserByDeptNamAction()
  getDepartmentByName()
})
const GetUserByDeptNamAction = async () => {
  let params: any = {
    maxResultCount: 20,
    skipCount: 0,
    name: name.value,
    deptName: dpartName.value
  }
  let res = await GetUserByDeptName(params)
  data.userList = res.result.items
}
const getDepartmentByName = async () => {
  let params: any = {
    name: name.value
  }
  let res = await GetDepartmentByName(params)
  data.departmentList = res.result.items
}
const departmentChange = async (val) => {
  let res = await GetUserByDepartmentId({ departmentId: val })
  data.userList = res.result.items
}

const data: any = reactive({
  dialogVisible: false,
  // comment: "",
  // opinion: "",
  // solutionIds: [],
  departmentId: "",
  departmentList: [],
  userId: "",
  userList: []
})
const remoteMethod = async (query: string) => {
  if (query !== "") {
    loading.value = true
    let res = await getDepartmentByName({ name: query })
    // name.value = query
    loading.value = false
    data.userList = res.result.items
  }
}
const onSubmit = async () => {
  if (nodeInstanceId && data.userId) {
    let res = await ResetTask({
      nodeInstanceId,
      targetUserId: data.userId
    })
    ElMessage.success("重置成功")
    console.log(res.data)
  }
}
</script>
