<template>
  <div class="versionManagement-wrap">
    <EZFilter
      :filterNnum="data.verisonfilterNnum"
      :show-btn="true"
      :initFilterValue="InitVersionFilterValue"
      :onSubmit="queryTable"
    />
    <el-card class="table-wrap" header="系统版本管理表">
      <el-table :data="data.versionManageData" style="width: 100%">
        <el-table-column prop="versionBasicInfo.projectName" label="项目名称">
          <template #default="{ row }">
            <el-button type="primary" link>
              <a
                target="_blank"
                :href="`/versionManagement/operationRecord?AuditFlowId=${row.versionBasicInfo?.auditFlowId}&projectName=${row.versionBasicInfo?.projectName}&version=${row.versionBasicInfo?.version}&projectManager=${row.versionBasicInfo?.projectManager}`"
              >
                {{ row.versionBasicInfo.projectName }}
              </a>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="versionBasicInfo.version" label="版本号" />
        <el-table-column prop="versionBasicInfo.auditFlowId" label="流程单号" />
        <el-table-column prop="versionBasicInfo.projectManager" label="项目经理" />
        <el-table-column label="拟稿时间">
          <template #default="{ row }">
            {{ formatDateTime(row.versionBasicInfo.draftTime || "") }}
          </template>
        </el-table-column>
        <el-table-column label="完成时间">
          <template #default="{ row }">
            {{ formatDateTime(row.versionBasicInfo.finishedTime || "") }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.versionBasicInfo.finishedTime"
              @click="getPriceEvaluationTableList(row)"
              type="primary"
              link
            >
              表单链接
            </el-button>
            <el-tooltip v-else :content="`${!row.versionBasicInfo.finishedTime ? '核价未完成' : ''}`">
              <el-button type="primary" link> 表单链接 </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="报表汇总" width="80%" v-model="data.visible">
      <versionDetail
        :priceEvaluationTableList="data.priceEvaluationTableList"
        :marketingQuotationData="data.marketingQuotationData"
        :auditFlowId="data.auditFlowId"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import { InitVersionFilterValue } from "./common/const"
import EZFilter from "@/components/EZFilter/index.vue"
import { GetVersionInfos, GetAllAuditFlowProjectNameAndVersion } from "./service"
import { formatDateTime } from "@/utils"
import versionDetail from "./versionDetail.vue"

// 获取项目已有核价流程所有项目名称以及对应版本号
const getAllAuditFlowProjectName = async () => {
  const { result } = await GetAllAuditFlowProjectNameAndVersion()
  data.verisonfilterNnum[0].options = result.map((item: any) => {
    data.versionsEnum[item.projectName] = item.versions.map((vNo: any) => ({ label: vNo, value: vNo }))
    return { label: item.projectName, value: item.projectName }
  })
  console.log(data.versionsEnum, result, "data.versionsEnum")
}

// 获取项目名称对应版本号
const getAllAuditFlowVersion = async (projectName: any) => {
  data.verisonfilterNnum[1].options = data.versionsEnum[projectName]
}

// 系统版本管理表-table数据
const data = reactive<any>({
  versionManageData: [],
  verisonfilterNnum: [
    // 版本管理 - 筛选项
    {
      label: "项目名称",
      key: "ProjectName",
      role: "select",
      options: [],
      onchange: getAllAuditFlowVersion,
      filterable: true
    },
    {
      label: "版本号",
      key: "Version",
      role: "select",
      options: []
    },
    {
      label: "流程单号",
      key: "auditFlowId"
    },
    {
      label: "单据编号",
      key: "Number"
    },
    {
      label: "拟稿时间",
      key: "DraftDate",
      role: "timePicker"
    },
    {
      label: "完成时间",
      key: "FinishedDate",
      role: "timePicker"
    }
  ],
  priceEvaluationTableList: [],
  visible: false,
  versionsEnum: {},
  marketingQuotationData: null, // 报价表
  auditFlowId: null
})

const queryTable = async (formValue: any) => {
  const { DraftDate, ProjectName, Version = 0, auditFlowId, FinishedDate } = formValue
  const { result } = await GetVersionInfos({
    ProjectName: ProjectName,
    Version,
    auditFlowId,
    DraftStartTime: DraftDate[0] || "",
    DraftEndTime: DraftDate[1] || "",
    FinishedStartTime: FinishedDate[0] || "",
    FinishedEndTime: FinishedDate[1] || "",
    Number: formValue.Number
  })

  data.versionManageData = result?.versionManageList || []
  console.log(result, "queryTable")
}

const getPriceEvaluationTableList = ({ priceEvaluationTableList, quotationTable, auditFlowId }: any) => {
  data.priceEvaluationTableList = priceEvaluationTableList
  data.marketingQuotationData = quotationTable
  data.auditFlowId = auditFlowId
  data.visible = true
}

// const pathToOperationRecord = (AuditFlowId: number) => {
//   router.push().catch((err) => {
//     console.warn(err)
//   })
// }

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  getAllAuditFlowProjectName()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

watchEffect(() => {})
</script>
<style scoped lang="scss">
.table-wrap {
  margin-top: 20px;
}
.versionManagement-wrap {
  margin: 0px 10px 20px 10px;
}
</style>
