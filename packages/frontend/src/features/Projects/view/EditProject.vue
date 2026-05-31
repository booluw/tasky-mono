<script lang="ts" setup>
import type { UpdateProject } from '@dash/shared'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { clone, isEmpty, pick } from 'lodash'

import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import Modal from '@/shared/components/Modal.vue'
import { PROJECT_TYPES, STATUS } from '@/shared/utils/constants'
import { validateRequiredField } from '@/shared/utils/helpers'
import { useProject } from '../composable/useProjects'

const useproject = useProject()
const router = useRouter()
const route = useRoute()

const submitting = computed(() => useproject.submitting.value)
const comp_project = computed(() => useproject.project ?? {})

const formRef = ref<FormInstance>()
const loading = ref(true)
const project = ref(clone(comp_project.value))

const rules = reactive<FormRules<typeof project>>({
  title: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField(project, 'title', callback)
    },
    trigger: 'change',
  }],
  description: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField(project, 'description', callback)
    },
    trigger: 'change',
  }],
  cuid: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField(project, 'cuid', callback)
    },
    trigger: 'change',
  }],
})

function disabledDate(time: Date) {
  return time.getTime() < Date.now()
}

async function submitProject(formEl: FormInstance | undefined) {
  if (!formEl)
    return

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.warn('invalid fields: ', fields)
      return
    }

    try {
      await useproject.updateProject(pick(project.value, ['id', 'title', 'description', 'startDate', 'endDate', 'type', 'status']))
      router.push({ name: 'view-project', params: { id: route.params.id } })
    }
    catch (error) {
      console.error(error)
    }
  })
}

onMounted(async () => {
  loading.value = true
  try {
    await useproject.fetchProjectById(route.params!.id! as string)
  }
  catch (error) {
    console.error(error)
    ElMessage.error('Error loading project')
    router.back()
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Modal heading="Update Project" size="" @close="$router.push({ name: 'view-project', params: { id: $route.params.id } })">
    <el-form ref="formRef" v-loading="loading" :model="project" label-position="top" size="large" :rules>
      <el-scrollbar v-if="!isEmpty(project)" class="!h-[40vh] overflow-y-auto">
        <el-form-item class="md:col-span-2" prop="title" label="Project Name">
          <el-input v-model="project.title" type="text" placeholder="Rocky plains" />
        </el-form-item>
        <div class="grid md:grid-cols-2 md:gap-3">
          <el-form-item class="md:col-span-1" prop="type" label="Project Status">
            <el-select v-model="project.status" placeholder="Select status">
              <el-option v-for="type in STATUS.filter((s) => s.scope.includes('project'))" :key="type.label" :value="type.value" :label="type.label" />
            </el-select>
          </el-form-item>
          <el-form-item class="md:col-span-1" prop="type" label="Project Type">
            <el-select v-model="project.type" placeholder="Select type">
              <el-option v-for="type in PROJECT_TYPES" :key="type.label" :value="type.value" :label="type.label" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item prop="description" label="Project Description">
          <el-input v-model="project.description" type="textarea" placeholder="Building the next big thing." />
        </el-form-item>

        <div class="grid md:grid-cols-3 md:gap-3">
          <el-form-item prop="startDate" label="Project Start Date">
            <el-date-picker v-model="project.startDate" class="w-full" placeholder="Project start date" />
          </el-form-item>

          <el-form-item prop="endDate" label="Project End Date">
            <el-date-picker v-model="project.endDate" placeholder="Project end date" :disabled-date="disabledDate" />
          </el-form-item>

          <el-form-item prop="cuid" label="Client">
            <el-input :value="`${project.client.firstName} ${project.client.lastName}`" disabled />
          </el-form-item>
        </div>
      </el-scrollbar>

      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="$router.push({ name: 'view-project', params: { id: $route.params.id } })">
          Cancel
        </el-button>
        <el-button :loading="submitting" type="primary" @click="submitProject(formRef)">
          Update Project
        </el-button>
      </div>
    </el-form>
  </Modal>
</template>
