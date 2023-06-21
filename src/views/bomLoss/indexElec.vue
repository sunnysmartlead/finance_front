<template>
  <div class="bom-loss">
    <InterfaceRequiredTime :ProcessIdentifier="Host" />
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>电子料bom损耗率表单</span>
        </div>
      </template>
      <el-table :data="data.bomLossElecData" border style="width: 100%" height="500">
        <el-table-column type="index" width="50" />
        <el-table-column prop="superType" label="种类" width="180" />
        <el-table-column prop="categoryName" label="物料大类" width="180" />
        <el-table-column :label="year + ''" v-for="(year, index) in data.years" :key="year" width="180">
          <template #default="{ row }">
            <el-input v-model="row.lossRateYearList[index].rate" type="number">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-button type="primary" @click="submit" v-havedone>提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { getElecOldLossRateInfo, saveLossRateInfo, getYears, getElecLossRateType } from "./service"
import { ElMessage, ElMessageBox } from "element-plus"
import { LossRateYearDto } from "./data.type"
import getQuery from "@/utils/getQuery"
import _ from "lodash"

import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
let Host: string = "ElecLossRateInput"
/**
 * 路由对象
 */
/**
 * 路由实例
 */
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  // bomLossData: [
  //   {
  //     categoryName: "1123",
  //     lossRateYearList: [] as LossRateYearDto[],
  //     auditFlowId: 2,
  //     productId: 2,
  //     product: "string",
  //     superType: "string"
  //   }
  // ],
  bomLossElecData: [],
  years: [] as number[]
})

let auditFlowId = 0
let productId = 0
const submit = async () => {
  let bomLossData = [] as any[]
  let isComfirm = false
  let cantSubmit = false
  bomLossData = _.cloneDeep(data.bomLossElecData)
  // bomLossData.concat(data.bomLossElecData)
  let lossRateDtoList = bomLossData.map((item: any) => {
    return {
      ...item,
      lossRateYearList: item.lossRateYearList.map((i: LossRateYearDto) => {
        if (i.rate === "") {
          cantSubmit = true
        }
        if (Number(i.rate) >= 10) {
          isComfirm = true
        }
        return {
          year: i.year,
          rate: (Number(i.rate) / 100).toFixed(4)
        }
      })
    }
  })
  if (cantSubmit) {
    ElMessage({
      type: "error",
      message: "存在空值，无法提交"
    })
    return
  }
  if (isComfirm) {
    ElMessageBox.confirm("损耗录有超过10%的值,是否提交?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      let res: any = await saveLossRateInfo(lossRateDtoList)
      if (res.success) {
        ElMessage({
          type: "success",
          message: "提交成功"
        })
      }
    })
  } else {
    let res: any = await saveLossRateInfo(lossRateDtoList)
    if (res.success) {
      // jumpTodoCenter()
      ElMessage({
        type: "success",
        message: "提交成功"
      })
    }
  }
}
onBeforeMount(() => {
  // console.log(VITE_BASE_API)
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  let query = getQuery()
  auditFlowId = query.auditFlowId ? Number(query.auditFlowId) : 0
  productId = query.productId ? Number(query.productId) : 0
  let right = query.right
  let { result } = (await getYears(auditFlowId)) as any
  data.years = result
  if (right === "1") {
    // 已办查看老数据
    let resOldElec: any = await getElecOldLossRateInfo({ auditFlowId, productId })
    data.bomLossElecData = resOldElec.result
    data.bomLossElecData.forEach((item: any) => {
      item.lossRateYearList.forEach((it: any) => {
        it.rate = Number(it.rate) * 100
      })
    })
  } else {
    // let res: any = await getLossRateType({ auditFlowId, productId })
    // 获取电子料 结构料初始值
    let resElec: any = await getElecLossRateType({ auditFlowId, productId })
    data.bomLossElecData = resElec.result
    data.bomLossElecData.forEach((item: any) => {
      // item.lossRateYearList = []
      // item.lossRateYearList = data.years.map((year) => ({ year, rate: "" }))
      // 不知后端返回的是空数组还是null
      if (!item.lossRateYearList || item.lossRateYearList.length === 0) {
        item.lossRateYearList = []
        item.lossRateYearList = data.years.map((year) => ({ year, rate: "" }))
      } else {
        // 初始值可能会是退回，这时需要显示后端返回的值
        item.lossRateYearList.forEach((it: any) => {
          it.rate = Number(it.rate) * 100
        })
      }
    })
  }
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.card {
  margin: 10px 0;
}
</style>
