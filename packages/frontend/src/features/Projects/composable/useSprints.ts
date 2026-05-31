import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { createApiConfig } from '@/config/api'
import { useAppStore } from '@/stores/app'

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/sprints`)
const loading = ref(false)
const submitting = ref(false)

const sprints = ref([])
const sprint = ref()
const meta = reactive({})

export function useSprint() {
  const appstore = useAppStore()

  const fetchAllSprintsByProjectId = async (pid: string, silent = false) => {
    if (!silent) {
      loading.value = true
    }

    try {
      const { sprints: _sprints } = await api.get(`/project/${pid}`) as any

      sprints.value = _sprints
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      loading.value = false
    }
  }

  const createSprint = async (payload: any) => {
    submitting.value = true

    try {
      const { message } = await api.post('', payload)
      await fetchAllSprintsByProjectId(payload.pid)

      ElMessage.success(message)
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      submitting.value = false
    }
  }

  const createTask = async (payload: any) => {
    submitting.value = true

    const { sid, ...data } = payload

    try {
      const { message, task } = await api.post(`/${sid}/sprint`, data)

      ElMessage.success(message)
      fetchAllSprintsByProjectId(task.pid, true)
      appstore.setReload(true)
      return task
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      submitting.value = false
    }
  }

  const createTaskComment = async (payload: any) => {
    const { id, ...data } = payload

    try {
      const { message, task } = await api.post(`/task/${id}/comment`, data)

      ElMessage.success(message)
      return task
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  const findTaskById = async (id: string) => {
    try {
      return await api.get(`/task/${id}`)
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  const updateTaskById = async (id: string, data: any) => {
    try {
      const task = await api.patch(`/task/${id}/status`, data)
      await fetchAllSprintsByProjectId(task.task.sprint.pid)

      appstore.setReload(true)
      return task
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  const findSprintById = async (id: string) => {
    try {
      return await api.get(`/${id}`)
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
      throw error
    }
  }

  const startSprintById = async (sprintId: string) => {
    try {
      const { message, pid } = await api.put(`/${sprintId}/sprint`, {})
      ElMessage.success(message)
      await fetchAllSprintsByProjectId(pid)
    } catch (error: any | { message: any }) {
      ElMessage.error(error.message)
      throw error
    }
  }

  const endSprintById = async (id: string, form: any) => {
    try {
      const { message, pid } = await api.patch(`/${id}/sprint`, form)
      ElMessage.success(message)
      await fetchAllSprintsByProjectId(pid)
    } catch (error: any | { message: any }) {
      ElMessage.error(error.message)
      throw error
    }
  }

  return {
    loading,
    submitting,
    sprint,
    sprints,
    meta,
    fetchAllSprintsByProjectId,
    createSprint,
    createTask,
    findTaskById,
    updateTaskById,
    findSprintById,
    endSprintById,
    startSprintById,
    createTaskComment
  }
}
