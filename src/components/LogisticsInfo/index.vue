<template>
  <div>
    <el-button type="primary" @click="data.dialogFormVisible = true">查看物流&包装基础数据</el-button>
    <el-dialog v-model="data.dialogFormVisible" title="物流基础信息">
      <el-form :model="data.logisticsForm" inline>
        <h5>物流基础信息</h5>
        <h6>外包装体积</h6>
        <el-form-item label="外包装长">
          <el-input v-model="data.logisticsForm.outerPackagingLength" readonly>
            <template #append>cm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="外包装宽">
          <el-input v-model="data.logisticsForm.outerPackagingWidth" readonly>
            <template #append>cm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="外包装高">
          <el-input v-model="data.logisticsForm.outerPackagingHeight" readonly>
            <template #append>cm</template>
          </el-input>
        </el-form-item>
        <h6>重量</h6>
        <el-form-item label="单个产品重量">
          <el-input v-model="data.logisticsForm.singleProductWeight" readonly>
            <template #append>kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单箱数量">
          <el-input v-model="data.logisticsForm.singleBoxQuantity" readonly>
            <template #append>pcs</template>
          </el-input>
        </el-form-item>
        <h5>包装基础信息</h5>
        <h6>内包装体积</h6>
        <el-form-item label="内包装长">
          <el-input v-model="data.logisticsForm.innerPackagingLength" readonly>
            <template #append>mm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="内包装宽">
          <el-input v-model="data.logisticsForm.innerPackagingWidth" readonly>
            <template #append>mm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="内包装高">
          <el-input v-model="data.logisticsForm.innerPackagingHeight" readonly>
            <template #append>mm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否打托">
          <el-select v-model="data.logisticsForm.isHit" placeholder="Select" disabled>
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="每托盘箱数">
          <el-input v-model="data.logisticsForm.boxesPerPallet" readonly>
            <template #append> 箱/托</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单箱包装数量">
          <el-input v-model="data.logisticsForm.quantityPerBox" readonly>
            <template #append> PCS/箱</template>
          </el-input>
        </el-form-item>
        <el-form-item label="包装方式">
          <el-input v-model="data.logisticsForm.packagingType" readonly />
        </el-form-item>
        <el-form-item label="运输方式">
          <el-input v-model="data.logisticsForm.shippingType" readonly />
        </el-form-item>
        <el-form-item label="交货地点">
          <el-input v-model="data.logisticsForm.placeOfDelivery" type="textarea" readonly />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.logisticsForm.remarks" type="textarea" readonly />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import getQuery from "@/utils/getQuery"
import { getProductFreight } from "./service"
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  auditFlowId: 0,
  productId: 0,
  dialogFormVisible: false,
  logisticsForm: {
    outerPackagingLength: "",
    outerPackagingWidth: "",
    outerPackagingHeight: "",
    singleProductWeight: "",
    singleBoxQuantity: "",
    innerPackagingLength: "",
    innerPackagingWidth: "",
    innerPackagingHeight: "",
    isHit: "",
    boxesPerPallet: "",
    quantityPerBox: "",
    remarks: "",
    pictureId: "",
    packagingType: "",
    shippingType: "",
    placeOfDelivery: ""
  }
})
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  let query = getQuery()
  data.auditFlowId = Number(query.auditFlowId) || 0
  data.productId = Number(query.productId) || 0
  // 获取运费信息
  let res: any = await getProductFreight({ auditFlowId: data.auditFlowId, productId: data.productId })
  data.logisticsForm = res.result
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
