<template>
  <Suspense>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Suspense>
</template>

<script setup lang="ts">
const userStore = useUserStore();

await userStore.loadSession();
</script>