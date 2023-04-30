import { createRouter, createWebHistory, START_LOCATION } from "vue-router";
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
type BrowserNavigationInfo = Parameters<HistoryListenCallback>[2];

enum NavigationDirection {
  back = "back",
  forward = "forward",
  unknown = "",
}

type LastNavigationInfo = {
  replace: boolean;
  lastInfo: BrowserNavigationInfo | null;
  isFirstNavigation: boolean;
};

const INITIAL_LAST_NAVIGATION_INFO: LastNavigationInfo = {
  replace: false,
  lastInfo: null,
  isFirstNavigation: false,
};
const lastNavigationInfo: LastNavigationInfo = { ...INITIAL_LAST_NAVIGATION_INFO };
function resetLastInfo() {
  Object.assign(lastNavigationInfo, INITIAL_LAST_NAVIGATION_INFO);
}

function suppertHistoryStack() {
  const stack: string[] = [];
  let position: number = -1;
  // const stackForForward: string[] = [];

  /* window.addEventListener("popstate", (event) => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
    console.debug("🚥 popstate#1: event :>> ", event);
  }); */

  routerHistory.listen((to, from, info) => {
    console.debug("🚥 listen: ");
    console.debug("from :>> ", from);
    console.debug("to :>> ", to); // TODO: 在afterEach那里校验
    console.debug("info :>> ", info);
    lastNavigationInfo.lastInfo = info;
  });

  const routerHistoryPush = routerHistory.push;
  routerHistory.push = function (...args) {
    console.debug("🚥 push: args :>> ", args);
    return routerHistoryPush.call(this, ...args);
  };

  const routerHistoryReplace = routerHistory.replace;
  routerHistory.replace = function (...args) {
    console.debug("🚥 replace: args :>> ", args);
    lastNavigationInfo.replace = true;
    return routerHistoryReplace.call(this, ...args);
  };

  const routerHistoryGo = routerHistory.go;
  routerHistory.go = function (...args) {
    console.debug("🚥 go: args :>> ", args);
    return routerHistoryGo.call(this, ...args);
  };

  const removeStartLocationListener = router.beforeEach(async (_to, from) => {
    console.debug("from === START_LOCATION :>> ", from === START_LOCATION);
    if (from === START_LOCATION) {
      lastNavigationInfo.isFirstNavigation = true;
      removeStartLocationListener();
    }
  });

  router.afterEach(async (to, _from, failure) => {
    if (failure) return;

    // console.debug("lastNavigationInfo.replace :>> ", lastNavigationInfo.replace);
    // console.debug("lastNavigationInfo.isFirstNavigation :>> ", lastNavigationInfo.isFirstNavigation);

    if (lastNavigationInfo.replace && !lastNavigationInfo.isFirstNavigation) {
      stack[position] = to.fullPath;
    } else if (
      lastNavigationInfo?.lastInfo?.direction === NavigationDirection.back ||
      lastNavigationInfo?.lastInfo?.direction === NavigationDirection.forward
    ) {
      position += lastNavigationInfo.lastInfo.delta;
    } else {
      stack.push(to.fullPath);
      position++;
    }

    const stackWithPosition = stack.map((item, index) => (position === index ? `${item}📍` : item));

    resetLastInfo();
    console.debug("🚥 stack :>> ", JSON.stringify(stackWithPosition, null, 2));
    console.debug("   position :>> ", position);
  });
}
