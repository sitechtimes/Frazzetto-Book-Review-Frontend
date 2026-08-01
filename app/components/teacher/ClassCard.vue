<template>
  <NuxtLink
    :to="`/teacher/classes/${props.course.id}`"
    class="card bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
  >
    <div
      class="bg-neutral-300 py-6 text-center text-xl font-semibold text-black"
    >
      {{ course.name }}
    </div>

    <div class="px-12 py-6 text-gray-800">
      <p class="text-lg text-center">
        Period {{ course.period }} <br />
        {{ course.students.length }} students
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  course: Course;
}>();
</script>

<style scoped></style>
