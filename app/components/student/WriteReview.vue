<template>
    <div class="min-h-screen bg-base-200">
        <section class="max-w-6xl mx-auto px-10 py-14">

            <h1 class="text-4xl font-bold text-center mb-14">
                Write Review
            </h1>

            <div class="grid grid-cols-[280px_1fr] gap-16">

                <div class="flex flex-col items-center">

                    <div class="w-64 h-96 bg-gray-300 rounded flex items-center justify-center overflow-hidden">
                        <img :src="book.coverImage" :alt="book.title" class="w-full h-full object-contain" />
                    </div>

                    <div class="mt-8 text-center w-64">
                        <h2 class="text-2xl font-bold">
                            {{ book.title }}
                        </h2>

                        <p class="text-lg text-gray-700 mt-1">
                            {{ book.author }}
                        </p>

                        <p class="text-gray-500 mt-1">
                            {{ book.genre.join(", ") }}
                        </p>

                        <p class="text-sm text-gray-600 mt-4">
                            {{ book.description }}
                        </p>
                    </div>

                </div>

                <div class="space-y-5">

                    <div>
                        <label class="block text-xl mb-2">
                            Headline
                        </label>

                        <input v-model="review.headline" type="text" maxlength="255"
                            class="w-full h-11 px-4 border border-gray-300 bg-white rounded-md focus:outline-none focus:border-gray-500"
                            placeholder="Summarize your review..." />

                        <p class="text-sm text-gray-500 mt-1 text-right">
                            {{ review.headline.length }}/255
                        </p>
                    </div>

                    <div>
                        <label class="block text-xl mb-3">
                            Your Rating
                        </label>

                        <div class="flex gap-2">
                            <button v-for="star in 5" :key="star" type="button" @click="review.rating = star"
                                class="text-5xl transition hover:scale-110"
                                :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'">
                                ★
                            </button>
                        </div>
                    </div>

                    <div>

                        <textarea v-model="review.text" required
                            class="w-full h-56 px-4 py-3 border border-gray-300 bg-white rounded-md resize-none focus:outline-none focus:border-gray-500"
                            placeholder="Write your thoughts about this book..." />
                    </div>

                    <div>
                        <label class="flex items-center gap-3 text-lg">
                            <input type="checkbox" class="checkbox" v-model="review.spoiler" />

                            This review contains spoilers
                        </label>
                    </div>

                    <div class="flex justify-center gap-6 pt-10">

                        <button class="btn bg-white border border-gray-300 text-gray-800 px-10"
                            @click="$emit('cancel')">
                            Cancel
                        </button>

                        <button class="btn bg-slate-800 text-white px-10 hover:bg-slate-900" @click="submitReview">
                            Submit Review
                        </button>

                    </div>

                </div>

            </div>

        </section>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    book: Book;
}>();

const emit = defineEmits<{
    (
        e: "submit",
        review: {
            rating: number;
            headline: string;
            text: string;
            spoiler: boolean;
        }
    ): void;

    (e: "cancel"): void;
}>();

const review = ref({
    rating: 0,
    headline: "",
    text: "",
    spoiler: false,
});

function submitReview() {

    if (review.value.rating === 0) {
        alert("Please select a star rating.");
        return;
    }

    if (!review.value.headline.trim()) {
        alert("Please enter a headline.");
        return;
    }

    if (!review.value.text.trim()) {
        alert("Please write a review.");
        return;
    }

    emit("submit", {
        rating: review.value.rating,
        headline: review.value.headline,
        text: review.value.text,
        spoiler: review.value.spoiler,
    });
}
</script>