<template>
  <el-button class="m-2" type="primary" @click="downLoadSOR">SOR下载</el-button>
  <el-button class="m-2" type="primary" @click="downTrFile">TR-主方案下载</el-button>
  <div>
    <el-card
      class="table-wrap"
      :header="`项目名称:` + projectName + ` / 版本号:` + version + ` / 项目经理:` + projectManager"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
        <div v-for="(item, index) in Timeliness.values" :key="index">
          <el-form-item :label="item.name">
            <el-input v-model="item.value" :placeholder="`请输入` + item.name" />
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

  <div class="m-2">
    <!-- <h3>时效性管理</h3> -->
    <el-card class="table-wrap" header="系统版本操作记录表">
      <el-table
        ref="multipleTable"
        :data="data.operationRecordData"
        style="width: 100%"
        border
        :span-method="arraySpanMethod"
        :row-class-name="tableRowClassName"
        @cell-mouse-leave="cellMouseLeave"
        @cell-mouse-enter="cellMouseEnter"
      >
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column type="index" label="信息流" width="150" />
        <el-table-column prop="classify" label="分类" />
        <el-table-column prop="title" label="任务标题" />
        <el-table-column prop="processName" label="界面名称" />
        <el-table-column label="节点状态">
          <template #default="scope">
            <el-tag :type="istype(scope.row.processState)">{{ isAccomplish(scope.row.processState) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="userName" label="责任人" />
        <el-table-column label="开始日期">
          <template #default="scope">
            {{ fomatterDat1e(scope.row.auditFlowOperateTimes[scope.row.auditFlowOperateTimes.length - 1]?.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="requiredTime" label="期望日期" :formatter="fomatterDate" />
        <el-table-column prop="roleName" label="修改人角色" />
        <el-table-column label="更新时间">
          <template #default="scope">
            {{
              fomatterDat1e(scope.row.auditFlowOperateTimes[scope.row.auditFlowOperateTimes.length - 1]?.lastModifyTime)
            }}
          </template>
        </el-table-column>
        <el-table-column label="以往记录">
          <template #default="scope">
            <el-popover placement="right" :width="400" trigger="click">
              <template #reference>
                <el-button style="margin-right: 16px">记录</el-button>
              </template>
              <el-table :data="scope.row.auditFlowOperateTimes">
                <el-table-column type="index" width="50" />
                <el-table-column property="startTime" label="开始时间" :formatter="fomatterDate" />
                <el-table-column property="lastModifyTime" label="结束时间" :formatter="fomatterDate" />
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted } from "vue"
import { GetAuditFlowOperateReocrd, GetTimeliness, SetTimeliness } from "./service"
import getQuery from "@/utils/getQuery"
import { formatDateTime } from "@/utils"
import nameMap from "./constant"
import { Timer } from "@element-plus/icons-vue"
import { RowJustify, TableColumnCtx } from "element-plus"
import { ElMessage } from "element-plus"
import { update } from "lodash"
import { CommonDownloadFile } from "@/api/bom"
import { downloadFile, getAuditFlowVersion } from "../trAudit/service"
import { getSorByAuditFlowId } from "@/components/CustomerSpecificity/service"
const { auditFlowId, projectName, version, projectManager }: any = getQuery()
// 系统版本操作记录表-table数据
const data = reactive<any>({
  operationRecordData: [],
  hoverOrderArr: [],
  rowIndex: "-1",
  OrderIndexArr: [],
  OrderObj: {}
})

const formInline = reactive({
  user: "",
  region: ""
})

const Timeliness = reactive<any>([])

const onSubmit = async () => {
  let { success } = await SetTimeliness({ auditFlowId: auditFlowId, data: Timeliness.values })
  if (success) {
    ElMessage.success("保存成功")
  } else {
    ElMessage.error("保存失败")
  }
}

const fomatterDate = (_record: any, _: any, val: any) => {
  return formatDateTime(val)
}

const fomatterDat1e = (val: any) => {
  return formatDateTime(val)
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
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  // 合并行  产品名字相同合并、我是合并第三列，所以合判断columnIndex是否等于2
  // if (columnIndex === 2) {
  //   if (rowIndex === 0 || row.classify != data.operationRecordData[rowIndex - 1].classify) {
  //     let rowspan = 0
  //     data.operationRecordData.forEach((element: any) => {
  //       if (element.classify === row.classify) {
  //         rowspan++
  //       }
  //     })
  //     return [rowspan, 1]
  //   } else {
  //     return [0, 0]
  //   }
  // }

  if (columnIndex === 2) {
    for (var i = 0; i < data.OrderIndexArr.length; i++) {
      var element = data.OrderIndexArr[i]
      for (var j = 0; j < element.length; j++) {
        var item = element[j]
        if (rowIndex == item) {
          if (j == 0) {
            return {
              rowspan: element.length,
              colspan: 1
            }
          } else if (j != 0) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    }
  }
}

const sortChange = async () => {
  let arr = []
  // arr.push(data.operationRecordData.filter((p: any) => p.classify == "核价需求"))
  // arr.push(data.operationRecordData.filter((p: any) => p.classify == "BOM核价"))
  // arr.push(data.operationRecordData.filter((p: any) => p.classify == "NRE核价"))
  // arr.push(data.operationRecordData.filter((p: any) => p.classify == "核价审核"))
  // arr.push(data.operationRecordData.filter((p: any) => p.classify == "报价审核"))
  // arr.push(data.operationRecordData.filter((p: any) => p.classify == "报价输出"))
  // arr.push(data.operationRecordData.filter((p: any) => p.classify == "报价归档"))
  // arr.push(
  //   data.operationRecordData.filter((p: any) => p.classify == undefined || p.classify == null || p.classify == "")
  // )
  arr.push(data.operationRecordData.filter((p: any) => p.title == "需求录入"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "核价需求审批&方案录入"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "主方案审核"))

  arr.push(data.operationRecordData.filter((p: any) => p.title == "上传电子BOM"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "电子BOM审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "上传结构BOM"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "结构BOM审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "电子单价录入"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "电子单价审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "结构单价录入"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "结构单价审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "BOM成本审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "查看初版BOM成本"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "工序工时添加"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "COB/其他制造成本录入"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "物流成本录入"))

  arr.push(data.operationRecordData.filter((p: any) => p.title == "模具费用"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "模具费审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "可靠性实验费"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "可靠性实验费审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "EMC实验费"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "EMC实验费审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "手板件/差旅费/其他费用"))

  arr.push(data.operationRecordData.filter((p: any) => p.title == "贸易合规判定"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "贸易不合规判定"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "核价看板"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "项目部课长审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "财务审核"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "项目部长查看核价表"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "核心器件成本、NRE费用拆分"))

  arr.push(data.operationRecordData.filter((p: any) => p.title == "报价分析"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "总经理审批"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "报价单"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "报价审批表"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "报价反馈"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "财务中标确认"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "总经理中标查看"))

  arr.push(data.operationRecordData.filter((p: any) => p.title == "核价表归档"))
  arr.push(data.operationRecordData.filter((p: any) => p.title == "报价审批表、报价单归档"))

  arr.push(
    data.operationRecordData.filter((p: any) => p.classify == undefined || p.classify == null || p.classify == "")
  )
  data.operationRecordData = arr.flat(Infinity)
  getOrderNumber()
}

//是否完成方法
const isAccomplish = (processState: any) => {
  switch (processState) {
    case 1:
      return "已完成"
    case 2:
      return "进行中"
    case 3:
      return "未开始"
    default:
      return "状态错误"
  }
}

const istype = (processState: any) => {
  switch (processState) {
    case 1:
      return "success"
    case 2:
      return ""
    case 3:
      return "info"
  }
}
const getOrderNumber = () => {
  data.OrderObj = {}
  data.operationRecordData.forEach(function (element: any, index: any) {
    element.rowIndex = index
    if (data.OrderObj[element.classify]) {
      data.OrderObj[element.classify].push(index)
    } else {
      data.OrderObj[element.classify] = []
      data.OrderObj[element.classify].push(index)
    }
  }, this)

  for (var k in data.OrderObj) {
    if (data.OrderObj[k].length > 1) {
      data.OrderIndexArr.push(data.OrderObj[k])
    }
  }
}
//console.log('1-开始创建组件-setup')

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
const getSORFileName = async () => {
  const { result }: any = await getSorByAuditFlowId(auditFlowId)
  data.sorFileName = result.sorFileName
  data.fileId = result.sorFileId
}
onMounted(async () => {
  init()
  getSORFileName()
  debugger
  let { result } = await GetTimeliness({ auditFlowId: auditFlowId })
  if (result) {
    Timeliness.values = result.data
  }
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})

const init = async () => {
  const { result } = await GetAuditFlowOperateReocrd({ flowId: auditFlowId })
  data.operationRecordData = result
  if (data.operationRecordData.length) {
    data.operationRecordData.forEach((item: any) => {
      item.classify = nameMap[item.processName as keyof typeof nameMap]?.classify
      item.title = nameMap[item.processName as keyof typeof nameMap]?.title
    })
  }
  // await sortChange()
}

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  var arr = data.hoverOrderArr
  for (var i = 0; i < arr.length; i++) {
    if (rowIndex == arr[i]) {
      return "success-row"
    }
  }
}

const cellMouseLeave = async (row: any, column: any, cell: any, event: any) => {
  data.rowIndex = "-1"
}

const cellMouseEnter = async (row: any, column: any, cell: any, event: any) => {
  data.rowIndex = row.rowIndex
  data.hoverOrderArr = []
  data.OrderIndexArr.forEach((element: any) => {
    if (element.indexOf(data.rowIndex) >= 0) {
      data.hoverOrderArr = element
    }
  }, this)
}
</script>
<style>
.el-table .success-row {
  background: #f5f7fa;
}
</style>
