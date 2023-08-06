<template>
  <div style="padding: 0 10px">
    <InterfaceRequiredTime :ProcessIdentifier="Host" />
    <el-button class="m-2" type="primary" @click="toModuleNumber">项目走量查看</el-button>
    <el-button class="m-2" type="primary" @click="downLoadSOR">SOR下载</el-button>
    <el-card class="margin-top">
      <template #header>
        <el-row style="width: 100%" justify="space-between" align="middle">
          项目制程QC量检具
          <el-button type="primary" @click="addQaqcDepartmentsData" v-havedone>新增</el-button>
        </el-row>
      </template>
      <el-table
        :data="data.qaqcDepartments"
        border
        :summary-method="getQaqcDepartmentsSummaries"
        show-summary
        height="72vh"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="项目制程QC量检具" width="180">
          <template #default="{ row }">
            <el-input v-model="row.qc" />
          </template>
        </el-table-column>
        <el-table-column label="单价" width="180">
          <template #default="{ row }">
            <el-input v-model="row.unitPrice" />
          </template>
        </el-table-column>
        <el-table-column label="数量（set）" width="220">
          <template #default="{ row }">
            <el-input-number v-model="row.count" :min="0" controls-position="right" />
          </template>
        </el-table-column>

        <el-table-column label="费用" width="180">
          <template #default="{ row }">
            <div>
              <span v-show="false">{{ (row.cost = row.unitPrice * row.count) }}</span>
              {{ row.unitPrice * row.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="使用工站" width="180">
          <template #default="{ row }">
            <el-input v-model="row.useWorkstation" />
          </template>
        </el-table-column>
        <el-table-column label="备注" width="180">
          <template #default="{ row }">
            <el-input v-model="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="{ $index }">
            <el-button @click="deleteQaqcDepartmentsData($index)" type="danger" v-havedone>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-button type="primary" @click="submit" v-havedone>提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { getQaqcDepartmentsSummaries } from "../../common/nreQCDepartmentSummaries"
import { PostQADepartment, GetReturnQcGauge } from "../../common/request"
import { ElMessage } from "element-plus"
import { getSorByAuditFlowId } from "@/components/CustomerSpecificity/service"
import { CommonDownloadFile } from "@/api/bom"
import router from "@/router"
import getQuery from "@/utils/getQuery"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host = "NreInputGage"
const { auditFlowId, productId }: any = getQuery()

/**
 * 数据部分
 */
const data = reactive<{
  qaqcDepartments: any
}>({
  qaqcDepartments: []
})

const deleteQaqcDepartmentsData = (i: number) => {
  data.qaqcDepartments.splice(i, 1)
}

const addQaqcDepartmentsData = () => {
  data.qaqcDepartments.push({
    cost: 0,
    count: 0,
    qc: null,
    remark: "",
    unitPrice: "",
    useWorkstation: null
  })
}
// 跳转查看项目走量
const toModuleNumber = () => {
  router.push({
    path: "/resourcesDepartment/moduleNumber",
    query: {
      auditFlowId,
      productId
    }
  })
}

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
const submit = async () => {
  const { success } = await PostQADepartment({
    auditFlowId,
    qcGaugeDtoModels: {
      productId,
      qaqcDepartments: data.qaqcDepartments.map((item: any) => ({
        ...item,
        allCost: (item.unitPrice || 0) * (item.count || 0)
      }))
    }
  })
  success && ElMessage.success("提交成功")
}
const initFetch = async () => {
  const { result } = await GetReturnQcGauge(auditFlowId, productId)
  data.qaqcDepartments = result?.qaqcDepartments || []
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  initFetch()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

watchEffect(() => {})
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
