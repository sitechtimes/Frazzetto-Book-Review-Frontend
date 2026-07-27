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

  const isLoggedIn = computed(() => {
    return isAuthenticated.value && user.value !== null;
  });

  function signOut() {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;
    useCookie("access").value = null;
    useCookie("refresh").value = null;
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
      return {
        error: new Error("Not authenticated"),
      };
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

    const access = tokenResult.data.access;
    const refresh = tokenResult.data.refresh;

    token.value = access;
    refreshToken.value = refresh;

    const accessCookie = useCookie("access", {
      expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    const refreshCookie = useCookie("refresh", {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

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
    const refresh = useCookie("refresh");

    if (!refresh.value) {
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
        refresh: refresh.value,
      },
    );

    if (error) {
      signOut();
      return;
    }

    token.value = data.access;

    useCookie("access", {
      expires: new Date(Date.now() + 10 * 60 * 1000),
    }).value = data.access;
  }

  async function loadSession() {
    const access = useCookie("access");
    const refresh = useCookie("refresh");

    if (!refresh.value) {
      return;
    }

    if (!access.value) {
      await reloadAccess();
    } else {
      token.value = access.value;
    }

    const { data, error } = await getUserData();

    if (error) {
      signOut();
      return;
    }

    user.value = data;
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
    loadSession,
    reloadAccess,
  };
});
