export const USER_TYPES = [
  {
    label: 'Super Admin',
    value: 'SUPER_ADMIN',
  },
  {
    label: 'Admin',
    value: 'ADMIN',
  },
  {
    label: 'User',
    value: 'USER',
  },
]

export const PROJECT_TYPES = [
  {
    label: 'Wordpress',
    value: 'WORD_PRESS',
  },
  {
    label: 'Custom Product',
    value: 'CUSTOM_PRODUCT',
  },
  {
    label: 'Custom Project',
    value: 'CUSTOM_PROJECT',
  },
]

export const STATUS = [
  {
    label: 'Todo',
    value: 'TO_DO',
    scope: ['project', 'task'],
  },
  {
    label: 'In Progress',
    value: 'IN_PROGRESS',
    scope: ['project', 'task'],
  },
  {
    label: 'Awaiting Feedback',
    value: 'AWAITING_FEEDBACK',
    scope: ['project', 'task'],
  },
  {
    label: 'Ready To Test',
    value: 'READY_TO_TEST',
    scope: ['task'],
  },
  {
    label: 'Testing',
    value: 'TESTING',
    scope: ['task'],
  },
  {
    label: 'Kickback',
    value: 'KICKBACK',
    scope: ['task'],
  },
  {
    label: 'Done',
    value: 'DONE',
    scope: ['task'],
  },
  {
    label: 'Completed',
    value: 'COMPLETED',
    scope: ['project'],
  },
]

export const TAG_TYPES = {
  TO_DO: 'info',
  IN_PROGRESS: 'warning',
  AWAITING_FEEDBACK: 'danger',
  READY_TO_TEST: 'warning',
  TESTING: 'primary',
  DONE: 'success'
}

export const PROJECT_USER_TYPES = ['Product Manager', 'Project Manager', 'Developer', 'Content Writer']
