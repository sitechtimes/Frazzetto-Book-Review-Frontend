<template>
  <div>
    <h1>Student Homepage</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "student",
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["student"],
});
</script>

<style scoped></style>
