<script setup>
import { ref, reactive, onMounted, getCurrentInstance, toRefs, watch } from 'vue'
import { getCodeImg } from '@/api/login'
import useUserStore from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
// const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const redirect = ref(undefined)

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect
  },
  { immediate: true }
)

const form = reactive({
  username: '',
  password: '',
  verifyCode: ''
})
const rules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const loading = ref(false)
const codeUrl = ref('')
const captchaEnabled = ref(false) // 是否开启验证码

const getCode = () => {
  getCodeImg().then((res) => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      codeUrl.value = 'data:image/gif;base64,' + res.img
      form.uuid = res.uuid
    }
  })
}
const toLogin = () => {
  userStore
    .Login(form)
    .then((res) => {
      console.log(res)
      router.push({ path: redirect.value || '/' })
    })
    .catch(() => {
      if (captchaEnabled.value) {
        getCode()
      }
    })
}
onMounted(() => {
  getCode()
})
</script>
<template>
  <div class="login">
    <div class="login-content">
      <div class="logo">
        <img src="@/assets/logo/logo.jpg" alt="" />
      </div>
      <van-form @submit="toLogin">
        <van-cell-group>
          <van-field
            v-model.trim="form.username"
            label="账号"
            placeholder="请输入账号"
            :rules="rules.username"
            :error="false"
          />
          <van-field
            v-model.trim="form.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="rules.password"
            :error="false"
          />
          <van-field
            v-if="captchaEnabled"
            v-model.trim="form.verifyCode"
            type="text"
            label="验证码"
            center
            :error="false"
            placeholder="请输入验证码"
            :rules="rules.verifyCode"
          >
            <template #button>
              <div class="verifly-code" @click="getCode">
                <img :src="codeUrl" alt="" />
              </div>
            </template>
          </van-field>
        </van-cell-group>
        <van-button :loading="loading" type="primary" block class="login-btn" native-type="submit">登 录</van-button>
      </van-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.logo {
  width: 30vw;
  margin: 0 auto;
  img {
    width: 100%;
  }
}
.login {
  height: 100vh;
  display: grid;
  place-content: center;
  &-content {
    margin-top: -15vh;
    padding: 1.5rem;
    box-sizing: border-box;
  }
  &-btn {
    margin-top: 4rem;
  }
  .verifly-code {
    width: 7rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
