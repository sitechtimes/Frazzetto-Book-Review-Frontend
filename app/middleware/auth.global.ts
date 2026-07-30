export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  const getHomeRoute = () =>
    userStore.user?.is_teacher
      ? "/teacher/classes"
      : "/student/home";

  if (to.path === "/teacher/home") {
    return navigateTo("/teacher/classes");
  }

  if (userStore.isAuthenticated && to.meta.redirectIfAuth) {
    return navigateTo(getHomeRoute());
  }

  if (!userStore.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo("/login");
  }
});