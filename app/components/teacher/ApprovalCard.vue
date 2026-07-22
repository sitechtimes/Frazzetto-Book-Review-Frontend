<template>
  <div class="bg-white border border-gray-200 rounded-xl p-5 mb-4">
    <div class="flex justify-between">
      <div>
        <h3 class="font-medium text-black">
          {{ studentName }} - {{ review.headline }}
        </h3>
        <p class="text-sm text-gray-700">{{ title }} by {{ author }}</p>
      </div>
      <div class="text-right">
        <div class="flex">
          <span
            v-for="(percentage, index) in stars"
            :key="index"
            class="relative inline-block text-lg leading-none"
          >
            <span class="text-gray-300"> ★ </span>

            <span
              class="absolute left-0 top-0 overflow-hidden text-black"
              :style="{ width: `${percentage}%` }"
            >
              ★
            </span>
          </span>
        </div>
        <p class="text-sm text-gray-700">Created at {{ review.createdAt }}</p>
      </div>
    </div>

    <p class="mt-6 text-sm text-gray-800">
      {{ review.text }}
    </p>

    <div v-if="showActions" class="flex justify-end gap-2 mt-6">
      <button
        class="btn btn-sm bg-white border border-gray-300 text-black hover:bg-gray-100"
        @click="$emit('reject', review.id)"
      >
        Reject
      </button>
      <button
        class="btn btn-sm bg-white border border-gray-300 text-black hover:bg-gray-100"
        @click="$emit('approve', review.id)"
      >
        Approve
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  review: Review;
  showActions?: boolean;
}>();

defineEmits<{
  reject: [id: number];
  approve: [id: number];
}>();

const stars = computed(() => {
  const rating = props.review.rating;
  return Array.from({ length: 5 }, (_, index) => {
    const value = rating - index;
    if (value >= 1) return 100;
    if (value > 0) return Math.round(value * 100);
    return 0;
  });
});

//fetch book w/ id? :
const book = books[props.review.bookId - 1]; // this has to be fixed later bc ids may not be in order
const title = book.title;
const author = book.author;

const studentName =
  students[props.review.userId - 1].firstName +
  " " +
  students[props.review.userId - 1].lastName; //this also has to be fixed later
</script>

<style scoped></style>
