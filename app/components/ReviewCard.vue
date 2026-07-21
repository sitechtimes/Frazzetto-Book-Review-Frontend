<template>
    <div class="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <div class="flex justify-between gap-8">
            <div>
                <h2 class="text-2xl font-bold">
                    {{ review.headline }}
                </h2>

                <div v-if="showBookInfo" class="mt-2">

                    <p class="text-lg text-gray-700">
                        {{ book.title }}
                    </p>

                    <p class="text-gray-500">
                        by {{ book.author }}
                    </p>
                </div>
            </div>

            <div class="text-right min-w-fit">
                <div class="flex justify-end">
                    <span v-for="star in 5" :key="star" class="text-2xl" :class="star <= review.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                        ">
                        ★
                    </span>
                </div>

                <p class="text-sm text-gray-500 mt-2">
                    {{ formatDate(review.createdAt) }}
                </p>

                <p v-if="review.updatedAt" class="text-xs text-gray-400">
                    Edited
                </p>
            </div>
        </div>

        <p class="text-gray-700 text-lg leading-relaxed mt-6">
            {{ review.text }}
        </p>

        <p v-if="review.spoiler" class="text-red-600 text-sm font-medium mt-5">
            ⚠ Contains spoilers
        </p>

        <div v-if="showActions" class="flex justify-end gap-4 mt-6">
            <button class="btn bg-white border border-gray-300 text-gray-800 px-8" @click="emit('edit', review)">
                Edit
            </button>

            <button class="btn bg-red-600 text-white px-8 hover:bg-red-700" @click="emit('delete', review.id)">
                Delete
            </button>
        </div>
    </div>
</template>


<script setup lang="ts">
withDefaults(
    defineProps<{
        book: Book;
        review: Review;
        showActions?: boolean;
        showBookInfo?: boolean;
    }>(),
    {
        showActions: false,
        showBookInfo: true,
    }
);

const emit = defineEmits<{
    edit: [review: Review];
    delete: [id: number];
}>();

function formatDate(date: string) {
    if (!date) {
        return "";
    }
    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );
}
</script>