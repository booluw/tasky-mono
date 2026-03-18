import type { IRoutes } from '../types'

import ClientIcon from '../icons/ClientIcon.vue'
import DashboardIcon from '../icons/DashboardIcon.vue'
import SettingIcon from '../icons/SettingIcon.vue'
import StaffIcon from '../icons/StaffIcon.vue'
import HelpIcon from '../icons/HelpIcon.vue'

export const ROUTES: IRoutes[] = [
  {
    uri: '/app/dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    acl: ['ADMIN', 'USER', 'SUPER_ADMIN']
  },
  {
    uri: '/app/staff',
    title: 'Staff',
    icon: StaffIcon,
    acl: ['ADMIN', 'SUPER_ADMIN']
  },
  {
    uri: '/app/clients',
    title: 'Clients',
    icon: ClientIcon,
    acl: ['ADMIN', 'SUPER_ADMIN']
  }
]

export const COMMON: IRoutes[] = [
  {
    uri: '//forms.gle/YnkGRvn1gnVMPh2LA',
    title: 'Help',
    icon: HelpIcon,
    external: true,
    acl: ['ADMIN', 'USER', 'SUPER_ADMIN']
  },
  {
    uri: '/settings',
    title: 'Settings',
    icon: SettingIcon,
    acl: ['ADMIN', 'USER', 'SUPER_ADMIN']
  },
]
