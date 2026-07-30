export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  if (!userStore.isAuthenticated || !userStore.user) return;

  const allowedRoles = to.meta.allowedRoles as string[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) return;

  if (userStore.user.is_student && !allowedRoles.includes("student"))
    return await navigateTo("/student/homepage", { redirectCode: 302 });
  if (userStore.user.is_teacher && !allowedRoles.includes("teacher"))
    return await navigateTo("/teacher/classes", { redirectCode: 302 });
});
