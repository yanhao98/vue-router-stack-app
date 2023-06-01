import { defineComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { configRouterStack } from "./router-stack";

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    ...Array.from({ length: 26 }, (_, i) => {
      const letter = String.fromCharCode(i + 97);
      const Letter = String.fromCharCode(i + 65);
      return {
        path: `/${letter}`,
        name: Letter,
        component: defineComponent({
          setup: () => {
            console.debug(`🎨 Route Component ${Letter}'s setup function is called.`);
            return () => {
              return `Route Component ${Letter}`;
            };
          },
        }),
      };
    }),
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: defineComponent({
        setup: () => {
          console.debug("🎨 Route Component NotFound's setup function is called.");
          return () => {
            return "Route Component NotFound";
          };
        },
      }),
    },
  ],
});

router.beforeEach(async (to, from) => {
  console.debug(
    "========================================",
    `🚗 [beforeEach] [${String(from.name || "")}] -> [${String(to.name)}].`,
    "========================================"
  );
});

router.beforeResolve((to, from) => {
  console.debug(`🚗 [beforeResolve] [${String(from.name || "")}] -> [${String(to.name)}]`);
});

router.afterEach(async (to, from, failure) => {
  console.debug(`🚗 [ afterEach] [${String(from.name || "")}] -> [${String(to.name)}]. failure: `, failure);
});

configRouterStack(router);

// ================================================================================
// 判断刷新还是关闭。
// https://www.jianshu.com/p/ed6010ab868e/
window.addEventListener(
  "beforeunload",
  function (e) {
    // Cancel the event as stated by the standard.
    e.preventDefault();
    // Chrome requires returnValue to be set.
    e.returnValue = "";

    console.debug("🚥 beforeunload, e :>> ", e);
    // sleep(3000);
  },
  {
    passive: true,
  }
);

// 睡眠
function sleep(numberMillis: number) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime) return;
  }
}
