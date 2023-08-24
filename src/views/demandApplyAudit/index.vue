<template>
  <div class="demand-apply">
    <div class="demand-apply_row">
      <el-row :gutter="12">
        <el-button @click="submit(0)">保存</el-button>
        <el-button type="success" @click="submit(1)">提交</el-button>
      </el-row>
    </div>
    <div>
      <el-row class="demand-apply__card">
        <el-button type="danger" @click="submit(1)">退回</el-button>
        <el-button type="warning">导出</el-button>
        <el-button type="info">重置</el-button>
      </el-row>
    </div>
    <demandApply :isDisabled="true" />
    <el-card>
      <el-card v-for="(item, index) in schemeTableMap" :key="index">
        <template #header>
          <div class="card-header">
            <span>{{ item }}</span>
            <el-button type="primary" :style="'float:right'" @click="addScheme(schemeTableData(item))">新增</el-button>
          </div>
        </template>
        <el-table :data="schemeTableData(item)" border>
          <el-table-column type="index" width="50" />
          <el-table-column prop="solutionName" label="方案">
            <template #default="{ row }">
              <el-input
                v-model="row.solutionName"
                placeholder="请录入方案"
                @change="(val) => schemeChange(val, row.id)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="product" label="产品名称" />
          <el-table-column prop="isCOB" label="是否COB方案">
            <template #default="{ row }">
              <el-select v-model="row.isCOB">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="elecEngineerId" label="电子工程师">
            <template #default="{ row }">
              <el-select v-model="row.elecEngineerId" placeholder="请选择姓名">
                <el-option v-for="item in elecEngineerId" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="structEngineerId" label="结构工程师">
            <template #default="{ row }">
              <el-select v-model="row.structEngineerId" placeholder="请选择姓名">
                <el-option v-for="item in structEngineerId" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="isFirst" label="是否为首款产品">
            <template #default="{ row }">
              <el-select v-model="row.isFirst">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="danger" @click="deleteScheme(row.id)" :disabled="schemeTableData(item)?.length == 1"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
    <h5 />
    <el-card>
      <template #header>
        <div class="card-header">
          <span>项目设计方案</span>
          <el-button type="primary" :style="'float:right;margin:0 10px'" @click="DownloadTemplateClick()"
            >下载模版</el-button
          >
          <el-upload
            :style="'float:right;margin:0 10px'"
            :v-model:file-list="[]"
            :show-file-list="false"
            :action="$baseUrl + 'api/services/app/DemandApplyAudit/ImportData'"
            :on-success="handleSuccess"
            :on-change="handleFileChange"
            name="fileName"
            :on-progress="handleGetUploadProgress"
            :on-error="handleUploadTemplateError"
          >
            <el-button>导入模版数据</el-button>
          </el-upload>
        </div>
      </template>
      <el-table :data="designSolution" border>
        <el-table-column prop="solutionName" label="方案名称" width="150" />
        <el-table-column prop="sensor" label="SENSOR" width="150">
          <template #default="{ row }">
            <el-input v-model="row.sensor" placeholder="请录入SENSOR" />
          </template>
        </el-table-column>
        <el-table-column prop="serial" label="Serial" width="150">
          <template #default="{ row }">
            <el-input v-model="row.serial" placeholder="请录入Serial" />
          </template>
        </el-table-column>
        <el-table-column prop="lens" label="lens" width="150">
          <template #default="{ row }">
            <el-input v-model="row.lens" placeholder="请录入lens" />
          </template>
        </el-table-column>
        <el-table-column prop="isp" label="ISP" width="150">
          <template #default="{ row }">
            <el-input v-model="row.isp" placeholder="请录入ISP" />
          </template>
        </el-table-column>
        <el-table-column prop="vcsel" label="vcsel/LED" width="150">
          <template #default="{ row }">
            <el-input v-model="row.vcsel" placeholder="请录入vcsel/LED" />
          </template>
        </el-table-column>
        <el-table-column prop="mcu" label="MCU" width="150">
          <template #default="{ row }">
            <el-input v-model="row.mcu" placeholder="请录入MCU" />
          </template>
        </el-table-column>
        <el-table-column prop="connector" label="连接器" width="150">
          <template #default="{ row }">
            <el-input v-model="row.connector" placeholder="请录入连接器" />
          </template>
        </el-table-column>
        <el-table-column prop="harness" label="线束" width="150">
          <template #default="{ row }">
            <el-input v-model="row.harness" placeholder="请录入线束" />
          </template>
        </el-table-column>
        <el-table-column prop="stand" label="支架" width="150">
          <template #default="{ row }">
            <el-input v-model="row.stand" placeholder="请录入支架" />
          </template>
        </el-table-column>
        <el-table-column prop="transmissionStructure" label="传动结构" width="150">
          <template #default="{ row }">
            <el-input v-model="row.transmissionStructure" placeholder="请录入传动结构" />
          </template>
        </el-table-column>
        <el-table-column prop="productType" label="产品类型" width="150">
          <template #default="{ row }">
            <el-input v-model="row.productType" placeholder="请录入产品类型" />
          </template>
        </el-table-column>
        <el-table-column prop="processProgram" label="工艺方案" width="150">
          <template #default="{ row }">
            <el-input v-model="row.processProgram" placeholder="请录入工艺方案" />
          </template>
        </el-table-column>
        <el-table-column prop="rests" label="其他" width="150">
          <template #default="{ row }">
            <el-input v-model="row.rests" placeholder="请录入其他" />
          </template>
        </el-table-column>
        <el-table-column prop="fileId" label="上传3D爆炸图" fixed="right" width="200">
          <template #default="{ row, $index }">
            <el-upload
              v-model:file-list="fileList[$index]"
              class="upload-demo"
              :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
              :on-success="(val) => handleSuccess3D(val, row.uuid, $index)"
              :on-change="handleFileChange3D"
              :on-progress="handleGetUploadProgress"
              :on-error="handleUploadTemplateError"
              show-file-list
            >
              <el-button type="primary">点击上传3D爆炸图</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <h5 />
    <el-card>
      <template #header>
        <div class="card-header">
          <span>核价团队</span>
        </div>
      </template>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="工程技术部-工序工时录入员">
          <SearchDepartMentPerson v-model="state.quoteForm.engineerId" roleName="工程技术部-工序工时录入员" />
        </el-form-item>
        <el-form-item label="品质保证部-环境实验费录入员">
          <SearchDepartMentPerson v-model="state.quoteForm.qualityBenchId" roleName="品质保证部-环境实验费录入员" />
        </el-form-item>
        <el-form-item label="产品开发部-EMC+电性能实验费录入员">
          <SearchDepartMentPerson v-model="state.quoteForm.emcId" roleName="产品开发部-EMC+电性能实验费录入员" />
        </el-form-item>
        <el-form-item label="财务部-制造成本录入员">
          <SearchDepartMentPerson v-model="state.quoteForm.productCostInputId" roleName="财务部-制造成本录入员" />
        </el-form-item>
        <el-form-item label="生产管理部-物流成本录入员">
          <SearchDepartMentPerson v-model="state.quoteForm.productManageTimeId" roleName="生产管理部-物流成本录入员" />
        </el-form-item>
        <el-form-item label="项目核价审核员">
          <SearchDepartMentPerson v-model="state.quoteForm.auditId" :roleName="['市场部-项目课长','项目管理部-项目课长']" />
        </el-form-item>
      </el-form>
    </el-card>
    <h5 />
    <el-card>
      <template #header>
        <div class="card-header">
          <span>核价截止时间</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="营销要求核价完成时间:">
            <el-date-picker type="date" v-model="state.quoteForm.deadline" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="TR预计提交时间:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.trSubmitTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品部-电子工程师:">
            <el-date-picker type="date" placeholder="请输入预计提交时间" v-model="state.quoteForm.elecEngineerTime" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="产品部-结构工程师:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.structEngineerTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品部-EMC实验费录入员:">
            <el-date-picker type="date" placeholder="请输入预计提交时间" v-model="state.quoteForm.emcTime" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品质保证部-实验费用录入员:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.qualityBenchTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="资源管理部-电子资源开发:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.resourceElecTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资源管理部-结构资源开发:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.resourceStructTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资源部-模具费录入员:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.mouldWorkHourTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工程技术部-工序工时录入员:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.engineerWorkHourTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生产管理部-物流成本录入员:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.productManageTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制造成本录入员:">
            <el-date-picker
              type="date"
              placeholder="请输入预计提交时间"
              v-model="state.quoteForm.productCostInputTime"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch, reactive, onMounted } from "vue"
