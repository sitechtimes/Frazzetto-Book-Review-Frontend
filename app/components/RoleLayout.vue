<template>
    <NuxtLayout :name="layout">
        <slot />
    </NuxtLayout>
</template>

<script setup lang="ts">
const userStore = useUserStore();

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
