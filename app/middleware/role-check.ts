export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  //if (!userStore.user || !userStore.isAuthenticated) return;
  if (!userStore.isAuthenticated) return;

  const allowedRoles = to.meta.allowedRoles;
  
  if (!allowedRoles || allowedRoles.length === 0) return;

  if (userStore.user.is_student && !allowedRoles.includes("student")) return await navigateTo("/student/home", { redirectCode: 302 });
  if (userStore.user.is_teacher && !allowedRoles.includes("teacher")) return await navigateTo("/teacher/classes", { redirectCode: 302 });
});