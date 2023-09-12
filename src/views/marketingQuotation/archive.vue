<template>
  <div>
    <el-card class="marketingQuotation-page" header="报价审核表（含样品）" m="2">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="直接客户名称">
          {{ data.resa.directCustomerName }}
        </el-descriptions-item>
        <el-descriptions-item label="客户性质"> {{ data.resa.clientNature }} </el-descriptions-item>
        <el-descriptions-item label="终端客户名称">
          {{ data.resa.terminalCustomerName }}
        </el-descriptions-item>
        <el-descriptions-item label="终端客户性质">
          {{ data.resa.terminalClientNature }}
        </el-descriptions-item>
        <el-descriptions-item label="开发计划">
          <el-input v-model="data.resa.developmentPlan" />
        </el-descriptions-item>
        <el-descriptions-item label="SOP时间">
          <el-input v-model="data.resa.sopTime" />
        </el-descriptions-item>
        <el-descriptions-item label="项目生命周期">
          <el-input v-model="data.resa.projectCycle" />
        </el-descriptions-item>
        <el-descriptions-item label="销售类型">
          <el-input v-model="data.resa.forSale" />
        </el-descriptions-item>
        <el-descriptions-item label="贸易方式">
          <el-input v-model="data.resa.modeOfTrade" />
        </el-descriptions-item>
        <el-descriptions-item label="付款方式">
          <el-input v-model="data.resa.paymentMethod" />
        </el-descriptions-item>
        <el-descriptions-item label="报价币种">
          <el-input v-model="data.resa.quoteCurrency" />
        </el-descriptions-item>
        <el-descriptions-item label="汇率"> {{ data.resa.exchangeRate }} </el-descriptions-item>
      </el-descriptions>
      <el-card header="sop走量信息" m="2">
        <el-table :data="data.resa.motionMessage" border>
          <el-table-column type="index" width="100" />
          <el-table-column label="名称" prop="messageName" />
          <el-table-column
            v-for="(item, index) in data.motionMessageSop"
            :key="item.year"
            :label="item.year"
            :prop="`sop[${index}].value`"
            :formatter="formatMarketingQuotationDatas"
          />
        </el-table>
      </el-card>
      <!-- 核心部件 -->
      <el-card header="核心部件：" m="2">
        <template v-for="item in data.resa.componenSocondModels" :key="item.coreComponent">
          <el-card :header="item.componentName" class="m-2">
            <el-table :data="item.productSubclass" border>
              <el-table-column type="expand">
                <template #default="props">
                  <el-table :data="props.row.specifications" border>
                    <el-table-column label="方案名" prop="solutionname" />
                    <el-table-column label="specification" prop="specification" />
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="核心部件" prop="coreComponent" />
              <!-- <el-table-column label="型号" prop="model" /> -->
              <el-table-column label="类型" prop="type" />
              <el-table-column label="备注" prop="remark" />
            </el-table>
          </el-card>
        </template>
      </el-card>
      <!-- nre汇总 -->
      <el-card v-for="item in data.resa.nres" :key="item.solutionName">
        <p>{{ item.solutionName }}</p>
        <p>线体数量：{{ item.numberLine }} 共线分摊率：{{ item.collinearAllocationRate }}</p>
        <el-table
          :data="item.models"
          style="width: 100%"
          border
          height="500px"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column prop="index" label="序号" />
          <el-table-column prop="costName" label="费用名称" />
          <el-table-column prop="pricingMoney" label="核价金额" />
          <el-table-column label="报价系数">
            <template #default="scope">
              <el-input v-model="scope.row.offerCoefficient" type="number" />
            </template>
          </el-table-column>
          <el-table-column prop="offerMoney" label="报价金额" />
          <el-table-column label="备注">
            <template #default="scope">
              <el-input v-model="scope.row.remark" type="textarea" />
            </template>
          </el-table-column>
        </el-table>
        <p>专用设备</p>
        <el-table :data="item.devices" style="width: 100%" border height="500px">
          <el-table-column prop="deviceName" label="设备名称" />
          <el-table-column prop="devicePrice" label="设备单价" />
          <el-table-column prop="number" label="设备数量" />
          <el-table-column prop="equipmentMoney" label="设备金额" />
        </el-table>
      </el-card>

      <el-card header="内部核价信息：" m="2">
        <template v-for="item in data.resa.pricingMessage" :key="item.messageName">
          <el-card :header="item.pricingMessageName" class="m-2">
            <el-table :data="item.pricingMessageModels" border>
              <el-table-column type="expand">
                <template #default="props">
                  <el-table :data="props.row.sops" border>
                    <el-table-column label="sop" prop="sop" />
                    <el-table-column label="梯度" prop="gradientValue" />
                    <el-table-column label="全周期" prop="all" />
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="序号" type="index" width="100" />
              <el-table-column label="费用类别" prop="name" />
              <el-table-column label="成本值" prop="costValue" :formatter="formatThousandths" />
            </el-table>
          </el-card>
        </template>
      </el-card>
      <el-card header="报价策略：" m="2">
        <el-table :data="data.resa.biddingStrategySecondModels" border>
          <el-table-column type="index" width="100" />
          <el-table-column label="产品" prop="product" />
          <el-table-column label="Sop年成本" prop="sopCost" />
          <el-table-column label="全生命周期成本" prop="fullLifeCyclecost" />
          <el-table-column label="毛利率" prop="grossMargin">
            <template #default="{ row }">
              {{ `${row.grossMargin?.toFixed(2) || 0} %` }}
            </template>
          </el-table-column>
          <el-table-column label="Sop年毛利率" prop="sopGrossMargin">
            <template #default="{ row }">
              {{ `${row.sopGrossMargin?.toFixed(2) || 0} %` }}
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="price" />
          <el-table-column label="佣金" prop="commission" width="180">
            <template #default="scope">
              <el-input-number
                controls-position="right"
                v-model="scope.row.commission"
                placeholder="请输入佣金"
                @change="(val: any) => changeCommission(scope.row, scope.$index)"
                :min="0"
              />
            </template>
          </el-table-column>
          <el-table-column label="含佣金的毛利率" prop="grossMarginCommission">
            <template #default="{ row }">
              {{ `${row.grossMarginCommission?.toFixed(2) || 0} %` }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 样品 -->
      <p>样品报价</p>
      <el-card v-for="sample in data.resa.sampleOffer" :key="sample.solutionName">
        <span>{{ sample.solutionName }}</span>
        <el-table :data="sample.onlySampleModels" style="width: 100%" border height="500px">
          <el-table-column prop="sampleName" label="样品阶段" />
          <el-table-column prop="pcs" label="需求量（pcs）" />
          <el-table-column prop="cost" label="成本" />
          <el-table-column prop="unitPrice" label="单价" />
          <el-table-column prop="grossMargin" label="毛利率" />
          <el-table-column prop="salesRevenue" label="销售收入" />
        </el-table>
      </el-card>
      <el-row justify="end" style="margin-top: 20px">
        <div v-if="data.userInfo.userJobs === '总经理'">
          <!-- <el-button type="primary" @click="handleGeneralManagerQuoteCheck(true)" v-havedone>同意</el-button>
          <el-button type="danger" @click="handleGeneralManagerQuoteCheck(false)" v-havedone>拒绝</el-button> -->
          <ProcessVertifyBox :onSubmit="handleSubmit" />
        </div>
      </el-row>
    </el-card>
    <el-dialog v-model="dialogVisible" title="3D爆炸图下载(请选择零件)" width="40%" align-center>
      <el-space wrap>
        <div v-for="prop in ProductByAuditFlowId" :key="prop">
          <el-button type="success" plain @click="downLoad3D(prop.id)">{{ prop.product }}</el-button>
        </div>
      </el-space>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { GetQuotationList, PostAuditQuotationList } from "./service"
import getQuery from "@/utils/getQuery"
import { getYears } from "../pmDepartment/service"
import { ElMessageBox, ElMessage } from "element-plus"
import useJump from "@/hook/useJump"
import { useRouter } from "vue-router"
import { CommonDownloadFile } from "@/api/bom"
import { GetPicture3DByAuditFlowId, getProductByAuditFlowId } from "../processImport/service"
import { getSorByAuditFlowId } from "@/components/CustomerSpecificity/service"
import { downloadFile, getAuditFlowVersion } from "../trAudit/service"
import { useRoute } from "vue-router"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"

const router = useRouter()
const query = useJump()
const route = useRoute()
const { closeSelectedTag, jumpPage } = query

const { auditFlowId = 1 }: any = getQuery()
const dialogVisible = ref(false)
const ProductByAuditFlowId = ref<any>({})
/**
 * 数据部分
 */
const data = reactive<any>({
  resa: {
    date: "2023-09-02T18:02:33.445Z",
    recordNumber: "string", //
    versions: 0,
    offerForm: "string", //报价形式
    sampleQuotationType: "string", //样品报价类型
    directCustomerName: "string", //直接客户名称
    clientNature: "string", //客户性质
    terminalCustomerName: "string", //终端客户名称
    terminalClientNature: "string", //终端客户性质
    developmentPlan: "string", //开发计划
    sopTime: 0, //Sop时间
    projectCycle: 0, //项目声明周期
    forSale: "string", //销售类型
    modeOfTrade: "string", //贸易方式
    paymentMethod: "string", //付款方式
    quoteCurrency: "string", //报价币种
    exchangeRate: 0, //汇率
    ///
    motionMessage: [
      //走量信息
      {
        messageName: "string", //名称
        sop: [
          {
            year: 0, //
            value: 0
          }
        ]
      }
    ],
    projectName: "string", //项目名称
    nres: [
      {
        solutionName: "string", //方案名
        solutionId: 0, //
        auditFlowId: 0, //
        models: [
          {
            id: 0, //
            formName: "string", //表单名称
            pricingMoney: 0, //核价金额
            offerCoefficient: 0, //报价系数
            offerMoney: 0, //报价金额
            remark: "string" //备注
          }
        ],
        devices: [
          //
          {
            deviceName: "string",
            devicePrice: 0,
            number: 0,
            equipmentMoney: 0
          }
        ],
        numberLine: 0, //线体数量
        collinearAllocationRate: 0 //共线分摊率
      }
    ],
    sampleOffer: [
      //样品报价
      {
        solutionName: "string",
        auditFlowId: 0,
        solutionId: 0,
        onlySampleModels: [
          {
            sampleName: "string",
            pcs: 0,
            cost: 0,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0
          }
        ]
      }
    ],
    componenSocondModels: [
      //核心部件
      {
        coreComponent: "string", //核心部件
        type: "string",
        remark: "string",
        specifications: [
          {
            solutionname: "string", //方案名
            specification: "string"
          }
        ]
      }
    ],
    pricingMessageSecondModels: [
      //内部核价信息
      {
        solutionName: "string",
        solutionId: "string",
        name: "string",
        sops: [
          {
            gradientValue: 0, //梯度
            sop: 0, //sop值
            all: 0 //全周期
          }
        ]
      }
    ],
    biddingStrategySecondModels: [
      //报价策略
      {
        gradientId: 0,
        productId: 0,
        product: "string",
        sopCost: 0, //Sop年成本
        fullLifeCyclecost: 0, //全生命周期成本
        grossMargin: 0, //毛利率
        price: 0, //价格
        commission: 0, //佣金
        sopGrossMargin: 0, //Sop年毛利率
        grossMarginCommission: 0 //含佣金的毛利率
      }
    ]
  }
})

const columns = reactive({
  sopData: []
})

const getSummaries = (param) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计"
      return
    }
    if (index === 2 || index === 4) {
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
      } else {
        sums[index] = "N/A"
      }
    }
  })

  return sums
}
const formatter = (_record: any, _row: any, cellValue: any) => {
  return Number(cellValue).toFixed(2)
}
const formatterP = (_record: any, _row: any, cellValue: any) => {
  return Number(cellValue).toFixed(2) + "%"
}
const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}
onBeforeMount(() => {
  if (data.userInfo.userJobs === "总经理") {
    data.isShowBtn = true
  }
  let userRole = data.userInfo.userRole.items.map((item: any) => item.name)
  if (userRole.includes("财务部-财务参数录入员")) {
    data.isShowBtn = true
  }
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  initFetch()
  fetchSopYear()
})

