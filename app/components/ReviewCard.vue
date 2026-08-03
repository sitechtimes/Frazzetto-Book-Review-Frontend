<template>
  <div class="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
    <div class="flex justify-between gap-8">
      <div>
        <h2 class="text-2xl font-bold">
          {{ review.headline }}
        </h2>

        <div v-if="showBookInfo && book" class="mt-2">
          <p class="text-lg text-gray-700">
            {{ book.title }}
          </p>

          <p class="text-gray-500">by {{ book.author }}</p>
        </div>

        <p v-if="review.spoiler" class="font-semibold">
          ⚠ This review contains spoilers
        </p>
      </div>

      <div class="text-right min-w-fit">
        <div class="flex justify-end">
          <span
            v-for="star in 5"
            :key="star"
            class="text-2xl"
            :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
          >
            ★
          </span>
        </div>

        <p class="text-sm text-gray-500 mt-2">
          {{ formatDate(review.created_at) }}
        </p>

        <!-- Elisa needs to make it not exist unless the review was actually changed after the initizal creation -->
        <!-- <p v-if="review.updated_at" class="text-xs text-gray-400">
                    Edited
                </p> -->
      </div>
    </div>

    <div class="mt-6">
      <button
        v-if="review.spoiler && !showSpoiler"
        class="w-full text-left bg-gray-200 rounded-md p-5 text-gray-700 hover:bg-gray-300 transition"
        @click="showSpoiler = true"
      >
        <p class="text-sm mt-1">Click to reveal review</p>
      </button>

      <div v-else>
        <p class="text-gray-700 text-lg leading-relaxed">
          {{ review.comment }}
        </p>
        <div v-if="review.spoiler" class="flex justify-end mb-3">
          <button
            class="btn btn-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            @click="showSpoiler = false"
          >
            Hide
          </button>
        </div>
      </div>
    </div>

    <div v-if="showActions" class="flex justify-end gap-4 mt-6">
      <button
        class="btn bg-white border border-gray-300 text-gray-800 px-8"
        @click="emit('edit', review)"
      >
        Edit
      </button>

      <button
        class="btn bg-red-600 text-white px-8 hover:bg-red-700"
        @click="emit('delete', review.id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    book?: Book;
    review: Review;
    showActions?: boolean;
    showBookInfo?: boolean;
  }>(),
  {
    showActions: false,
    showBookInfo: true,
  },
);

const emit = defineEmits<{
  edit: [review: Review];
  delete: [id: number];
}>();

const showSpoiler = ref(false);

function formatDate(date: string) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
</script>
