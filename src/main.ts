import { type ComponentPublicInstance, createApp } from "vue";
import "./style.css";
import { router, routerHistory } from "./router";
import App from "./App.vue";

const app = createApp(App);

app.mixin({
  beforeRouteEnter() {
    console.log("mixin enter");
  },
});

window.h = routerHistory;
window.r = router;

app.use(router);

window.vm = app.mount("#app");

declare global {
  interface Window {
    h: typeof routerHistory;
    r: typeof router;
    vm: ComponentPublicInstance;
  }
}
