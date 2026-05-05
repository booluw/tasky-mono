<script lang="ts" setup>
import { Calendar, Document } from '@element-plus/icons-vue'
import { computed, onMounted } from 'vue'

import { useAuthStore } from '@/features/Auth/store/useAuthStore'
import { useDate } from '@/shared/composables/useDate'
import DashboardMentions from '../components/mentions.vue'
import { useDashoard } from '../composables/useDashboard'

const usedashboard = useDashoard()
const { user } = useAuthStore()
const { format } = useDate()

const tasks = computed(() => usedashboard.tasks.value)
const tasksAnalytics = computed(() => usedashboard.tasksAnalytics.value)
const upcoming = computed(() => usedashboard.upcoming.value)

onMounted(async () => {
  usedashboard.loadTasksAnalytics()
  usedashboard.loadUpcomingTasks()
  usedashboard.loadTasks()
})
</script>

<template>
  <section class="!h-[100vh]">
    <div class="">
      <h1 class="text-3xl capitalize">
        Welcome Back, {{ user.firstName }}
      </h1>
      <p class="opacity-65">
        Here's what's happening with your tasks today.
      </p>
    </div>

    <section class="md:grid gap-5 grid-cols-6 mt-10 h-[80vh]" v-loading="upcoming.loading">
      <div class="col-span-4">
        <div class="">
          <div class="flex justify-between mb-3">
            <h2 class="uppercase text-gray-200 text-sm">Upcoming tasks</h2>
          </div>

          <div v-if="upcoming.items.length === 0" class="p-5 bg-emerald-50/30 border border-emerald-200 rounded-xl">
            <h3 class="text-emerald-700 font-bold">
              All Caught up!
            </h3>
            <p class="mt-3 text-emerald-500">
              Well done, you currently don't have anything on your tab at the moment.
            </p>
          </div>

          <el-scrollbar v-else class="!max-h-[50vh]">
            <Router-Link
              :to="{ name: 'view-sprint-task', params: { id: task.sprint.pid, sprintId: task.sprint.id, taskId: task.id } }"
              v-for="task in upcoming.items" :key="task.id"
              class="mb-3 p-5 flex flex-col gap-2 rounded-xl border border-gray-50 hover:bg-gray-50/20 ease-in-out duration-300">
              <div class="text-sm flex justify-between">
                <h4 class="text-gray-300 uppercase">
                  {{ task.sprint.project.title }}
                </h4>
                <div class="text-gray-200 font-semibold">
                  Due: {{ format(task?.dueDate, "do MMM, yyy") }}
                </div>
              </div>
              <h3 class="text-xl capitalize">
                {{ task.title }}
              </h3>
            </Router-Link>
          </el-scrollbar>
        </div>

        <div class="mt-10">
          <div class="flex justify-between mb-3">
            <h2 class="uppercase text-gray-200 text-sm">Pending tasks</h2>
          </div>

          <div v-if="tasks.items.length === 0" class="p-5 bg-emerald-50/30 border border-emerald-200 rounded-xl">
            <h3 class="text-emerald-700 font-bold">
              All Caught up!
            </h3>
            <p class="mt-3 text-emerald-500">
              Well done, you currently don't have anything on your tab at the moment.
            </p>
          </div>

          <el-scrollbar v-else class="!max-h-[18vh]">
            <Router-Link
              :to="{ name: 'view-sprint-task', params: { id: task.sprint.pid, sprintId: task.sprint.id, taskId: task.id } }"
              v-for="task in tasks.items" :key="task.id"
              class="mb-3 p-3 flex flex-col gap-2 rounded-lg border border-gray-50 hover:bg-gray-50/20 ease-in-out duration-300">
              <div class="flex justify-between items-center">
                <h3 class="capitalize">
                  {{ task.title }}
                </h3>
                <div class="text-red-500 text-sm">
                  Due: {{ format(task?.dueDate, "do MMM, yyy") }}
                </div>
              </div>
            </Router-Link>
          </el-scrollbar>
        </div>
      </div>

      <DashboardMentions />
    </section>
  </section>

  <RouterView :key="$route.fullPath" />
</template>
