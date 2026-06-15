<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useSprint } from '../composable/useSprints';

import SprintCard from './SprintCard.vue';

const route = useRoute()
const usesprint = useSprint()

const { loading, sprints } = usesprint

async function getAllSprints() {
  await usesprint.fetchAllCompletedSprintsByProjectId(route.params.id as string)
}

onMounted(() => {
  getAllSprints()
})
</script>

<template>
  <div class="bg-gray-50/20 rounded-xl p-5" v-loading="loading">
    <div v-if="sprints.length === 0" class="opacity-60">
      Sorry, no completed sprint yet.
    </div>

    <div v-else class="">
      <SprintCard v-for="(sprint, key) in sprints" :key :sprint />
    </div>
  </div>
</template>
