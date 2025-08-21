import CalendarPage from "@/views/CalendarPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "CalendarPage",
      component: CalendarPage,
    },
  ],
});

export default router;
