<script lang="ts" setup>
import { reactive, onMounted } from "vue"
import { useProductStore } from "@/store/modules/productList"
import getQuery from "@/utils/getQuery"
import { useRoute, useRouter } from "vue-router"
// const reload: any = inject("reload")

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const state = reactive({
  productId: "",
  auditFlowId: ""
})

onMounted(async () => {
  // 未执行todocenter里的跳转时打开会造成state.auditFlowId为undefined
  let { auditFlowId, productId } = getQuery()
  if (auditFlowId) {
    await productStore.setProductList(Number(auditFlowId))
  }
  if (productId) {
    //如url中存在productId则选中
    state.productId = String(productId)
    window.sessionStorage.setItem("productId", state.productId)
  }
})

const emit = defineEmits(["change"])

const handleChange = (productId: any) => {
  let { query } = route
  query.productId = productId
  let newQuery = Object.assign({ productId }, { ...query })
  productStore.setProductId(productId)
  window.sessionStorage.setItem("productId", productId)
  router.push({
    path: route.path,
    query: newQuery
  })
  emit("change")
}
</script>

<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">零件切换</h3>
      <el-radio-group v-model="state.productId" size="large" @change="handleChange">
        <div style="margin-bottom: 10px" v-for="item in productStore.productList" :key="item.id">
          <el-radio :label="item.id + ''" border>{{ item.product }}</el-radio>
        </div>
      </el-radio-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  .drawer-title {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 22px;
  }
  .drawer-item {
    font-size: 14px;
    padding: 12px 0;
  }
  .drawer-switch {
    float: right;
  }
}
</style>
