<template>
  <div class="navbar bg-base-100 shadow-sm px-8">
    <div class="flex-1">
      <NuxtLink to="/student/home" class="btn btn-ghost text-2xl font-bold">
        📚 Frazzetto
      </NuxtLink>
    </div>

    <div class="flex-none">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/student/home"
          class="btn btn-ghost"
          active-class="bg-base-200"
        >
          Home
        </NuxtLink>

        <NuxtLink
          to="/explore"
          class="btn btn-ghost"
          active-class="bg-base-200"
        >
          Explore
        </NuxtLink>

        <NuxtLink
          to="/student/reviews/my-reviews"
          class="btn btn-ghost"
          active-class="bg-base-200"
        >
          My Reviews
        </NuxtLink>
        <button
          class="btn btn-outline border-base-content/20 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
          @click="handleLogout"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();
const router = useRouter();

async function handleLogout() {
  store.signOut();
  router.push("/login");
}
</script>