import { demandApply } from "@/views/demandApply"
import { SearchDepartMentPerson } from "@/components/SearchDepartMentPerson"
import { AuditEntering, AuditExport, DownloadTemplate, ImportData } from "./service"
import _, { forEach } from "lodash"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"
import { useRoute, useRouter } from "vue-router"
import useJump from "@/hook/useJump"
import { getUserListByRoleName } from "@/api/user"
import { downloadFileExcel } from "@/utils"
import type { UploadProps, UploadUserFile } from "element-plus"
import { handleGetUploadProgress, handleUploadTemplateError } from "@/utils/upload"
import { Response, DesignSolutionDto, FileUploadOutputDto, PricingTeamDto, SolutionTableDto, user } from "./data.type"
let route = useRoute()
let router = useRouter()
let isEdit = false
const solutionTable = ref<SolutionTableDto[]>([])
const designSolution = ref<DesignSolutionDto[]>([])
const elecEngineerId = ref<user[]>([])
const structEngineerId = ref<user[]>([])
const { closeSelectedTag } = useJump()
/**
 * 数据部分
 */
let fileList = ref<UploadUserFile[][]>([])
const options = ref<user[]>([])
const state = reactive({
  quoteForm: {
    auditFlowId: null as any, //流程Id
    engineerId: undefined, //工程技术部-工序工时录入员
    qualityBenchId: undefined, //品质保证部-实验费用录人员
    emcId: undefined, //产品开发部-EMC实验费用录入员
    productCostInputId: undefined, //财务部-制造费用录入员
    productManageTimeId: undefined, //生产管理部-物流费用录入员
    auditId: undefined, //项目核价审核员
    trSubmitTime: "", // TR预计提交时间
    elecEngineerTime: "", // 产品部-电子工程师期望完成时间
    emcTime: "", //产品部-EMC实验费录入员
    structEngineerTime: "", // 产品部-结构工程师期望完成时间
    qualityBenchTime: "", // 品质保证部-实验室费用录入员期望完成时间
    resourceElecTime: "", // // 资源管理部-电子资源开发期望完成时间
    resourceStructTime: "", // 资源管理部-结构资源开发期望完成时间
    mouldWorkHourTime: "", //资源部-模具录入员
    engineerWorkHourTime: "", // 工程技术部-工序工时录入员期望完成时间
    productManageTime: "", // 生成管理部-物流成本录入员期望完成时间
    productCostInputTime: "", // 制造成本录入员期望完成时间
    deadline: "", //营销要求核价完成时间
    option: "",

  } as PricingTeamDto
})
const getList = async () => {
  let res: any = await getUserListByRoleName("产品开发部-电子工程师")
  elecEngineerId.value = res.result.items
  console.log(elecEngineerId.value, "elecEngineerId.value")
  let res1: any = await getUserListByRoleName("产品开发部-结构工程师")
  structEngineerId.value = res1.result.items
}
onMounted(async () => {
  isEdit = true
  let query = getQuery()
  await getList()
  if (query.auditFlowId) {
    let AuditEntering: any = await AuditExport(query.auditFlowId)
    if (AuditEntering.result) {
      state.quoteForm = AuditEntering.result.pricingTeam
      designSolution.value = AuditEntering.result.designSolutionList
      var solutionTableList = AuditEntering.result.solutionTableList
      let designSchemeIsNull = designSolution.value.length
      solutionTableList.forEach((item: SolutionTableDto) => {
        if (!item.id) {
          item.id = uuidv4()
        }
        designSolution.value.forEach((p: DesignSolutionDto) => {
          if (p.solutionName == item.product) {
            p.uuid = item.id
          }
        })
        if (!designSchemeIsNull) {
          let pro = {
            uuid: item.id,
            solutionName: "",
            sensor: "",
            serial: "",
            lens: "",
            isp: "",
            vcsel: "",
            mcu: "",
            harness: "", //线束
            stand: "", //支架
            transmissionStructure: "", //传动结构
            productType: "", //产品类型
            processProgram: "", //工艺方案
            rests: "", //其他
            fileId: 0
          }
          designSolution.value.push(pro)
        }
      })
      solutionTable.value = solutionTableList
      AuditEntering.result.designSolutionList.forEach((p: DesignSolutionDto, index: number) => {
        fileList.value[index] = []
        if (p.file) {
          fileList.value[index].push({
            name: p.file.fileName ? p.file.fileName : "",
            response: {
              result: {
                fileId: p.file.fileId
              }
            }
          })
        }
      })
    }
  }
  // 查看之后还需要编辑 --
  setTimeout(() => {
    isEdit = false
  }, 2000)
})

