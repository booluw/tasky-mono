import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { createApiConfig } from '@/config/api'
import { useAppStore } from '@/stores/app'

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/projects`)
const loading = ref(false)
const submitting = ref(false)

const projects = ref([])
const project = ref()
const documents = ref([])
const meta = reactive({
  page: 1,
  size: 10,
  total: 0,
})

export function useProject() {
  const appstore = useAppStore()
  const keyword = ref('')

  const addStaffToProject = async (pid: string, staff: Record<string, string>, silent: boolean = false) => {
    submitting.value = true
    try {
      const { message } = await api.patch(`/${pid}`, staff)

      if (!silent) {
        ElMessage.success(message)
      }
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      submitting.value = false
    }
  }

  const fetchAllProjects = async () => {
    // if (projects.value.length === 0)
    loading.value = true

    try {
      const { count, projects: _projects } = await api.get(`?size=${meta.size}&page=${meta.page - 1}`)

      meta.total = count
      projects.value = _projects
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      loading.value = false
    }
  }

  const fetchProjectById = async (id: string) => {
    try {
      if (project.value?.id !== id) {
        project.value = undefined
      }
      const { project: _project, members } = await api.get(`/${id}`)

      project.value = {
        ..._project,
        members
      }
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  const createProject = async (payload: Record<string, any>) => {
    submitting.value = true

    const { staff, ...project } = payload

    try {
      const { message, pid } = await api.post('/', {
        ...project,
        startDate: new Date(project.startDate).toISOString(),
        endDate: new Date(project.endDate).toISOString(),
      })

      if (staff.length !== 0) {
        await addStaffToProject(pid, staff.map(({ uid, userRole }: Record<string, string>) => ({ uid, userRole })), true)
      }

      await fetchAllProjects()
      appstore.setReload(true)
      ElMessage.success(message ?? 'Project created')
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      submitting.value = false
    }
  }

  const updateProject = async (payload: Record<string, any>) => {
    submitting.value = true

    try {
      const { id, ...rest } = payload

      const { message } = await api.put(`/${id}`, rest)

      ElMessage.success(message ?? 'Project updated')
      await fetchProjectById(id)
      appstore.setReload(true)
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message);
    } finally {
      submitting.value = false
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { message } = await api.delete(`/${id}`)

      ElMessage.success(message)
      appstore.setReload(true)
      await fetchAllProjects()
    } catch (error: any | { message: string }) {
      console.error(error)
      ElMessage.error(error.message ?? 'An error occurred, please try again.');
    }
  }

  const searchProjectByKeyword = async () => { }

  const findDocumentsByProjectId = async (id: string) => {
    try {
      const { documents: doc } = await api.get(`/${id}/documents`)
      documents.value = doc
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  const addDocumentToProject = async (id: string, doc: { title: string, url: string }) => {
    try {
      const { message } = await api.put(`/${id}/document`, doc)

      await findDocumentsByProjectId(id)
      ElMessage.success(message)
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  return {
    loading,
    submitting,
    keyword,
    projects,
    project,
    documents,
    meta,
    createProject,
    fetchAllProjects,
    fetchProjectById,
    updateProject,
    deleteProject,
    searchProjectByKeyword,
    addStaffToProject,
    findDocumentsByProjectId,
    addDocumentToProject
  }
}
