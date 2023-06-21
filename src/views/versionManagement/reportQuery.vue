<template>
  <div class="reportQuery-wrap">
    <EZFilter
      :filterNnum="data.reportfilterNnum"
      :show-btn="true"
      :initFilterValue="InitReportFilterValue"
      :onSubmit="queryTable"
    />
    <el-card class="table-wrap" header="整体差异表">
      <el-table :data="data.reportQueryData">
        <el-table-column prop="name" label="模块名" />
        <el-table-column label="版本1" prop="version1">
          <template #default="{ row }">
            {{ row.version1 ? row.version1?.toFixed(2) : 0 }}
          </template>
        </el-table-column>
        <el-table-column label="版本2" prop="version2">
          <template #default="{ row }">
            {{ row.version1 ? row.version2?.toFixed(2) : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="variance" label="差异">
          <template #default="{ row }">
            {{ row.variance !== "无" ? Number(row.variance).toFixed(2) : "无" }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="table-wrap" header="bom成本差异表" v-if="data.type === 'bom'">
      <el-table :data="data.costDetailVarianceMaterial" style="width: 100%">
        <el-table-column prop="superType" label="超级大种类" />
        <el-table-column prop="categoryName" label="物料大类" />
        <el-table-column prop="typeName" label="物料种类" />
        <el-table-column label="版本1">
          <el-table-column prop="version1.superType" label="超级大种类" />
          <el-table-column prop="version1.categoryName" label="物料大类" />
          <el-table-column prop="version1.typeName" label="物料种类" />
          <el-table-column prop="version1.superType" label="装配数量" />
          <el-table-column prop="version1.materialPrice" label="材料单价（原币）" />
          <el-table-column prop="version1.materialPriceCyn" label="材料单价（人民币）" />
          <el-table-column prop="version1.totalMoney" label=" 合计金额（原币）" />
          <el-table-column prop="version1.totalMoneyCyn" label="合计金额（人民币）" />
        </el-table-column>

        <el-table-column label="版本2">
          <el-table-column prop="version2.superType" label="超级大种类" />
          <el-table-column prop="version2.categoryName" label="物料大类" />
          <el-table-column prop="version2.typeName" label="物料种类" />
          <el-table-column prop="version2.superType" label="装配数量" />
          <el-table-column prop="version2.materialPrice" label="材料单价（原币）" />
          <el-table-column prop="version2.materialPriceCyn" label="材料单价（人民币）" />
          <el-table-column prop="version2.totalMoney" label=" 合计金额（原币）" />
          <el-table-column prop="version2.totalMoneyCyn" label="合计金额（人民币）" />
        </el-table-column>
        <el-table-column prop="draftTime" label="差异">
          <el-table-column prop="variance.superType" label="装配数量" />
          <el-table-column prop="variance.materialPrice" label="材料单价（原币）" />
          <el-table-column prop="variance.materialPriceCyn" label="材料单价（人民币）" />
          <el-table-column prop="variance.totalMoney" label=" 合计金额（原币）" />
          <el-table-column prop="variance.totalMoneyCyn" label="合计金额（人民币）" />
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="table-wrap" header="制造成本差异表" v-else>
      <el-table :data="data.detailVarianceManufacturingCost" style="width: 100%">
        <el-table-column prop="superType" label="超级大种类" />
        <el-table-column prop="categoryName" label="物料大类" />
        <el-table-column prop="typeName" label="物料种类" />
        <el-table-column label="版本1">
          <el-table-column prop="version1.superType" label="超级大种类" />
          <el-table-column prop="version1.categoryName" label="物料大类" />
          <el-table-column prop="version1.typeName" label="物料种类" />
          <el-table-column prop="version1.superType" label="装配数量" />
          <el-table-column prop="version1.materialPrice" label="材料单价（原币）" />
          <el-table-column prop="version1.materialPriceCyn" label="材料单价（人民币）" />
          <el-table-column prop="version1.totalMoney" label=" 合计金额（原币）" />
          <el-table-column prop="version1.totalMoneyCyn" label="合计金额（人民币）" />
        </el-table-column>

        <el-table-column label="版本2">
          <el-table-column prop="version2.superType" label="超级大种类" />
          <el-table-column prop="version2.categoryName" label="物料大类" />
          <el-table-column prop="version2.typeName" label="物料种类" />
          <el-table-column prop="version2.superType" label="装配数量" />
          <el-table-column prop="version2.materialPrice" label="材料单价（原币）" />
          <el-table-column prop="version2.materialPriceCyn" label="材料单价（人民币）" />
          <el-table-column prop="version2.totalMoney" label=" 合计金额（原币）" />
          <el-table-column prop="version2.totalMoneyCyn" label="合计金额（人民币）" />
        </el-table-column>
        <el-table-column prop="draftTime" label="差异">
          <el-table-column prop="variance.superType" label="装配数量" />
          <el-table-column prop="variance.materialPrice" label="材料单价（原币）" />
          <el-table-column prop="variance.materialPriceCyn" label="材料单价（人民币）" />
          <el-table-column prop="variance.totalMoney" label=" 合计金额（原币）" />
          <el-table-column prop="variance.totalMoneyCyn" label="合计金额（人民币）" />
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect } from "vue"
import EZFilter from "@/components/EZFilter/index.vue"
import { InitReportFilterValue } from "./common/const"
import {
  GetQuoteProjectNameList,
  GetCostDetailVarianceMaterial,
  GetCostDetailVarianceManufacturingCost,
  GetCostDetailVariance,
  GetProductListByAuditFlowIds,
  GetQuoteProjectInfoListByQuoteProjectName
} from "./service"

// 获取项目已有核价流程所有项目名称
const getQuoteProjectNameList = async () => {
  const { result } = await GetQuoteProjectNameList()
  data.reportfilterNnum[0].options = result.items.map((item: any) => {
    return { label: item, value: item }
  })
}

// 获取项目名称对应版本号
const getAllAuditFlowVersion = async (QuoteProjectName: any) => {
  const {
    result: { items }
  }: any = await GetQuoteProjectInfoListByQuoteProjectName({
    QuoteProjectName,
    SkipCount: 0,
    MaxResultCount: 1000
  })
  const options = items.map((item: any) => ({
    label: item.quoteVersion,
    value: item.id
  }))
  data.reportfilterNnum[1].options = options
  data.reportfilterNnum[1].options = options
}

const getVersions = async (val: any, index: number) => {
  data.selectList[index] = val
  if (index === 0) {
    data.reportfilterNnum[2].options = data.reportfilterNnum[2].options.map((item: { label: any }) => {
      if (item.label === val) return { ...item, disabled: true }
      return { ...item, disabled: false }
    })
  } else {
    data.reportfilterNnum[1].options = data.reportfilterNnum[1].options.map((item: { label: any }) => {
      if (item.label === val) return { ...item, disabled: true }
      return { ...item, disabled: false }
    })
  }

  // 获取版本对比对应的产品列表
  if (data.selectList[0] && data.selectList[1]) {
    const { result } = await GetProductListByAuditFlowIds({
      QuoteVersion1AuditFlowId: data.selectList[0],
      QuoteVersion2AuditFlowId: data.selectList[1]
    })
    data.reportfilterNnum[3].options = result.items.map((item: { product: any }) => ({ label: item.product }))
  }
}

const changeType = (val: any) => {
  data.type = val
}
//console.log('1-开始创建组件-setup')

const data = reactive<any>({
  reportfilterNnum: [
    // 版本管理 - 筛选项
    {
      label: "项目名称",
      key: "ProductName",
      role: "select",
      options: [],
      onchange: getAllAuditFlowVersion
    },
    {
      label: "版本号1",
      key: "QuoteVersion1AuditFlowId",
      role: "select",
      options: [],
      onchange: (val: any) => getVersions(val, 0)
    },
    {
      label: "版本号2",
      key: "QuoteVersion2AuditFlowId",
      role: "select",
      options: [],
      onchange: (val: any) => getVersions(val, 1)
    },
    {
      label: "产品",
      key: "Product",
      role: "select",
      options: []
    },
    {
      label: "是否为全生命周期",
      key: "IsAll",
      role: "select",
      options: [
        { label: "是", value: true },
        { label: "否", value: false }
      ]
    },
    {
      label: "报表类型",
      key: "type",
      role: "select",
      options: [
        { label: "bom成本差异表", value: "bom" },
        { label: "制造成本差异表", value: "product" }
      ],
      onchange: changeType
    }
  ],
  reportQueryData: [], // 整体差异表
  costDetailVarianceMaterial: [], // 明细差异表-bom成本
  detailVarianceManufacturingCost: [], // 成本明细差异表-制造成本
  selectList: [],
  type: "bom"
})

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  getQuoteProjectNameList()
})

