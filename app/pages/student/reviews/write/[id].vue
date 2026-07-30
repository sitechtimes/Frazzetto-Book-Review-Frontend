<template>
  <div class="bg-base-200 min-h-screen">
    <StudentWriteReview v-if="book" :book="book" @submit="submitReview" @cancel="cancel" />

    <div v-else class="min-h-screen flex items-center justify-center">
      <h1 class="text-3xl font-bold">
        Book not found
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["student"],
});

const route = useRoute();
const router = useRouter();

const bookStore = useBookStore();

const book = computed(() => bookStore.selectedBook);


onMounted(async () => {
  const id = Number(route.params.id);

  const { error } = await bookStore.getBookById(id);

  if (error) {
    console.error(error);
  }
});


async function submitReview(review: Review) {
  if (!book.value) {
    return;
  }

  const newReview = {
    bookId: book.value.id,
    ...review,
  };

  console.log("New review:", newReview);

  // TODO:
  // await reviewStore.createReview(newReview);
}

function cancel() {
  if (!book.value) {
    router.back();
    return;
  }

  router.push(`/books/${book.value.id}`);
}
</script>