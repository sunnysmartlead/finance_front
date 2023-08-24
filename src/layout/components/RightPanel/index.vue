<script lang="ts" setup>
// import { Setting } from "@element-plus/icons-vue"
import { ref, reactive, onMounted, watch, computed } from "vue"
import { useProductStore } from "@/store/modules/productList"
// import getQuery from "@/utils/getQuery"
import { useRoute, useRouter } from "vue-router"
import { wahiteRotes } from "./common/const"
import IntroJs from "intro.js" // introjs库
import "intro.js/introjs.css" // introjs默认css样式
const tabPosition = ref("left")
// introjs还提供了多种主题，可以通过以下方式引入
// import "intro.js/themes/introjs-modern.css"

defineProps({
  buttonTop: {
    type: Number,
    default: 250
  }
})

const show = ref(false)
let showPanel = ref(false)

const emit = defineEmits(["change"])
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const state = reactive<any>({
  productId: null,
  auditFlowId: ""
})

watch(
  () => route.name,
  (newV) => {
    // 判断当前页面路由是否在白名单内
    if (wahiteRotes.includes(newV)) {
      showPanel.value = true
      init()
    } else showPanel.value = false
  }
)
// watch(
//   () => productStore.productList,
//   (newV) => {
//     if (newV) {
//       state.productId = newV[0]?.id
//       handleChange(newV[0]?.id)
//     }
//   },
//   { deep: true }
// )
onMounted(() => {
  // 判断当前页面路由是否在白名单内
  if (wahiteRotes.includes(route.name)) {
    showPanel.value = true
    init()
  } else showPanel.value = false
})

const safeJsonParse = (data) => {
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

const init = async () => {
  // 未执行todocenter里的跳转时打开会造成state.auditFlowId为undefined
  try {
    state.productId = null
    const { productId, auditFlowId } = route.query

    if (auditFlowId) {
      await productStore.setProductList(Number(auditFlowId))
    }
    if (productId) {
      //如url中存在productId则选中

      state.productId = Number(productId)
      console.log(Number(productId), "productId")
      window.sessionStorage.setItem("productId", String(state.productId))
    } else {
      // const intro = IntroJs().setOptions({
      //   steps: [
      //     {
      //       element: document.querySelector(".handle-button"),
      //       intro: "录入零件数据前请先选择零件"
      //     }
      //   ]
      // })
      // intro.start()
    }
    const isUnfoldData = localStorage.getItem("isUnfold") || ""
    let isUnfoldValue = safeJsonParse(isUnfoldData)
    isUnfold.value = isUnfoldValue
  } catch (err) {
    console.log(err, "出错啦")
  }
}
// // 监听路由变化
// onBeforeRouteUpdate((to) => {
//   console.log(to, "onBeforeRouteUpdate")
// })

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
const moduleList = computed(() => {
  let values = [] as any
  let productList = [...new Set(productStore.productList.map((p: any) => p.moduleName))]
  productList.forEach((products: any) => {
    let value = {
      moduleName: "",
      value: [] as any
    }
    value.moduleName = products
    value.value = productStore.productList.filter((product: any) => product.moduleName == products)
    values.push(value)
  })
  return values
})
const isUnfold: any = ref(false)
const isUnfoldChange = (val: any) => {
  localStorage.setItem("isUnfold", val)
}
</script>

<template>
  <div>
    <div class="handle-button" :style="{ top: buttonTop + 'px' }" @click="show = true" v-if="showPanel">
      <span>零件列表</span>
    </div>

    <el-drawer v-model="show" size="500px" :with-header="false">
      <div>
        <div class="u-flex u-row-left u-col-center">
           <div>
              <h3>零件切换</h3>
           </div>
           <div class="u-m-l-10">
              <el-switch size="large"  width="80"
              @change="isUnfoldChange"
              v-model="isUnfold"
              inline-prompt
              active-text="展开"
              inactive-text="合并"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
           </div>
        </div>  

        <div>
          <div class="drawer-container" v-if="isUnfold">
            <div>
              <el-radio-group v-model="state.productId" size="large" @change="handleChange" style="display: block">
                <div style="margin-bottom: 10px" v-for="item in productStore.productList" :key="item.id">
                  <el-radio :label="item.id" border>{{ item.product }}</el-radio>
                </div>
              </el-radio-group>
            </div>
          </div>
        </div>
        <el-tabs :tab-position="tabPosition" style="height: 200px" class="demo-tabs" v-if="!isUnfold">
          <el-tab-pane v-for="(modu, index) in moduleList" :key="index" :label="modu.moduleName">
            <el-radio-group v-model="state.productId" size="large" @change="handleChange" style="display: block">
              <div style="margin-bottom: 10px" v-for="item in modu.value" :key="item.id">
                <el-radio :label="item.id" border>{{ item.product }}</el-radio>
              </div>
            </el-radio-group>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.handle-button {
  width: 80px;
  height: 48px;
  background-color: #152d3d;
  position: absolute;
  right: 15px;
  text-align: center;
  font-size: 14px;
  // border-radius: 6px 0 0 6px !important;
  border-radius: 6px !important;
  z-index: 101;
  cursor: pointer;
  pointer-events: auto;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
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
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
