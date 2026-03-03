<script lang="ts" setup>
import { ArrowDown, ArrowUp, CircleClose, Edit, Loading, Setting, VideoPlay } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useDate } from '@/shared/composables/useDate'
import { TAG_TYPES } from '@/shared/utils/constants'
import { useSprint } from '../composable/useSprints'

const { sprint } = defineProps<{ sprint: Record<string, any> }>()

const router = useRouter()
const { format } = useDate()
const { startSprintById } = useSprint()

const isOpened = ref(false)
const loading = ref(false)

async function handleCommand(action: 'start' | 'stop' | 'edit') {
  switch (action) {
    case 'stop':
      router.push({ name: 'end-sprint', params: { sprintId: sprint.id, id: sprint.pid } })
      break

    case 'start':
      loading.value = true
      await startSprintById(sprint.id)
      loading.value = false
      break

    default:
      break
  }
}

onMounted(() => {
  if (sprint.started) {
    isOpened.value = true
  }
})
</script>

<template>
  <div class="border-b border-gray-50 py-5">
    <div class="flex justify-between items-center">
      <div class="flex gap-5 items-center">
        <div class="flex flex-col">
          <div class="">
            <div class="flex gap-5 items-center">
              <h3 class="text-lg font-semibold text-primary cursor-pointer" @click="isOpened = !isOpened">
                {{ sprint.title }}
              </h3>
              <el-tag v-if="sprint.started" size="small">
                CURRENT
              </el-tag>
            </div>
            <p class="text-sm text-gray-300" v-if="!sprint.isBacklog">
              {{ format(sprint.startDate, 'do MMM, yyy') }} -
              {{ format(sprint.endDate, 'do MMM, yyy') }}
            </p>
            <p class="text-sm text-gray-300" v-else>
              {{ sprint.tasks.length }} Tasks
            </p>
          </div>
        </div>
      </div>

      <div v-if="!sprint.isBacklog" class="flex gap-5 items-center">
        <el-dropdown :disabled="loading" @command="handleCommand">
          <el-icon class="cursor-pointer" :size="20">
            <Loading v-if="loading" class="animate-spin" />
            <Setting v-else />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="!sprint.started" command="start">
                <div class="flex items-center gap-3">
                  <el-icon :size="16">
                    <VideoPlay />
                  </el-icon>
                  Start Sprint
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="edit">
                <div class="flex items-center gap-3">
                  <el-icon :size="16">
                    <Edit />
                  </el-icon>
                  Edit Sprint
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="sprint.started" command="stop">
                <div class="flex items-center gap-3">
                  <el-icon :size="16">
                    <CircleClose />
                  </el-icon>
                  End Sprint
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="text-gray-300 cursor-pointer flex items-center text-sm" @click="isOpened = !isOpened">
          Goal: {{ sprint.goals }}

          <el-icon class="ml-2">
            <ArrowDown v-if="!isOpened" />
            <ArrowUp v-else />
          </el-icon>
        </div>
      </div>
    </div>

    <div v-if="isOpened" class="mt-3">
      <div v-if="sprint.tasks.length === 0" class="text-gray-300">
        No tasks {{ sprint.isBacklog ? 'added to backlog' : 'scheduled for this sprint'}}, yet.
        <router-link
          class="text-gray-500 underline"
          :to="{ name: 'add-task-to-sprint', params: { sprintId: sprint.id } }"
        >
          Add task to {{ sprint.isBacklog ? 'project backlog' : 'sprint'}}
        </router-link>
      </div>
      <div v-else class="grid gap-3">
        <div
          v-for="(task, key) in sprint.tasks"
          :key class="border border-gray-50 rounded-xl p-5 flex justify-between items-center"
        >
          <div class="flex flex-col">
            <div class="flex gap-3">
              <h3>{{ task.title }}</h3>
              <el-tag size="small" class="capitalize" :type="TAG_TYPES[task.status as 'TO_DO']">
                {{ task.status.toLowerCase().replace('_', ' ') }}
              </el-tag>
            </div>
            <div class="text-gray-300 text-sm flex gap-3">
              <div class="">
                Staff Assigned: <span class="text-gray-500">{{ task.assignedTo.firstName }} {{ task.assignedTo.lastName
                }}</span>
              </div>
              |
              <div class="">
                Due Date: <span class="text-gray-500">{{ format(task.dueDate, 'do MMM, yyy') }}</span>
              </div>
            </div>
          </div>
          <router-link
            :to="{ name: 'view-sprint-task', params: { id: sprint.pid, sprintId: sprint.id, taskId: task.id } }"
          >
            <el-button type="primary" size="large" plain bg text>
              View Details
            </el-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
