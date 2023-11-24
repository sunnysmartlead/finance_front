<template>
  <div class="versionManagement-wrap">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="关闭流程" name="first">
        <EZFilter
          :filterNnum="data.verisonfilterNnum"
          :show-btn="true"
          :initFilterValue="InitVersionFilterValue"
          :onSubmit="queryTable"
        />
        <el-card class="table-wrap" header="系统版本管理表">
          <el-table
            ref="multipleTableRef"
            :data="data.versionManageData"
            :header-cell-class-name="cellClass"
            style="width: 100%"
            @select="checkSelect"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="versionBasicInfo.projectName" label="项目名称">
              <template #default="{ row }">
                <el-button type="primary" link>
                  <a
                    target="_blank"
                    :href="`/timeliness/operationRecord?AuditFlowId=${row.versionBasicInfo?.auditFlowId}`"
                  >
                    {{ row.versionBasicInfo.projectName }}
                  </a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="versionBasicInfo.number" label="单据号" />
            <el-table-column prop="versionBasicInfo.version" label="版本号" />
            <el-table-column prop="versionBasicInfo.auditFlowId" label="流程单号" />
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

            <!-- <el-table-column label="操作" fixed="right">
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
        </el-table-column> -->
          </el-table>
        </el-card>
        <el-dialog title="报表汇总" width="80%" v-model="data.visible">
          <versionDetail
            :priceEvaluationTableList="data.priceEvaluationTableList"
            :marketingQuotationData="data.marketingQuotationData"
            :auditFlowId="data.auditFlowId"
          />
        </el-dialog>
        <el-row justify="end" style="margin-top: 20px">
          <div>
            <el-button type="danger" @click="dialogVisibleTrue">删除</el-button>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="查询关闭的流程" name="second">
        <el-card class="table-wrap" header="关闭的流程">
          <el-table :data="data.AuditFlowDeleteList" style="width: 100%" height="650">
            <el-table-column prop="auditFlowId" label="流程id" />
            <el-table-column prop="auditFlowName" label="项目名称" />
            <el-table-column prop="number" label="单据号" />
            <el-table-column prop="auditFlowVersion" label="版本" />
            <el-table-column prop="deleteReason" label="删除理由" />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible" title="删除流程提醒" width="30%" align-center>
      <div>
        <div>您确定要删除{{ data.checkFlow.projectName }} 版本号为{{ data.checkFlow.version }}这条流程嘛</div>
        <div style="margin: 10px 0">拒绝理由：</div>
        <el-input type="textarea" v-model="opinionDescription" />
      </div>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="closeFlow">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { InitVersionFilterValue } from "./common/const"
import EZFilter from "@/components/EZFilter/index.vue"
import {
  GetVersionInfos,
  GetAllAuditFlowProjectNameAndVersion,
  DeleteAuditFlowById,
  GetAuditFlowDeleteList
} from "./service"
import { formatDateTime } from "@/utils"
import versionDetail from "./versionDetail.vue"
import { ElTable, ElMessageBox, ElMessage } from "element-plus"
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const activeName = ref("first")
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
let dialogVisible = ref(false)
let opinionDescription = ref("")
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
      filterable:true
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
  auditFlowId: null,
  checkFlow: {},
  AuditFlowDeleteList: []
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

const checkSelect = (selection: any, row: any) => {
  console.log(selection)
  multipleTableRef.value!.clearSelection() // 清空所有选择
  multipleTableRef.value!.toggleRowSelection(row, true) //  选中当前选择
  data.checkFlow = row.versionBasicInfo
}

const cellClass = (row: any) => {
  if (row.columnIndex === 0) return "DisableSelection"
  return "ShowSelection"
}

const AuditFlowDeleteList = async (auditFlowId: number) => {
  let { result } = await GetAuditFlowDeleteList({ auditFlowId })
  data.AuditFlowDeleteList = result
}

const closeFlow = async () => {
  const prop = data.checkFlow
  ElMessageBox["confirm"]("确定执行该操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    if (opinionDescription.value) {
      const { success, error } = await DeleteAuditFlowById({
        auditFlowId: prop.auditFlowId,
        deleteReason: opinionDescription.value
      })
      if (success) {
        ElMessage({
          type: "success",
          message: "删除成功"
        })
        dialogVisible.value = false
        data.versionManageData = data.versionManageData.filter((item: any) => {
          return item.versionBasicInfo.auditFlowId != prop.auditFlowId
        })
      }
    } else {
      ElMessage({
        type: "warning",
        message: "拒绝理由必填"
      })
    }
  })
}

const dialogVisibleTrue = async () => {
  const prop = data.checkFlow
  if (Object.keys(prop).length) {
    dialogVisible.value = true
  } else {
    ElMessage({
      message: "必须选择一条流程删除进行删除",
      type: "warning"
    })
  }
}

// const getPriceEvaluationTableList = ({ priceEvaluationTableList, quotationTable, auditFlowId }: any) => {
//   data.priceEvaluationTableList = priceEvaluationTableList
//   data.marketingQuotationData = quotationTable
//   data.auditFlowId = auditFlowId
//   data.visible = true
// }

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
  AuditFlowDeleteList()
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
<style scoped>
.el-table /deep/ .DisableSelection > .cell {
  display: none;
}
.el-table /deep/ .ShowSelection > .cell {
  display: block;
}
</style>
