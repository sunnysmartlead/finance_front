<template>
  <div>
    <el-card>
      <el-table :data="data.Costitems" style="width: 100%" border height="500px">
        <el-table-column type="expand">
          <template v-slot="props">
            <el-descriptions :column="3" border v-for="item in props.row.items" :key="item.project" mb-15px>
              <el-descriptions-item>
                <template v-slot:label> 方案名称 </template>
                {{ item.project }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 单价 </template>
                {{ item.UnitPrice }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 汇率 </template>
                {{ item.ExchangeRate }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 数量 </template>
                {{ item.Number }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template v-slot:label> 合计 </template>
                {{ item.Subtotal }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column prop="gradient" label="梯度" width="100" />
        <el-table-column prop="Costitem" label="名称" />
      </el-table>
    </el-card>
    <el-card>
      <p>NRE-前视方案一</p>
      <p>线体数量：2 共线分摊率：2</p>
      <el-table :data="data.nres" style="width: 100%" border height="500px">
        <el-table-column prop="nre" label="NRE费用" />
        <el-table-column prop="Amount" label="金额" />
        <el-table-column prop="reMark" label="备注" />
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
  Costitems: [
    {
      Costitem: "Sensor芯片", //梯度为区分
      gradient: 100,
      items: [
        {
          project: "前视-方案一",
          UnitPrice: "100",
          ExchangeRate: 100,
          Number: 100,
          Subtotal: 100
        },
        {
          project: "前视-方案而",
          UnitPrice: "100",
          ExchangeRate: 100,
          Number: 100
        }
      ]
    }
  ],
  nres: [
    {
      nre: "手板件费用",
      Amount: 100,
      reMark: "1111"
    }
  ]
})
const listOne = computed(() => {
  // let listOne: any[] = []
  // data.allRes.gradientQuotedGrossMargins.forEach((item) => {
  //   item.quotedGrossMarginSimples.forEach((listItem: any) => {
  //     listItem.gradient = item.gradient
  //     listOne.push(listItem)
  //   })
  // })
  return listOne
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
