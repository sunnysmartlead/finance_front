<script lang="ts" setup>
import { onBeforeMount, reactive, watch, computed } from "vue"
import { useRoute, useRouter, RouteLocationMatched } from "vue-router"
import { compile } from "path-to-regexp"

const route = useRoute()
const router = useRouter()

const pathCompile = (path: string) => {
  const { params } = route
  const toPath = compile(path)
  return toPath(params)
}

const state = reactive({
  breadcrumbs: [] as Array<RouteLocationMatched>,
  getBreadcrumb: () => {
    const matched = route.matched.filter((item) => item.meta && item.meta.title)
    state.breadcrumbs = matched.filter((item) => {
      return item.meta && item.meta.title && item.meta.breadcrumb !== false
    })
  },
  handleLink(item: any) {
    const { redirect, path } = item
    if (redirect) {
      router.push(redirect).catch((err) => {
        console.warn(err)
      })
      return
    }
    router.push(pathCompile(path)).catch((err) => {
      console.warn(err)
    })
  },
  flowName: window.sessionStorage.getItem("flowName") as string
})
watch(
  () => route.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return
    }
    state.getBreadcrumb()
    state.flowName = window.sessionStorage.getItem("flowName") || ""
  }
)

onBeforeMount(() => {
  state.getBreadcrumb()
})
</script>

<template>
  <el-breadcrumb class="app-breadcrumb">
    <transition-group name="breadcrumb">
      <span class="breadcrumb_span"> {{ state.flowName }}</span>
      <el-breadcrumb-item v-for="(item, index) in state.breadcrumbs" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === state.breadcrumbs.length - 1" class="no-redirect"
          >{{ item.meta.title }}
        </span>
        <!-- <a v-else @click.prevent="state.handleLink(item)">
          {{ item.meta.title }}
        </a> -->
        <a v-else>
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.breadcrumb_span {
  padding-left: 15px;
}
</style>
