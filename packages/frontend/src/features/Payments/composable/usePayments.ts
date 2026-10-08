import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { createApiConfig } from '@/config/api'

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/payments`)

export const PAYMENT_METHODS = ['TRANSFER', 'CASH', 'CARD', 'OTHER'] as const

export function formatNaira(amount: number | string) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(amount))
}

// "2026-10" -> "October 2026"
export function formatMonth(month: string) {
  return new Date(`${month}-01T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export function usePayments() {
  const loading = ref(false)
  const submitting = ref(false)
  const payments = ref<any[]>([])
  const status = ref<{ month: string, paid: boolean }>()

  const fetchUserPayments = async (uid: string) => {
    loading.value = true

    try {
      const { payments: _payments } = await api.get(`/user/${uid}`)

      payments.value = _payments
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      loading.value = false
    }
  }

  const addPayment = async (payload: any) => {
    submitting.value = true

    try {
      const { message } = await api.post('', payload)

      ElMessage.success(message)
      return true
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
      return false
    }
    finally {
      submitting.value = false
    }
  }

  const fetchMyCurrentStatus = async () => {
    loading.value = true

    try {
      status.value = await api.get('/me/current')
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    submitting,
    payments,
    status,
    fetchUserPayments,
    addPayment,
    fetchMyCurrentStatus,
  }
}
