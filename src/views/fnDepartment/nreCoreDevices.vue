<template>
  <!-- 核心器件，nre拆分 -->
  <div>
    <el-card>
      <el-table :data="data.productAndGradients" style="width: 100%" border height="500px">
        <el-table-column type="expand">
          <template v-slot="props">
            <el-descriptions
              :column="3"
              border
              v-for="item in props.row.solutionAndprices"
              :key="item.solutionName"
              mb-15px
            >
              <el-descriptions-item>
                <template v-slot:label> 方案名称 </template>
                {{ item.solutionName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 单价 </template>
                {{ item.price }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 汇率 </template>
                {{ item.exchangeRate }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 数量 </template>
                {{ item.number }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 合计 </template>
                {{ item.nsum }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column prop="gradientValue" label="梯度" width="100" />
        <el-table-column prop="product" label="名称" />
      </el-table>
    </el-card>
    <el-card>
      <p>NRE-前视方案一</p>
      <p>线体数量：2 共线分摊率：2</p>
      <el-table :data="data.nres" style="width: 100%" border height="500px">
        <el-table-column prop="nre" label="NRE费用" />
        <el-table-column prop="price" label="金额" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
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
  productAndGradients: [
    {
      gradientId: 202,
      gradientValue: 25,
      product: "Sensor芯片",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "串行芯片",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: " 镜头",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "PCBA（除sensor芯片、串行芯片）",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "结构件（除lens）",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "质量成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "损耗成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "制造成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "物流费用",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "其他成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 202,
      gradientValue: 25,
      product: "总成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "Sensor芯片",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "串行芯片",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: " 镜头",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "PCBA（除sensor芯片、串行芯片）",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "结构件（除lens）",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "质量成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "损耗成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "制造成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "物流费用",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "其他成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    },
    {
      gradientId: 203,
      gradientValue: 35,
      product: "总成本",
      solutionAndprices: [
        {
          solutionName: "AR0820",
          solutionId: 115,
          number: 1,
          price: 100,
          exchangeRate: 1,
          nsum: 12
        }
      ]
    }
  ],
  nres: [
    {
      nre: "手板件费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "模具费用",
      price: 100,
      remark: "12"
    },
    {
      nre: " 工装费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "治具费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "检具费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "生产设备费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "专用生产设备",
      price: 100,
      remark: "12"
    },
    {
      nre: "非专用生产设备",
      price: 100,
      remark: "12"
    },
    {
      nre: "实验费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "测试软件费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "差旅费",
      price: 100,
      remark: "12"
    },
    {
      nre: "其他费用",
      price: 100,
      remark: "12"
    },
    {
      nre: "合计",
      price: 100,
      remark: "12"
    }
  ]
})
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
