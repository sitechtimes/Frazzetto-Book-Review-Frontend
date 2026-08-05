<template>
  <div class="card bg-base-100 shadow-md border border-base-300">
    <div class="card-body">
      <div class="flex gap-6">
        <!-- Cover -->
        <div class="w-28 h-40 bg-gray-200 rounded-lg overflow-hidden shadow">
          <img
            v-if="submission.cover_image"
            :src="submission.cover_image"
            :alt="submission.title"
            class="w-full h-full object-cover"
          />

          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-500"
          >
            No Cover
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold">
                {{ submission.title }}
              </h2>

              <p class="text-lg text-gray-600">
                {{ submission.author }}
              </p>
            </div>

            <div
              class="badge"
              :class="{
                'badge-success': submission.is_approved === true,
                'badge-error': submission.is_approved === false,
                'badge-warning': submission.is_approved === null,
              }"
            >
              {{ approvalText }}
            </div>
          </div>

          <p
            v-if="submission.description"
            class="mt-4 text-gray-600 line-clamp-3"
          >
            {{ submission.description }}
          </p>

          <div class="mt-4 text-sm text-gray-500 space-y-1">
            <p>
              <span class="font-semibold">Genres:</span>
              {{ genreNames }}
            </p>

            <p v-if="submission.submitted_at">
              <span class="font-semibold">Submitted:</span>
              {{ formatDate(submission.submitted_at) }}
            </p>
          </div>

          <div class="card-actions justify-end mt-6">
            <button
              v-if="submission.is_approved !== true"
              class="btn btn-outline"
              @click="emit('edit', submission)"
            >
              Edit
            </button>

            <button
              class="btn btn-error"
              @click="emit('delete', submission.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="submission.is_approved === false"
        class="alert alert-error mt-5"
      >
        <div>
          <span class="font-semibold">Submission rejected.</span>
          <p class="text-sm mt-1">
            You can edit your submission and resubmit it for approval.
          </p>
        </div>
      </div>

      <div
        v-else-if="submission.is_approved === null"
        class="alert alert-warning mt-5"
      >
        Your submission is awaiting approval.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  submission: BookSubmission;
}>();

const emit = defineEmits<{
  edit: [submission: BookSubmission];
  delete: [id: number];
}>();

const approvalText = computed(() => {
  if (props.submission.is_approved === true) {
    return "Approved";
  }

  if (props.submission.is_approved === false) {
    return "Rejected";
  }

  return "Pending";
});

const genreNames = computed(() => {
  return props.submission.genres.map((genre) => genre.name).join(", ");
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
</script>
