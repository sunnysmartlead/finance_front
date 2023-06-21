<script lang="ts" setup>
import { computed, reactive } from "vue"
import { useRouter } from "vue-router"
import { useAppStore } from "@/store/modules/app"
import { useSettingsStore } from "@/store/modules/settings"
import { useUserStore } from "@/store/modules/user"
import { UserFilled } from "@element-plus/icons-vue"
import BreadCrumb from "../BreadCrumb/index.vue"
import Hamburger from "../Hamburger/index.vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Screenfull from "@/components/Screenfull/index.vue"
import { changePasswordAd, changePassword } from "@/api/user"

const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

let userStorage = window.localStorage.getItem("user")
let userInfo: any = userStorage ? JSON.parse(userStorage) : {}
const sidebar = computed(() => {
  return appStore.sidebar
})
const showThemeSwitch = computed(() => {
  return settingsStore.showThemeSwitch
})
const showScreenfull = computed(() => {
  return settingsStore.showScreenfull
})

const updatePassword = async () => {
  let res: any = await changePassword(state.psForm)
  if (res.success) {
    state.psVisible = false
  }
}

const state = reactive<any>({
  toggleSideBar: () => {
    appStore.toggleSidebar(false)
  },
  logout: () => {
    userStore.logout()
    router.push("/login").catch((err) => {
      console.warn(err)
    })
  },
  psVisible: false,
  psForm: {
    currentPassword: "",
    newPassword: ""
  }
})
</script>

<template>
  <div class="navbar">
    <Hamburger :is-active="sidebar.opened" class="hamburger" @toggle-click="state.toggleSideBar" />
    <BreadCrumb class="breadcrumb" />
    <div class="right-menu">
      <Screenfull v-if="showScreenfull" class="right-menu-item" />
      <ThemeSwitch v-if="showThemeSwitch" class="right-menu-item" />
      <span>{{ userInfo.name }}</span>
      <el-dropdown class="right-menu-item">
        <el-avatar :icon="UserFilled" :size="34" />
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <a target="_blank" href="https://juejin.cn/post/7089377403717287972">
              <el-dropdown-item>V3-Admin-Vite 中文文档</el-dropdown-item>
            </a>
            <a target="_blank" href="https://github.com/un-pany/v3-admin-vite">
              <el-dropdown-item>V3-Admin-Vite GitHub</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/un-pany/v3-admin-vite">
              <el-dropdown-item>V3-Admin-Vite Gitee</el-dropdown-item>
            </a>
            <a target="_blank" href="https://juejin.cn/post/6963876125428678693">
              <el-dropdown-item divided>V3-Admin 中文文档</el-dropdown-item>
            </a>
            <a target="_blank" href="https://github.com/un-pany/v3-admin/blob/master/README.en.md">
              <el-dropdown-item>V3-Admin English Docs</el-dropdown-item>
            </a>
            <a target="_blank" href="https://github.com/un-pany/v3-admin">
              <el-dropdown-item>V3-Admin GitHub</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/un-pany/v3-admin">
              <el-dropdown-item>V3-Admin Gitee</el-dropdown-item>
            </a> -->
            <el-dropdown-item divided @click="state.psVisible = true">
              <span style="display: block">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="state.logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog v-model="state.psVisible" title="修改密码">
        <el-form :model="state.psForm">
          <el-form-item label="旧密码" :label-width="state.formLabelWidth">
            <el-input v-model="state.psForm.currentPassword" type="password" />
          </el-form-item>
          <el-form-item label="新密码" :label-width="state.formLabelWidth">
            <el-input v-model="state.psForm.newPassword" type="password" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.psVisible = false">取消</el-button>
            <el-button type="primary" @click="updatePassword">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  .hamburger {
    display: flex;
    align-items: center;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
  }
  .breadcrumb {
    float: left;
  }
  .right-menu {
    float: right;
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #606266;
    .right-menu-item {
      padding: 0 10px;
      cursor: pointer;
    }
  }
}
</style>
