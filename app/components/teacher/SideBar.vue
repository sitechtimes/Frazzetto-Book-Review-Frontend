<template>
  <aside class="w-64 bg-white rounded-xl p-6 shadow">
    <h2 class="font-semibold text-center mb-4">
      {{ title }}
    </h2>

    <div class="space-y-2">
      <button
        class="w-full text-left px-4 py-2 rounded-lg transition"
        :class="{
          'bg-neutral-300': selectedStudent === null,
          'hover:bg-gray-200': selectedStudent !== null,
        }"
        @click="selectStudent(null)"
      >
        All
      </button>

      <button
        v-for="student in students"
        :key="student.id"
        class="w-full text-left px-4 py-2 rounded-lg transition hover:bg-gray-200"
        :class="{
          'bg-neutral-300': selectedStudent === student.id,
        }"
        @click="selectStudent(student.id)"
      >
        {{ student.firstName }} {{ student.lastName }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{
  students: Student[];
  title?: string;
}>();

const emit = defineEmits<{
  select: [studentId: number | null];
}>();

const selectedStudent = ref<number | null>(null);

function selectStudent(id: number | null) {
  selectedStudent.value = id;
  emit("select", id);
}
</script>

<style scoped></style>
