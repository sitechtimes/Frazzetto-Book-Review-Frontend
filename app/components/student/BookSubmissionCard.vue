<template>
  <div class="card bg-base-100 shadow-md border border-base-300">
    <div class="card-body">
      <div class="flex gap-6">
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
              class="badge badge-outline"
              :class="{
                'badge-success': submission.approved === true,
                'badge-error': submission.approved === false,
                'badge-warning': submission.approved === null,
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
          </div>

          <div class="card-actions justify-end mt-6">
            <button class="btn btn-outline" @click="emit('edit', submission)">
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
        v-if="submission.approved === false"
        class="mt-5 rounded-lg border border-error/40 bg-error/5 p-4 text-error"
      >
        <span class="font-semibold">Submission rejected.</span>
        <p class="mt-1 text-sm text-error/80">
          You can edit your submission and resubmit it for approval.
        </p>
      </div>

      <div
        v-else-if="submission.approved === null"
        class="mt-5 rounded-lg border border-warning/40 bg-warning/5 p-4 text-warning"
      >
        <span class="font-medium"> Your submission is awaiting approval. </span>
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
  if (props.submission.approved === true) {
    return "Approved";
  }

  if (props.submission.approved === false) {
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
