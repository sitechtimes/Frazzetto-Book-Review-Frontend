export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  if (!userStore.isAuth) return;

  const allowedRoles = to.meta.allowedRoles;
  
  if (!allowedRoles || allowedRoles.length === 0) return;

  if (userStore.userType && !allowedRoles.includes(userStore.userType)) return await navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 302 });
});