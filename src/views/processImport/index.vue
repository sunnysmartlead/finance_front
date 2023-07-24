<template>
  <div class="electronic-import">
    <InterfaceRequiredTime :ProcessIdentifier="Host" />
    <el-card class="m-2">
      <template #header>
        <el-row align="middle" justify="space-between">
          <span>工序工时导入</span>
          <el-row align="middle">
            <el-upload
              :action=" 'api/services/app/WorkingHours/UploadExcel'"
              :on-success="handleSuccess"
              show-file-list
              :data="{ auditFlowId: data.auditFlowId }"
              :on-progress="handleGetUploadProgress"
              :on-error="handleUploadError"
            >
              <el-button type="primary" style="margin: 10px 10px 0 0">工序工时上传</el-button>
            </el-upload>
            <el-button class="m-2" type="primary" @click="downLoadTemplate">工序工时模版下载</el-button>
            <el-button class="m-2" type="primary" @click="downLoadSOR">SOR下载</el-button>
            <el-button class="m-2" type="primary" @click="downLoad3DExploded">3D爆炸图下载</el-button>
            <el-button class="m-2" type="primary" @click="downTrFile">TR-主方案下载</el-button>
            <el-button class="m-2" type="primary" @click="toModuleNumber">项目走量查看</el-button>
            <el-button class="m-2" type="primary" @click="toBomVerifyConstruction">结构bom查看</el-button>
          </el-row>
        </el-row>
      </template>
      <el-card>
        <el-table :data="data.tableData" border height="700">
          <el-table-column label="序号" prop="sequenceNumber" width="100" />
          <el-table-column label="工序" prop="procedure" width="100" />
          <el-table-column label="设备部分" class-name="columnColor1">
            <template v-for="(item, devicendex) in data.tableData?.deviceList" :key="`equipmentPart-${index}`">
              <el-table-column
                :prop="`equipmentPart.equipmentDetails[${index}].equipmentName`"
                :label="`设备${index + 1}`"
                width="180"
              />
              <el-table-column
                :prop="`equipmentPart.equipmentDetails[${index}].status`"
                :label="`设备${index + 1}状态`"
                width="180"
              />
              <el-table-column
                :prop="`equipmentPart.equipmentDetails[${index}].number`"
                :label="`设备${index + 1}数量`"
                width="180"
              />
              <el-table-column
                :prop="`equipmentPart.equipmentDetails[${index}].price`"
                :label="`设备${index + 1}单价`"
                width="180"
              />
            </template>
            <el-table-column prop="equipmentPart.total" label="设备总价" width="180" />
          </el-table-column>
          <el-table-column label="追溯部分" class-name="columnColor2">
            <template v-for="(item, index) in data.retrospectPart?.equipmentDetails" :key="`retrospectPart-${index}`">
              <el-table-column
                :prop="`retrospectPart.equipmentDetails[${index}].equipmentName`"
                :label="`设备${index + 1}`"
                width="180"
              />
              <el-table-column :prop="`retrospectPart.equipmentDetails[${index}].status`" label="状态" width="180" />
              <el-table-column :prop="`retrospectPart.equipmentDetails[${index}].number`" label="数量" width="180" />
              <el-table-column :prop="`retrospectPart.equipmentDetails[${index}].price`" label="单价" width="180" />
            </template>
            <el-table-column prop="retrospectPart.openGraphSoftware" label="开图软件" width="180" />
            <el-table-column prop="retrospectPart.openGraphSoftware" label="软件" width="180" />
            <el-table-column prop="retrospectPart.openGraphFee" label="开发费(开图)" width="180" />
            <el-table-column prop="retrospectPart.total" label="开发总价" width="180" />
          </el-table-column>
          <el-table-column label="工装治具部分" class-name="columnColor3">
            <template
              v-for="(item, index) in data.toolingFixturePart?.equipmentDetails"
              :key="`toolingFixturePart-${index}`"
            >
              <el-table-column
                :prop="`toolingFixturePart.equipmentDetails[${index}].equipmentName`"
                :label="`治具${index + 1}`"
                width="180"
              />
              <el-table-column
                :prop="`toolingFixturePart.equipmentDetails[${index}].status`"
                label="状态"
                width="180"
              />
              <el-table-column
                :prop="`toolingFixturePart.equipmentDetails[${index}].number`"
                label="数量"
                width="180"
              />
              <el-table-column
                :prop="`toolingFixturePart.equipmentDetails[${index}].price`"
                :label="`治具单价${index + 1}`"
                width="180"
              />
            </template>
            <el-table-column prop="toolingFixturePart.toolingName" label="工装名称" width="180" />
            <el-table-column prop="toolingFixturePart.toolingNum" label="数量" width="180" />
            <el-table-column prop="toolingFixturePart.toolingPrice" label="工装单价" width="180" />
            <el-table-column prop="toolingFixturePart.testName" label="测试线名称" width="180" />
            <el-table-column prop="toolingFixturePart.testNum" label="数量" width="180" />
            <el-table-column prop="toolingFixturePart.testPrice" label="线束单价" width="180" />
            <el-table-column prop="toolingFixturePart.total" label="工装治具总价" width="180" />
          </el-table-column>
          <template
            v-for="(item, index) in data.humanMachineHoursDetailList"
            :key="`humanMachineHoursDetailList-${index}`"
          >
            <el-table-column :label="item.year" class-name="columnColor4">
              <el-table-column
                :prop="`humanMachineHoursDetailList[${index}]laborTime`"
                label="标准人工工时"
                width="180"
              />
              <el-table-column
                :prop="`humanMachineHoursDetailList[${index}]machineHours`"
                label="机器工时"
                width="180"
              />
              <el-table-column
                :prop="`humanMachineHoursDetailList[${index}]personnelNumber`"
                label="人均跟线数量"
                width="180"
              />
            </el-table-column>
          </template>
        </el-table>
        <el-row align="middle" justify="end" style="margin-top: 20px">
          <!-- <el-button type="primary" @click="handleSubmit">提交</el-button> -->
          <el-button type="primary" @click="handleSaveWorkingHour" v-havedone>保存</el-button>
        </el-row>
      </el-card>
      <el-card style="margin-top: 20px">
        <template #header>
          <el-row align="middle" justify="space-between">
            <span>跟线/切线工时</span>
          </el-row>
        </template>
        <el-row align="middle" style="width: 350px; flex-wrap: nowrap">UPH值:</el-row>
        <el-input style="width: 180px" class="m-2" v-model="data.uph" type="number" placeholder="请输入UPH值" />
        <el-form :model="data.tangentForm" ref="tangentFormRef">
          <el-table :data="data.tangentForm.tangent" height="500">
            <el-table-column label="年份" prop="year" />
            <el-table-column label="人工工时" prop="`laborTime`" width="175">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`tangent.${$index}.laborTime`"
                  :rules="[{ required: true, message: '请输入人工工时', trigger: 'change' }]"
                >
                  <el-input-number v-model="row.laborTime" :min="0" controls-position="right" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="机器工时" prop="machineHours" width="175">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`tangent.${$index}.machineHours`"
                  :rules="[{ required: true, message: '请输入机器工时', trigger: 'change' }]"
                >
                  <el-input-number v-model="row.machineHours" :min="0" controls-position="right" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="人均跟线数量" prop="personnelNumber" width="175">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`tangent.${$index}.personnelNumber`"
                  :rules="[{ required: true, message: '请输入人均跟线数量', trigger: 'change' }]"
                >
                  <el-input-number v-model="row.personnelNumber" :min="0" controls-position="right" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-row align="middle" justify="end" style="margin-top: 20px">
            <el-button type="primary" @click="handleSaveTangentHours(tangentFormRef)" v-havedone>保存</el-button>
            <el-button type="warning" :disabled="!data.isSaved" @click="handleSubmit(tangentFormRef)" v-havedone
              >提交流程
            </el-button>
          </el-row>
        </el-form>
      </el-card>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref } from "vue"
