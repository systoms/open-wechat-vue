<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 左侧图片 -->
      <div class="login-left">
        <img src="@/assets/login-left.svg" alt="login" />
        <div class="left-text">
          <h2>欢迎使用</h2>
          <p>Vue3 + Vite 后台管理系统</p>
        </div>
      </div>
      
      <!-- 右侧登录表单 -->
      <div class="login-form">
        <div class="login-header">
          <img src="@/assets/logo.png" class="login-logo" alt="logo" />
          <h2>后台管理系统</h2>
          <p class="sub-title">欢迎回来，请输入您的账号密码</p>
        </div>
        
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <div class="flex-between">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <el-link type="primary" class="forget-pwd">忘记密码？</el-link>
          </div>
          
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            登录
          </el-button>

          <div class="other-login">
            <div class="divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-login">
              <el-tooltip content="Github登录" placement="top">
                <i class="fab fa-github"></i>
              </el-tooltip>
              <el-tooltip content="微信登录" placement="top">
                <i class="fab fa-weixin"></i>
              </el-tooltip>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'

const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    loading.value = true
    await loginFormRef.value.validate()
    // TODO: 实现登录逻辑
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    animation: rotate 30s linear infinite;
  }

  .login-box {
    width: 96%;
    max-width: 1000px;
    height: 600px;
    background-color: rgba(255, 255, 255, 0.98);
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    overflow: hidden;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    position: relative;
    z-index: 1;

    .login-left {
      flex: 1;
      background: linear-gradient(135deg, #f6f9fc 0%, #ecf2f7 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      position: relative;

      img {
        max-width: 90%;
        height: auto;
        margin-bottom: 30px;
      }

      .left-text {
        text-align: center;
        color: #1890ff;

        h2 {
          font-size: 28px;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          color: #666;
          font-size: 16px;
        }
      }
    }

    .login-form {
      width: 400px;
      padding: 40px;
      
      .login-header {
        text-align: center;
        margin-bottom: 40px;

        .login-logo {
          height: 56px;
          margin-bottom: 16px;
        }

        h2 {
          font-size: 28px;
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .sub-title {
          color: #666;
          font-size: 14px;
        }
      }

      :deep(.el-input) {
        .el-input__wrapper {
          background-color: #f6f9fc;
          box-shadow: none !important;
          border: 1px solid #e4e9f0;
          height: 44px;
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            border-color: #1890ff;
            background-color: #fff;
          }

          &.is-focus {
            border-color: #1890ff;
            background-color: #fff;
            box-shadow: 0 0 0 2px rgba(24,144,255,0.1) !important;
          }
        }

        .el-input__prefix {
          font-size: 18px;
          color: #909399;
        }
      }

      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 24px;
      }

      .login-btn {
        width: 100%;
        height: 44px;
        font-size: 16px;
        border-radius: 8px;
        font-weight: 500;
        letter-spacing: 1px;
        background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
        border: none;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(24,144,255,0.3);
        }
      }

      .other-login {
        margin-top: 24px;

        .divider {
          display: flex;
          align-items: center;
          color: #999;
          font-size: 12px;
          margin: 24px 0;

          &::before,
          &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #eee;
          }

          span {
            padding: 0 16px;
          }
        }

        .social-login {
          display: flex;
          justify-content: center;
          gap: 20px;

          i {
            font-size: 24px;
            color: #666;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              color: #1890ff;
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .login-container {
    .login-box {
      height: auto;
      min-height: 500px;

      .login-left {
        display: none;
      }

      .login-form {
        width: 100%;
      }
    }
  }
}
</style> 