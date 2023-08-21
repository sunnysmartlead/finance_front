<template>
  <div>
    <el-dialog v-model="props.dialogTableVisible" :title="title" @close="dialogClose" draggable width="85%">
      <el-table :data="designScheme" border>
        <el-table-column prop="solutionName" label="方案名称" width="150" />
        <el-table-column prop="sensor" label="SENSOR" width="150">
          <template #default="{ row }">
            <el-input v-model="row.sensor" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="serial" label="Serial" width="150">
          <template #default="{ row }">
            <el-input v-model="row.serial" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="lens" label="lens" width="150">
          <template #default="{ row }">
            <el-input v-model="row.lens" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="isp" label="ISP" width="150">
          <template #default="{ row }">
            <el-input v-model="row.isp" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="vcsel" label="vcsel/LED" width="150">
          <template #default="{ row }">
            <el-input v-model="row.vcsel" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="mcu" label="MCU" width="150">
          <template #default="{ row }">
            <el-input v-model="row.mcu" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="harness" label="线束" width="150">
          <template #default="{ row }">
            <el-input v-model="row.harness" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="stand" label="支架" width="150">
          <template #default="{ row }">
            <el-input v-model="row.stand" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="transmissionStructure" label="传动结构" width="150">
          <template #default="{ row }">
            <el-input v-model="row.transmissionStructure" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="productType" label="产品类型" width="150">
          <template #default="{ row }">
            <el-input v-model="row.productType" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="processProgram" label="工艺方案" width="150">
          <template #default="{ row }">
            <el-input v-model="row.processProgram" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="rests" label="其他" width="150">
          <template #default="{ row }">
            <el-input v-model="row.rests" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="rests" label="币别" width="150">
          <template #default="{ row }">
            <el-input v-model="row.rests" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="rests" label="汇率" width="150">
          <template #default="{ row }">
            <el-input v-model="row.rests" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="rests" label="合计" width="150">
          <template #default="{ row }">
            <el-input v-model="row.rests" :disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="file.fileName" label="3D爆炸图截图下载" fixed="right" width="300">
          <template #default="{ row }">
            <el-button type="success" @click="downLoad(row.fileId, row.file?.fileName)">{{
              row.file?.fileName
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, defineEmits } from "vue"
import { AuditExport } from "./service"
import getQuery from "@/utils/getQuery"
import { DesignSolutionDto } from "./data.type"
import { downloadFile } from "@/views/trAudit/service"
const designScheme = ref<DesignSolutionDto[]>([])
const props = defineProps({
  dialogTableVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "项目设计方案"
  },
  disabled: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(["close"])
const dialogClose = () => {
  emit("close")
}
const downLoad = async (trFileId: number, FileName: string) => {
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
        a.download = FileName
        a.target = "_blank"
        a.click()
        a.remove() //将a标签移除
      }
    } catch (err) {
      console.log(err, "downLoadError")
    }
  }
}
onMounted(async () => {
  let query = getQuery()
  if (query.auditFlowId) {
    let AuditEntering: any = await AuditExport(query.auditFlowId)
    if (AuditEntering.result) {
      designScheme.value = AuditEntering.result.designSolutionList
    }
  }
})
</script>

<style lang="scss" scoped></style>
