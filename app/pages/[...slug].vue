<template>
  <div></div>
</template>

<script setup lang="ts">
//redirects to home if user tries to go to a non-existent page
definePageMeta({
  requiresAuth: false,
  redirectIfAuth: false,
  middleware: [
    function () {
      return navigateTo("/", { redirectCode: 301 });
    },
  ],
});
</script>

<style scoped></style>
