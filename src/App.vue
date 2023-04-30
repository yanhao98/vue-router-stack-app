<script setup lang="ts">
import { computed } from "vue";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const currentLocation = computed(() => {
  return removeMatched(route);
});

function removeMatched(route: RouteLocationNormalizedLoaded): Omit<RouteLocationNormalizedLoaded, "matched"> {
  const { matched, ...rest } = route;
  return rest;
}

async function clickA() {
  await router.push({ path: "/a" });
  await router.push({ path: "/b" });
  await router.push({ path: "/c" });
}
</script>

<template>
  <div>
    <button @click="clickA">Test 1</button>
  </div>

  <pre>currentLocation: {{ currentLocation }}</pre>

  <RouterView v-slot="{ Component, route: routeInSlot }">
    <pre>route: {{ removeMatched(routeInSlot) }}</pre>
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