const submit = async (submitType: number) => {
  let { auditFlowId } = route.query
  let { quoteForm } = state
  let value = {} as Response
  value.auditFlowId = auditFlowId as any
  value.pricingTeam = quoteForm as PricingTeamDto
  value.designSolutionList = _.cloneDeep(designSolution.value)
  value.solutionTableList = _.cloneDeep(solutionTable.value)
  console.log(value, "value")
  value.solutionTableList.forEach((item: any) => {
    if (!isNumeric(item.id)) {
      item.id = 0
    }
  })
  let res: any = await AuditEntering(value)
  try {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "保存成功"
      })
      closeSelectedTag(route.path)
    }
  } catch (error) {}
}
const isNumeric = (value: any) => {
  return /^\d+$/.test(value)
}
const schemeTableMap = computed(() => {
  return [...new Set(solutionTable.value?.map((p: SolutionTableDto) => p.moduleName))]
})

const schemeTableData = (item: string) => {
  return solutionTable.value.filter((p: SolutionTableDto) => p.moduleName == item)
}
const addScheme = (item: SolutionTableDto[]) => {
  let id = uuidv4()
  console.log(item, "item")
  let prop: SolutionTableDto = {
    id: id,
    productld: item[0].productld,
    moduleName: item[0].moduleName,
    solutionName: "",
    product: "",
    isCOB: false,
    elecEngineerId: null, // 电子工程师(用户ID)
    structEngineerId: null //结构工程师(用户ID)
  }
  solutionTable.value.push(prop)

  let pro: DesignSolutionDto = {
    uuid: id,
    solutionName: "",
    sensor: "",
    serial: "",
    lens: "",
    isp: "",
    vcsel: "",
    mcu: "",
    harness: "", //线束
    stand: "", //支架
    transmissionStructure: "", //传动结构
    productType: "", //产品类型
    processProgram: "", //工艺方案
    rests: "", //其他
    fileId: 0
  }

  designSolution.value.push(pro)
}
const deleteScheme = (id: any) => {
  const index = solutionTable.value.findIndex((item: SolutionTableDto) => item.id === id)
  if (index !== -1) {
    solutionTable.value.splice(index, 1)
  }

  const designSchemeindex = designSolution.value.findIndex((item: DesignSolutionDto) => item.uuid === id)
  if (designSchemeindex !== -1) {
    designSolution.value.splice(designSchemeindex, 1)
    fileList.value.splice(designSchemeindex, 1)
  }
}
const schemeChange = (value: string, id: any) => {
  const index = solutionTable.value.findIndex((item: SolutionTableDto) => item.id === id)
  let moduleNameValue = solutionTable.value[index].moduleName + "-" + value
  let schemeTableValue = solutionTable.value.filter((p: SolutionTableDto) => p.product == moduleNameValue)
  console.log(schemeTableValue)
  if (schemeTableValue.length) {
    ElMessage({
      message: "同一个模组方案名不能相同.",
      type: "warning"
    })
    return
  }
  solutionTable.value[index].product = moduleNameValue
}
const DownloadTemplateClick = async () => {
  let res = await DownloadTemplate(designSolution.value)
  await downloadFileExcel(res, "项目设计方案")
}

