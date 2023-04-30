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
    <pre>currentLocation:
{{ currentLocation }}</pre>

  <RouterView v-slot="{ Component, route }">
    <pre>route:
{{
        function () {
          const { matched, ...rest } = route
          return rest
        }()
      }}</pre>
    <component :is="Component" :key="route.fullPath" />
  </RouterView>
</template>

<style>
pre {
  background-color: #eee;
  padding: 10px;
  border-radius: 5px;
}
</style>
