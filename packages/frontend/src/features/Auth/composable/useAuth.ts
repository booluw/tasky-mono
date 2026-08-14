import type { ILoginData } from '@dash/shared'

import { ElMessage } from 'element-plus'
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { createApiConfig } from '@/config/api'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '../store/useAuthStore'

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/auth`)
const loading = ref(false)

export function useAuth() {
  const appstore = useAppStore()
  const authstore = useAuthStore()

  const router = useRouter()

  const logUserIn = async function (payload: ILoginData) {
    loading.value = true
    try {
      const { user, auth, setPassword } = await api.post('/login', payload)

      if (setPassword) {

        appstore.setToken(auth.token)
        authstore.setEmail(payload.email)
        router.replace({ name: 'accept-invite' })
        return
      }

      appstore.setRefresh(auth.refresh)
      appstore.setToken(auth.token)

      authstore.setUser(user)

      router.replace({ name: 'dashboard' })
      ElMessage.success(`Welcome back, ${user.firstName}`)
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      loading.value = false
    }
  }

  const setPassword = async function (password: string) {
    loading.value = true

    try {
      const { message } = await api.post('/set-password', { email: authstore.email, password })

      ElMessage.success(message)
      router.replace({ name: 'login' })
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async function (email: string) {
    loading.value = true
    try {
      await api.post('/reset-password', { email })

      ElMessage.success("Check you Email for Next Steps")
      router.replace({ name: 'login' })
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      loading.value = false
    }
  }

  return {
    logUserIn,
    setPassword,
    loading,
    forgotPassword
  }
}
