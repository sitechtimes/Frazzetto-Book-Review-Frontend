<template>
  <div
    class="group flex flex-col transition-transform duration-200 hover:-translate-y-1"
  >
    <NuxtLink
      :to="`/books/${book.id}`"
      class="aspect-2/3 w-full overflow-hidden bg-base-200"
    >
      <img
        v-if="book.cover_image"
        :src="book.cover_image"
        :alt="book.title"
        class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />

      <div
        v-else
        class="h-full w-full flex items-center justify-center text-gray-400"
      >
        No Cover
      </div>
    </NuxtLink>

    <div class="mt-4 space-y-2">
      <div class="font-semibold text-base leading-tight hover:underline">
        {{ book.title }}
      </div>

      <p class="text-sm text-gray-600">
        {{ book.author }}
      </p>

      <div class="flex flex-wrap gap-1">
        <span
          v-for="(genre, index) in book.genres"
          :key="typeof genre === 'object' ? genre.id : genre"
          class="text-xs text-gray-500"
        >
          {{ typeof genre === "object" ? genre.name : genre }}

          <span v-if="index < book.genres.length - 1"> • </span>
        </span>
      </div>

      <p class="text-sm text-gray-700 leading-relaxed">
        {{ shortDescription }}

        <NuxtLink :to="`/books/${book.id}`" class="font-medium underline">
          Read More
        </NuxtLink>
      </p>

      <div class="flex items-center gap-2 pt-1">
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

        <span class="text-sm text-gray-600">
          {{ book.average_rating ? book.average_rating.toFixed(1) : "0.0" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  book: Book;
}>();

const stars = computed(() => {
  const rating = props.book.average_rating ?? 0;

  return Array.from({ length: 5 }, (_, index) => {
    const value = rating - index;

    if (value >= 1) {
      return 100;
    }

    if (value > 0) {
      return Math.round(value * 100);
    }

    return 0;
  });
});

const MAX_DESCRIPTION_LENGTH = 50;

const shortDescription = computed(() => {
  const description = props.book.description ?? "";

  if (description.length <= MAX_DESCRIPTION_LENGTH) {
    return description;
  }

  return description.slice(0, MAX_DESCRIPTION_LENGTH).trim() + "...";
});
</script>
