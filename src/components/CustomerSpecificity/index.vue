<template>
  <div>
    <el-form inline>
      <el-form-item label="客户特殊性要求">
        <el-input v-model="data.text" type="textarea" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="downLoadSor">点击下载SOR附件</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { useRoute } from "vue-router"
import { getSorByAuditFlowId } from "./service"
import { CommonDownloadFile } from "@/api/bom"

/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  sorFileName: "",
  fileId: null,
  text: ""
})

const downLoadSor = async () => {
  let res: any = await CommonDownloadFile(data.fileId)
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = data.sorFileName
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(async () => {
  let { auditFlowId } = route.query
  if (auditFlowId) {
    try {
      const { result }: any = (await getSorByAuditFlowId(auditFlowId)) || {}
      data.text = result.customerSpecialRequest
      data.sorFileName = result.sorFileName
      data.fileId = result.sorFileId
    } catch (err: any) {
      console.log(err)
    }
  }
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

watchEffect(() => {})
</script>
<style scoped lang="scss"></style>
