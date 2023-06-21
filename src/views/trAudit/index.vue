<template>
  <div>
    <el-card>
      <el-form :model="data.form">
        <el-form-item label="标题">
          <el-input v-model="data.form.title" />
        </el-form-item>
        <el-form-item label="Tr主方案">
          <el-button @click="downLoad">点击下载附件</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save(true)" v-havedone>同意</el-button>
          <el-button @click="save(false)" v-havedone>拒绝</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { getAuditFlowVersion, downloadFile, setTRMainSolutionState } from "./service"
// import useQueryData from "@/hook/useQueryData"
import getQuery from "@/utils/getQuery"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRoute } from "vue-router"
import useJump from "@/hook/useJump"

const route = useRoute()
const { closeSelectedTag } = useJump()

let { trCheckType, auditFlowId } = getQuery()

// import { useRoute, useRouter } from "vue-router"
/**
 * 路由对象
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
const data = reactive({
  form: {
    title: "",
    tr: ""
  }
})
let trFileId: null | number = null
let solutionFileName = "" //文件名
const save = async (isAgree: boolean) => {
  if (trFileId) {
    let text = isAgree ? "您确定要同意嘛？" : "请输入拒绝理由"
    ElMessageBox[!isAgree ? "prompt" : "confirm"](text, "请审核", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async (val) => {
      let res: any = await setTRMainSolutionState({
        auditFlowId,
        trCheckType: trCheckType ? Number(trCheckType) : 1, //1：“市场部TR主方案审核”，2：“产品开发部TR主方案审
        isAgree,
        opinionDescription: !isAgree ? val?.value : ""
      })
      if (res.success) {
        ElMessage.success("操作成功")
        closeSelectedTag(route.path)
      }
    })
  }
}
const downLoad = async () => {
  console.log(trFileId, "trFileId")
  if (trFileId) {
    try {
      let res: any = await downloadFile(trFileId)
      const blob = res
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        let url = URL.createObjectURL(new Blob([blob]))
        let a = document.createElement("a")
        document.body.appendChild(a) //此处增加了将创建的添加到body当中
        a.href = url
        a.download = solutionFileName
        a.target = "_blank"
        a.click()
        a.remove() //将a标签移除
      }
    } catch (err) {
      console.log(err, "downLoadError")
    }
  }
}
onBeforeMount(() => {
  if (trCheckType === "1") {
    route.meta.title = "市场部" + route.meta.title
  } else if (trCheckType === "2") {
    route.meta.title = "产品开发部" + route.meta.title
  }

  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  // let auditFlowId = window.sessionStorage.getItem("auditFlowId") || 5
  let res: any = await getAuditFlowVersion(Number(auditFlowId))
  data.form.title = res.result.title
  trFileId = res.result.solutionFileIdentifier
  solutionFileName = res.result.solutionFileName
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
