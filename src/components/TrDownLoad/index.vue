<template>
  <div>
    <el-button class="m-2" type="primary" @click="downTrFile">TR-主方案下载</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect} from "vue"
import { useRoute } from "vue-router"
import { getAuditFlowVersion, downloadFile } from "./service"
import getQuery from "@/utils/getQuery"

const { auditFlowId } = getQuery()

//console.log('1-开始创建组件-setup')
// TR主方案下载
const downTrFile = async () => {
  let res: any = await getAuditFlowVersion(Number(auditFlowId))
  const trFileId = res.result.solutionFileIdentifier
  const solutionFileName = res.result.solutionFileName
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

watchEffect(() => {})

</script>
<style scoped lang="scss"></style>
