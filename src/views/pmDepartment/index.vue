<template>
  <div class="pm-department">
    <InterfaceRequiredTime style="float: right" :ProcessIdentifier="Host" />
    <div class="pm-department__btn-container">
      <el-button type="primary" @click="getSorFile">SOR查看</el-button>
      <el-button type="primary" @click="data.dialogFormVisible = true">查看物流&包装基础数据</el-button>
    </div>
    <el-card>
      <el-table :data="data.tableData" style="width: 100%" border>
        <el-table-column label="年份" prop="year" />
        <el-table-column label="单PCS包装价格/元">
          <template #default="{ row }">
            <el-input v-model="row.perPackagingPrice" />
          </template>
        </el-table-column>
        <el-table-column label="运费/月">
          <template #default="{ row }">
            <el-input v-model="row.freight" />
          </template>
        </el-table-column>
        <el-table-column label="仓储费用/月">
          <template #default="{ row }">
            <el-input v-model="row.storageExpenses" />
          </template>
        </el-table-column>
        <el-table-column label="月度需求量" prop="monthEndDemand">
          <!-- <template #default="{ row }">
            <el-input v-model="row.monthEndDemand" />
          </template> -->
        </el-table-column>
        <el-table-column label="单PCS运输费" prop="perFreight">
          <!-- <template #default="{ row }">
            <el-input v-model="row.perFreight" />
          </template> -->
        </el-table-column>
        <el-table-column label="单PCS总物流成本" prop="perTotalLogisticsCost">
          <!-- <template #default="{ row }">
            <el-input v-model="row.perTotalLogisticsCost" />
          </template> -->
        </el-table-column>
        <el-table-column label="备注">
          <template #default="{ row }">
            <el-input v-model="row.remarks" />
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-button @click="submit" type="primary" v-havedone>提交</el-button>
      </div>
    </el-card>
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
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="data.dialogFormVisible = false">确认</el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect, watch } from "vue"
import {
  saveProductionControl,
  // getPcsByPriceAuditFlowId,
  getSorByAuditFlowId,
  getProductFreight,
  getModelCountByAuditFlowId,
  getProductionControl
} from "./service"
import { ElMessage } from "element-plus"
import getQuery from "@/utils/getQuery"
import { CommonDownloadFile } from "@/api/bom"

import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host: string = "LogisticsCostInput"
// import { useRoute, useRouter } from "vue-router"
/**
 * 路由对象
 */
// const route = useRoute()
// /**
//  * 路由实例
//  */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */

const data = reactive({
  tableData: [],
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
watch(
  () => data.tableData,
  (value) => {
    if (value) {
      value.forEach((row: any) => {
        row.perFreight = ((Number(row.freight) + Number(row.storageExpenses)) / row.monthEndDemand).toFixed(2)

        row.perTotalLogisticsCost = (Number(row.perPackagingPrice) + Number(row.perFreight)).toFixed(2)
      })
    }
  },
  { deep: true }
)
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  let query = getQuery()
  data.auditFlowId = Number(query.auditFlowId) || 1
  data.productId = Number(query.productId) || 1
  let oldRes: any = await getProductionControl(data.auditFlowId, data.productId)
  console.log(oldRes)
  if (oldRes.result.infoList.length > 0) {
    data.tableData = oldRes.result.infoList
  } else {
    let { result } = (await getModelCountByAuditFlowId(data.auditFlowId)) as any
    let warpArr = [] as any[] //二维数组
    let years = [] as number[]
    result.items.forEach((item: any) => {
      item.modelCountYearListDto.forEach((yearItem: any, index: number) => {
        if (!warpArr[index]) {
          warpArr[index] = []
        }
        warpArr[index].push(yearItem.quantity)
      })
    })
    result.items[0]?.modelCountYearListDto.forEach((yearItem: any) => {
      years.push(yearItem.year)
    })
    let yearValue: any[] = [] //1000, 2000, 3000
    console.log(warpArr, "warpArr")
    // 1.手工录入[单PCS包装价格].[运费].[仓储费用]
    // 2.[月需求量]按照 sop年的销售数量除以12，计算得出
    // 3.[单pcs运输费=（运费+仓储费）/月需求量]根据公式计算得出
    // 4.[总物流成本=包装价格+单CS运输费]根据公式计算得出
    warpArr.forEach((arr, index) => {
      yearValue[index] = arr.reduce((pre: number, cur: number) => {
        return pre + cur
      })
    })
    // console.log(yearValue)
    if (years?.length > 0) {
      data.tableData = years.map((year: number, index: number) => {
        return {
          year,
          perPackagingPrice: "",
          freight: "",
          storageExpenses: "",
          monthEndDemand: (yearValue[index] / 12).toFixed(0), //月度需求量
          perFreight: "",
          perTotalLogisticsCost: ""
        }
      }) as any
    }
    // console.log(data.tableData)
    // watch(
    //   () =>data.tableData,
    //   (val) => {
    //     console.log("123")
    //     val.forEach((row: any) => {
    //       row.perFreight = ((Number(row.freight) + Number(row.storageExpenses)) / row.monthEndDemand).toFixed(2)

    //       row.perTotalLogisticsCost = (Number(row.perPackagingPrice) + Number(row.perFreight)).toFixed(2)
    //     })
    //   },
    //   { deep: true }
    // )
  }
  // 获取运费信息
  let res: any = await getProductFreight({ auditFlowId: data.auditFlowId, productId: data.productId })
  data.logisticsForm = res.result

  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})

const getSorFile = async () => {
  const { result }: any = (await getSorByAuditFlowId(data.auditFlowId)) || {}
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
const submit = async () => {
  let { auditFlowId, productId } = data
  let infoList = data.tableData.map((item) => item)
  let res: any = await saveProductionControl({
    auditFlowId,
    productId,
    infoList
  })
  if (res.success) {
    ElMessage.success("提交成功")
  }
}
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.pm-department {
  &__btn-container {
    margin: 20px 0;
  }
}
</style>
