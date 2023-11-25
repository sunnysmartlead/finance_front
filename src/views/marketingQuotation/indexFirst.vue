<template>
  <div>
    <!-- 总经理审批1 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>报价审核表</span>
          <el-button-group float-right>
            <el-button type="primary" @click="dialogVisible = true">同意</el-button>
            <el-button type="danger" @click="dialogVisibleR = true"> 退回</el-button>
          </el-button-group>
        </div>
      </template>
      <h4 mb-20px>已保存的方案版本</h4>
      <div mb-20px>
        <el-table :data="versionList" border max-height="300px">
          <el-table-column label="版本号" width="200" align="center" prop="version" />
          <el-table-column label="提交次数" width="200" align="center" prop="ntime" />
          <el-table-column label="组合方案" width="300" align="center">
            <template #default="scope">
              <div v-for="item in scope.row.solutionList" :key="item.product">
                {{ item.product }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="selectVersion(scope.row)" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
                加载该版本</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 单价汇总 -->
      <p>单价汇总</p>
      <el-table :data="data.resa.unitPriceSum" border>
        <!-- <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.solutuionAndValues" border>
            <el-table-column label="solutionId" prop="solutionId" />
            <el-table-column label="value" prop="value" />
          </el-table>
        </template>
      </el-table-column> -->
        <el-table-column label="产品名称" prop="product" />
        <el-table-column label="价格" prop="price" />
      </el-table>
      <!-- NRE报价汇总 -->
      <p>NRE报价汇总</p>
      <el-table :data="data.resa.nreUnitSumModels" border>
        <el-table-column label="产品名称" prop="product" />
        <el-table-column label="花费" prop="cost" />
        <el-table-column label="数量" prop="number" />
      </el-table>
      <!-- nre -->
      <el-card>
        <p>报价毛利率测算-实际数量</p>
        <el-table :data="data.resa.managerApprovalOfferNres" style="width: 100%" border max-height="500px">
          <el-table-column prop="solutionName" label="方案名" />
          <el-table-column prop="offerUnitPrice" label="本次报价-单价" :formatter="formatThousandths" />
          <el-table-column prop="offerGrossMargin" label="本次报价-毛利率">
            <template #default="{ row }">
              {{ `${row.offerGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column prop="offerClientGrossMargin" label="本次报价增加客供料毛利率">
            <template #default="{ row }">
              {{ `${row.offerClientGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column prop="offerNreGrossMargin" label="本次报价剔除NRE分摊费用毛利率">
            <template #default="{ row }">
              {{ `${row.offerNreGrossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column prop="salesRevenue" label="销售收入" :formatter="formatThousandths" />
          <el-table-column prop="sellingCost" label="销售成本" :formatter="formatThousandths" />
          <el-table-column prop="sopCost" label="SOP成本" :formatter="formatThousandths" />
          <el-table-column prop="fullCost" label="全生命周期成本" :formatter="formatThousandths" />
          <!-- <el-table-column prop="equipmentMoney" label="设备金额" /> -->
        </el-table>
        <!-- nre汇总 -->
        <p>线体数量：{{ data.resa.nre.numberLine }} 共线分摊率：{{ data.resa.nre.collinearAllocationRate }}</p>
        <el-table
          :data="data.resa.nre.models"
          style="width: 100%"
          border
          max-height="500px"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column label="序号" type="index" />
          <el-table-column prop="formName" label="费用名称" />
          <el-table-column prop="pricingMoney" label="核价金额" :formatter="formatThousandths" />
          <el-table-column label="报价系数">
            <template #default="scope">
              <el-input-number
                @mousewheel.native.prevent
                v-model="scope.row.offerCoefficient"
                controls-position="right"
                @change="offerCoefficientChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="offerMoney" label="报价金额" :formatter="formatThousandths" />
          <el-table-column label="备注">
            <template #default="scope">
              <el-input v-model="scope.row.remark" type="textarea" />
            </template>
          </el-table-column>
        </el-table>
        <p>专用设备</p>
        <el-table :data="data.resa.nre.devices" style="width: 100%" border max-height="500px">
          <el-table-column prop="deviceName" label="设备名称" />
          <el-table-column prop="devicePrice" label="设备单价" />
          <el-table-column prop="number" label="设备数量" />
          <el-table-column prop="equipmentMoney" label="设备金额" />
        </el-table>
      </el-card>
      <!-- <el-row justify="end" m="2">
      <el-button @click="save" type="primary">保存</el-button>
    </el-row> -->
      <el-row justify="end" m="2">
        <el-button @click="save" type="primary">总经理审批2</el-button>
      </el-row>
    </el-card>
    <el-dialog v-model="dialogVisible" title="审批意见" width="30%" :before-close="handleClose">
      <el-input type="textarea" rows="4" v-model="confirmText" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="agreeConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisibleR" title="退回" width="30%" :before-close="handleClose">
      <el-form>
        <el-form-item label="退回因素">
          <el-select v-model="refuseReason">
            <el-option label="价格因素-退回到报价分析看板" value="Spbjclyhjb_Bjfxkb" />
            <el-option label="价格因素-退回到核价看板" value="Spbjclyhjb_Hjkb" />
          </el-select>
        </el-form-item>
        <el-form-item label="退回原因">
          <el-input type="textarea" rows="4" v-model="refuseText" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleR = false">取消</el-button>
          <el-button type="primary" @click="refuseConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"

import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import getQuery from "@/utils/getQuery"
import { getYears } from "../pmDepartment/service"
import { PostAuditQuotationListSave, GetManagerApprovalOfferOne, PostManagerApprovalOfferOneSave } from "./service"
import { GeCatalogue, SubmitNode } from "../quoteAnalysis/service"

// import { ElMessageBox } from "element-plus"

const router = useRouter()
const route = useRoute()
const { auditFlowId, nodeInstanceId } = getQuery()
/**
 * 数据部分
 */
const data = reactive<any>({
  projectName: "",
  developmentPlan: "",
  marketingQuotationData: {},
  motionMessageSop: [],
  resa: {
    unitPriceSum: [
      {
        product: "前视-AR0820",
        solutuionAndValues: [
          {
            solutionId: 115,
            value: 5
          }
        ]
      }
    ],
    nreUnitSumModels: [
      {
        product: "前视-AR0820",
        solutuionAndValues: [
          {
            solutionId: 115,
            value: 5
          }
        ]
      }
    ],
    managerApprovalOfferNres: [],
    nre: {
      solutionName: "汇总",
      solutionId: null,
      auditFlowId: 0,
      models: [
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "手板件费",
          pricingMoney: 10739378.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1245986",
          creatorUserId: null,
          id: 263
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "模具费",
          pricingMoney: 514140.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246008",
          creatorUserId: null,
          id: 264
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "生产设备费",
          pricingMoney: 51497385.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246025",
          creatorUserId: null,
          id: 265
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "工装费",
          pricingMoney: 3488767.5,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246042",
          creatorUserId: null,
          id: 266
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "治具费",
          pricingMoney: 5727840.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246058",
          creatorUserId: null,
          id: 267
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "检具费",
          pricingMoney: 0.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246075",
          creatorUserId: null,
          id: 268
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "实验费",
          pricingMoney: 5566242.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246094",
          creatorUserId: null,
          id: 269
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "测试软件费",
          pricingMoney: 2058270.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.124611",
          creatorUserId: null,
          id: 270
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "差旅费",
          pricingMoney: 73048.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246126",
          creatorUserId: null,
          id: 271
        },
        {
          auditFlowId: 337,
          solutionId: null,
          formName: "其他费用",
          pricingMoney: 3950000.0,
          offerCoefficient: 0.0,
          offerMoney: 0.0,
          remark: null,
          numberLine: 0.0,
          collinearAllocationRate: 0.0,
          version: 0,
          isDeleted: false,
          deleterUserId: null,
          deletionTime: null,
          lastModificationTime: null,
          lastModifierUserId: null,
          creationTime: "2023-11-12T15:06:04.1246146",
          creatorUserId: null,
          id: 272
        }
      ],
      devices: [],
      numberLine: 0.0,
      collinearAllocationRate: 0.0
    }
  }
})
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = "合计"
      return
    }
    if (index === 2 || index === 4) {
      const values = data.map((item: any) => Number(item[column.property]))
      if (!values.every((value: any) => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
        sums[index] = (Number(sums[index]).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
      } else {
        sums[index] = "N/A"
      }
    }
  })

  return sums
}
const columns = reactive({
  sopData: []
})
let versionChosen: any = null // 选中的以前版本
const fullscreenLoading = ref(false)
let versionList = reactive<any[]>([])
const dialogVisible = ref(false)
const dialogVisibleR = ref(false)
const confirmText = ref("")
const refuseText = ref("")
const refuseReason = ref("Spbjclyhjb_Bjfxkb")
const handleClose = () => {
  confirmText.value = ""
  refuseText.value = ""
}

const refuseConfirm = async () => {
  if (refuseText.value) {
    await SubmitNode({
      comment: refuseText.value,
      nodeInstanceId,
      financeDictionaryDetailId: refuseReason.value
    })
    dialogVisibleR.value = false
  } else {
    ElMessage.warning("退回原因必填！")
  }
}

/**
 * 同意提交流程
 */
const agreeConfirm = async () => {
  /**
   * 保存数据需要确认
   */
  // save
  let res = await SubmitNode({
    comment: confirmText.value,
    nodeInstanceId,
    financeDictionaryDetailId: "Spbjclyhjb_Yes"
  })
  if (res.success) {
    ElMessage.success("操作成功")
    dialogVisibleR.value = false
  }
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  initFetch()
  // fetchSopYear()
})

const formatMarketingQuotationDatas = (record: any, _row: any, cellValue: any) => {
  if (record.messageName.includes("%")) return `${cellValue.toFixed(2)} %`
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

const initFetch = async () => {
  if (auditFlowId) {
    let res: any = await GeCatalogue({ auditFlowId })
    res.result.forEach((item: any) => {
      versionList.push(item)
    })
  }
}
const selectVersion = async (row: any) => {
  fullscreenLoading.value = true
  try {
    versionChosen = row
    const { result } = await GetManagerApprovalOfferOne({ auditFlowId, version: versionChosen.version }) //暂时先减1 针对337
    data.resa = result
    console.log(result, "result")
    /**
     * 根据版本号查询该版本数据
     */
    fullscreenLoading.value = false
  } catch (error) {
    fullscreenLoading.value = false
  }
}
//报价值change
const offerCoefficientChange = (row: any) => {
  row.offerMoney = row.offerCoefficient * row.pricingMoney
}
// 计算含佣金的毛利率
const changeCommission = (row: any, index: number) => {
  console.log(row, index, "changeCommission")
  data.resa.biddingStrategy[index].grossMarginCommission = (1 - (row.commission + row.cost) / row.price) * 100
}

const fetchSopYear = async () => {
  const { result } = (await getYears(auditFlowId)) || {}
  columns.sopData = result || []
}

/**
 * 总经理页面1保存
 */
const save = async () => {
  let query = route.query
  let res = await PostManagerApprovalOfferOneSave(data.resa)
  console.log(res)
  router.push({ path: "/marketingQuotation/indexSecond", query: { ...query, version: versionChosen.version } })
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.demandApply-result-page {
  margin: 10px;
}
</style>
