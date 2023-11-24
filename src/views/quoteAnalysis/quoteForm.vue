<!-- 报价单 -->
<template>
  <div>
    <el-card m="2">
      <el-radio-group v-model="data.solutionId" @change="init">
      <template v-for="item in data.solutionIdList" :key="item.title">
        <el-radio :label="item.id" size="large" border>
          方案{{ item.version }}
        </el-radio>
      </template>
    </el-radio-group>
    </el-card>
    <el-card m="2" >
      <el-row justify="end">
        <el-button type="primary" @click="submit" m="2">提交</el-button>
        <el-button type="primary" @click="downLoad" m="2">下载报价单</el-button>
      </el-row>
      <el-descriptions >
        <el-descriptions-item label="日期：">{{ formatDateTime(data.form.creationTime) }} </el-descriptions-item>
        <el-descriptions-item label="记录编号：">{{  data.form.recordNo }}</el-descriptions-item>
        <el-descriptions-item  label="版本：">V{{data.form.numberOfQuotations }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="客户名称">
          <el-input v-model="data.form.customerName" />
        </el-descriptions-item>
        <el-descriptions-item label="报价单位">
          <el-input v-model="data.form.quotationName" />
        </el-descriptions-item>
        <el-descriptions-item label="客户地址">
          <el-input v-model="data.form.customerAdd" />
        </el-descriptions-item>
        <el-descriptions-item label="地址（报价单位）">
          <el-input v-model="data.form.quotationAdd" />
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          <el-input v-model="data.form.customerLink" />
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          <el-input v-model="data.form.quotationLink" />
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          <el-input v-model="data.form.customerNum" />
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          <el-input v-model="data.form.quotationNum" />
        </el-descriptions-item>
        <el-descriptions-item label="项目名称">
          <el-input v-model="data.form.projectName" />
        </el-descriptions-item>
        <el-descriptions-item label="项目生命周期">
          <el-input v-model="data.form.projectCycle" />
        </el-descriptions-item>
        <el-descriptions-item label="项目SOP时间">
          <el-input v-model="data.form.sopTime" />
        </el-descriptions-item>
        <el-descriptions-item label="报价币种">
          <el-input v-model="data.form.currency" />
        </el-descriptions-item>
      </el-descriptions>
      <el-card style="margin-top: 10px;" header="产品报价清单">
        <el-table :data="data.form.productQuotationListDtos" style="width: 100%" border height="500px">
          <el-table-column type="index" label="序号" width="80" fixed="left" />
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column prop="year" label="年份" />
          <el-table-column prop="travelVolume" label="走量" />
          <el-table-column prop="unitPrice" label="单价（未税）" />
          <el-table-column prop="remark" label="备注" >
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card style="margin-top: 10px;" header="NRE报价清单">
        <el-table :data="data.form.nreQuotationListDtos" style="width: 100%" border height="500px">
          <el-table-column type="index" label="序号" width="80" fixed="left" />
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column prop="travelVolume" label="走量" />
          <el-table-column prop="handmadePartsFee" label="手板件费" />
          <el-table-column prop="myPropMoldCosterty" label="模具费" />
          <el-table-column prop="costOfToolingAndFixtures" label="工装治具费" />
          <el-table-column prop="experimentalFees" label="实验费" />
          <el-table-column prop="remark" label="备注" >
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="备注">
          <el-input v-model="data.form.remark" />
        </el-descriptions-item>
        <el-descriptions-item label=" " :span="2">
          * 无公司公章报价单为无效报价单
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-top: 20px;" title="开票资料" :column="2" border>
        <el-descriptions-item label="制作">
          <el-input v-model="data.form.make" />
        </el-descriptions-item>
        <el-descriptions-item label="审核">
          <el-input v-model="data.form.toExamine" />
        </el-descriptions-item>
        <el-descriptions-item label="户名">
          <el-input v-model="data.form.accountName" />
        </el-descriptions-item>
        <el-descriptions-item label="税号">
          <el-input v-model="data.form.dutyParagraph" />
        </el-descriptions-item>
        <el-descriptions-item label="开户行">
          <el-input v-model="data.form.bankOfDeposit" />
        </el-descriptions-item>
        <el-descriptions-item label="账号">
          <el-input v-model="data.form.quotationLink" />
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          <el-input v-model="data.form.address" />
        </el-descriptions-item>
      </el-descriptions>
      <el-row style="margin-top: 20px;" justify="end">
        表单编号：ZL-232-01-02
      </el-row>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue"
import {
  GetExternalQuotation,
  SaveExternalQuotation,
  DownloadExternalQuotation,
  GeCatalogue,
} from "./service"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"
import useJump from "@/hook/useJump"
import { useRoute } from "vue-router"
import { formatDateTime } from "@/utils"

const { closeSelectedTag } = useJump()
const route = useRoute()

const { auditFlowId, numberOfQuotations = 1 }: any = getQuery()

const data = reactive({
  form: {
    productQuotationListDtos: [],
    bankOfDeposit: null,
    nreQuotationListDtos: [],
    customerName: "理想",
    address: null,
    customerLink: null,
    customerNum: null,
    quotationName: null,
    quotationAdd: null,
    quotationLink: null,
    quotationNum: null,
    projectCycle: 3,
    projectName: "流程测试OK，测试数据1",
    sopTime: 2024,
    currency: "",
    remark: "",
    customerAdd: "",
    creationTime: "",
    recordNo: "",
    numberOfQuotations: "",
    accountName: "",
    make: "",
  },
  auditFlowId: 0,
  solutionId: null,
  solutionIdList: []
})

const init = async (solutionId: any) => {
  const { result } = await GetExternalQuotation({
    auditFlowId,
    solutionId,
    numberOfQuotations,
  }) || {}
  data.form = {
    ...result,
    productQuotationListDtos: result.productQuotationListDtos || [],
    nreQuotationListDtos: result.nreQuotationListDtos || [],
  }
}

onMounted(() => {
  fetchList()
})


const submit = async () => {
  const { success } = await SaveExternalQuotation({
    ...data.form,
  })
  if (success) {
    ElMessage.success('提交成功！')
    closeSelectedTag(route.path)
  }
}

const downLoad = async () => {
  let res: any = await DownloadExternalQuotation({
    auditFlowId,
    solutionId: data.solutionId,
    numberOfQuotations,
  })
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = "成本信息表.xlsx"
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}

const fetchList = async () => {
  const { result }: any = await GeCatalogue({ auditFlowId: Number(auditFlowId) })
  data.solutionIdList = result
  data.solutionId = result[0]?.id
  init(result[0]?.id)
}
</script>
<style scoped></style>
