<template>
  <div
    class="card bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
    @click="router.push(`/teacher/classes/${props.course.id}`)"
  >
    <div
      class="bg-neutral-300 py-6 text-center text-xl font-semibold text-black"
    >
      {{ course.name }}
    </div>

    <div class="px-12 py-6 text-gray-800">
      <p class="text-lg text-center">
        Period {{ course.classPeriod }} <br />
        {{ course.students.length }} students
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  course: Course;
}>();

const router = useRouter();
</script>

<style scoped></style>
