<template>
    <div class="min-h-screen bg-base-200">
        <section class="max-w-5xl mx-auto px-10 py-14">
            <h1 class="text-4xl font-bold text-center mb-12">
                My Reviews
            </h1>

            <div class="space-y-6">
                <ReviewCard v-for="review in student.reviews" :key="review.id" :review="review"
                    :book="getBook(review.bookId)" :show-actions="true" @edit="editReview" @delete="deleteReview" />
            </div>

        </section>
    </div>
</template>

<script setup lang="ts">
const currentUserId = 1;

const student = computed(() => {
    return students.find(
        (student: { id: number }) => student.id === currentUserId
    )!;
});

function getBook(id: number) {
    return books.find(
        book => book.id === id
    )!;
}

function editReview(review: Review) {
    console.log("Edit review:", review);
}

function deleteReview(id: number) {
    console.log("Delete review:", id);
}
</script>