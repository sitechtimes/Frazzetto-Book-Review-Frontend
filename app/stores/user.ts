export const useUserStore = defineStore("userStore", () => {
  const user = ref<User>();

  function signOut() {
    user.value = undefined;
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
  }
  return {
    user,
    signOut,
    signIn,
  };
});
