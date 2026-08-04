<template>
  <div class="min-h-screen bg-base-200">
    <section class="max-w-5xl mx-auto px-10 py-14">
      <h1 class="text-4xl font-bold text-center mb-12">My Reviews</h1>

      <div v-if="selectedUserReviews.length" class="space-y-6">
        <ReviewCard
          v-for="review in selectedUserReviews"
          :key="review.id"
          :review="review"
          :book="getBook(review.book_id)"
          :show-actions="true"
          @edit="editReview"
          @delete="deleteReview"
        />
      </div>

      <p v-else class="text-center text-gray-500">
        You haven't written any reviews yet.
      </p>
    </section>
  </div>
  <ConfirmationModal
    :show="showDeleteModal"
    title="Delete Review"
    message="Are you sure you want to delete this review? This action cannot be undone."
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["student"],
});

const userStore = useUserStore();
const reviewStore = useReviewStore();
const bookStore = useBookStore();
const showDeleteModal = ref(false);
const reviewToDelete = ref<number | null>(null);

const { user } = storeToRefs(userStore);
const { books } = storeToRefs(bookStore);
const { selectedUserReviews } = storeToRefs(reviewStore);

onMounted(async () => {
  await userStore.loadSession();

  if (!user.value) return;

  await Promise.all([
    bookStore.getAllBooks(),
    reviewStore.getReviewsByStudentId(user.value.id),
  ]);
});

function getBook(bookId: number): Book {
  const book = books.value.find((book) => book.id === bookId);

  if (!book) {
    throw new Error(`Book ${bookId} not found`);
  }

  return book;
}

function editReview(review: Review) {
  navigateTo(`/reviews/edit/${review.id}`);
}

async function deleteReview(id: number) {
  reviewToDelete.value = id;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (reviewToDelete.value === null) {
    return;
  }

  const { error } = await reviewStore.deleteReview(reviewToDelete.value);

  if (error) {
    console.error(error);
    return;
  }

  if (user.value) {
    await reviewStore.getReviewsByStudentId(user.value.id);
  }

  showDeleteModal.value = false;
  reviewToDelete.value = null;
}

function cancelDelete() {
  showDeleteModal.value = false;
  reviewToDelete.value = null;
}
</script>
