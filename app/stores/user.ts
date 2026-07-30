export interface TokenLoginResponse {
  refresh: string;
  access: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export const useUserStore = defineStore("userStore", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isAuthenticated = ref(false);

  const accessCookie = useCookie("access", {
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });

  const refreshCookie = useCookie("refresh", {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const isLoggedIn = computed(() => {
    return isAuthenticated.value && user.value !== null;
  });

  function signOut() {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;

    accessCookie.value = null;
    refreshCookie.value = null;
  }

  async function getTokenData(
    email: string,
    pin: string,
  ): Promise<Result<TokenLoginResponse, Error>> {
    const { data, error } = await tryRequestEndpoint<TokenLoginResponse>(
      "/api/token",
      "POST",
      {
        "Content-Type": "application/json",
      },
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
      return {
        error: new Error("Not authenticated"),
      };
    }

    const { data, error } = await tryRequestEndpoint<User>("/users/", "GET", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    });

    if (error) {
      return { error };
    }

    user.value = data;

    return { data };
  }

  async function getUserById(id: number): Promise<Result<User, Error>> {
    if (!token.value) {
      return {
        error: new Error("Not authenticated"),
      };
    }

    const { data, error } = await tryRequestEndpoint<User>(
      `/users/${id}/`,
      "GET",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    );

    if (error) {
      return { error };
    }

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

    const access = tokenResult.data.access;
    const refresh = tokenResult.data.refresh;

    token.value = access;
    refreshToken.value = refresh;

    accessCookie.value = access;
    refreshCookie.value = refresh;

    const userResult = await getUserData();

    if (userResult.error) {
      return { error: userResult.error };
    }

    user.value = userResult.data;
    isAuthenticated.value = true;

    return {
      data: userResult.data,
    };
  }

  async function reloadAccess() {
    if (!refreshCookie.value) {
      signOut();
      return;
    }

    const { data, error } = await tryRequestEndpoint<RefreshTokenResponse>(
      "/api/token/refresh/",
      "POST",
      {
        "Content-Type": "application/json",
      },
      {
        refresh: refreshCookie.value,
      },
    );

    if (error) {
      signOut();
      return;
    }

    token.value = data.access;
    accessCookie.value = data.access;
  }

  async function loadSession() {
    if (!refreshCookie.value) {
      signOut();
      return;
    }

    token.value = accessCookie.value ?? null;

    const userResult = await getUserData();

    if (!userResult.error) {
      user.value = userResult.data;
      isAuthenticated.value = true;
      return;
    }

    await reloadAccess();

    const retryResult = await getUserData();

    if (retryResult.error) {
      signOut();
      return;
    }

    user.value = retryResult.data;
    isAuthenticated.value = true;
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoggedIn,
    signIn,
    signOut,
    getUserData,
    getUserById,
    loadSession,
    reloadAccess,
  };
}, 
{persist: true}); // THIS IS TEMPORARY, needs backend for checking for session/cookies/idk so user data is saved on reload
