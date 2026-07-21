<template>
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
</template>

<script setup lang="ts">
const classes: Course[] = [
  {
    id: 1,
    name: "English Literature",
    classPeriod: "1",
    students: [],
  },
  {
    id: 2,
    name: "AP English Literature",
    classPeriod: "2",
    students: [],
  },
  {
    id: 3,
    name: "Creative Writing",
    classPeriod: "3",
    students: [],
  },
];
</script>

<style scoped></style>
