import { createRouter, createWebHistory } from "vue-router";
import { defineComponent } from "vue";

export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: defineComponent({
        setup: () => {
          // const route = useRoute();
          // console.debug("route :>> ", route);
          return () => {
            return '404';
          };
        },
      })
    },
  ],
})
