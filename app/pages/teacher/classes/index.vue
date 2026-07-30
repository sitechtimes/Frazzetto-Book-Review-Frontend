<template>
  <RoleLayout>
    <div class="min-h-screen bg-base-200">
      <main class="max-w-4xl mx-auto py-12">
        <h1 class="text-center text-4xl font-bold mb-12 text-black">
          My Classes
        </h1>
        <div class="space-y-10">
          <TeacherClassCard
            v-for="course in classes"
            :key="course.id"
            :course="course"
          />
        </div>
      </main>
    </div>
  </RoleLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["teacher"],
});

const courseStore = useCourseStore();

const classes = computed(() => courseStore.courses);

onMounted(async () => {
  const { error } = await courseStore.getAllCourses();

  if (error) {
    console.error(error);
  }
});
</script>