// 模板上传
const handleSuccess: UploadProps["onSuccess"] = async (res: any) => {
  if (!res.error) {
    if (res.result.length != solutionTable.value.length) {
      ElMessage.error("方案名称的数量于上下文不匹配")
      return
    }
    if (!compareSets(res.result, solutionTable.value)) {
      ElMessage.error("方案名称和产品名称不匹配")
      return
    }
    //进行uuid转换 防止 用户 修改方案 后于上execl传方案名不匹配
    var solutionTableList = solutionTable.value
    solutionTableList.forEach((item: SolutionTableDto) => {
      if (!item.id) {
        item.id = uuidv4()
      }
      res.result.forEach((p: any) => {
        if (p.solutionName == item.product) {
          p.uuid = item.id
        }
      })
    })
    designSolution.value = res.result || []
    ElMessage.success("上传成功！")
  } else {
    ElMessage.error(res.error.message)
  }
}
//3D爆炸图上传
const handleSuccess3D: UploadProps["onSuccess"] = async (res: any, uuid: any, index: any) => {
  if (!res.error) {
    designSolution.value.forEach((item: DesignSolutionDto) => {
      if (item.uuid == uuid) {
        item.fileId = res.result.fileId
      }
    })
    if (fileList.value[index].length == 2) fileList.value[index].splice(0, 1)
    ElMessage.success("上传成功！")
  } else {
    ElMessage.error(res.error.message)
  }
}
const compareSets = (set1: any, set2: any) => {
  const set1Ids = set1.map((item: any) => item.solutionName)
  const set2Ids = set2.map((item: any) => item.product)
  if (JSON.stringify(set1Ids) === JSON.stringify(set2Ids)) {
    return true
  }

  return false
}
const handleFileChange: UploadProps["onChange"] = (file, uploadFiles) => {
  console.log(uploadFiles)
  console.log(fileList, "fileList")
}
const handleFileChange3D: UploadProps["onChange"] = (file, uploadFiles) => {
  console.log(uploadFiles)
  console.log(fileList, "fileList")
}
watch(
  () => solutionTable.value,
  (val: SolutionTableDto[]) => {
    val.forEach((item: SolutionTableDto) => {
      designSolution.value.forEach((p: DesignSolutionDto) => {
        if (p.uuid == item.id) {
          p.solutionName = item.product
        }
      })
    })
  },
  { deep: true }
)
watch(
  () => {
    return state.quoteForm.trSubmitTime
  },
  (newValue) => {
    if (isEdit) return
    if (!state.quoteForm.trSubmitTime) return
    state.quoteForm.elecEngineerTime = dayjs(state.quoteForm.trSubmitTime).add(2, "day").format("YYYY-MM-DD")
    state.quoteForm.emcTime = dayjs(state.quoteForm.trSubmitTime).add(2, "day").format("YYYY-MM-DD")
    state.quoteForm.structEngineerTime = dayjs(state.quoteForm.trSubmitTime).add(2, "day").format("YYYY-MM-DD")
    state.quoteForm.qualityBenchTime = dayjs(state.quoteForm.trSubmitTime).add(2, "day").format("YYYY-MM-DD")
    state.quoteForm.resourceElecTime = dayjs(state.quoteForm.trSubmitTime).add(3, "day").format("YYYY-MM-DD")
    state.quoteForm.resourceStructTime = dayjs(state.quoteForm.trSubmitTime).add(3, "day").format("YYYY-MM-DD")
    state.quoteForm.engineerWorkHourTime = dayjs(state.quoteForm.trSubmitTime).add(4, "day").format("YYYY-MM-DD")
    state.quoteForm.mouldWorkHourTime = dayjs(state.quoteForm.trSubmitTime).add(4, "day").format("YYYY-MM-DD")
    state.quoteForm.productManageTime = dayjs(state.quoteForm.trSubmitTime).add(3, "day").format("YYYY-MM-DD")
    state.quoteForm.productCostInputTime = dayjs(state.quoteForm.trSubmitTime).add(5, "day").format("YYYY-MM-DD")
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
.demand-apply {
  .demand-apply__card {
    margin: 20px;
  }
  .demand-apply_row {
    float: right;
    margin: 20px;
  }
  width: 100%;
}
</style>
