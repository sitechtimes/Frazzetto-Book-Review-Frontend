export const useUserStore = defineStore("userStore", () => {
  const user = ref<User>();
  const isAuth = ref(false)
  const userType = computed(() => user.value?.userType);

  function signOut() {
    user.value = undefined;
    isAuth.value = false
  }

  async function signIn(
    email: string,
    pin: number,
  ): Promise<Error | undefined> {
    const { data, error } = await tryRequestEndpoint<User>("/login", "POST", {
      email,
      pin,
    });
    if (error) return error;
    user.value = data;
    isAuth.value = true
  }
  return {
    user,
    isAuth,
    userType,
    signOut,
    signIn,
  };
});
