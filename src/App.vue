<script lang="ts" setup>
import { useAppStore } from "@/store/modules/app"
import zhCn from "element-plus/es/locale/lang/zh-cn"

useAppStore().initTheme() // 初始化 theme
const locale = zhCn // element-plus 设置为中文
</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>

