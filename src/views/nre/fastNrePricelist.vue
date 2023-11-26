<template>
  <el-card m="2">
    <el-row justify="end">
      <!-- <el-button type="primary" class="m-2" @click="handleFethNreTableDownload" v-if="!hideBtn">NRE核价表下载</el-button> -->
      <el-upload
        :action="$baseUrl + 'api/services/app/NrePricing/FastQueryNreExecl'"
        :on-success="handleSuccess"
        :on-error="handleUploadError"
        show-file-list
        :on-progress="handleGetUploadProgress"
      >
        <el-button :style="{ margin: '7px' }" type="primary">上传Nre核价表</el-button>
      </el-upload>
      <el-button type="primary" class="m-2" @click="handleSave">提交</el-button>
    </el-row>
    <el-descriptions m="2" border>
      <el-descriptions-item label="项目名称">{{ data.projectName }}</el-descriptions-item>
      <el-descriptions-item label="客户名称">{{ data.clientName }}</el-descriptions-item>
      <el-descriptions-item label="产能需求">{{ data.requiredCapacity }}</el-descriptions-item>
      <el-descriptions-item label="编制时间">{{ formatDateTime(data.compileDate) }}</el-descriptions-item>
    </el-descriptions>
    <el-card class="margin-top" header="手板件费用">
      <el-table :data="data.handPieceCost" border
        :summary-method="(val: any) => getMouldSummaries(val, '手板件费用', null, 'quantity')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="partName" label="手板件名称" />
        <el-table-column prop="partNumber" label="料号" />
        <el-table-column prop="unitPrice" label="单价" :formatter="formatThousandths" />
        <el-table-column prop="quantity" label="数量" :formatter="formatThousandths" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="模具费用">
      <el-table :data="data.mouldInventory" border :summary-method="(val: any) => getMouldSummaries(val, '模具费用')"
        show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="modelName" label="模具名称" />
        <el-table-column prop="moldCavityCount" label="模穴数" :formatter="formatThousandths" />
        <el-table-column prop="unitPrice" label="单价" :formatter="formatThousandthsNoFixed" />
        <el-table-column prop="count" label="数量" :formatter="formatThousandths" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="实验费用">
      <el-table :data="data.laboratoryFeeModels" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '实验费用', 'allCost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="projectName" label="试验项目" />
        <el-table-column prop="isThirdParty" label="是否指定第三方">
          <template #default="{ row }">
            {{ row.isThirdParty ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" :formatter="formatThousandths" />
        <el-table-column label="计数-摸底" prop="countBottomingOut" :formatter="formatThousandths" />
        <el-table-column label="计数-DV" prop="countDV" :formatter="formatThousandths" />
        <el-table-column label="计数-PV" prop="countPV" :formatter="formatThousandths" />
        <el-table-column prop="allCost" label="总费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="工装费用">
      <el-descriptions m="2" border>
        <el-descriptions-item label="线体数量">{{ uphAndValues.xtsl }}</el-descriptions-item>
        <el-descriptions-item label="共线分摊率">{{ (uphAndValues.gxftl || 0) }}%</el-descriptions-item>
      </el-descriptions>
      <el-table :data="data.toolingCost" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '工装费用', 'cost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="workName" label="工装名称" />
        <el-table-column prop="toolingCount" label="工装数量" :formatter="formatThousandths" />
        <el-table-column prop="unitPriceOfTooling" label="工装单价" :formatter="formatThousandths" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="治具费用">
      <el-descriptions m="2" border>
        <el-descriptions-item label="线体数量">{{ uphAndValues.xtsl }}</el-descriptions-item>
        <el-descriptions-item label="共线分摊率">{{ (uphAndValues.gxftl || 0)}}%</el-descriptions-item>
      </el-descriptions>
      <el-table :data="data.fixtureCost" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '治具费用', 'cost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="toolingName" label="治具名称" />
        <el-table-column prop="unitPrice" label="治具单价" :formatter="formatThousandths" />
        <el-table-column prop="number" label="治具数量" :formatter="formatThousandthsNoFixed" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="检具费用">
      <el-descriptions m="2" border>
        <el-descriptions-item label="线体数量">{{ uphAndValues.xtsl }}</el-descriptions-item>
        <el-descriptions-item label="共线分摊率">{{ (uphAndValues.gxftl || 0) }}%</el-descriptions-item>
      </el-descriptions>
      <el-table :data="data.qaqcDepartments" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '检具费用', 'cost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="qc" label="检具名称" />
        <el-table-column prop="unitPrice" label="检具单价" :formatter="formatThousandths" />
        <el-table-column prop="count" label="检具数量" :formatter="formatThousandthsNoFixed" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="生产设备费用">
      <el-descriptions m="2" border>
        <el-descriptions-item label="线体数量">{{ uphAndValues.xtsl }}</el-descriptions-item>
        <el-descriptions-item label="共线分摊率">{{ (uphAndValues.gxftl || 0) }}%</el-descriptions-item>
      </el-descriptions>
      <el-table :data="data.productionEquipmentCost" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '生产设备费用', 'cost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="equipmentName" label="生产设备名" />
        <el-table-column prop="deviceStatusName" label="生产设备状态" />
        <el-table-column prop="unitPrice" label="单价" :formatter="formatThousandths" />
        <el-table-column prop="number" label="数量" :formatter="formatThousandthsNoFixed" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="测试软件费用">
      <el-descriptions m="2" border>
        <el-descriptions-item label="线体数量">{{ uphAndValues.xtsl }}</el-descriptions-item>
        <el-descriptions-item label="共线分摊率">{{ (uphAndValues.gxftl || 0) }}%</el-descriptions-item>
      </el-descriptions>
      <el-table :data="data.softwareTestingCost" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '测试软件费用', 'cost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="softwareProject" label="软件项目" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="差旅费用">
      <el-table :data="data.travelExpense" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '差旅费用', 'cost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="reasonsId" label="事由">
          <template #default="{ row }">
            <el-select v-model="row.reasonsId" disabled>
              <el-option v-for="item in nreResonOptions" :key="item.id" :label="item.displayName" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="peopleCount" label="人数" :formatter="formatThousandthsNoFixed" />
        <el-table-column prop="costSky" label="费用/天" :formatter="formatThousandths" />
        <el-table-column prop="skyCount" label="天数" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-card class="margin-top" header="其他费用">
      <el-table :data="data.restsCost" style="width: 100%" border
        :summary-method="(val: any) => getMouldSummaries(val, '其他费用', 'cost')" show-summary>
        <el-table-column type="index" width="50" />
        <el-table-column prop="constName" label="费用类型" />
        <el-table-column prop="cost" label="费用" :formatter="formatThousandths" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
    <el-descriptions m="4" :column="1" border>
      <el-descriptions-item label="（不含税人民币）NRE 总费用">{{
        formatThousandths(null,null,total.rmbAllCost)
      }}</el-descriptions-item>
      <el-descriptions-item label="（不含税美金）NRE 总费用">{{
        formatThousandths(null,null,total.usdAllCost)
      }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, watchEffect, ref, watch, reactive } from "vue"
import {
  NreTableDownload,
  GetPricingFormDownload,
  FastSaveNreExecl,
  FastQueryNreExecl,
} from "./common/request"
import { getMouldSummaries } from "./common/mouldSummaries"
import getQuery from "@/utils/getQuery"
import { formatDateTime, downloadFileExcel } from "@/utils"
import { getDictionaryAndDetail } from "@/api/dictionary"
import { ElMessage, ElMessageBox } from "element-plus"
import { formatThousandths, formatThousandthsNoFixed } from '@/utils/number'
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"

const { auditFlowId, productId, hideBtn }: any = getQuery()

const data = ref<any>({
  handPieceCost: [],
  handPieceCostModifyDtos: [],
  mouldInventory: [],
  qaqcDepartments: [],
  laboratoryFeeModels: [],
  travelExpense: [],
  restsCost: [],
  toolingCost: [],
  fixtureCost: [],
  productionEquipmentCost: [],
  softwareTestingCost: [],
})

const total = reactive({
  rmbAllCost: 0,
  usdAllCost: 0,
})

const uphAndValues = reactive<any>({// 线体数量和共线分摊率的值
  xtsl: 0, // 线体数量
  gxftl: 0, // 分摊数量
})

const nreResonOptions = ref<any[]>([])

const initFetch = async () => {
  try {
    const { success, result } = await FastQueryNreExecl({ auditFlowId, solutionId: productId })
    if (!success) throw Error()
    data.value = result
    uphAndValues.xtsl = result.uphAndValues.find((item: any) => item.uph === 'xtsl')?.value
    uphAndValues.gxftl = result.uphAndValues.find((item: any) => item.uph === 'gxftl')?.value

  } catch (err) {
    console.log(err, "[ FastQueryNreExecl err ]")
  }
}

const getPricingFormDownload = async () => {
  const { success, result } = await GetPricingFormDownload({ auditFlowId, solutionId: productId })
  if (success) {
    total.rmbAllCost = result.rmbAllCost
    total.usdAllCost = result.usdAllCost
  }
}

// NRE核价表下载
const handleFethNreTableDownload = async () => {
  try {
    const res: any = await NreTableDownload({
      // Year: year,
      AuditFlowId: auditFlowId,
      SolutionId: productId
    })
    downloadFileExcel(res, "NRE核价表")
    ElMessage.success("下载成功！")
    console.log(res, "NreTableDownload")
  } catch (err: any) {
    console.log(err, "[ NRE核价表下载 失败 ]")
  }
}

const handleSuccess = (res: any) => {
  const { result } = res || {}
  if (res.success) {
    data.value = result
    uphAndValues.xtsl = result.uphAndValues.find((item: any) => item.uph === 'xtsl')?.value
    uphAndValues.gxftl = result.uphAndValues.find((item: any) => item.uph === 'gxftl')?.value
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
}


const getResonOptions = async () => {
  let nreReasons: any = await getDictionaryAndDetail("NreReasons") //落地工厂
  nreResonOptions.value = nreReasons.result.financeDictionaryDetailList
}

const handleSave = async () => {
  const { success } = await FastSaveNreExecl({
    ...data.value
  })
  if (success) {
    ElMessage({
      message: "保存成功",
      type: "success"
    })
  }
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  if (!auditFlowId || !productId) return
  initFetch()
  getResonOptions()
  getPricingFormDownload()
})

watchEffect(() => { })
</script>
<style scoped lang="scss">
.margin-top {
  margin-top: 20px;
}
</style>
