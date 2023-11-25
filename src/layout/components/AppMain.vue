<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const key = computed(() => {
  return route.name
})
</script>

<template>
  <section class="app-main">
    <ResetProcess />
    <el-scrollbar style="height: 100%" native>
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="['quoteAnalysis', 'indexSecond']">
            <component :is="Component" :key="key" />
          </keep-alive>
        </transition>
      </router-view>
    </el-scrollbar>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  /* 50 = navbar height  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
    padding: 0 20px;
  }
  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