const queryTable = (formValue: any | undefined) => {
  getCostDetailVariance(formValue)
  if (formValue?.type === "bom") {
    getCostDetailVarianceMaterial(formValue)
  } else {
    getCostDetailVarianceManufacturingCost(formValue)
  }
}

// 获取成本明细差异表-bom成本
const getCostDetailVarianceMaterial = async (formValue: any) => {
  const { QuoteVersion1AuditFlowId, QuoteVersion2AuditFlowId, Product, IsAll } = formValue
  const {
    result: { items = [] }
  }: any = await GetCostDetailVarianceMaterial({
    QuoteVersion1AuditFlowId,
    QuoteVersion2AuditFlowId,
    Product,
    IsAll
  })
  if (items.length) data.costDetailVarianceMaterial = items
  console.log(data.costDetailVarianceMaterial, "getCostDetailVarianceMaterial")
}

// 获取成本明细差异表-制造成本
const getCostDetailVarianceManufacturingCost = async (formValue: any) => {
  const { QuoteVersion1AuditFlowId, QuoteVersion2AuditFlowId, Product, IsAll } = formValue
  const {
    result: { items = [] }
  }: any = await GetCostDetailVarianceManufacturingCost({
    QuoteVersion1AuditFlowId,
    QuoteVersion2AuditFlowId,
    Product,
    IsAll
  })
  if (items.length) data.detailVarianceManufacturingCost = items
}

// 获取成本明细差异表-项目整体
const getCostDetailVariance = async (formValue: any) => {
  const { QuoteVersion1AuditFlowId, QuoteVersion2AuditFlowId } = formValue
  const {
    result: { items = [] }
  }: any = await GetCostDetailVariance({
    QuoteVersion1AuditFlowId,
    QuoteVersion2AuditFlowId
  })
  if (items.length) data.reportQueryData = items
  console.log(data.reportQueryData, "data.reportQueryData")
}

watchEffect(() => {})
</script>
<style scoped lang="scss">
.reportQuery-wrap {
  margin: 0 10px;
}
.table-wrap {
  margin-top: 20px;
}
</style>
