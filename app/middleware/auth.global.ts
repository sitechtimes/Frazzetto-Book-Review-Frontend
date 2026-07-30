export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  const userStore = useUserStore();

  const getHomeRoute = () =>
    userStore.user?.is_teacher ? "/teacher/classes" : "/student/homepage";

  // redirect /teacher/home to /teacher/classes
  if (to.path === "/teacher/home") {
    return navigateTo("/teacher/classes", { redirectCode: 301 });
  }

  if (userStore.isAuthenticated && to.meta.redirectIfAuth) {
    return navigateTo(getHomeRoute(), { redirectCode: 301 });
  }

  if (!userStore.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo("/", { redirectCode: 301 });
  }
});
