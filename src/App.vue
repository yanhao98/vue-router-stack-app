<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute()
const currentLocation = computed(() => {
  const { matched, ...rest } = route
  return rest
})
</script>

<template>
  <div>
    <pre>{{ currentLocation }}</pre>
  </div>

  <!--<RouterView v-slot="{ Component, route }">
    <component :is="Component" />
  </RouterView>-->
</template>
