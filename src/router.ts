import { createRouter, createWebHistory, RouteLocationNormalized, START_LOCATION } from "vue-router";
import { defineComponent } from "vue";

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

// ================================================================================

suppertHistoryStack();

// historyListenFn的形参类型
type HistoryListenCallback = Parameters<typeof routerHistory.listen>[0];
type NavigationInfo = Parameters<HistoryListenCallback>[2];

enum NavigationDirection {
  back = "back",
  forward = "forward",
  unknown = "",
}

function suppertHistoryStack() {
  let lastNavigationInfo: NavigationInfo | null = null;
  let lastIsReplace = false;
  let lastFrom: RouteLocationNormalized | null = null;
  // 暂时没有考虑forward的情况。需要记录一个完整的历史记录。再加一个position记录当前位置。
  const stack: string[] = [];

  routerHistory.listen((to, from, info) => {
    console.debug("🚥 listen: ");
    console.debug("from :>> ", from);
    console.debug("to :>> ", to);
    console.debug("info :>> ", info);
    // 目前测试结果：只要是返回就会进这个回调，无论是外部触发的返回还是router触发的。
    // if (from === stack[stack.length - 1]) {
    lastNavigationInfo = info;
    // }
  });

  const routerHistoryPush = routerHistory.push;
  routerHistory.push = function (...args) {
    console.debug("🚥 push: args :>> ", args);
    return routerHistoryPush.call(this, ...args);
  };

  const routerHistoryReplace = routerHistory.replace;
  routerHistory.replace = function (...args) {
    console.debug("🚥 replace: args :>> ", args);
    lastIsReplace = true;
    return routerHistoryReplace.call(this, ...args);
  };

  const routerHistoryGo = routerHistory.go;
  routerHistory.go = function (...args) {
    console.debug("🚥 go: args :>> ", args);
    return routerHistoryGo.call(this, ...args);
  };

  router.beforeEach(async (_to, from) => {
    // console.debug("from === START_LOCATION :>> ", from === START_LOCATION);
    lastFrom = from;
  });

  router.afterEach(async (to, _from, failure) => {
    if (failure) {
      lastNavigationInfo = null;
      lastIsReplace = false;
      return;
    }

    if (lastNavigationInfo?.direction === NavigationDirection.forward && Math.abs(lastNavigationInfo.delta) > 1) {
      // 应该：正常的用户操作都是一个一个的页面跳转，不会出现forward的情况。
      console.warn("🚥 forward: 出现了forward, 这种情况暂时不支持。");
    }

    if (lastNavigationInfo?.direction === NavigationDirection.back) {
      const popLength = Math.abs(lastNavigationInfo.delta);
      stack.splice(-popLength);
    } else if (lastIsReplace && lastFrom !== START_LOCATION) {
      stack[stack.length - 1] = to.fullPath;
    } else {
      stack.push(to.fullPath);
    }

    console.debug("🚥 stack :>> ", JSON.stringify(stack, null, 2), stack);
    lastNavigationInfo = null;
    lastIsReplace = false;
    lastFrom = null;
  });
}
