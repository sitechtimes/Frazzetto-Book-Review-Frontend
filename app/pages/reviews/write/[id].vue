<template>
  <div class="bg-base-200 min-h-screen">
    <StudentWriteReview
      v-if="book"
      :book="book"
      @submit="submitReview"
      @cancel="cancel"
    />
    <!-- what happens if a teacher writes a review -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <h1 class="text-3xl font-bold">Book not found</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  redirectIfAuth: false,
});

const route = useRoute();
const router = useRouter();

const bookStore = useBookStore();
const reviewStore = useReviewStore();
const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const book = computed(() => bookStore.selectedBook);

onMounted(async () => {
  const id = Number(route.params.id);

  const { error } = await bookStore.getBookById(id);

  if (error) {
    console.error(error);
  }
});

async function submitReview(review: {
  rating: number;
  headline: string;
  comment: string;
  spoiler: boolean;
}) {
  if (!book.value || !user.value) {
    return;
  }

  const reviewData = {
    book_id: book.value.id,
    user_id: user.value.id,
    rating: review.rating,
    headline: review.headline,
    comment: review.comment,
    spoiler: review.spoiler,
  };

  const { data, error } = await reviewStore.createReview(reviewData);

  if (error) {
    console.error("Failed to create review:", error);
    return;
  }

  console.log("Review created:", data);

  router.push(`/books/${book.value.id}`);
}

function cancel() {
  if (!book.value) {
    router.back();
    return;
  }

  router.push(`/books/${book.value.id}`);
}
</script>
