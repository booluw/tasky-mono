<script setup lang="ts">
import type { DashboardProject } from '@dash/shared'
import type { Reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/Auth/store/useAuthStore'

import Logo from '@/shared/components/Logo.vue'
import { resetAllStores } from '@/stores/resetAllStores'
import { useDashoard } from '../features/Dashboard/composables/useDashboard'
import { useClickOutside } from '../shared/composables/useClickoutside'
import { useAppStore } from '../stores/app'
import AddStaffIcon from './icons/AddStaffIcon.vue'
import LogoutIcon from './icons/LogoutIcon.vue'
import { COMMON, ROUTES } from './utils/constants'

const route = useRoute()
const router = useRouter()
const userstore = useAuthStore()
const appstore = useAppStore()

const openNav = ref(false)
const navRef = ref(null)
const userRole = computed(() => userstore.user.role)
const reloadActiveProjects = computed(() => appstore.reloadActiveProjects)

const activeProjects: Reactive<{ loading: boolean, error: boolean, projects: DashboardProject[] }> = reactive({
  loading: true,
  error: false,
  projects: [],
})

async function getActiveProjects(silent = false) {
  activeProjects.error = false
  if (!silent) {
    activeProjects.loading = true
  }

  try {
    const resp: { data: DashboardProject[] } = await useDashoard().loadActiveProjects()

    activeProjects.projects = resp.data
    appstore.setReload(false)
  }
  catch (error) {
    console.error(error)
    if (!silent) {
      activeProjects.error = true
    }
  }
  finally {
    activeProjects.loading = false
  }
}

function logUserOut() {
  try {
    resetAllStores()
    router.replace('/')
  }
  catch (e) {
    console.warn(e)
  }
}

watch(route, () => {
  openNav.value = false
}, { deep: true })

watch(reloadActiveProjects, () => {
  getActiveProjects(true)
})

onMounted(() => {
  getActiveProjects()
})

useClickOutside(navRef, () => {
  openNav.value = false
})
</script>

<template>
  <section class="h-screen flex bg-white overflow-hidden">
    <nav
      ref="navRef"
      class="hidden w-[250px] min-lg:w-[350px] min-lg:block border-r border-gray-50/50"
      :class="{ 'max-lg:fixed max-lg:top-0 max-lg:block max-lg:left-0 max-lg:bottom-0 max-lg:bg-white max-lg:z-10 max-lg:shadow-lg': openNav }"
    >
      <div
        class="bg-white p-3 min-lg:flex h-screen flex-col justify-between relative"
        :class="{ 'max-lg:flex max-lg:left-0 max-lg:bottom-0 max-lg:bg-white max-lg:z-10 max-lg:shadow-lg': openNav }"
      >
        <div class="flex flex-col gap-1">
          <div class="flex gap-5 items-center justify-center py-5">
            <Logo />
            <h1 class="text-xl font-bold text-primary">
              Monitora
            </h1>
          </div>
          <div class="flex flex-col gap-2">
            <template v-for="(link, key) in ROUTES" :key>
              <template v-if="link.acl && link.acl.includes(userRole)">
                <router-link
                  v-if="!link.external" :to="link.uri"
                  class="flex items-center gap-3 p-3 rounded hover:text-primary text-sm"
                  :class="{ 'bg-primary/10 text-primary hover:text-primary': route.meta.parent === link.uri }"
                >
                  <component :is="link.icon" class="w-[20px]" />
                  {{ link.title }}
                </router-link>

                <a
                  v-else :href="link.uri" class="flex items-center gap-3 p-3 rounded hover:text-primary text-sm"
                  target="_blank"
                >
                  <component :is="link.icon" class="w-[20px]" />
                  {{ link.title }}
                </a>
              </template>
            </template>
          </div>

          <div class="py-10 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <h2 class="uppercase text-gray-200 text-xs">
                active projects
              </h2>
              <router-link :to="{ name: 'projects' }" class="text-xs text-blue-500">
                See all
              </router-link>
            </div>
            <div v-if="activeProjects.loading" v-loading="activeProjects.loading" class="text-xs">
              Loading active projects and tasks count.
            </div>
            <div
              v-else-if="activeProjects.error"
              class="bg-red-100 rounded p-3 text-sm flex flex-col items-start gap-2"
            >
              <h3 class="text-red-500 font-semibold">
                An error occurred!
              </h3>
              <p class="text-xs mb-5">
                We encountered an issue while loading all your active projects, we are looking into this.
              </p>
              <div class="flex gap-5">
                <router-link :to="{ name: 'projects' }" class="bg-red-500 text-white px-2 py-1 rounded ">
                  See all projects
                </router-link>
                <button class="text-gray-500 cursor-pointer" @click="getActiveProjects()">
                  Reload
                </button>
              </div>
            </div>
            <div v-else-if="activeProjects.projects.length === 0" class="bg-orange-100 rounded p-3 text-sm flex flex-col items-start gap-2">
              <h3 class="text-orange-500 font-semibold">
                You have not been assigned to any active project, yet.
              </h3>
              <p class="text-xs mb-5">
                All projects you have been assigned to that are active will be displayed here for you to access easily.
              </p>
            </div>
            <el-scrollbar v-else class="!max-h-[28vh] overflow-y-scroll">
              <div class="flex flex-col gap-2">
                <template v-for="project in activeProjects.projects" :key="project.id">
                  <router-link
                    v-if="project.tasks.length !== 0"
                    :to="{ name: 'view-project', params: { id: project.id } }"
                    class="text-sm flex justify-between items-center p-3 rounded text-gray-300 hover:text-black transition-colors ease-in-out"
                    :class="{ 'bg-gray-50 !text-black': route.path.includes(`/projects/${project.id}`) }"
                  >
                    <div class="line-clamp-1 w-[85%]">
                      {{ project.title }}
                    </div>

                    <div
                      class="h-5 w-5 rounded-full text-xs bg-gray-50 flex items-center justify-center"
                      :class="{ '!bg-black !text-white': route.path.includes(`/projects/${project.id}`) }"
                    >
                      {{ project.tasks.length }}
                    </div>
                  </router-link>
                </template>
              </div>
            </el-scrollbar>
            <router-link :to="{ name: 'new-project' }" v-if="userRole === 'SUPER_ADMIN'" class="p-3 rounded bg-gray-50/50 text-gray-300 flex gap-3 items-center text-sm mt-2">
              <el-icon>
                <Plus />
              </el-icon>
              Create Project
            </router-link>
          </div>
        </div>
        <div class="mb-10">
          <div class="flex flex-col gap-2">
            <template v-for="(link, key) in COMMON" :key>
              <router-link
                v-if="!link.external" :to="link.uri"
                class="flex items-center gap-3 p-3 rounded hover:text-primary text-sm"
                :class="{ 'bg-primary text-white': route.meta.parent === link.uri }"
              >
                <component :is="link.icon" class="w-[20px]" />
                {{ link.title }}
              </router-link>

              <a v-else :href="link.uri" class="flex items-center gap-3 p-3 rounded hover:text-primary text-sm" target="_blank">
                <component :is="link.icon" class="w-[20px]" />
                {{ link.title }}
              </a>
            </template>
          </div>
        </div>

        <div class="absolute bottom-0 right-0 left-0 grid grid-cols-2 bg-gray-50 border-t border-gray-50/50">
          <router-link :to="{ name: `${route.meta.name}-invite` }" class="flex items-center justify-center gap-3 text-sm bg-white hover:bg-transparent mr-0.5">
            <AddStaffIcon class="w-[14px]" />
            Invite Staff
          </router-link>
          <a
            href=""
            class="transition ease-in-out flex items-center justify-center gap-3 p-3 bg-white text-red-500 hover:bg-red-200 hover:text-red-500 text-sm"
            @click.prevent="logUserOut()"
          >
            <LogoutIcon class="w-[14px]" />
            Logout
          </a>
        </div>
      </div>
    </nav>
    <section class="h-screen w-full bg-white px-5 overflow-hidden">
      <header
        class="sticky top-0 z-[20] bg-white border-b border-primary-50 py-5 mb-5 flex justify-between items-center"
      >
        <div class="flex items-center justify-center gap-5">
          <svg
            class="w-[24px] cursor-pointer transition-all ease-in-out min-lg:hidden"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" @click="openNav = !openNav"
          >
            <path v-show="!openNav" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            <path
              v-show="openNav"
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>

          <h1 class="capitalize text-xl font-semibold">
            {{ route.meta.name }}
          </h1>
        </div>
        <div class="" />
      </header>
      <div class="h-[90vh] overflow-hidden">
        <RouterView />
      </div>
    </section>
  </section>
</template>
