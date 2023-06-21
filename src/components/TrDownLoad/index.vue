<template>
  <div>
    <el-form inline>
      <el-form-item label="Tr主方案">
        <el-button @click="downLoad" type="primary">点击下载附件</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect} from "vue"
import { useRoute } from "vue-router"
import { getAuditFlowVersion, downloadFile } from "./service"

/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({})
let trFileId: null | number = null
let solutionFileName = "" //文件名
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
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  let { auditFlowId } = route.query
  let res: any = await getAuditFlowVersion(Number(auditFlowId))
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
