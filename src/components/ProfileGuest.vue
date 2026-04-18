<template>
  <div class="guest-page">
    <div class="guest-card">
      <section class="hero-section">
        <div class="hero-left">
          <h1 class="hero-title">{{ heroTitle }}</h1>
          <p class="hero-subtitle">{{ heroSubtitle }}</p>
        </div>

        <div class="hero-avatar">
          <div class="avatar-circle">
            <div class="avatar-head"></div>
            <div class="avatar-body"></div>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="panel-section">
        <div v-if="mode === 'entry'" class="entry-layout">
          <div class="entry-card">
            <h2>Welcome back</h2>
            <p>Log in to continue your vocabulary journey and sync your review record.</p>
            <button class="primary-btn" @click="mode = 'login'">Go to Log in</button>
          </div>

          <div class="entry-card register-card">
            <h2>New here?</h2>
            <p>Create your account first. Registration and login are separated here.</p>
            <button class="secondary-btn" @click="mode = 'register'">Go to Register</button>
          </div>
        </div>

        <div v-else-if="mode === 'login'" class="form-layout">
          <div class="form-card">
            <button class="top-back" @click="mode = 'entry'">Back</button>
            <h2 class="form-title">Log in</h2>

            <div class="field">
              <label>Account</label>
              <input v-model.trim="loginForm.account" type="text" placeholder="Enter your account" />
            </div>

            <div class="field">
              <label>Password</label>
              <input v-model.trim="loginForm.password" type="password" placeholder="Enter your password" />
            </div>

            <div class="form-actions">
              <button class="primary-btn" :disabled="submitting" @click="handleLogin">
                {{ submitting ? 'Logging in...' : 'Log in' }}
              </button>
              <button class="text-btn" @click="mode = 'register'">No account yet? Register</button>
            </div>
          </div>
        </div>

        <div v-else class="form-layout">
          <div class="form-card register-panel">
            <button class="top-back" @click="mode = 'entry'">Back</button>
            <h2 class="form-title">Register</h2>

            <div class="field">
              <label>Name</label>
              <input v-model.trim="registerForm.name" type="text" placeholder="Enter your name" />
            </div>

            <div class="field">
              <label>Account</label>
              <input v-model.trim="registerForm.account" type="text" placeholder="Create your account" />
            </div>

            <div class="field">
              <label>Password</label>
              <input v-model.trim="registerForm.password" type="password" placeholder="Create your password" />
            </div>

            <div class="field">
              <label>Confirm password</label>
              <input
                v-model.trim="registerForm.confirmPassword"
                type="password"
                placeholder="Type it again"
              />
            </div>

            <div class="form-actions">
              <button class="secondary-btn" :disabled="submitting" @click="handleRegister">
                {{ submitting ? 'Creating...' : 'Register' }}
              </button>
              <button class="text-btn" @click="mode = 'login'">Already have an account? Log in</button>
            </div>
          </div>
        </div>

        <p v-if="message" class="message-text">{{ message }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

const router = useRouter()
const userStore = useUserStore()

const mode = ref('entry')
const message = ref('')
const submitting = ref(false)

const loginForm = reactive({
  account: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  account: '',
  password: '',
  confirmPassword: ''
})

const heroTitle = computed(() => {
  if (mode.value === 'login') return 'Dear user,\nyou have not logged in yet.'
  if (mode.value === 'register') return 'Create your own\nlearning profile.'
  return 'Profile\nis waiting for you.'
})

const heroSubtitle = computed(() => {
  if (mode.value === 'login') return 'Please log in to continue your personalized learning.'
  if (mode.value === 'register') return 'A new account lets you save words, review history and progress.'
  return 'Choose log in or register to enter your personal space.'
})

const handleLogin = async () => {
  message.value = ''

  if (!loginForm.account || !loginForm.password) {
    message.value = 'Please fill in both account and password.'
    return
  }

  submitting.value = true

  try {
    await userStore.login(loginForm)
    router.go(0)
  } catch (error) {
    message.value = error.message || 'Incorrect account or password.'
  } finally {
    submitting.value = false
  }
}

const handleRegister = async () => {
  message.value = ''

  if (
    !registerForm.name ||
    !registerForm.account ||
    !registerForm.password ||
    !registerForm.confirmPassword
  ) {
    message.value = 'Please complete all fields.'
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    message.value = 'The two passwords do not match.'
    return
  }

  submitting.value = true

  try {
    await userStore.register({
      account: registerForm.account,
      email: registerForm.account,
      password: registerForm.password
    })

    await userStore.login({
      account: registerForm.account,
      password: registerForm.password
    })

    router.go(0)
  } catch (error) {
    message.value = error.message || 'Register failed.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.guest-page {
  min-height: 100vh;
  background: #d8e1cf;
  padding: 24px;
  box-sizing: border-box;
}

.guest-card {
  min-height: calc(100vh - 48px);
  background: #79c19d;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 42px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1);
  padding: 34px 38px 42px;
  box-sizing: border-box;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.hero-title {
  margin: 0;
  white-space: pre-line;
  font-size: 64px;
  line-height: 1.08;
  font-weight: 800;
  color: #111;
}

.hero-subtitle {
  margin: 20px 0 0;
  font-size: 22px;
  line-height: 1.45;
  color: #4c4746;
}

.hero-avatar {
  flex-shrink: 0;
  padding-right: 18px;
}

.avatar-circle {
  position: relative;
  width: 176px;
  height: 176px;
  border-radius: 50%;
  background: #f2b247;
  overflow: hidden;
}

.avatar-head {
  position: absolute;
  width: 78px;
  height: 92px;
  background: #dc8a8d;
  border-radius: 46px 46px 40px 40px;
  top: 34px;
  left: 54px;
}

.avatar-head::before {
  content: '';
  position: absolute;
  width: 88px;
  height: 54px;
  background: #9f485f;
  border-radius: 48px 48px 22px 18px;
  top: -10px;
  left: -6px;
}

.avatar-head::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #f2d7c7;
  border-radius: 50%;
  right: -8px;
  top: 32px;
}

.avatar-body {
  position: absolute;
  width: 118px;
  height: 66px;
  background: #c8c462;
  border-radius: 50% 50% 0 0;
  bottom: 8px;
  left: 29px;
}

.divider {
  height: 2px;
  background: rgba(255, 248, 220, 0.6);
  margin: 24px 28px 40px;
}

.panel-section {
  max-width: 1360px;
  margin: 0 auto;
}

.entry-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 34px;
}

.entry-card,
.form-card {
  position: relative;
  background: #ece8b8;
  border-radius: 36px;
  padding: 40px 42px;
  box-sizing: border-box;
  min-height: 300px;
  box-shadow: 0 16px 30px rgba(100, 90, 55, 0.08);
}

.entry-card h2,
.form-title {
  margin: 0 0 14px;
  font-size: 42px;
  font-weight: 800;
  color: #171515;
}

.entry-card p {
  margin: 0;
  font-size: 18px;
  line-height: 1.7;
  color: #4d4640;
  max-width: 460px;
}

.register-card {
  background: #efeabf;
}

.form-layout {
  display: flex;
  justify-content: center;
}

.form-card {
  width: min(780px, 100%);
  min-height: auto;
}

.register-panel {
  background: #efeabf;
}

.top-back {
  position: absolute;
  top: 24px;
  right: 28px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #171515;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.field label {
  font-size: 20px;
  font-weight: 800;
  color: #1f1a18;
}

.field input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(100, 88, 64, 0.16);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  font-size: 16px;
  color: #2c2622;
  box-sizing: border-box;
  outline: none;
}

