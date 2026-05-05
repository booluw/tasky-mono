<script lang="ts" setup>
import { Edit, View } from '@element-plus/icons-vue'
import { isEmpty } from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useDate } from '@/shared/composables/useDate'

import ViewProjectDocs from '../components/ViewProjectDocs.vue'
import ViewProjectSprints from '../components/ViewProjectSprints.vue'
import { useProject } from '../composable/useProjects'

const route = useRoute()
const useproject = useProject()

const { project } = useproject
const { format } = useDate()

const loading = ref(false)
const tab = ref<'details' | 'doc' | 'sprint'>('sprint')

const isSide = route.meta.side

const projectId = computed(() => route.params.id)
const productManager = computed(() => {
  const pm = project.value.users.find(item => (item.userRole === 'Product Manager') || (item.userRole === 'Project Manager'))?.user

  return pm ?? 'N/A'
})

async function getProjectById() {
  loading.value = true

  try {
    await useproject.fetchProjectById(route.params.id as string)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getProjectById()

  if (!isSide && ['details', 'doc', 'sprint'].includes((route.name as string).split('-')[1] as string)) {
    tab.value = (route.name as string).split('-')[1] as 'details' | 'doc' | 'sprint'
  }
})

watch(projectId, () => {
  getProjectById()
})
</script>

<template>
  <section v-loading="loading" class="">
    <div v-if="!isEmpty(project)" class="">
      <div class="flex gap-5 items-center justify-between" :class="{ 'flex-col !items-start': isSide }">
        <div class="">
          <h2 class="text-3xl capitalize">
            {{ project.title }}
          </h2>
          <p class="uppercase text-gray-300" :class="{ 'text-sm': isSide }">
            {{ project.id }}
          </p>
        </div>

        <div class="flex gap-3">
          <router-link :to="{ name: 'edit-project', params: { id: project.id } }">
            <el-button type="primary" :plain="tab === 'details' ? false : true" size="large">
              <el-icon>
                <Edit />
              </el-icon>
              &nbsp; Edit
            </el-button>
          </router-link>

          <router-link v-if="isSide" :to="{ name: 'view-project', params: { id: project.id } }">
            <el-button size="large">
              <el-icon>
                <View />
              </el-icon>
              &nbsp;View More
            </el-button>
          </router-link>
        </div>
      </div>

      <div class="mt-10">
        <div v-if="!isSide" class="grid gap-10 grid-cols-3 bg-gray-50 p-2 rounded">
          <div
            class="text-center p-4 rounded cursor-pointer ease-in-out transition-all"
            :class="{ 'bg-white': tab === 'details' }" @click="tab = 'details'"
          >
            Project Details
          </div>
          <div
            class="text-center p-4 rounded cursor-pointer ease-in-out transition-all"
            :class="{ 'bg-white': tab === 'doc' }" @click="tab = 'doc'"
          >
            Documents
          </div>
          <div
            class="text-center p-4 rounded cursor-pointer ease-in-out transition-all"
            :class="{ 'bg-white': tab === 'sprint' }" @click="tab = 'sprint'"
          >
            Sprints
          </div>
        </div>

        <el-scrollbar class="mt-5 !h-[65vh] overflow-y-auto">
          <template v-if="tab === 'details'">
            <div :class="{ 'bg-gray-50/50 rounded-xl p-5': !isSide }">
              <div class="border-gray-100 border-b pb-3 mb-3">
                <h3 class="text-xl">
                  Project Information
                </h3>
              </div>
              <div class="grid gap-5 grid-cols-3" :class="{ '!grid-cols-1 !gap-3': isSide }">
                <div class="">
                  <h4 class="opacity-60 font-normal">
                    Project Name
                  </h4>
                  {{ project.title }}
                </div>

                <div class="">
                  <h4 class="opacity-60 font-normal">
                    Project Type
                  </h4>
                  {{ project.type.replace("_", " ") }}
                </div>

                <div class="">
                  <h4 class="opacity-60 font-normal">
                    Client
                  </h4>
                  {{ project.client.firstName }} {{ project.client.lastName }}
                </div>

                <div class="">
                  <h4 class="opacity-60 font-normal">
                    Project Manager
                  </h4>
                  <template v-if="productManager !== 'N/A'">
                    {{ productManager.firstName }} {{ productManager.lastName }}
                  </template>
                  <template v-else>
                    {{ productManager }}
                  </template>
                </div>

                <div class="">
                  <h4 class="opacity-60 font-normal">
                    Start Date
                  </h4>
                  {{ format(project.startDate, 'do MMM, yyy') }}
                </div>

                <div class="">
                  <h4 class="opacity-60 font-normal">
                    Start Date
                  </h4>
                  {{ project.status.replace("_", " ") }}
                </div>
              </div>

              <div class="mt-5">
                <h4 class="opacity-60 font-normal">
                  Description
                </h4>
                <p :class="{ 'line-clamp-3': isSide }">
                  {{ project.description }}
                </p>
              </div>
            </div>
            <div class="mt-5 bg-gray-50/50 rounded-xl p-5">
              <div class="border-gray-100 border-b pb-3 mb-3">
                <h3 class="text-xl">
                  Project Members
                </h3>
              </div>

              <div class="flex gap-5 flex-wrap">
                <router-link :to="{ name: 'view-staff', params: { id: member.id} }" v-for="member in project.members" :key="member.id">
                  <el-tag class="capitalize">
                    {{ member.firstName }} {{ member.lastName }}
                  </el-tag>
                </router-link>
              </div>
            </div>
          </template>
          <ViewProjectDocs v-else-if="tab === 'doc'" />
          <ViewProjectSprints v-else />
        </el-scrollbar>
      </div>
    </div>
  </section>

  <RouterView />
</template>
