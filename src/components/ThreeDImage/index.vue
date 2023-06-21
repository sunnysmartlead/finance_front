<template>
  <div>
    <el-button type="primary" @click="downLoad3DExploded">3D爆炸图下载</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { useRoute } from "vue-router"
import { CommonDownloadFile } from "@/api/bom"
import { GetPicture3DByAuditFlowId } from "./service"

/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */

// 3D爆炸图下载
const downLoad3DExploded = async () => {
  let { auditFlowId, productId } = route.query
  let downRes: any = await GetPicture3DByAuditFlowId(auditFlowId, productId)
  if (!downRes.result.threeDFileId) return false
  let res: any = await CommonDownloadFile(downRes.result.threeDFileId)
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = downRes.result.threeDFileName
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
  // data.setVisible = false
}
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({})
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
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
