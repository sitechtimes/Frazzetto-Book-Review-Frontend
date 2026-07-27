<template>
  <div class="bg-base-200">
    <button class="btn btn-outline m-10" @click="cancel">< Back</button>
    <p>
      add navbar to page --> can teachers add reviews? if YES, take file out &
      dynamic layout; if NO, only make write review btn visible to students &
      student layout
    </p>
  </div>

  <StudentWriteReview
    v-if="book"
    :book="book"
    @submit="submitReview"
    @cancel="cancel"
  />

  <div v-else class="min-h-screen flex items-center justify-center">
    <h1 class="text-3xl font-bold">Book not found</h1>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const book = computed(() => {
  const id = Number(route.params.id);
  return books.find((book) => book.id === id);
});

function submitReview(review: any) {
  if (!book.value) {
    return;
  }

  console.log("New review:", {
    bookId: book.value.id,
    ...review,
  });
}

function cancel() {
  router.push(`/books/${book.value?.id}`);
}
</script>
