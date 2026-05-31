<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Modal from '@/shared/components/Modal.vue'
import { useDate } from '@/shared/composables/useDate'
import { STATUS, TAG_TYPES } from '@/shared/utils/constants'
import { useAuthStore } from '../../Auth/store/useAuthStore';
import { useStaff } from '../../Staff/composable/useStaff'
import { useSprint } from '../composable/useSprints'

const router = useRouter()
const route = useRoute()
const { format } = useDate()
const usesprint = useSprint()
const usestaff = useStaff()
const auth = useAuthStore()

const { staff, searchStaffByKeyword } = usestaff
const { sprints, loading: sprintLoading } = usesprint

const loading = ref(true)
const statusLoading = ref(false)
const statusRef = ref()
const task = ref<Record<string, any>>({})
const pid = computed(() => route.params.id)

const changeSprint = ref(false)
const sprintId = ref()

const changeAssignee = ref(false)
const assigneeUid = ref()

const comment = ref('')
const addingComment = ref(false)

async function fetchTaskById() {
  loading.value = true

  try {
    const { task: _task } = await usesprint.findTaskById(route.params.taskId as string)
    task.value = _task
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

async function updateStatus(val: string[]) {
  task.value.status = val[0]
  statusLoading.value = true
  statusRef.value.blur()

  try {
    const { task: _task } = await usesprint.updateTaskById(route.params.taskId as string, { status: task.value.status })
    task.value = _task
  }
  catch (error) {
    console.error(error)
  }
  finally {
    statusLoading.value = false
  }
}

async function searchStaff(query: string, cb: any) {
  await searchStaffByKeyword(query)

  const availableStaff = staff.value.filter((staff: any) => staff.id !== task.value.uid)
    .map((member: any) => ({
      ...member,
      value: `${member.firstName} ${member.lastName}`,
    }))

  cb(availableStaff)
}

async function saveSprint() {
  loading.value = true
  try {
    const { task: _task } = await usesprint.updateTaskById(route.params.taskId as string, { sid: sprintId.value })
    task.value = _task
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
    changeSprint.value = false
  }
}

async function updateAssignee(item: any) {
  loading.value = true
  try {
    const { task: _task } = await usesprint.updateTaskById(route.params.taskId as string, { uid: item.id })
    task.value = _task
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
    changeAssignee.value = false
  }
}

async function createComment() {
  addingComment.value = true

  try {
    const { task: _task } = await usesprint.createTaskComment(
      { id: route.params.taskId as string, text: comment.value, uid: auth.user.id }
    )
    task.value = _task
    comment.value = ""
  } catch (error) {
    console.error(error)
  } finally {
    addComment.value = false
  }
}

onMounted(() => {
  fetchTaskById()
})
</script>

<template>
  <Modal v-loading="loading" :heading="task.title" size="third"
    @close="router.push({ name: 'view-project', params: { id: pid } })">
    <template #subheading>
      <div class="text-sm text-gray-200">
        <div class="mb-3">
          {{ task.sprint ? `Sprint: ${task?.sprint?.title}` : '' }}
          |
          <div class="inline-flex gap-3 items-center">
            <a class="text-primary text-sm cursor-pointer"
              @click="changeSprint ? saveSprint() : changeSprint = !changeSprint">
              {{ changeSprint ? 'Save' : 'Change' }}
            </a>
            <a v-if="changeSprint" class="text-red-500 text-sm cursor-pointer" @click="changeSprint = !changeSprint">
              Cancel
            </a>
          </div>
        </div>
        <el-select v-show="changeSprint" v-model="sprintId" placeholder="Select a sprint">
          <template v-for="(sprint, key) in sprints" :key>
            <el-option v-if="sprint.id !== task.sid" :value="sprint.id" :label="sprint.title" />
          </template>
        </el-select>
      </div>
    </template>
    <template v-if="task.title">
      <div class="border-b border-gray-50/50 grid md:grid-cols-2 gap-5 pb-3">
        <div class="">
          <h4 class="text-xs text-gray-300">
            Staff Assigned
          </h4>
          <div class="flex items-center gap-5">
            <el-autocomplete v-if="changeAssignee" v-model="assigneeUid"
              :placeholder="`${task.assignedTo.firstName} ${task.assignedTo.lastName}`" :loading="sprintLoading"
              :fetch-suggestions="searchStaff" @select="updateAssignee" />
            <div v-else>
              {{ task.assignedTo.firstName }}
              {{ task.assignedTo.lastName }}
            </div>

            <a class="text-sm text-primary cursor-pointer" @click="changeAssignee = !changeAssignee">
              {{ changeAssignee ? 'Cancel' : 'Change' }}
            </a>
          </div>
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">
            Due Date
          </h4>
          {{ format(task.dueDate, 'do MMM, yyy') }}
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">
            Status
          </h4>
          <el-select ref="statusRef" v-model="task.status" v-loading="statusLoading" multiple :multiple-limit="1"
            @change="updateStatus">
            <el-option v-for="(status, key) in STATUS.filter((type: any) => type.scope.includes('task'))" :key
              v-bind="status" />
            <template #tag>
              <el-tag :type="TAG_TYPES[task.status as 'TO_DO']" class="capitalize">
                {{ task.status?.toLowerCase().replaceAll('_', ' ') }}
              </el-tag>
            </template>
          </el-select>
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">
            Description
          </h4>
          <p class="">
            {{ task.description }}
          </p>
        </div>
      </div>
      <h3 v-if="task.comments.length !== 0" class="my-5">Comments</h3>
      <el-scrollbar class="max-h-[25vh] mb-5">
        <el-empty v-if="task.comments.length === 0" description="No comments yet." />
        <template v-else>
          <div v-for="item in task.comments" :key="item.id" class="p-2 bg-slate-50 text-slate-500 rounded">
            {{ item.text }}
            <div class="border-slate-200 border-t pt-1 mt-2 flex justify-end items-center gap-3 capitalize text-sm">
              {{ item.user.firstName }} {{ item.user.lastName }}
              <div class="p-1 h-1 w-1 bg-slate-300 rounded-full" />
              {{ format(item.createdAt, 'do MMM, yyy') }}
            </div>
          </div>
        </template>
      </el-scrollbar>

      <div class="md:max-h-[15vh] overflow-auto grid gap-3">
        <el-input v-model="comment" :autosize="{ minRows: 2, maxRows: 5 }" type="textarea"
          placeholder="Please input your comment" size="large" />
        <div class="flex gap-5 justify-between items-center">
          <p class="text-xs" :class="{ 'text-transparent': comment.length >= 20 }">
            Comments should be atleast 20 characters long.
            <b>{{ 20 - comment.length }} left</b>
          </p>
          <el-button type="primary" size="large" @click="createComment()" :disabled="comment.length <= 20">
            Comment
          </el-button>
        </div>
      </div>
    </template>
  </Modal>
</template>
