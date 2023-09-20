<!-- 财务中标确认、总经理中标查看、总经理审批2的界面是一样的 -->
<template>
  <div>
    <el-card header="总经理审批2">
      <div style="margin: 20px 0; float: right" v-if="data.isShowBtn">
        <el-button class="m-2" type="primary" @click="downLoadSOR">SOR下载</el-button>
        <el-button class="m-2" type="primary" @click="downLoad3DExploded">3D爆炸图下载</el-button>
        <el-button class="m-2" type="primary" @click="downTrFile">TR-主方案下载</el-button>
        <el-button type="primary" @click="jumpToAnalysis">点击查看报价分析看板</el-button>
        <el-button class="m-2" type="primary" @click="jumpToElec">点击查看电子料返利金额</el-button>
        <el-button class="m-2" type="primary" @click="jumpToStru">点击查看结构料返利金额</el-button>
        <el-button class="m-2" @click="toNREPriceList" type="primary">在线预览NRE核价表</el-button>
        <el-button class="m-2" @click="toProductPriceList" type="primary">在线预览核价表</el-button>
      </div>
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
      <!-- sop走量信息 -->
      <el-card header="sop走量信息" m="2">
        <div v-for="item in data.resa.motionMessage" :key="item.messageName">
          <p>{{ item.messageName }}</p>
          <el-table :data="item.sop" border>
            <el-table-column type="index" width="100" />
            <el-table-column prop="year" label="年份" />
            <el-table-column prop="value" />
            <el-table-column prop="sopValue" label="sop" />
            <el-table-column prop="fullValue" />
            <!-- <el-table-column label="梯度" prop="messageName" /> -->
          </el-table>
        </div>
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
      <!-- nre汇总 只有单个nre表格 字段可能需要变动 -->
      <!-- <el-card>
        <p>{{ item.analyseBoardNreDto.solutionName }}</p>
        <p>
          线体数量：{{ item.analyseBoardNreDto.numberLine }} 共线分摊率：{{
            item.analyseBoardNreDto.collinearAllocationRate
          }}
        </p>
        <el-table
          :data="item.analyseBoardNreDto.models"
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
        <el-table :data="item.analyseBoardNreDto.devices" style="width: 100%" border height="500px">
          <el-table-column prop="deviceName" label="设备名称" />
          <el-table-column prop="devicePrice" label="设备单价" />
          <el-table-column prop="number" label="设备数量" />
          <el-table-column prop="equipmentMoney" label="设备金额" />
        </el-table>
      </el-card> -->

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
              <el-input-number controls-position="right" v-model="scope.row.commission" placeholder="请输入佣金"
                @change="(val: any) => changeCommission(scope.row, scope.$index)" :min="0" />
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
import { GetQuotationList, PostAuditQuotationList, GetManagerApprovalOfferTwo } from "./service"
import { getAcceptanceBid, getBidView } from "../quoteAnalysis/service"
import getQuery from "@/utils/getQuery"
// import { getYears } from "../pmDepartment/service"
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

const { auditFlowId } = getQuery()
const dialogVisible = ref(false)
const ProductByAuditFlowId = ref<any>({})
/**
 * 数据部分
 */
