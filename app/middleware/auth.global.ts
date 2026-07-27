export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  const userStore = useUserStore();

  const getHomeRoute = () =>
    userStore.user?.userType === "teacher" ? "/teacher/classes" : "/student/home";

  // redirect /teacher/home to /teacher/classes
  if (to.path === "/teacher/home") {
    return navigateTo("/teacher/classes", { redirectCode: 301 });
  }

  if (userStore.isAuth && to.meta.redirectIfAuth) {
    return navigateTo(getHomeRoute(), { redirectCode: 301 });
  }

  if (
    !import.meta.client || !nuxtApp.isHydrating || !nuxtApp.payload.serverRendered
  ) {
    return;
  }

  if (!userStore.isAuth && to.meta.requiresAuth) {
    return navigateTo("/login", { redirectCode: 301 });
  } 
});

