/* export default defineNuxtRouteMiddleware(() => {
  //student and admin login check
}); */


// MIDDLEWARE NEEDS A LOT MORE HERE
export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  if (!userStore.user && to.meta.requiresAuth) return await navigateTo("/login", { redirectCode: 301 });
});