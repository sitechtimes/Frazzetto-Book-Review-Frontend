<template>
  <Suspense>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </Suspense>
</template>

<script setup lang="ts">
const userStore = useUserStore();

await userStore.loadSession();

const layout = computed(() => {
  if (userStore.user?.is_teacher) {
    return "teacher";
  }

  if (userStore.user?.is_student) {
    return "student";
  }

  return "default";
});
</script>
