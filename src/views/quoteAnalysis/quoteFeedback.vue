<!-- eslint-disable prettier/prettier -->
<!-- 报价反馈 -->
<template>
  <div>
    <div>
      <el-button type="primary" @click="downLoad" style="margin-left: 10px">成本信息表下载</el-button>
    </div>
    <!-- nre -->
    <el-card v-for="(nre, index) in data.allRes.nres" :key="index">
      <p>{{ nre.solutionName }}</p>
      <p>线体数量：2 共线分摊率：2</p>
      <el-table
        :data="nre.models"
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
      <el-table :data="nre.devices" style="width: 100%" border height="500px">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="devicePrice" label="设备单价" />
        <el-table-column prop="number" label="设备数量" />
        <el-table-column prop="equipmentMoney" label="设备金额" />
      </el-table>
    </el-card>
    <!-- 样品 -->
    <p>样品报价</p>
    <el-card v-for="sample in data.sampleOnlyRes.sampleOffer" :key="sample.solutionName">
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
    <!-- sop -->
    <p>单价表（sop年）</p>
    <el-table :data="data.allRes.sops" style="width: 100%" border height="500px">
      <el-table-column prop="gradientValue" label="梯度" />
      <el-table-column prop="product" label="产品" />
      <el-table-column :label="item.gross" v-for="(item, index) in data.allRes.sops[0].grossValues" :key="item.gross">
        <template #default="scope">
          <el-input v-model="scope.row.grossValues[index].grossvalue" type="number" />
        </template>
      </el-table-column>
    </el-table>
    <p>项目全生命周期汇总分析表-实际数量</p>
    <el-table :data="data.allRes.fullLifeCycle" style="width: 100%" border height="500px">
      <el-table-column prop="itemName" label="项目名称" />
      <el-table-column
        :label="item.grossMargin"
        v-for="(item, index) in data.allRes.fullLifeCycle[0].grosss"
        :key="item.grossMargin"
      >
        <template #default="scope">
          <el-input v-model="scope.row.grosss[index].grossMarginNumber" type="number" />
        </template>
      </el-table-column>
    </el-table>
    <el-card class="card">
      <el-row justify="end" m="2">
        <el-button @click="openDialog(null)" type="primary">年份维度对比</el-button>
      </el-row>
    </el-card>

    <p>报价毛利率测算-阶梯数量</p>
    <el-card class="card">
      <el-table :data="listOne" border>
        <el-table-column label="梯度" prop="gradient" />
        <el-table-column label="产品" prop="product" />
        <el-table-column label="单车产品数量" prop="amount" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率" prop="interior.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="client.price">
            <template #default="scope">
              <el-input v-model="scope.row.client.price">
                <template #append>
                  <el-button
                    @click="
                      calculateFullGrossMargin(
                        scope.row,
                        scope.$index,
                        'clientTargetUnitPrice',
                        'clientTargetGrossMargin'
                      )
                    "
                    >计算</el-button
                  >
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价">
            <template #default="scope">
              <el-input v-model="scope.row.thisQuotation.price">
                <template #append>
                  <el-button
                    @click="calculateFullGrossMargin(scope.row, scope.$index, 'offerUnitPrice', 'offeGrossMargin')"
                    >计算</el-button
                  >
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="thisQuotation.grossMargin">
            <template #default="{ row }">
              {{ `${row.thisQuotation.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="增加客供料毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
          <el-table-column label="剔除分摊费用毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column :label="'第' + (index + 1) + '轮'"
          v-for="(item, index) in table.quotedGrossMarginSimples.length > 0 ? table.quotedGrossMarginSimples[0].oldOffer : []" :key="index"
          width="300"
        >
          <el-table-column label="单价" :prop="`oldOffer[${index}].unitPrice`" :formatter="formatThousandths">
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              <div>{{ `${row.oldOffer[index].grossMargin.toFixed(2)} %` }}</div>
            </template>
          </el-table-column>
        </el-table-column> -->
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row)" type="primary">年份维度对比</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="card" v-for="(table, index) in data.allRes.gradientQuotedGrossMargins" :key="index">
      <el-row justify="end" m="2">
        <el-button @click="openDialog(null)" type="primary">年份维度对比</el-button>
      </el-row>
      <el-table :data="table.quotedGrossMarginSimple" border>
        <el-table-column label="产品" prop="product" />
        <el-table-column label="单车产品数量" prop="amount" />
        <el-table-column label="目标价（内部）" width="300">
          <el-table-column label="单价" prop="interior.price" :formatter="formatThousandths" />
          <el-table-column label="毛利率" prop="interior.grossMargin">
            <template #default="{ row }">
              {{ `${row.interior.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标价（客户）">
          <el-table-column label="单价" prop="client.price">
            <template #default="scope">
              <el-input v-model="scope.row.client.price">
                <template #append>
                  <el-button
                    @click="
                      calculateFullGrossMargin(
                        scope.row,
                        scope.$index,
                        'clientTargetUnitPrice',
                        'clientTargetGrossMargin'
                      )
                    "
                    >计算</el-button
                  >
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="client.grossMargin">
            <template #default="{ row }">
              {{ `${row.client.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价">
          <el-table-column label="单价">
            <template #default="scope">
              <el-input v-model="scope.row.thisQuotation.price">
                <template #append>
                  <el-button
                    @click="calculateFullGrossMargin(scope.row, scope.$index, 'offerUnitPrice', 'offeGrossMargin')"
                    >计算</el-button
                  >
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" prop="thisQuotation.grossMargin">
            <template #default="{ row }">
              {{ `${row.thisQuotation.grossMargin?.toFixed(2)} %` }}
            </template>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column :label="'第' + (index + 1) + '轮'"
          v-for="(item, index) in table.quotedGrossMarginSimples.length > 0 ? table.quotedGrossMarginSimples[0].oldOffer : []" :key="index"
          width="300"
        >
          <el-table-column label="单价" :prop="`oldOffer[${index}].unitPrice`" :formatter="formatThousandths">
          </el-table-column>
          <el-table-column label="毛利率">
            <template #default="{ row }">
              <div>{{ `${row.oldOffer[index].grossMargin.toFixed(2)} %` }}</div>
            </template>
          </el-table-column>
        </el-table-column> -->
        <el-table-column width="140" label="操作">
          <template #default="{ row }">
            <el-row justify="end" m="2">
              <el-button @click="openDialog(row)" type="primary">年份维度对比</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="card">
      <div v-for="(table, index) in data.allRes.gradientGrossMarginModels" :key="index">
        <p>{{ table.gradient }}</p>
        <el-table :data="table._itemGrossMarginModels" border>
          <el-table-column label="产品" prop="item" />
          <el-table-column label="目标价（内部）" width="300" prop="interior" />
          <el-table-column label="目标价（客户）" prop="client" />
          <el-table-column label="本次报价" prop="thisQuotation" />
          <el-table-column label="上轮报价" prop="lastRound" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import debounce from "lodash/debounce"
import getQuery from "@/utils/getQuery"
import { postCalculateFullGrossMargin, getDownloadMessage } from "./service"
/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
let { auditFlowId, productId } = getQuery()
const data = reactive({
  //仅含样品
  sampleOnlyRes: {
    nre: null,
    unitPrice: null,
    sampleOffer: [
      {
        onlySampleModels: [
          {
            sampleName: "SampleName_C",
            pcs: 200,
            cost: 0,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0
          }
        ],
        solutionName: "样品报价-前是有一"
      }
    ],
    isSuccess: true,
    message: "调用成功"
  },
  allRes: {
    auditFlowId: 0,
    nres: [
      {
        solutionName: "string", //方案
        solutionId: 0,
        auditFlowId: 0,
        models: [
          //nre
          {
            id: 0,
            creationTime: "2023-09-06T17:34:43.342Z",
            creatorUserId: 0,
            lastModificationTime: "2023-09-06T17:34:43.342Z",
            lastModifierUserId: 0,
            isDeleted: true,
            deleterUserId: 0,
            deletionTime: "2023-09-06T17:34:43.342Z",
            auditFlowId: 0,
            solutionId: 0,
            formName: "string", //手办
            pricingMoney: 0, // 核价金额
            offerCoefficient: 0, //报价系数
            offerMoney: 0, //报价金额
            remark: "string"
          }
        ],
        devices: [
          {
            id: 0,
            creationTime: "2023-09-06T17:34:43.342Z",
            creatorUserId: 0,
            lastModificationTime: "2023-09-06T17:34:43.342Z",
            lastModifierUserId: 0,
            isDeleted: true,
            deleterUserId: 0,
            deletionTime: "2023-09-06T17:34:43.342Z",
            auditFlowId: 0,
            solutionId: 0,
            deviceName: "string", //设备名
            devicePrice: 0, //价格
            number: 0, //数量
            equipmentMoney: 0 //总价
          }
        ],
        numberLine: 0, //线体
        collinearAllocationRate: 0 //分摊
      }
    ],
    sampleOffer: [
      //`样品
      {
        solutionName: "string",
        auditFlowId: 0,
        solutionId: 0,
        onlySampleModels: [
          {
            id: 0,
            creationTime: "2023-09-06T17:34:43.342Z",
            creatorUserId: 0,
            lastModificationTime: "2023-09-06T17:34:43.342Z",
            lastModifierUserId: 0,
            isDeleted: true,
            deleterUserId: 0,
            deletionTime: "2023-09-06T17:34:43.342Z",
            auditFlowId: 0,
            solutionId: 0,
            name: "string", //阶段名
            pcs: 0, //走量
            cost: 0, //成本
            unitPrice: 0, //单价
            grossMargin: 0, //毛利率
            salesRevenue: 0 //销售收入
          }
        ]
      }
    ],
    sops: [
      //SOP单价
      {
        gradientValue: "string", //梯度
        product: "string", //产
        grossValues: [
          {
            gross: "string",
            grossvalue: 0
          }
        ]
      }
    ],
    quotedGrossMargins: [
      //阶梯数量
      {
        project: "string",
        grossMargins: [
          {
            proudct: "string", //产品
            productNumber: 0,
            quotedGrossMarginSimple: {
              //
              interior: {
                price: 0,
                grossMargin: 0,
                clientGrossMargin: 0,
                nreGrossMargin: 0
              },
              client: {
                price: 0,
                grossMargin: 0,
                clientGrossMargin: 0,
                nreGrossMargin: 0
              },
              thisQuotation: {
                price: 0,
                grossMargin: 0,
                clientGrossMargin: 0,
                nreGrossMargin: 0
              },
              lastRound: {
                price: 0,
                grossMargin: 0,
                clientGrossMargin: 0,
                nreGrossMargin: 0
              }
            }
          }
        ]
      }
    ],
    gradientQuotedGrossMargins: [
      //实际数量
      {
        proudct: "string", //产品
        quotedGrossMarginSimple: {
          interior: {
            //内部
            price: 0,
            grossMargin: 0,
            clientGrossMargin: 0,
            nreGrossMargin: 0
          },
          client: {
            //客户
            price: 0,
            grossMargin: 0,
            clientGrossMargin: 0,
            nreGrossMargin: 0
          },
          thisQuotation: {
            //本轮
            price: 0,
            grossMargin: 0,
            clientGrossMargin: 0,
            nreGrossMargin: 0
          },
          lastRound: {
            //上轮
            price: 0,
            grossMargin: 0,
            clientGrossMargin: 0,
            nreGrossMargin: 0
          }
        },
        gradient: "string" //梯度
      }
    ],

    gradientGrossMarginModels: [
      {
        title: "string",
        _itemGrossMarginModels: [
          {
            item: "string",
            interior: 0, //内部
            client: 0, //客户
            thisQuotation: 0, //本轮
            lastRound: 0
          }
        ]
      }
    ]
  }
})
const listOne = computed(() => {
  let listOne: any[] = []
  data.allRes.gradientQuotedGrossMargins.forEach((item) => {
    item.quotedGrossMarginSimples.forEach((listItem: any) => {
      listItem.gradient = item.gradient
      listOne.push(listItem)
    })
  })
  return listOne
})
const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (typeof cellValue === "number") {
    return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}
// 报价分析看板 单价计算
const calculateFullGrossMargin = debounce(async (row: any, index: number, key1: string, key2: string) => {
  // console.log(data.auditFlowId)
  const productBoards = data.productBoard.map((item: any) => {
    return {
      modelCountId: item.modelCountId,
      unitPrice: item[key1]
    }
  })
  let { result }: any = (await postCalculateFullGrossMargin(productBoards, data.auditFlowId)) || {}
  // row.oldOffer[index].grossMargin = res.result.productBoardGrosses[0].offeGrossMargin

  data.productBoard[index][key2] = result?.productBoardGrosses[index].grossMargin

  if (key2 === "offeGrossMargin") {
    data.allGrossMargin = result.allGrossMargin
    // const grossMarginValue = calculatedValue("offeGrossMargin") // 本次报价整套毛利率
    // const AllUnitPrice = calculatedValue("offerUnitPrice") // 本次报价整套单价
    spreadSheetCalculate(productBoards, "offer")
  } else {
    data.allClientGrossMargin = result.allGrossMargin
    spreadSheetCalculate(productBoards, "clientTarget")
  }
  setData()
}, 300)

const openDialog = async (row: any) => {
  // let productBoards: any = []
  // if (!row) {
  //   productBoards = data.productBoard.map((item: any) => {
  //     console.log(item, "123123")
  //     return {
  //       modelCountId: item.modelCountId,
  //       unitPrice: item.offerUnitPrice
  //     }
  //   })
  // } else {
  //   productBoards = [
  //     {
  //       modelCountId: row.modelCountId,
  //       unitPrice: row.offerUnitPrice
  //     }
  //   ]
  // }
  // console.log(productBoards, "data.productBoard")
  // const { result } = await PostYearDimensionalityComparison({
  //   auditFlowId: data.auditFlowId,
  //   grossMargin: 0,
  //   productBoards
  // })
  // console.log(result, "res")
  // data.dialogTable = result
  // dialogVisible.value = true
}
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
const downLoad = async () => {
  let res: any = await getDownloadMessage(auditFlowId, "成本信息表")
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = "成本信息表.xlsx"
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}
let ProjectUnitPrice: any = {
  title: {
    text: "项目单价对比"
  },
  tooltip: {
    trigger: "item",
    axisPointer: {
      // Use axis to trigger tooltip
      type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: ["目标价（内部）", "目标价（客户）", "本次报价"]
  },
  // yAxis: {
  //   type: "value"
  // },
  yAxis: [
    {
      type: "value",
      name: "单价",
      min: 0,
      axisLabel: {
        formatter: "{value} 元"
      }
    },
    {
      type: "value",
      name: "毛利率",
      min: 0,
      axisLabel: {
        formatter: "{value}%"
      }
    }
  ],
  series: []
}
let RevenueGrossMargin: any = {
  title: {
    text: "收入和毛利率对比"
  },
  xAxis: {
    type: "category",
    data: ["目标价(内部)", "目标价(客户)", "本次报价"]
  },
  tooltip: {
    trigger: "item",
    axisPointer: {
      // Use axis to trigger tooltip
      type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  legend: {},
  yAxis: [
    {
      type: "value",
      name: "收入",
      min: 0,
      axisLabel: {
        formatter: "{value} 元"
      }
    },
    {
      type: "value",
      name: "毛利率",
      min: 0,
      axisLabel: {
        formatter: "{value}%"
      }
    }
  ],
  series: [
    // {
    //   data: [120, 200, 150],
    //   type: "bar",
    //   name: "OV方案销售收入"
    // },
    // {
    //   data: [0, 0.05, 0.1],
    //   type: "line",
    //   name: "OV方案毛利率",
    //   yAxisIndex: 1
    // }
  ]
}

let chart1: any = null
let chart2: any = null
const initCharts = (id: string, chartOption: any) => {
  // 基于准备好的dom，初始化echarts实例
  let chartEl: HTMLElement | null = document.getElementById(id)
  if (chartEl) {
    var chart = echarts.init(chartEl)
    // 绘制图表
    chart.setOption(chartOption)
    return chart
  }
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
