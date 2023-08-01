<template>
  <el-button class="m-2" type="primary" @click="downLoadSOR">SOR下载</el-button>
</template>
<script lang="ts" setup>
import getQuery from "@/utils/getQuery"
import { CommonDownloadFile } from "@/api/bom"
import { getSorByAuditFlowId } from "@/components/CustomerSpecificity/service"

const { auditFlowId = 1 }: any = getQuery()
// SOR下载
const downLoadSOR = async () => {
  const { result }: any = (await getSorByAuditFlowId(auditFlowId)) || {}
  if (!result.sorFileName) return false
  let res: any = await CommonDownloadFile(result.sorFileId)
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = result.sorFileName
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}
</script>