const initFetch = async () => {
  const { result } = await GetQuotationList({ Id: auditFlowId })
  data.marketingQuotationData = result
  data.motionMessageSop = result.motionMessage[0].sop.map((item: any) => item)
  console.log(result, "result")
}

const fetchSopYear = async () => {
  const { result } = (await getYears(auditFlowId)) || {}
  columns.sopData = result || []
}

const formatMarketingQuotationDatas = (record: any, _row: any, cellValue: any) => {
  if (record.messageName.includes("%")) return `${cellValue.toFixed(2)} %`
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const handleSubmit = async ({ comment, opinion, nodeInstanceId }: any) => {
  const { success } = await PostAuditQuotationList({
    ...data.marketingQuotationData,
    isPass: !opinion.includes("_No"),
    auditFlowId,
    backReason: comment,
    comment,
    nodeInstanceId
  })
  if (success) {
    ElMessage.success("操作成功")
    closeSelectedTag(route.path)
  }
}
const toProductPriceList = () => {
  router.push({
    path: "/nupriceManagement/productPriceList",
    query: {
      auditFlowId,
      disabled: 1
    }
  })
}

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

// TR主方案下载
const downTrFile = async () => {
  let res: any = await getAuditFlowVersion(Number(auditFlowId))
  const trFileId = res.result.solutionFileIdentifier
  const solutionFileName = res.result.solutionFileName
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

// 3D爆炸图下载
const downLoad3DExploded = async () => {
  const { result }: any = await getProductByAuditFlowId(auditFlowId)
  ProductByAuditFlowId.value = result
  dialogVisible.value = true
}

const downLoad3D = async (productId: any) => {
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
  dialogVisible.value = false
}

// nre 合计
const calculationNre = (key: string) => {
  const count = data.marketingQuotationData.expensesStatement.map((item: any) => item[key]) || []
  if (!count.length) return 0
  const total = count.reduce((a: number, b: number) => a + b)
  return formatThousandths(null, null, total)
}

const toNREPriceList = () => {
  router.push({
    path: "/nre/nrePricelist",
    query: {
      auditFlowId,
      hideBtn: 1
    }
  })
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
* {
  font-size: 20px;
}
</style>
