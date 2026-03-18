<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Modal from '@/shared/components/Modal.vue'
import { useDate } from '@/shared/composables/useDate'
import { TAG_TYPES, STATUS } from '@/shared/utils/constants'
import { useSprint } from '../composable/useSprints'
import { useStaff } from '../../Staff/composable/useStaff'

const router = useRouter()
const route = useRoute()
const { format } = useDate()
const usesprint = useSprint()
const usestaff = useStaff()

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
  } catch (error) {
    console.error(error)
  } finally {
    statusLoading.value = false
  }
}

async function searchStaff(query: string, cb: any) {
  await searchStaffByKeyword(query)

  const availableStaff = staff.value.filter((staff: any) =>staff.id !== task.value.uid)
    .map((member: any) => ({
      ...member,
      value: `${member.firstName} ${member.lastName}`,
    }));

  cb(availableStaff)
}

async function saveSprint() {
  loading.value = true
  try {
    const { task: _task } = await usesprint.updateTaskById(route.params.taskId as string, { sid: sprintId.value })
    task.value = _task
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    changeSprint.value = false
  }
}

async function updateAssignee(item: any) {
  loading.value = true
  try {
    const { task: _task } = await usesprint.updateTaskById(route.params.taskId as string, { uid: item.id })
    task.value = _task
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    changeAssignee.value = false
  }
}

onMounted(() => {
  fetchTaskById()
})
</script>

<template>
  <Modal v-loading="loading" :heading="task.title" size="large"
    @close="router.push({ name: 'view-project', params: { id: pid } })">
    <template #subheading>
      <p class="text-sm text-gray-200">
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
      </p>
    </template>
    <el-scrollbar v-if="task.title" class="!h-[50vh] overflow-y-auto">
      <div class="border-b border-gray-50/50 grid grid-cols-2 gap-3 pb-3">
        <div class="">
          <h4 class="text-xs text-gray-300">Title</h4>
          {{ task.title }}
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">Staff Assigned</h4>
          <div class="flex items-center gap-5">
            <el-autocomplete v-if="changeAssignee" v-model="assigneeUid" :placeholder="`${task.assignedTo.firstName} ${task.assignedTo.lastName}`" @select="updateAssignee" :loading="sprintLoading"
              :fetch-suggestions="searchStaff">
            </el-autocomplete>
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
          <h4 class="text-xs text-gray-300">Due Date</h4>
          {{ format(task.dueDate, 'do MMM, yyy') }}
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">Status</h4>
          <el-select ref="statusRef" multiple :multiple-limit="1" v-model="task.status" @change="updateStatus"
            v-loading="statusLoading">
            <el-option v-for="(status, key) in STATUS.filter((type: any) => type.scope.includes('task'))" :key
              v-bind="status" />
            <template #tag>
              <el-tag :type="TAG_TYPES[task.status as 'TO_DO']" class="capitalize">
                {{ task.status?.toLowerCase().replaceAll('_', ' ') }}
              </el-tag>
            </template>
          </el-select>
        </div>
      </div>
      <div class="mt-3">
        <h4 class="text-xs text-gray-300">Description</h4>
        <p class="">
          {{ task.description }}
        </p>
      </div>
    </el-scrollbar>
  </Modal>
</template>
