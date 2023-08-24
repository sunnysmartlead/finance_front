<template>
  <div>
    <h5>客户指定采购/供应详情：</h5>
    <el-table header="" :data="specifyTableData" style="width: 100%" border>
      <el-table-column prop="productType" label="类型" />
      <el-table-column prop="productName" label="零件名称" />
      <el-table-column prop="main" label="核心部件" />
      <el-table-column prop="type" label="品牌/型号" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="currency" label="币别">
        <template #default="{ row }">
          <el-select v-model="row.currency" disabled>
            <el-option
              v-for="item in ExchangeSelectOptions"
              :key="item.id"
              :label="item.exchangeRateKind"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="exchange" label="汇率" />
      <el-table-column prop="total" label="合计" />
    </el-table>
  </div>
</template>

<script  lang="ts" setup>
import { ref, reactive, onMounted, toRefs, watch, watchEffect, computed } from "vue"
import { productTypeMap } from "./data.type"
import getQuery from "@/utils/getQuery"
import { getPriceEvaluationStartData, getExchangeRate } from "./service"
let specifyTableData: any = ref([])
let productTableData: any = ref([])
let ExchangeSelectOptions: any =ref([])
const generateCustomTable = () => {
  specifyTableData.value.splice(0, specifyTableData.value.length) // 清空数据
  productTableData.value.forEach((item: any) => {
    if (item.sensorTypeSelect !== productTypeMap.recommend) {
      let price = item.sensorPrice
      let productName = item.name
      let main = "sensor"
      let type = item.sensor
      let productType = item.sensorTypeSelect === "2" ? "客户指定" : "客户供应"
      let currency = item.sensorCurrency
      let exchange = item.sensorExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.lensTypeSelect !== productTypeMap.recommend) {
      let price = item.lensPrice
      let productName = item.name
      let main = "lens"
      let type = item.lens
      let productType = item.lensTypeSelect === "2" ? "客户指定" : "客户供应"
      let currency = item.lensCurrency
      let exchange = item.lensExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.ispTypeSelect !== productTypeMap.recommend) {
      let price = item.ispPrice
      let productName = item.name
      let main = "isp"
      let type = item.isp
      let productType = item.ispTypeSelect === "2" ? "客户指定" : "客户供应"
      let currency = item.ispCurrency
      let exchange = item.ispExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.serialChipTypeSelect !== productTypeMap.recommend) {
      let price = item.serialChipPrice
      let productName = item.name
      let main = "serialChip"
      let type = item.serialChip
      let productType = item.serialChipTypeSelect === "2" ? "客户指定" : "客户供应"
      let currency = item.serialChipCurrency
      let exchange = item.serialChipExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.cableTypeSelect !== productTypeMap.recommend) {
      let price = item.cablePrice
      let productName = item.name
      let main = "线缆"
      let type = item.cable
      let productType = item.cableTypeSelect === "2" ? "客户指定" : "客户供应"
      let currency = item.cableCurrency
      let exchange = item.cableExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.otherTypeSelect !== productTypeMap.recommend) {
      let price = item.otherPrice
      let productName = item.name
      let main = "其它"
      let type = item.other
      let productType = item.otherTypeSelect === "2" ? "客户指定" : "客户供应"
      let currency = item.otherCurrency
      let exchange = item.otherExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
  })
}
onMounted(async () => {
  let query = getQuery()
  if (query.auditFlowId) {
    let exchangeSelect: any = await getExchangeRate({
      maxResultCount: 100,
      skipCount: 0
    })
    ExchangeSelectOptions.value = exchangeSelect.result.items
    // 查看
    let viewDataRes: any = await getPriceEvaluationStartData(query.auditFlowId)
    if (viewDataRes.result) {
      productTableData.value = viewDataRes.result.productInformation
      generateCustomTable()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
