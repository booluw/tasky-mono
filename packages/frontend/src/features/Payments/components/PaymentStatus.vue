<script lang="ts" setup>
import { onMounted } from 'vue'

import { formatMonth, usePayments } from '../composable/usePayments'

const usepayments = usePayments()
const { status, loading } = usepayments

onMounted(() => usepayments.fetchMyCurrentStatus())
</script>

<template>
  <div
    v-loading="loading" class="mb-5 p-5 rounded-xl border"
    :class="status?.paid ? 'bg-emerald-50/30 border-emerald-200' : 'bg-red-50/30 border-red-200'"
  >
    <template v-if="status">
      <h3 class="text-sm uppercase opacity-65">
        Payment for {{ formatMonth(status.month) }}
      </h3>
      <p class="mt-2 font-bold" :class="status.paid ? 'text-emerald-700' : 'text-red-600'">
        {{ status.paid ? 'Paid' : 'Not paid yet' }}
      </p>
    </template>
    <p v-else-if="!loading" class="text-sm opacity-65">
      Couldn't load your payment status.
    </p>
  </div>
</template>
