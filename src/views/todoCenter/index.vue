<template>
  <div class="todo-center">
    <el-card class="card" v-if="isProductManager">
      <el-form :model="form" inline :rules="rules" ref="projectFormRef">
        <el-form-item label="项目名称" prop="quoteProjectName">
          <el-input v-model="form.quoteProjectName" />
        </el-form-item>
        <el-form-item label="项目代码" prop="quoteProjectNumber">
          <el-input v-model="form.quoteProjectNumber" />
        </el-form-item>
        <el-form-item label="版本号" prop="quoteVersion">
          <el-input v-model="form.quoteVersion" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <el-button @click="saveNew(projectFormRef)" type="primary">新建</el-button>
    </el-card>
    <el-card class="card">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="待办" name="upcoming">
          <el-table :data="auditFlowIdInfoList">
            <el-table-column type="expand">
              <template #default="scopeP">
                <el-table :data="scopeP.row.auditFlowRightDetailList">
                  <el-table-column label="流程界面" prop="processName" />
                  <el-table-column label="是否回退">
                    <template #default="scope">
                      {{ scope.row.isRetype ? "是" : "否" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="流转说明" prop="jumpDescription" />
                  <el-table-column label="跳转至流程">
                    <template #default="scope">
                      <el-button @click="clickToPage(scope.row, scopeP)">跳转</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="流程ID" prop="auditFlowId" />
            <el-table-column label="流程标题" prop="auditFlowTitle" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已办/查看" name="check">
          <el-table :data="auditFlowIdInfoListCheck">
            <el-table-column type="expand">
              <template #default="scopeP">
                <el-table :data="scopeP.row.auditFlowRightDetailList">
                  <el-table-column label="流程界面" prop="processName" />
                  <el-table-column label="是否回退">
                    <template #default="scope">
                      {{ scope.row.isRetype ? "是" : "否" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="流转说明" prop="jumpDescription" />
                  <el-table-column label="跳转至流程">
                    <template #default="scope">
                      <el-button @click="clickToPage(scope.row, scopeP)">跳转</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="流程ID" prop="auditFlowId" />
            <el-table-column label="流程标题" prop="auditFlowTitle" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { getAllAuditFlowInfos, getAuditFlowNewVersionByProjectName } from "./service"
import type { FormInstance, FormRules } from "element-plus"

import urlMap from "./constant"
// import { useStore } from "vuex"
import { useRouter } from "vue-router"
import _ from "lodash"
import { useProductStore } from "@/store/modules/productList"
// import getQuery from "@/utils/getQuery"

const productStore = useProductStore()
const projectFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  quoteProjectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  quoteProjectNumber: [
    {
      required: true,
      message: "请输入项目代码",
      trigger: "blur"
    }
  ],
  quoteVersion: [
    {
      required: true,
      message: "等待后端返回版本号继续",
      trigger: "blur"
    }
  ]
})
const router = useRouter()
const activeName = ref("upcoming")
const form = reactive({
  quoteProjectName: "",
  quoteProjectNumber: "",
  quoteVersion: "",
  remarks: ""
})
let auditFlowIdInfoList = ref([])
let auditFlowIdInfoListCheck = ref([])
let isProductManager = ref(false)
// let userStorage = window.localStorage.getItem("user")
// let userInfo: any = userStorage ? JSON.parse(userStorage) : {}
const saveNew = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (!form.quoteVersion && form.quoteProjectName) {
    let resVersion: any = await getAuditFlowNewVersionByProjectName(form.quoteProjectName)
    form.quoteVersion = resVersion.result.newVersion
    // 同一个项目多次报价 自动带出项目编号
    if (resVersion.result.projectNumber) {
      form.quoteProjectNumber = resVersion.result.projectNumber
    }
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      router.push({
        path: "/demandApply/index",
        query: {
          projectName: form.quoteProjectName,
          projectCode: form.quoteProjectNumber,
          quoteVersion: form.quoteVersion
        }
      })
    } else {
      console.log("error submit!", fields)
    }
  })
}

const clickToPage = (row: any, scopeP: any) => {
  productStore.setProductList(scopeP.row.auditFlowId) // 只在这里执行获取零件列表
  let pathItem: any = urlMap[row.processIdentifier as keyof typeof urlMap]
  let query: any = Object.assign({ auditFlowId: scopeP.row.auditFlowId, right: row.right }, pathItem.query)
  if (window.sessionStorage.getItem("productId")) {
    query.productId = window.sessionStorage.getItem("productId")
  }
  window.sessionStorage.setItem("flowName", scopeP.row.auditFlowTitle)
  console.log(row.processIdentifier)
  router.push({
    path: `${pathItem.path}`,
    query
  })
}
/**
 * 仓库
 */
// const store = useStore()
/**
 * 路由对象
 */
// const route = useRoute()
/**
 * 路由实例
 */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
onBeforeMount(() => {
  // 移除缓存
  if (window.sessionStorage.getItem("productId")) {
    window.sessionStorage.removeItem("productId")
  }
  if (window.sessionStorage.getItem("flowName")) {
    window.sessionStorage.removeItem("flowName")
  }
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  let res: any = await getAllAuditFlowInfos()
  // 待办2
  if (res.result) {
    res.result = res.result.sort(function (a: any, b: any) {
      return b.auditFlowId - a.auditFlowId
    })
    let notShowList: any = []
    auditFlowIdInfoList.value = _.cloneDeep(res.result)
    auditFlowIdInfoList.value.forEach((item: any, index: number) => {
      item.auditFlowRightDetailList = item.auditFlowRightDetailList.filter((i: any) => {
        return i.right === 2
      })
      if (item.auditFlowRightDetailList.length === 0) {
        notShowList.push(index)
      }
    })
    notShowList.sort((a: number, b: number) => {
      return b - a
    })
    notShowList.forEach((index: number) => {
      auditFlowIdInfoList.value.splice(index, 1)
    })
    // 已办1

    let notShowListhave: any = []
    auditFlowIdInfoListCheck.value = _.cloneDeep(res.result)
    auditFlowIdInfoListCheck.value.forEach((item: any, index: number) => {
      item.auditFlowRightDetailList = item.auditFlowRightDetailList.filter((i: any) => {
        return i.right === 1
      })
      if (item.auditFlowRightDetailList.length === 0) {
        notShowListhave.push(index)
      }
    })
    notShowListhave.sort((a: number, b: number) => {
      return b - a
    })
    notShowListhave.forEach((index: number) => {
      auditFlowIdInfoListCheck.value.splice(index, 1)
    })
  }
  try {
    let userStorage = window.localStorage.getItem("user")
    let userInfo: any = userStorage ? JSON.parse(userStorage) : {}
    let usetRoleNames = userInfo?.userRole?.items?.map((item: any) => item.name) || []
    if (usetRoleNames.includes("营销部-业务员")) {
      isProductManager.value = true
    }
  } catch (error) {
    console.log(error)
  }
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
// defineExpose({
//   ...toRefs(data)
// })
</script>
<style scoped lang="scss">
.todo-center {
  &__body {
    margin: 20px 0;
    background: #fff;
    height: 500px;
  }
  .card {
    margin: 20px 0;
  }
}
</style>
