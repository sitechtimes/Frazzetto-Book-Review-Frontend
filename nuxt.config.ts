import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", 
    "pinia-plugin-persistedstate/nuxt",],    //persisted state is temporary, for testing, replace when we have backend
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      backend: "",
    },
  },
});
