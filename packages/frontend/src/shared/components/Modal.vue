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
      return 'w-1/4'

    case 'third':
      return 'w-1/3'

    case 'large':
      return 'w-2/3'

    default:
      return 'w-1/2'
  }
})
</script>

<template>
  <section class="fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-[98] flex flex-col items-center justify-center">
    <div class="bg-white rounded-xl shadow-2xl max-h-2/3 px-5" :class="width">
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
      <div class="py-5">
        <slot />
      </div>
    </div>
  </section>
</template>
