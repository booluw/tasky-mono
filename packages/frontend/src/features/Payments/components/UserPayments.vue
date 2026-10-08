<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

import Modal from '@/shared/components/Modal.vue'
import { useDate } from '@/shared/composables/useDate'
import { formatMonth, formatNaira, PAYMENT_METHODS, usePayments } from '../composable/usePayments'

const { uid } = defineProps<{ uid: string }>()

const usepayments = usePayments()
const { loading, submitting, payments } = usepayments
const { format } = useDate()

const showForm = ref(false)
const paymentForm = ref<FormInstance>()

function emptyPayment() {
  return {
    amount: undefined as number | undefined,
    month: '',
    paidAt: '',
    method: 'TRANSFER',
    note: '',
  }
}
const payment = reactive(emptyPayment())

const required = { required: true, message: 'Please provide a value', trigger: 'change' }
const rules = reactive<FormRules<typeof payment>>({
  amount: [required],
  month: [required],
  paidAt: [required],
  method: [required],
})

async function submitPayment(formEl: FormInstance | undefined) {
  if (!formEl)
    return

  await formEl.validate(async (valid) => {
    if (!valid)
      return

    const ok = await usepayments.addPayment({
      ...payment,
      uid,
      paidAt: new Date(payment.paidAt).toISOString(),
      note: payment.note || undefined,
    })
    if (!ok)
      return

    Object.assign(payment, emptyPayment())
    showForm.value = false
    await usepayments.fetchUserPayments(uid)
  })
}

onMounted(() => usepayments.fetchUserPayments(uid))
</script>

<template>
  <section v-loading="loading" class="mt-10">
    <div class="flex justify-between items-center mb-3">
      <h2 class="uppercase text-gray-200 text-sm">
        Payments
      </h2>
      <el-button type="primary" @click="showForm = true">
        Add payment
      </el-button>
    </div>

    <el-table :data="payments" empty-text="No payments recorded yet">
      <el-table-column label="Month">
        <template #default="{ row }">
          {{ formatMonth(row.month) }}
        </template>
      </el-table-column>
      <el-table-column label="Amount">
        <template #default="{ row }">
          {{ formatNaira(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column label="Paid on">
        <template #default="{ row }">
          {{ format(row.paidAt, 'do MMM, yyy') }}
        </template>
      </el-table-column>
      <el-table-column label="Method">
        <template #default="{ row }">
          <span class="capitalize">{{ row.method.toLowerCase() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="Note" />
      <el-table-column label="Added by">
        <template #default="{ row }">
          {{ row.creator.firstName }} {{ row.creator.lastName }}
        </template>
      </el-table-column>
    </el-table>

    <Modal v-if="showForm" heading="Add payment" size="third" @close="showForm = false">
      <el-form ref="paymentForm" :model="payment" :rules label-position="top" size="large">
        <div class="grid gap-5 grid-cols-2">
          <el-form-item prop="amount" label="Amount (₦)">
            <el-input-number v-model="payment.amount" :min="0.01" :precision="2" :controls="false" class="!w-full" />
          </el-form-item>
          <el-form-item prop="method" label="Method">
            <el-select v-model="payment.method">
              <el-option v-for="m in PAYMENT_METHODS" :key="m" :value="m" :label="m.charAt(0) + m.slice(1).toLowerCase()" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid gap-5 grid-cols-2">
          <el-form-item prop="month" label="Month covered">
            <el-date-picker v-model="payment.month" type="month" value-format="YYYY-MM" class="!w-full" placeholder="Select month" />
          </el-form-item>
          <el-form-item prop="paidAt" label="Payment date">
            <el-date-picker v-model="payment.paidAt" class="!w-full" placeholder="When was it paid?" />
          </el-form-item>
        </div>

        <el-form-item prop="note" label="Note / reference">
          <el-input v-model="payment.note" type="textarea" maxlength="500" placeholder="Optional" />
        </el-form-item>

        <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
          <el-button @click="showForm = false">
            Cancel
          </el-button>
          <el-button :loading="submitting" type="primary" @click="submitPayment(paymentForm)">
            Add payment
          </el-button>
        </div>
      </el-form>
    </Modal>
  </section>
</template>
