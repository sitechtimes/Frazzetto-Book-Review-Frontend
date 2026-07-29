<template>
  <RoleLayout>
    <div class="min-h-screen bg-base-200">
      <section v-if="book" class="max-w-6xl mx-auto px-10 py-14">
        <div class="grid grid-cols-[280px_1fr] gap-16">
          <div class="flex flex-col items-center">
            <div class="w-64 h-96 bg-gray-300 rounded overflow-hidden">
              <img :src="book.cover_image" :alt="book.title" class="w-full h-full object-contain" />
            </div>

            <button class="btn bg-slate-800 text-white px-10 mt-8 hover:bg-slate-900" @click="writeReview">
              Write Review
            </button>
          </div>

          <div class="space-y-7">
            <h1 class="text-4xl font-bold">
              {{ book.title }}
            </h1>

            <p class="text-xl text-gray-700">
              {{ book.author }}
            </p>

            <div>
              <h2 class="text-xl font-semibold mb-3">
                Genres
              </h2>

              <div class="flex flex-wrap gap-3">
                <span v-for="genre in book.genres" :key="genre.id" class="px-4 py-1 bg-gray-200 rounded-full text-sm">
                  {{ genre.name }}
                </span>
              </div>
            </div>

            <div>
              <h2 class="text-xl font-semibold mb-3">Average Rating</h2>

              <div class="flex items-center gap-3">
                <div class="flex">
                  <span v-for="(percentage, index) in stars" :key="index"
                    class="relative inline-block text-3xl leading-none">
                    <span class="text-gray-300"> ★ </span>

                    <span class="absolute left-0 top-0 overflow-hidden text-yellow-400"
                      :style="{ width: `${percentage}%` }">
                      ★
                    </span>
                  </span>
                </div>

                <span class="text-lg text-gray-700">
                  {{ book.average_rating ? book.average_rating.toFixed(1) : "0.0" }}

                  <a href="#reviews" class="hover:underline cursor-pointer">
                    ({{ approvedReviews.length }} reviews)
                  </a>
                </span>
              </div>
            </div>

            <div>
              <h2 class="text-xl font-semibold mb-3">Description</h2>

              <p class="text-lg text-gray-700 leading-relaxed">
                {{ book.description }}
              </p>
            </div>
          </div>
        </div>

        <section id="reviews" class="mt-16">
          <h2 class="text-3xl font-bold mb-8">Reviews</h2>

          <div class="space-y-6">
            <ReviewCard v-for="review in approvedReviews" :key="review.id" :book="book" :review="review" />

            <p v-if="approvedReviews.length === 0" class="text-lg text-gray-600">
              No reviews yet. Be the first to write one!
            </p>
          </div>
        </section>
      </section>

      <section v-else class="max-w-6xl mx-auto px-10 py-20 text-center">
        <h1 class="text-4xl font-bold">Book not found</h1>
      </section>
    </div>
  </RoleLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const bookStore = useBookStore();

const book = computed(() => bookStore.selectedBook);

onMounted(async () => {
  const id = Number(route.params.id);

  const { error } = await bookStore.getBookById(id);

  if (error) {
    console.error(error);
  }
});

const approvedReviews = computed(() => {
  if (!book.value || !book.value.reviews) {
    return [];
  }

  return book.value.reviews.filter(
    (review) => review.is_approved,
  );
});

const stars = computed(() => {
  if (!book.value) {
    return [];
  }

  const rating = book.value.average_rating ?? 0;

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


function writeReview() {
  if (!book.value) {
    return;
  }

  navigateTo(`/student/reviews/write/${book.value.id}`);
}
</script>