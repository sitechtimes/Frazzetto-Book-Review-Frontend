export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  const userStore = useUserStore();

  const getHomeRoute = () =>
    userStore.user?.userType === "teacher" ? "/teacher/classes" : "/student/home";

  // Redirect teacher home to classes
  if (to.path === "/teacher/home") {
    return navigateTo("/teacher/classes", { redirectCode: 301 });
  }

  if (userStore.isAuth && to.meta.redirectIfAuth) {
    return navigateTo(getHomeRoute(), { redirectCode: 301 });
  }

  // Only run on initial page load
  // https://nuxt.com/docs/guide/directory-structure/middleware#when-middleware-runs
  if (
    !import.meta.client || !nuxtApp.isHydrating || !nuxtApp.payload.serverRendered
  ) {
    return;
  }

  if (!userStore.isAuth && to.meta.requiresAuth) {
    return navigateTo("/login", { redirectCode: 301 });
  } 
});

