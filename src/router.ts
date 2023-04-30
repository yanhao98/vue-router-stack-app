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
          console.debug("🎨 Route Component's setup function is called.");
          return () => {
            return 'Route Component'
          };
        },
      })
    },
  ],
})
