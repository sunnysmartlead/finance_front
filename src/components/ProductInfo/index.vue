<template>
  <div>
    <el-button type="primary" @click="viewProductInfo">查看产品信息</el-button>
    <el-dialog v-model="data.visible" title="产品信息">
      <el-table :data="specifyTableData" style="width: 100%" border>
        <el-table-column prop="productType" label="类型" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="main" label="核心部件" />
        <el-table-column prop="type" label="品牌/型号" />
        <el-table-column prop="price" label="单价" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.visible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { productTypeMap } from "../../views/demandApply/data.type"
import { getProductionControl } from "./service"

const props = defineProps({
  auditFlowId: {
    type: Number,
    required: true
  }
})

//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  visible: false
})
let specifyTableData: any = ref([])

const viewProductInfo = async () => {
  let res: any = await getProductionControl(props.auditFlowId)
  data.visible = true
  console.log(res)
  generateCustomTable(res.result)
}
const generateCustomTable = (data: any) => {
  specifyTableData.value.splice(0, specifyTableData.value.length) // 清空数据
  data.forEach((item: any) => {
    if (item.sensorTypeSelect !== productTypeMap.recommend) {
      let price = item.sensorPrice
      let productName = item.name
      let main = "sensor"
      let type = item.sensor
      let productType = item.sensorTypeSelect === "2" ? "客户指定" : "客户供应"
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType
      })
    }
    if (item.lensTypeSelect !== productTypeMap.recommend) {
      let price = item.lensPrice
      let productName = item.name
      let main = "lens"
      let type = item.lens
      let productType = item.lensTypeSelect === "2" ? "客户指定" : "客户供应"
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType
      })
    }
    if (item.ispTypeSelect !== productTypeMap.recommend) {
      let price = item.ispPrice
      let productName = item.name
      let main = "isp"
      let type = item.isp
      let productType = item.ispTypeSelect === "2" ? "客户指定" : "客户供应"
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType
      })
    }
    if (item.serialChipTypeSelect !== productTypeMap.recommend) {
      let price = item.serialChipPrice
      let productName = item.name
      let main = "serialChip"
      let type = item.serialChip
      let productType = item.serialChipTypeSelect === "2" ? "客户指定" : "客户供应"
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType
      })
    }
    if (item.ledTypeSelect !== productTypeMap.recommend) {
      let price = item.ledPrice
      let productName = item.name
      let main = "其它"
      let type = item.led
      let productType = item.ledTypeSelect === "2" ? "客户指定" : "客户供应"
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType
      })
    }
  })
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
