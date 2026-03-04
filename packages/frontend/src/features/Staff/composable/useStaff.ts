import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { createApiConfig } from "@/config/api";

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/staff`)
const loading = ref(false);
const submitting = ref(false);

const staff = ref([])
const onestaff = ref()
const meta = reactive({
  page: 1,
  size: 10,
  total: 0,
})

export function useStaff() {
  const keyword = ref('')

  const inviteStaff = async (payload: any) => {
    submitting.value = true

    try {
      const { message } = await api.post('/invite', payload)

      ElMessage.success(message)
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      submitting.value = false
    }
  }

  const fetchAllStaff = async () => {
    loading.value = true

    try {
      const { count, staff: _staff } = await api.get(`?size=${meta.size}&page=${meta.page - 1}`)

      meta.total = count
      staff.value = _staff
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const fetchStaffById = async (id: string) => {
    try {
      onestaff.value = undefined
      const { staff } = await api.get(`/${id}`)

      onestaff.value = staff
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  const searchStaffByKeyword = async (keyword?: string) => {
    loading.value = true

    try {
      const { users, total } = await api.get(`/search?query=${keyword}&size=${meta.size}&page=${meta.page - 1}`)

      staff.value = users
      meta.total = total

    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    submitting,
    keyword,
    meta,
    staff,
    onestaff,
    inviteStaff,
    fetchAllStaff,
    fetchStaffById,
    searchStaffByKeyword
  }
}
