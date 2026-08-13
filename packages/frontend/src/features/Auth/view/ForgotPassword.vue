<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue'
import AppLogo from '@/shared/components/Logo.vue'
import { useAuth } from '../composable/useAuth'

const auth = useAuth()

const loading = auth.loading

const emailSetForm = ref<FormInstance>()
const data = reactive({ email: '' })

function validateEmail(rule: any, value: any, callback: any) {
  if (data.email === '') {
    callback(new Error('Please provide an email'))
  }
  else if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
    callback(new Error('Email is not valid'))
  }
  callback()
}

const rules = reactive<FormRules<typeof data>>({
  email: [{ validator: validateEmail, trigger: 'change' }],
})

async function submit(formEl: FormInstance | undefined) {
  if (!formEl)
    return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await auth.forgotPassword(data.email)
    }
    else {
      console.warn('fields error; ', fields)
    }
  })
}
</script>

<template>
  <section class="h-auto w-2/3 min-lg:w-1/4 shadow rounded bg-white/90 p-5">
    <div class="flex flex-col gap-3 items-center justify-center pt-5 pb-1">
      <AppLogo />
      <h1 class="text-2xl font-semibold text-primary capitalize">
        Forgot Account Password
      </h1>
    </div>

    <p class="text-center">
      Please provide your email address
    </p>

    <el-form ref="emailSetForm" :model="data" :rules label-position="top" size="large" class="my-3">
      <el-form-item label="Email" prop="email">
        <el-input v-model="data.email" type="email" placeholder="john.doe@example.com" />
      </el-form-item>

      <el-button type="primary" class="w-full" :loading @click="submit(emailSetForm)">
        Submit
      </el-button>
    </el-form>
  </section>
</template>
