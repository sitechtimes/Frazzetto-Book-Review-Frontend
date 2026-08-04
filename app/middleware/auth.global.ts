export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  if (!userStore.user) {
    await userStore.loadSession();
  }

  const getHomeRoute = () =>
    userStore.user?.is_teacher ? "/teacher/classes" : "/student/home";

  if (to.path === "/teacher/home") {
    return navigateTo("/teacher/classes", { redirectCode: 301 });
  }

  if (userStore.isAuthenticated && to.meta.redirectIfAuth) {
    return navigateTo(getHomeRoute());
  }

  if (!userStore.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo("/");
  }
});