.form-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.primary-btn,
.secondary-btn,
.text-btn {
  border: none;
  border-radius: 999px;
  padding: 14px 22px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.primary-btn {
  background: #dcc66b;
  color: #271f13;
}

.secondary-btn {
  background: #ef7d42;
  color: #24170f;
}

.text-btn {
  background: rgba(0, 0, 0, 0.06);
  color: #312924;
}

.message-text {
  margin: 22px 0 0;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #7a3f31;
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 48px;
  }

  .entry-layout {
    grid-template-columns: 1fr;
  }

  .entry-card h2,
  .form-title {
    font-size: 34px;
  }
}

@media (max-width: 768px) {
  .guest-page {
    padding: 12px;
  }

  .guest-card {
    min-height: calc(100vh - 24px);
    padding: 20px 18px 24px;
    border-radius: 26px;
  }

  .hero-section {
    align-items: center;
    gap: 14px;
  }

  .hero-title {
    font-size: 34px;
    line-height: 1.15;
  }

  .hero-subtitle {
    font-size: 16px;
    margin-top: 12px;
  }

  .avatar-circle {
    width: 96px;
    height: 96px;
  }

  .avatar-head {
    width: 42px;
    height: 52px;
    left: 29px;
    top: 20px;
  }

  .avatar-head::before {
    width: 50px;
    height: 26px;
    left: -4px;
  }

  .avatar-body {
    width: 62px;
    height: 34px;
    left: 17px;
  }

  .divider {
    margin: 18px 6px 20px;
  }

  .entry-card,
  .form-card {
    border-radius: 26px;
    padding: 24px 20px;
  }

  .entry-card h2,
  .form-title {
    font-size: 28px;
  }

  .entry-card p,
  .field label {
    font-size: 16px;
  }

  .field input {
    font-size: 15px;
  }

  .top-back {
    top: 16px;
    right: 18px;
    font-size: 16px;
  }
}
</style>
