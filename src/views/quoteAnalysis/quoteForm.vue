<!-- 报价单 -->
<template>
  <div class="wrap">
    <el-card m="2">
      <div>
        <el-select v-model="data.numberOfQuotations" placeholder="选择版本" style="margin-bottom: 10px">
          <el-option
            v-for="item in data.versionList"
            :key="item"
            :label="`报价次数：${item}`"
            :value="item"
            @click="init(data.solutionId)"
          />
        </el-select>
      </div>
      <!-- <el-radio-group v-model="data.solutionId" @change="init">
        <template v-for="item in data.solutionIdList" :key="item.title">
          <el-radio :label="item.id" size="large" border> 方案{{ item.version }} </el-radio>
        </template>
      </el-radio-group> -->

      <div mb-20px>
        <el-table :data="data.solutionIdList" border max-height="300px">
          <el-table-column label="版本号" width="200" align="center" prop="version" />
          <!-- <el-table-column label="提交次数" width="200" align="center" prop="ntime" /> -->
          <el-table-column label="组合方案" width="300" align="center">
            <template #default="scope">
              <div v-for="item in scope.row.solutionList" :key="item.product">
                {{ item.product }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="init(scope.row.id)" type="primary">加载该版本</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card m="2">
      <el-row justify="end">
        <el-button type="primary" @click="submit(false)" v-if="right == 2" m="2" :loading="data.loading">保存</el-button>
        <el-button type="primary" @click="submit(true)" v-if="right == 2" m="2" :loading="data.loading">提交</el-button>
        <el-button type="primary" @click="downLoad" m="2">下载报价单</el-button>
      </el-row>
      <el-descriptions>
        <el-descriptions-item label="日期：">{{ formatDateTime(data.form.creationTime) }} </el-descriptions-item>
        <el-descriptions-item label="记录编号：">{{ data.form.recordNo }}</el-descriptions-item>
        <el-descriptions-item label="版本：">V{{ data.numberOfQuotations }}</el-descriptions-item>
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
      <el-card style="margin-top: 10px" header="产品报价清单">
        <el-table :data="data.form.productQuotationListDtos" style="width: 100%" border height="500px">
          <el-table-column type="index" label="序号" width="80" fixed="left" align="center" />
          <el-table-column prop="productName" label="产品名称" align="center" />
          <el-table-column prop="year" label="年份" align="center" />
          <el-table-column prop="travelVolume" label="走量" :formatter="formatThousandths" align="center" />
          <el-table-column prop="unitPrice" label="单价（未税）" :formatter="formatThousandths" align="center" />
          <el-table-column prop="remark" label="备注" align="center">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card style="margin-top: 10px" header="NRE报价清单">
        <el-table :data="data.form.nreQuotationListDtos" style="width: 100%" border height="500px">
          <el-table-column type="index" label="序号" width="80" fixed="left" />
          <el-table-column prop="productName" label="产品名称" align="center" />
          <el-table-column label="单价（未税）" align="center">
            <el-table-column prop="travelVolume" width="175" label="走量" align="center">
              <template #default="{ row }">
                <el-input-number :min="0" v-model="row.travelVolume" />
              </template>
            </el-table-column>
            <el-table-column prop="handmadePartsFee" label="手板件费" align="center" :formatter="formatThousandths" />
            <el-table-column prop="myPropMoldCosterty" label="模具费" align="center" :formatter="formatThousandths" />
            <el-table-column
              prop="costOfToolingAndFixtures"
              label="工装治具费"
              align="center"
              :formatter="formatThousandths"
            />
            <el-table-column prop="experimentalFees" label="实验费" align="center" :formatter="formatThousandths" />
            <el-table-column prop="rdExpenses" label="研发费" align="center" :formatter="formatThousandths" />
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
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
        <el-descriptions-item label=" " :span="2"> * 无公司公章报价单为无效报价单 </el-descriptions-item>
      </el-descriptions>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-descriptions style="margin-top: 20px" title="审核" :column="1" border>
            <el-descriptions-item label="制作" :span="2">
              <el-input v-model="data.form.make" />
            </el-descriptions-item>
            <el-descriptions-item label="审核" :span="2">
              <el-input v-model="data.form.toExamine" />
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="12">
          <el-descriptions style="margin-top: 20px" title="开票资料：" :column="1" border>
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
              <el-input v-model="data.form.accountNumber" />
            </el-descriptions-item>
            <el-descriptions-item label="地址">
              <el-input v-model="data.form.address" />
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px" justify="end"> 表单编号：ZL-232-01-02 </el-row>
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
  GetExternalQuotationNumberOfQuotations
} from "./service"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"
import { useRoute } from "vue-router"
import { formatDateTime } from "@/utils"
import { formatThousandths } from "@/utils/number"
//import { fa, tr } from "element-plus/es/locale"

// const { closeSelectedTag } = useJump()
const route = useRoute()

const { auditFlowId, nodeInstanceId, right }: any = getQuery()

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
    accountName: "",
    make: "",
    isSubmit: false,
    accountNumber: ""
  },
  numberOfQuotations: 0,
  auditFlowId: 0,
  solutionId: null,
  solutionIdList: [],
  versionList: [],
  loading:false
})

const init = async (solutionId: any) => {
  data.solutionId = solutionId
  const { result } =
    (await GetExternalQuotation({
      auditFlowId,
      solutionId,
      numberOfQuotations: data.numberOfQuotations
    })) || {}
  data.form = {
    ...result,
    productQuotationListDtos: result.productQuotationListDtos || [],
    nreQuotationListDtos: result.nreQuotationListDtos || []
  }
}

onMounted(async () => {
  await fetchList()
  await fetchOptions()
  await init(data.solutionId)
})

const submit = async (IsSubmit: boolean) => {
  data.form.isSubmit = IsSubmit
  const { success } = await SaveExternalQuotation({
    ...data.form,
    numberOfQuotations: data.numberOfQuotations,
    opinion: IsSubmit ? "Done" : "Save",
    nodeInstanceId: nodeInstanceId
  })
  if (success) {
    ElMessage.success("提交成功！")
    await init(data.solutionId)
    // closeSelectedTag(route.path)
  }
}

const downLoad = async () => {
  let res: any = await DownloadExternalQuotation({
    auditFlowId,
    solutionId: data.solutionId,
    numberOfQuotations: data.numberOfQuotations
  })
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = "对外报价单.xlsx"
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}

const fetchList = async () => {
  const { result }: any = await GeCatalogue({ auditFlowId: Number(auditFlowId) })
  data.solutionIdList = result
  data.solutionId = result[0]?.id
}

const fetchOptions = async () => {
  const { result } =
    (await GetExternalQuotationNumberOfQuotations({
      auditFlowId: Number(auditFlowId),
      solutionId: Number(data.solutionId)
    })) || {}
  data.versionList = result || {}
  if (result[0]) {
    data.numberOfQuotations = result[0]
  }
}
</script>
<style scoped>
.wrap {
  /deep/ .el-radio {
    margin-bottom: 10px;
  }
}
</style>
