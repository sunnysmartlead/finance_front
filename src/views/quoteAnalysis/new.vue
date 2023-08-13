<template>
  <div>
    <el-card>
      <p>请选择报价方案组合：</p>
      <el-button type="primary" @click="addNewPlan" mb-20px>新增</el-button>
      <el-table :data="data.tableData" style="width: 100%" border height="500px">
        <el-table-column prop="name" label="报价序号" />
        <el-table-column label="前视">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案一" :value="1" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="侧视">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案二" :value="1" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="后视">
          <template #default="scope">
            <el-select clearable v-model="scope.row.projectsPlan">
              <el-option label="方案三" :value="1" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- nre -->
    <el-card v-for="(nre, index) in data.allRes.nres" :key="index">
      <p>{{ nre.solutionName }}</p>
      <p>线体数量：2 共线分摊率：2</p>
      <el-table :data="nre.models" style="width: 100%" border height="500px">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
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
const data = reactive({
  tableData: [
    // {
    //   projectsPlan: 1,
    //   name: "1/JAN"
    // }
  ],
  //被选中的当前方案
  currentPlan: [
    {
      auditFlowId: 1,
      productld: 5,
      moduleName: "1",
      solutionName: "方案二",
      product: "1-方案二",
      isCOB: false,
      elecEngineerId: 92,
      structEngineerId: 51,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 5
    },
    {
      auditFlowId: 1,
      productld: 2,
      moduleName: "侧视",
      solutionName: "方案一",
      product: "侧视-方案一",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 2
    },
    {
      auditFlowId: 1,
      productld: 2,
      moduleName: "侧视",
      solutionName: "方案二",
      product: "侧视-方案二",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 8
    },
    {
      auditFlowId: 1,
      productld: 2,
      moduleName: "侧视",
      solutionName: "方案三",
      product: "侧视-方案三",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 9
    },
    {
      auditFlowId: 1,
      productld: 1,
      moduleName: "前视",
      solutionName: "方案一",
      product: "前视-方案一",
      isCOB: false,
      elecEngineerId: 59,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 1
    },
    {
      auditFlowId: 1,
      productld: 1,
      moduleName: "前视",
      solutionName: "方案二",
      product: "前视-方案二",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 6
    },
    {
      auditFlowId: 1,
      productld: 1,
      moduleName: "前视",
      solutionName: "方案三",
      product: "前视-方案三",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 7
    },
    {
      auditFlowId: 1,
      productld: 3,
      moduleName: "后视",
      solutionName: "方案一",
      product: "后视-方案一",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 3
    },
    {
      auditFlowId: 1,
      productld: 3,
      moduleName: "后视",
      solutionName: "方案二",
      product: "后视-方案二",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: true,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 10
    },
    {
      auditFlowId: 1,
      productld: 4,
      moduleName: "环视",
      solutionName: "方案一",
      product: "环视-方案一",
      isCOB: false,
      elecEngineerId: 36,
      structEngineerId: 39,
      isFirst: false,
      isDeleted: false,
      deleterUserId: null,
      deletionTime: null,
      lastModificationTime: null,
      lastModifierUserId: null,
      creationTime: "2023-06-26T16:29:42.006",
      creatorUserId: 2,
      id: 4
    }
  ],
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
    isSuccess: true,
    message: "string",
    grossMarginList: [0],
    nres: [
      {
        solutionName: "string", //方案名
        models: [
          {
            index: 0, //序号
            costName: "string", //费用名称
            pricingMoney: "string", //核价金额
            offerCoefficient: 0, //报价系数
            offerMoney: 0, //报价金额
            remark: 0 //备注
          }
        ],
        devices: [
          //专用设备
          {
            deviceName: "string", //设备名称
            devicePrice: 0, //单价
            number: 0, //数量
            equipmentMoney: 0 //金额
          }
        ]
      }
    ],

    sops: [
      //SOP单价表（SOP年）
      {
        gradientValue: 0, //梯度
        product: "string", //产品
        grossValues: [
          {
            gross: "10", //毛利
            grossvalue: 0 //值
          },
          {
            gross: "20", //毛利
            grossvalue: 1 //值
          }
        ]
      },
      {
        gradientValue: 100, //梯度
        product: "string", //产品
        grossValues: [
          {
            gross: "10", //毛利
            grossvalue: 3 //值
          },
          {
            gross: "20", //毛利
            grossvalue: 5 //值
          }
        ]
      }
    ],
    quotedGrossMargins: [
      //报价毛利率测算
      {
        project: "string", //方案名
        quotedGrossMarginSimples: [
          {
            product: "string", //产品
            amount: 0, //单车产品数量
            interior: {
              //目标价（内部）
              price: 0, // 单价
              grossMargin: 0, // 毛利率
              clientGrossMargin: 0, // 增加客供料毛利率
              nreGrossMargin: 0 // 剔除NRE分摊费用毛利率
            },
            client: {
              // 目标价（客户）
              price: 0,
              grossMargin: 0,
              clientGrossMargin: 0,
              nreGrossMargin: 0
            },
            thisQuotation: {
              // 本次报价
              price: 0,
              grossMargin: 0,
              clientGrossMargin: 0,
              nreGrossMargin: 0
            },
            lastRound: {
              // 上轮报价
              price: 0,
              grossMargin: 0,
              clientGrossMargin: 0,
              nreGrossMargin: 0
            }
          }
        ]
      }
    ],
    gradientQuotedGrossMargins: [
      // 报价毛利率测算-阶梯数量
      {
        project: "string", //方案名
        quotedGrossMarginSimples: [
          {
            product: "string", //产品
            amount: 0, //单车产品数量
            interior: {
              //目标价（内部）
              price: 0, // 单价
              grossMargin: 0, // 毛利率
              clientGrossMargin: 0, // 增加客供料毛利率
              nreGrossMargin: 0 // 剔除NRE分摊费用毛利率
            },
            client: {
              // 目标价（客户）
              price: 0,
              grossMargin: 0,
              clientGrossMargin: 0,
              nreGrossMargin: 0
            },
            thisQuotation: {
              // 本次报价
              price: 0,
              grossMargin: 0,
              clientGrossMargin: 0,
              nreGrossMargin: 0
            },
            lastRound: {
              // 上轮报价
              price: 0,
              grossMargin: 0,
              clientGrossMargin: 0,
              nreGrossMargin: 0
            }
          }
        ],
        gradient: "string" //梯度
      }
    ],
    fullLifeCycle: [
      // 项目全生命周期汇总分析表-实际数量
      {
        itemName: "string", //项目名
        grosss: [
          {
            grossMargin: "0", // 毛利率
            grossMarginNumber: 0 //毛利率值
          }
        ]
      }
    ],
    gradientGrossMarginModels: [
      {
        gradient: "string", //梯度
        _itemGrossMarginModels: [
          {
            item: "string", // 项目
            interior: 0, // 目标价（内部）
            client: 0, // 目标价（客户）
            thisQuotation: 0, // 本次报价
            lastRound: 0 // 上轮报价
          }
        ]
      }
    ]
  }
})

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

const addNewPlan = () => {
  debugger
  data.tableData.push({
    projectsPlan: 1,
    name: "1/JAN"
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
