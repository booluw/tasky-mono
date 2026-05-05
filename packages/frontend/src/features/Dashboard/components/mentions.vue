<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

import { useAuthStore } from '@/features/Auth/store/useAuthStore';
import { createApiConfig } from '../../../config/api';

const { user } = useAuthStore()

const api = createApiConfig(import.meta.env.VITE_BASE_URL)
const loading = ref(false)

async function sendEmailReport() {
  loading.value = true

  try {
    const { message } = await api.get('/cron/weekly-reports')

    ElMessage.success(message)
  } catch (error) {
    console.error(error)
    ElMessage.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="">
    <div class="border border-slate-300 p-5 rounded-xl flex flex-col gap-3" v-if="user.role === 'SUPER_ADMIN'">
      <h2 class="">Weekly Email Report</h2>
      <p class="text-sm">
        Send email reports to both clients and the super admin. This will send a report of work done.
      </p>
      <el-button
        @click="sendEmailReport()"
        type="primary"
        size="large"
        :loading
      >
        Send Report
      </el-button>
    </div>
  </section>
</template>
