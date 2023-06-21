<template>
  <div class="dictionary">
    <el-card class="EZFilter-wrap">
      <div class="dictionary__btn-container">
        <el-form :model="data" class="dictionary__form" :rules="rules" ref="ruleFormRef">
          <!-- <el-form-item label="字典名">
          <el-input v-model="data.searchForm.id" />
        </el-form-item>
        <el-form-item label="字典显示名">
          <el-input v-model="data.searchForm.displayName" />
        </el-form-item> -->
          <el-form-item label="邮箱地址" prop="emailAddress">
            <el-input v-model="data.emailAddress" disabled />
          </el-form-item>
          <el-form-item label="邮箱密码" prop="emailPassword">
            <el-input v-model="data.emailPassword" />
          </el-form-item>
          <el-form-item label="密码维护人邮箱地址" prop="maintainerEmail">
            <el-input v-model="data.maintainerEmail" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="SaveEmailInfo(ruleFormRef)">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { useRouter } from "vue-router"
import { addDictionary, editDictionary, deleteDictionary, getDictionary } from "@/api/dictionary"
import { GetEmailInfo, ChangeEmailInfo } from "./service"
import { ElMessage, ElMessageBox } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
/**
 * 路由对象
 */
// const route = useRoute()
/**
 * 路由实例
 */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */

const data = ref({
  emailAddress: "",
  emailPassword: "",
  maintainerEmail: ""
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  emailAddress: [{ required: true, message: "必填", trigger: "blur" }],
  emailPassword: [{ required: true, message: "必填", trigger: "blur" }],
  maintainerEmail: [{ required: true, message: "必填", trigger: "blur" }]
})
const search = () => {
  getList()
}
const getList = async () => {
  let { result }: any = await GetEmailInfo()
  data.value = result
}

const handlePageChange = () => {
  getList()
}

const SaveEmailInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      ElMessageBox.confirm("修改的密码请确认于集团域账号密码一致,否则系统将无法正常运行!", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let { success }: any = await ChangeEmailInfo(data.value)
        if (success) {
          ElMessage({
            type: "success",
            message: "保存成功"
          })
          getList()
        }
      })
    } else {
      console.log("error submit!", fields)
    }
  })
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  search()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.dictionary {
  &__btn-container {
    margin: 20px 0;
  }
}
.dictionary__form {
  width: 70%;
}
.EZFilter-wrap {
  margin-top: 20px;
}
</style>
