<template>
  <div>
    <el-card class="box-card">
      <el-button v-if="isAdmin" style="float: right" @click="drawer = true">新增</el-button>
      <h4>更新日志</h4>
      <el-timeline>
        <el-timeline-item v-for="item in data.updateLogInfoData" :key="item" :timestamp="tilte(item)" placement="top">
          <el-card class="box-card-card">
            <el-tag :type="item.isStart ? `success` : `danger`">{{ item.isStart ? "更新正常" : "更新异常" }}</el-tag>
            <el-tag type="success">{{ item.identify }}</el-tag>
            <h4>{{ item.versionNumber }}</h4>
            <p v-for="prop in item.children" :key="prop">
              <el-tag class="ml-2" :type="info(prop.identify)">{{ prop.identify }}</el-tag>
              <el-tag class="mx-1" type="info" effect="plain"> {{ prop.module }} </el-tag>
              {{ prop.content }}
            </p>
            <div v-if="isAdmin">
              <el-button size="small" round style="float: right" @click="drawertrue(item)">编辑</el-button>
              <el-popconfirm title="确定要删除嘛?" @confirm="DelUpdateLog(item)">
                <template #reference>
                  <el-button type="danger" size="small" round style="float: right">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
    <el-dialog class="dialog" v-model="drawer" title="更新日志" width="60%" center @close="dialogclose">
      <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px" class="demo-dynamic">
        <el-form-item
          label="版本号"
          prop="versionNumber"
          :rules="[
            {
              required: true,
              message: '必填',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="dynamicValidateForm.versionNumber" placeholder="请输入版本号" class="input-with-select">
            <template #prepend>
              <el-select v-model="dynamicValidateForm.identify" placeholder="请选择更新环境" style="width: 215px">
                <el-option label="测试环境" value="测试环境" />
                <el-option label="正式环境" value="正式环境" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dynamicValidateForm.isStart" placeholder="请选择更新状态" style="width: 215px">
            <el-option label="更新正常" :value="true" />
            <el-option label="更新异常" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.children"
          :key="domain.key"
          :label="index.toString()"
          :prop="'children.' + index + '.module'"
          :rules="{
            required: true,
            message: '必填',
            trigger: 'blur'
          }"
        >
          <el-input v-model="domain.module" placeholder="请输入调整的模块名称" class="input-with-select">
            <template #prepend>
              <el-select v-model="domain.identify" placeholder="请选择类型" style="width: 115px">
                <el-option label="新增" value="新增" />
                <el-option label="移除" value="移除" />
                <el-option label="修复" value="修复" />
                <el-option label="调整" value="调整" />
              </el-select>
            </template>
          </el-input>
          <el-input v-model="domain.content" placeholder="请输入调整的内容" />
          <el-button class="mt-2" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
          <el-button @click="addDomain">新增行</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { GetUpdateLogInfo, DelUpdateLogInfo, AddVersions } from "./service"
import { formatDateTime } from "@/utils"
import type { FormInstance } from "element-plus"
import { ElMessage, ElMessageBox } from "element-plus"
// import { useRoute, useRouter } from "vue-router"
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

const formRef = ref<FormInstance>()
let dynamicValidateForm = ref<any>({
  children: [
    {
      content: "",
      identify: "",
      module: ""
    }
  ],
  versionNumber: "",
  select: "v"
})

interface DomainItem {
  key: number
  value: string
}

const removeDomain = (item: DomainItem) => {
  const index = dynamicValidateForm.value?.children.indexOf(item)
  if (index !== -1) {
    dynamicValidateForm.value?.children.splice(index, 1)
  }
}

const addDomain = () => {
  dynamicValidateForm.value?.children.push({
    content: "",
    identify: "",
    module: ""
  })
}

const submitForm = (formEl: FormInstance | undefined) => {
  console.log(dynamicValidateForm.value, "dynamicValidateForm")
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      //dynamicValidateForm.value.creationTime = new Date()
      let { success }: any = await AddVersions(dynamicValidateForm.value)
      console.log(success, "res")
      if (success) {
        ElMessage({
          type: "success",
          message: "操作成功"
        })
        getList()
        drawer.value = false
      }
    } else {
      return false
    }
  })
}

const dialogclose = () => {
  dynamicValidateForm.value = {
    children: [
      {
        content: "",
        identify: "",
        module: ""
      }
    ],
    versionNumber: "",
    select: "v"
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const DelUpdateLog = async (item: any) => {
  let res: any = await DelUpdateLogInfo({ Id: item.id })
  if (res.success) {
    ElMessage({
      type: "success",
      message: "删除成功"
    })
    getList()
  }
}

const data = reactive<any>({
  updateLogInfoData: []
})
const drawer = ref(false)
const isAdmin = ref(false)
const tilte = (itme: any) => {
  return formatDateTime(itme.creationTime)
}
const drawertrue = (itme: any) => {
  drawer.value = true
  console.log(itme, "itme")
  dynamicValidateForm.value = JSON.parse(JSON.stringify(itme))
}
const info = (identify: any) => {
  switch (identify) {
    case "新增":
      return ""
      break
    case "移除":
      return "danger"
      break
    case "修复":
      return "success"
      break
    case "调整":
      return "info"
      break
    default:
      return ""
      break
  }
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  const userStorage = window.localStorage.getItem("user") || "{}"
  const userInfo = JSON.parse(userStorage)
  const userRoles = userInfo?.userRole?.items.map((item: any) => item.name) || []
  if (userRoles.includes("Admin")) {
    isAdmin.value = true
  }
  await getList()
})
const getList = async () => {
  let { result }: any = await GetUpdateLogInfo()
  data.updateLogInfoData = result
  console.log(data.updateLogInfoData, "data.updateLogInfoData")
}
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  margin: 20px;
}
.dialog {
  max-height: 700px;
  overflow: auto;
}
</style>
