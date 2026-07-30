<template>
  <div>
    <h1>(landing page...) Welcome to ...</h1>
    <NuxtLink to="/login" class="btn btn-primary"> Login </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: false,
  redirectIfAuth: true,
});
</script>

<style scoped></style>
