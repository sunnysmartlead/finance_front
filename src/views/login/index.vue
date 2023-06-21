<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { User, Lock, Key, Message } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"

interface ILoginForm {
  /** admin 或 editor */
  userNameOrEmailAddress: string
  /** 密码 */
  password: string
}

const router = useRouter()
const loginFormDom = ref<any>()

const state = reactive({
  /** 登录按钮 loading */
  loading: false,
  /** 验证码图片 URL */
  codeUrl: "",
  /** 登录表单 */
  loginForm: {
    userNameOrEmailAddress: "",
    password: ""
  } as ILoginForm,
  /** 登录表单校验规则 */
  loginRules: {
    userNameOrEmailAddress: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
    ]
  },
  /** 登录逻辑 */
  handleLogin: () => {
    loginFormDom.value.validate((valid: boolean) => {
      if (valid) {
        state.loading = true
        useUserStore()
          .login({
            userNameOrEmailAddress: state.loginForm.userNameOrEmailAddress,
            password: state.loginForm.password,
            rememberClient: true
          })
          .then(() => {
            state.loading = false
            router.push({ path: "/" }).catch((err) => {
              console.warn(err)
            })
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        return false
      }
    })
  },
  /** 创建验证码 */
  // createCode: () => {
  //   // 先清空验证码的输入
  //   state.loginForm.code = ""
  //   // 实际开发中，可替换成自己的地址，这里只是提供一个参考
  //   state.codeUrl = `/api/v1/login/code?${Math.random() * 1000}`
  // },
  /* 注册表单 */
  registForm: {
    name: "",
    surname: "",
    userName: "",
    emailAddress: "",
    password: "",
    captchaResponse: ""
  }
})
const dialogVisible = ref(false)
const formLabelWidth = "100px"
/** 初始化验证码 */
// state.createCode()
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="login-card">
      <!-- <div class="title">
        <img src="@/assets/layout/logo-text-2.png" />
      </div> -->
      <h1 style="text-align: center; width: 100%">报价核价系统</h1>
      <div class="content">
        <el-form ref="loginFormDom" :model="state.loginForm" :rules="state.loginRules" @keyup.enter="state.handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model="state.loginForm.userNameOrEmailAddress"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="state.loginForm.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <!-- <el-form-item prop="code">
            <el-input
              v-model="state.loginForm.code"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="4"
              size="large"
            />
            <span class="show-code">
              <img :src="state.codeUrl" @click="state.createCode" />
            </span>
          </el-form-item> -->
          <el-button :loading="state.loading" type="primary" size="large" @click.prevent="state.handleLogin">
            登 录
          </el-button>
          <!-- <div>
            <el-button type="primary" size="large" @click.prevent="dialogVisible = true"> 注册 </el-button>
          </div> -->
        </el-form>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="注册">
      <el-form :model="state.registForm">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="state.registForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="state.registForm.surname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="state.registForm.userName" autocomplete="off" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="state.registForm.emailAddress" autocomplete="off" :prefix-icon="Message" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            v-model="state.registForm.password"
            placeholder="密码"
            type="password"
            tabindex="2"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth">
          <el-input v-model="state.registForm.captchaResponse" autocomplete="off" :prefix-icon="Key" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      .show-code {
        position: absolute;
        right: 0px;
        top: 0px;
        cursor: pointer;
        user-select: none;
        img {
          width: 100px;
          height: 42px;
          border-radius: 4px;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
