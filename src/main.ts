import { createApp, Directive } from "vue"
import router from "./router"
import "@/router/permission"
import store from "./store"
import App from "./App.vue"
import ElementPlus from "element-plus"
import loadSvg from "@/icons"
import * as directives from "@/directives"

import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "@/styles/index.scss"
import ResetProcess from "@/components/ResetProcess/index.vue" // 重置流程组件
import OperationList from "@/components/OperationList/index.vue" // 操作记录组件

const app = createApp(App)
app.component("ResetProcess", ResetProcess)
app.component("OperationList", OperationList)

app.config.globalProperties.$baseUrl = import.meta.env.VITE_BASE_API
/** element-plus 组件完整引入 */
app.use(ElementPlus)
/** 加载全局 svg */
loadSvg(app)
/** 自定义指令 */
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})

app.use(store).use(router).mount("#app")
