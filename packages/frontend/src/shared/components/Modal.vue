<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { computed } from 'vue';

const emit = defineEmits(['close'])

const { heading, subheading, size = 'half' } = defineProps<{
  heading: string,
  subheading?: string,
  size?: 'half' | 'third' | 'fourth' | 'large'
}>()

const width = computed(() => {
  switch (size) {
    case 'fourth':
      return 'md:w-1/4 w-3/4'

    case 'third':
      return 'md:w-1/3 w-3/4'

    case 'large':
      return 'md:w-2/3 w-3/4'

    default:
      return 'md:w-1/2 w-3/4'
  }
})
</script>

<template>
  <section class="fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-[98] flex flex-col items-center justify-center">
    <div class="bg-white rounded-xl shadow-2xl md:max-h-2/3 px-5" :class="width">
      <div class="border-primary-50 border-b py-5 flex items-center justify-between" :class="{ '!py-3' : subheading }">
        <div class="">
          <h2 class="font-semibold capitalize">
            {{ heading }}
          </h2>
          <slot name="subheading" v-if="$slots.subheading" />
          <p class="text-sm text-gray-200" v-else-if="subheading !== undefined">
            {{ subheading }}
          </p>
        </div>
        <el-icon color="#fb2c36" class="cursor-pointer" @click="emit('close')">
          <Close />
        </el-icon>
      </div>
      <el-scrollbar class="py-5 overflow-auto max-h-4/5">
        <slot />
      </el-scrollbar>
    </div>
  </section>
</template>
