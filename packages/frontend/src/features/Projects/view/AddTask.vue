<script lang="ts" setup>
import { type FormInstance, type FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useStaff } from '@/features/Staff/composable/useStaff'

import Modal from '@/shared/components/Modal.vue'
import { useSprint } from '../composable/useSprints'
import { validateRequiredField } from '@/shared/utils/helpers'

const router = useRouter()
const route = useRoute()
const usestaff = useStaff()
const usesprint = useSprint()

const { staff, searchStaffByKeyword } = usestaff
const { submitting, sprints, loading } = usesprint

const taskFormRef = ref<FormInstance>()
const task = reactive({
  title: '',
  status: 'TO_DO',
  description: '',
  sid: route.params.sprintId ?? '',
  startDate: new Date(),
  dueDate: new Date(),
  uid: '',
  keyword: ''
})

const rules = reactive<FormRules<typeof task>>({
  title: [{
    validator: (value: any, rule: any, callback: any) => {
      validateRequiredField(task, 'title', callback)
    }, trigger: 'change'
  }],
  description: [{
    validator: (value: any, rule: any, callback: any) => {
      validateRequiredField(task, 'description', callback)
    }, trigger: 'change'
  }],
  sid: [{
    validator: (value: any, rule: any, callback: any) => {
      validateRequiredField(task, 'sid', callback)
    }, trigger: 'change'
  }],
  uid: [{
    validator: (value: any, rule: any, callback: any) => {
      validateRequiredField(task, 'uid', callback)
    }, trigger: 'change'
  }],
})

const selectedSprint = computed(() => sprints.value.find((sprint) => sprint.id === task.sid))

function disabledStartDate(time: Date) {
  return time.getTime() < (new Date(selectedSprint.value?.startDate).getTime() || new Date().getTime())
}

function disabledDueDate(time: Date) {
  return time.getTime() < new Date(selectedSprint.value?.endDate).getTime()
}

async function searchStaff(query: string, cb: any) {
  await searchStaffByKeyword(query)

  const availableStaff = staff.value
    .map((member: any) => ({
      ...member,
      value: `${member.firstName} ${member.lastName}`,
    }));

  cb(availableStaff)
}

async function submitTask(formEl: FormInstance | undefined) {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.warn('invalid fields; ', fields)
      return
    }

    try {

      const { keyword: _keyword, ...rest } = task

      const { id, sid, pid } = await usesprint.createTask(rest)
      router.push({ name: 'view-sprint-task', params: { id: pid, sprintId: sid, taskId: id } })
    } catch (error) {
      console.warn(error)
    }
  })
}
</script>

<template>
  <Modal heading="Add New Task" size="third" @close="router.back()">
    <el-form ref="taskFormRef" :rules :model="task" label-position="top" size="large">
      <el-scrollbar class="!h-[40vh] overflow-y-auto">
        <el-form-item label="Sprint" prop="sid" v-loading="loading" v-if="route.params.sprintId === undefined">
          <el-select v-model="task.sid" placeholder="Select a sprint">
            <el-option v-for="(sprint, key) in sprints" :key :value="sprint.id" :label="sprint.title" />
          </el-select>
        </el-form-item>

        <el-form-item label="Title" prop="title">
          <el-input v-model="task.title" placeholder="Task Title" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input type="textarea" v-model="task.description" placeholder="Describe what this task is about" />
        </el-form-item>

        <el-form-item label="Assignee" prop="uid">
          <el-autocomplete v-model="task.keyword" placeholder="Search for staff" :fetch-suggestions="searchStaff"
            @select="(item: any) => task.uid = item.id">
            <!-- <template #default="{ item }">
              <div class="">
                {{ item.firstName }} {{ item.lastName }}
              </div>
            </template> -->
          </el-autocomplete>
        </el-form-item>

        <div class="grid gap-5 grid-cols-2">
          <el-form-item prop="startDate" label="Start Date">
            <el-date-picker v-model="task.startDate" class="w-full" placeholder="Task start date"
              :disabled-date="disabledStartDate" />
          </el-form-item>
          <el-form-item prop="endDate" label="Due Date">
            <el-date-picker v-model="task.dueDate" class="w-full" placeholder="Task due date"
              :disabled-date="disabledDueDate" />
          </el-form-item>
        </div>
      </el-scrollbar>

      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="$router.back()">
          Cancel
        </el-button>
        <el-button :loading="submitting" type="primary" @click="submitTask(taskFormRef)">
          Create Task
        </el-button>
      </div>
    </el-form>
  </Modal>
</template>