import { ElMessage, UploadProps } from "element-plus"
// import { ElMessage } from "element-plus"
// import type { TabsPaneContext } from "element-plus"
import {
  downloadWorkingHoursInfo,
  SaveWorkingHour,
  SaveTangentHours,
  getTangentHoursList,
  SubmitWorkingHourAndSwitchLine,
  getYears,
  QueryWorkingHour
} from "./service"
import { downloadFile, getAuditFlowVersion } from "../trAudit/service"
import getQuery from "@/utils/getQuery"
import type { FormInstance } from "element-plus"
import router from "@/router"
import { getSorByAuditFlowId } from "@/components/CustomerSpecificity/service"
import { CommonDownloadFile } from "@/api/bom"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { GetPicture3DByAuditFlowId } from "./service"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host: string = "ManHourImport"
const { auditFlowId, productId }: any = getQuery()

const data = reactive<any>({
  tableData: [{"procedure":"11"}],
  downloadSetForm: {
    number: 0
  },
  retrospectPart: { equipmentDetails: [] }, // 追溯部分（硬件及软件开发费用）
  toolingFixturePart: { equipmentDetails: [] }, // 工装治具部分
  equipmentPart: { equipmentDetails: [] }, // 设备部分
  humanMachineHoursDetailList: [212,22],
  sop: [],
  uph: null,
  tangentForm: {
    tangent: [] // 根线/切线工时
  },
  years: [],
  isSaved: false,
  auditFlowId: null,
  fileName: "",
  picture3D: {
    fileName: "",
    id: ""
  }
})