const data = reactive<any>({
  projectName: "",
  developmentPlan: "",
  userInfo: JSON.parse(window.localStorage.getItem("user") || ""),
  marketingQuotationData: {
    motionMessage: [],
    expensesStatement: []
  },
  motionMessageSop: [],
  isShowBtn: false,
  sor: {
    sorFileName: "",
    fileId: null
  },
  resa: {
    date: "2023-09-14T02:04:14.3874625+08:00",
    recordNumber: null,
    versions: 0,
    offerForm: null,
    sampleQuotationType: null,
    directCustomerName: "理想",
    clientNature: null,
    terminalCustomerName: "理想",
    terminalClientNature: null,
    developmentPlan: null,
    sopTime: 0,
    projectCycle: 0,
    forSale: null,
    modeOfTrade: null,
    paymentMethod: null,
    quoteCurrency: null,
    exchangeRate: 0,
    motionMessage: [
      {
        messageName: "25K/Y",
        sop: [
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          }
        ]
      },
      {
        messageName: "35K/Y",
        sop: [
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          },
          {
            year: 0,
            value: 0,
            sopValue: 0,
            fullValue: 0
          }
        ]
      }
    ],
    projectName: null,
    nres: null,
    sampleOffer: [
      {
        solutionName: "AR0820",
        auditFlowId: 0,
        solutionId: 0,
        onlySampleModels: [
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_A",
            pcs: 200,
            cost: 1866.5904956533818,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-14T02:04:17.9590589+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_B",
            pcs: 300,
            cost: 1866.5904956533818,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-14T02:04:17.9594331+08:00",
            creatorUserId: null,
            id: 0
          },
          {
            auditFlowId: 0,
            solutionId: 0,
            name: "SampleName_C",
            pcs: 400,
            cost: 1866.5904956533818,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0,
            isDeleted: false,
            deleterUserId: null,
            deletionTime: null,
            lastModificationTime: null,
            lastModifierUserId: null,
            creationTime: "2023-09-14T02:04:17.959434+08:00",
            creatorUserId: null,
            id: 0
          }
        ]
      }
    ],
    componenSocondModels: [
      {
        coreComponent: "Sensor",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "Lens",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "ISP",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "串行芯片",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      },
      {
        coreComponent: "线缆",
        type: null,
        remark: null,
        specifications: [
          {
            solutionname: "AR0820",
            specification: "12"
          }
        ]
      }
    ],
    pricingMessageSecondModels: null,
    biddingStrategySecondModels: [
      {
        gradientId: 202,
        gradient: "25K/Y",
        productId: 0,
        product: "前视-AR0820",
        sopCost: 1,
        fullLifeCyclecost: 2,
        salesRevenue: 0,
        sellingCost: 0,
        grossMargin: 0,
        price: 1,
        commission: 0,
        sopGrossMargin: 23,
        grossMarginCommission: 0,
        totallifeCyclegrossMargin: 12,
        clientGrossMargin: 23,
        nreGrossMargin: 10
      },
      {
        gradientId: 203,
        gradient: "35K/Y",
        productId: 0,
        product: "前视-AR0820",
        sopCost: 1,
        fullLifeCyclecost: 2,
        salesRevenue: 0,
        sellingCost: 0,
        grossMargin: 0,
        price: 1,
        commission: 0,
        sopGrossMargin: 23,
        grossMarginCommission: 0,
        totallifeCyclegrossMargin: 12,
        clientGrossMargin: 23,
        nreGrossMargin: 10
      }
    ]
  },
  targetUrl: null,
  success: true,
  error: null,
  unAuthorizedRequest: false,
  __abp: true
})

// const columns = reactive({
//   sopData: []
// })
// const formatter = (_record: any, _row: any, cellValue: any) => {
//   return Number(cellValue).toFixed(2)
// }
// const formatterP = (_record: any, _row: any, cellValue: any) => {
//   return Number(cellValue).toFixed(2) + "%"
// }
const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}
// 计算含佣金的毛利率
const changeCommission = (row: any, index: number) => {
  console.log(row, index, "changeCommission")
  // data.marketingQuotationData.biddingStrategy[index].grossMarginCommission =
  //   (1 - (row.commission + row.cost) / row.price) * 100
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
  // fetchSopYear()
})
const jumpToAnalysis = () => {
  jumpPage("/quoteAnalysis/index", {
    auditFlowId
  })
}
const jumpToElec = () => {
  jumpPage("/bomVerify/electronic", {
    auditFlowId,
    right: 1
  })
}
const jumpToStru = () => {
  jumpPage("/bomVerify/construction", {
    auditFlowId,
    right: 1
  })
}
// const initFetch = async () => {
//   const { result } = await GetQuotationList({ Id: auditFlowId })
//   data.marketingQuotationData = result
//   data.motionMessageSop = result.motionMessage[0].sop.map((item: any) => item)
//   console.log(result, "result")
// }

// const fetchSopYear = async () => {
//   const { result } = (await getYears(auditFlowId)) || {}
//   columns.sopData = result || []
// }

const initFetch = async () => {
  if (auditFlowId) {
    // 总经理审批2
    const { result } = await GetManagerApprovalOfferTwo(auditFlowId)
    // 总经理中标查看
    // const { result } = await getAcceptanceBid(auditFlowId)
    // 中标确认
    // const { result } = await getAcceptanceBid(auditFlowId)
    data.resa = result
    console.log(result, "result")
  }
}
const formatMarketingQuotationDatas = (record: any, _row: any, cellValue: any) => {
  if (record.messageName.includes("%")) return `${cellValue.toFixed(2)} %`
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

// const handleGeneralManagerQuoteCheck = (isAgree: boolean) => {
//   let text = isAgree ? "您确定要同意嘛？" : "请输入拒绝理由"
//   ElMessageBox[!isAgree ? "prompt" : "confirm"](text, "报价审核", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning"
//   }).then(async (val) => {
//     if (!isAgree && !val?.value) {
//       ElMessage.warning("拒绝理由必填")
//       return
//     }
//     const { success } = await PostAuditQuotationList({
//       ...data.marketingQuotationData,
//       isPass: isAgree,
//       auditFlowId,
//       backReason: !isAgree ? val?.value : ""
//     })
//     if (success) {
//       ElMessage.success("操作成功")
//       closeSelectedTag(route.path)
//     }
//   })
// }
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

watchEffect(() => { })
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}

* {
  font-size: 20px;
}
</style>
