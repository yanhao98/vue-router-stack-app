<script setup lang="ts">
import { computed, onMounted } from "vue";
import { type RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";

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
  console.clear();
  console.debug("⚙️ 预期结果： ", ["/", "/a", "/b"]);
  await router.push({ path: "/a" });
  await router.push({ path: "/b" });
}

async function click2() {
  console.clear();
  console.debug("⚙️ 预期结果： ", ["/", "/a", "/c"]);
  await router.push({ path: "/a" });
  await router.push({ path: "/b" });
  await router.push({ path: "/c", replace: true });
}

async function click3() {
  console.clear();
  console.debug("⚙️ 预期结果： ", ["/", "/a📍", "/b", "/c", "/d"]);
  await router.push({ path: "/a" });
  await router.push({ path: "/b" });
  await router.push({ path: "/c" });
  await router.push({ path: "/d" });
  router.go(-3);
}

async function click4() {
  console.clear();
  console.debug("⚙️ 预期结果： ", ["/", "/a", "/d📍", "/c"]);
  await router.push({ path: "/a" });
  await router.push({ path: "/b" });
  await router.push({ path: "/c" });
  router.go(-1);

  function popStateListener() {
    console.debug('back执行完成, 替换"/b"为"/d"');
    router.replace({ path: "/d" });
    window.removeEventListener("popstate", popStateListener);
  }

  window.addEventListener("popstate", popStateListener);
}

console.debug("🚀 App created");

onMounted(() => {});
</script>

<template>
  <div class="buttons">
    <button @click="clickReload">Rload</button>
    <button @click="click1">A -> B</button>
    <button @click="click2">A -> (B) -> C</button>
    <button @click="click3">A -> B -> C -> D -> go(-3)</button>
    <button @click="router.go(2)">go(2)</button>
    <button @click="click4">A -> B -> C -> go(-1) -> (D)</button>
    <button @click="router.push('/z')">push('/z')</button>
  </div>

  <pre>currentLocation: {{ currentLocation }}</pre>

  <RouterView v-slot="{ Component, route: routeInSlot }">
    <pre>route: {{ removeMatched(routeInSlot) }}</pre>
    <component :is="Component" :key="route.fullPath" />
  </RouterView>
</template>

<style scoped>
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
button {
  text-align: left;
}
</style>
