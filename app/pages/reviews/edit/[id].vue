<template>
    <StudentWriteReview v-if="review && book" :book="book" :initial-review="review" @submit="updateReview"
        @cancel="goBack" />
</template>


<script setup lang="ts">
const route = useRoute();

const userStore = useUserStore();
const reviewStore = useReviewStore();
const bookStore = useBookStore();

const review = ref<Review | null>(null);

const book = computed(() => bookStore.selectedBook);


onMounted(async () => {
    await userStore.loadSession();

    const id = Number(route.params.id);

    const reviewResult = await reviewStore.getReviewById(id);

    if (reviewResult.error) {
        console.error(reviewResult.error);
        return;
    }

    review.value = reviewResult.data;

    await bookStore.getBookById(review.value.book_id);
});

async function updateReview(data: {
    rating: number;
    headline: string;
    comment: string;
    spoiler: boolean;
}) {
    if (!review.value) {
        return;
    }

    const result = await reviewStore.updateReview(
        review.value.id,
        {
            book_id: review.value.book_id,
            user_id: review.value.user_id,
            rating: data.rating,
            headline: data.headline,
            comment: data.comment,
            spoiler: data.spoiler,
        },
    );

    if (result.error) {
        console.error(result.error);
        return;
    }

    navigateTo("/student/homepage");
}

function goBack() {
    navigateTo("/student/homepage");
}
</script>