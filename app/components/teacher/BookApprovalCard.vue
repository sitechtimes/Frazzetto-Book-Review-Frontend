<template>
  <div class="bg-white rounded-xl shadow-md p-6 mb-6">
    <div class="flex gap-6">
      <div class="w-32 h-48 bg-gray-200 rounded overflow-hidden shrink-0">
        <img
          v-if="submission.cover_image"
          :src="submission.cover_image"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-500"
        >
          No Cover
        </div>
      </div>

      <div class="flex-1">
        <h2 class="text-2xl font-bold">
          {{ submission.title }}
        </h2>

        <p class="text-gray-600 mb-3">by {{ submission.author }}</p>

        <p class="mb-4 whitespace-pre-wrap">{{ submission.description }}</p>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="genre in submission.genres"
            :key="genre.id"
            class="badge badge-outline"
          >
            {{ genre.name }}
          </span>
        </div>

        <p class="text-sm text-gray-500">
          Submitted by
          <strong> {{ student.first_name }} {{ student.last_name }} </strong>
        </p>

        <div v-if="showActions" class="flex gap-3 mt-6">
          <button class="btn btn-success" @click="$emit('approve', submission)">
            Approve
          </button>

          <button class="btn btn-error" @click="$emit('reject', submission)">
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  submission: BookSubmission;
  student: Student;
  showActions?: boolean;
}>();

defineEmits<{
  (e: "approve", submission: BookSubmission): void;
  (e: "reject", submission: BookSubmission): void;
}>();
</script>
