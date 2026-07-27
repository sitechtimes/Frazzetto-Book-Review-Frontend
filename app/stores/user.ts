export interface TokenLoginResponse {
  refresh: string;
  access: string;
}

export const useUserStore = defineStore("userStore", () => {
  const user = ref<User | null>(null);

  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  function signOut() {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
  }

  async function getTokenData(
    email: string,
    pin: string,
  ): Promise<Result<TokenLoginResponse, Error>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const { data, error } = await tryRequestEndpoint<TokenLoginResponse>(
      "/api/token",
      "POST",
      headers,
      {
        email,
        pin,
      },
    );

    if (error) {
      return { error };
    }

    return { data };
  }

  async function getUserData(): Promise<Result<User, Error>> {
    if (!token.value) {
      return { error: new Error("Not authenticated") };
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    };

    const { data, error } = await tryRequestEndpoint<User>(
      "/users/",
      "GET",
      headers,
    );

    if (error) {
      return { error };
    }

    user.value = data;

    return { data };
  }

  async function signIn(
    email: string,
    pin: string,
  ): Promise<Result<User, Error>> {
    const tokenResult = await getTokenData(email, pin);

    if (tokenResult.error) {
      return { error: tokenResult.error };
    }

    token.value = tokenResult.data.access;
    refreshToken.value = tokenResult.data.refresh;

    return await getUserData();
  }

  return {
    user,
    token,
    refreshToken,
    signIn,
    signOut,
    getUserData,
  };
});
