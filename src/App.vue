<script setup lang="ts">
import { computed, onMounted } from "vue";
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

function clickReload() {
  window.location.href = "/";
  console.clear();
}

async function click1() {
  console.debug("⚙️ 预期结果： ", ["/", "/a", "/b"]);
  await router.push({ path: "/a" });
  await router.push({ path: "/b" });
}

async function click2() {
  console.debug("⚙️ 预期结果： ", ["/", "/a", "/c"]);
  await router.push({ path: "/a" });
  await router.push({ path: "/b" });
  await router.push({ path: "/c", replace: true });
}
console.debug("🚀 App created");

onMounted(() => {});
</script>

<template>
  <div class="buttons">
    <button @click="clickReload">Rload</button>
    <button @click="click1">A -> B</button>
    <button @click="click2">A -> (B) -> C</button>
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
.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