const tangentFormRef = ref<FormInstance>()

const formatterArr = (key: string, childKey: any = "equipmentDetails") => {
  return Math.max.apply(
    null,
    data.tableData.map((item: any) => {
      if (childKey) return item[key]?.equipmentDetails.length || 0
      else return item[key]?.length || 0
    })
  )
}

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  const { success, result } = res
  if (success && result?.workingHourDetailList?.length > 0) {
    data.tableData = res.result?.workingHourDetailList
    formatTableColumnData()
    ElMessage.success("上传成功！")
  } else {
    ElMessage.error(res.error.message || "上传失败~")
  }
}

const formatTableColumnData = () => {
  console.log(data.tableData, "data.tableData")
  data.retrospectPart = {
    equipmentDetails: new Array(formatterArr("retrospectPart"))
  }
  console.log(data.retrospectPart, "data.retrospectPart")
  data.toolingFixturePart = {
    equipmentDetails: new Array(formatterArr("toolingFixturePart"))
  }
  data.equipmentPart = {
    equipmentDetails: new Array(formatterArr("equipmentPart"))
  }
  data.humanMachineHoursDetailList = data.tableData[0]?.humanMachineHoursDetailList || []
}

// 工序工时模板下载
const downLoadTemplate = async () => {
  let res: any = await downloadWorkingHoursInfo()
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = "模板文件.xlsx"
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
  // data.setVisible = false
}

// 3D爆炸图下载
const downLoad3DExploded = async () => {
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

// TR主方案下载
const downTrFile = async () => {
  let res: any = (await getAuditFlowVersion(Number(auditFlowId))) || {}
  const trFileId = res.result?.solutionFileIdentifier
  const solutionFileName = res.result?.solutionFileName
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

const getSORFileName = async () => {
  const { result }: any = await getSorByAuditFlowId(auditFlowId)
  data.sorFileName = result.sorFileName
  data.fileId = result.sorFileId
}

// SOR下载
const downLoadSOR = async () => {
  if (!data.sorFileName) return false
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

const toBomVerifyConstruction = () => {
  router.push({
    path: "/bomView/struc",
    query: {
      auditFlowId,
      productId,
      right: 1
    }
  })
}

const handleSaveWorkingHour = async () => {
  let { success }: any = await SaveWorkingHour({
    auditFlowId: Number(auditFlowId),
    productId,
    workingHourDetailList: data.tableData
  })
  if (!success) throw Error()
  ElMessage.success("请求成功！")
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  await formEl?.validate(async (valid) => {
    if (valid) {
      let { success }: any = await SubmitWorkingHourAndSwitchLine(auditFlowId)
      if (!success) throw Error()
      ElMessage.success("提交成功！")
    } else {
      ElMessage.error("请填写正确数据！")
    }
  })
}

const init = async () => {
  const { result }: any = (await QueryWorkingHour(auditFlowId, productId)) || {}
  if (result.workingHourDetailList?.length) {
    data.tableData = result.workingHourDetailList
    formatTableColumnData()
  }
}

onMounted(async () => {
  data.auditFlowId = auditFlowId
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  getSORFileName()
  getAllSop()
  init()
})

const getAllSop = async () => {
  const {
    result: { tangentHoursDetailList = [], uph }
  }: any = await getTangentHoursList(auditFlowId, productId)
  if (!tangentHoursDetailList.length) {
    // 获取年份
    const { result = [] } = (await getYears(auditFlowId)) as any
    data.tangentForm.tangent = result || []
    data.isSaved = false
    return
  }
  data.isSaved = true
  data.uph = uph
  data.tangentForm.tangent = tangentHoursDetailList || []
}

// 保存切线工时
const handleSaveTangentHours = async (formEl: any) => {
  try {
    await formEl.validate(async (valid: any, fields: any) => {
      if (valid) {
        const { success } = await SaveTangentHours({
          uph: Number(data.uph || 0),
          auditFlowId,
          productId,
          tangentHoursDetailList: data.tangentForm.tangent
        })
        if (!success) throw Error()
        ElMessage.success("请求成功！")
      } else {
        console.log("error submit!", fields)
      }
    })
  } catch {
    ElMessage.error("请填写正确表单")
  }
}
</script>

<style lang="scss" scoped>
.electronic-import {
  &__btn-container {
    margin: 20px 0;
    position: relative;
  }
}

.columnColor1 {
  color: red !important;
}
</style>
<style>
.columnColor1 {
  background-color: #409eff !important;
  color: #fff !important;
}

.columnColor2 {
  background-color: #67c23a !important;
  color: #fff !important;
}

.columnColor3 {
  background-color: #e6a23c !important;
  color: #fff !important;
}

.columnColor4 {
  background-color: #909399 !important;
  color: #fff !important;
}
</style>
