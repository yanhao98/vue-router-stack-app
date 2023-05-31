import { Router, START_LOCATION } from "vue-router";
const stack: string[] = [];
let position: number = -1;

enum NavigationType {
  pop = "pop",
  push = "push",
}

enum NavigationDirection {
  back = "back",
  forward = "forward",
  unknown = "",
}

type BrowserNavigationInfo = {
  type: NavigationType;
  direction: NavigationDirection;
  delta: number;
};

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

export function configRouterStack(router: Router) {
  const routerHistory = router.options.history;

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
      stack.splice(position + 1);
      stack.push(to.fullPath);
      position++;
    }

    // 这里是因为如果先back，再通过浏览器刷新了，那么position和stack就对不上了。暂时先这样处理。
    // 考虑用sessionStorage缓存可不可以？
    stack[position] = to.fullPath;

    const stackWithPosition = stack.map((item, index) => (position === index ? `${item}📍` : item));

    Object.assign(lastNavigationInfo, INITIAL_LAST_NAVIGATION_INFO);
    console.debug("🚥 stack :>> ", JSON.stringify(stackWithPosition, null, 2));
    console.debug("   position :>> ", position);
  });
}
