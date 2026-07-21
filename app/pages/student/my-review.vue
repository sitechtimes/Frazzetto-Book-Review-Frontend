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
const books: Book[] = [
    {
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: ["Fantasy", "Adventure"],
        description: "A hobbit goes on an adventure.",
        coverImage: "/hobbit.jpg",
        averageRating: 4.5,
        reviews: []
    }
];

const student: Student = {

    id: 1,
    email: "student@test.com",
    firstName: "John",
    lastName: "Smith",
    userType: "user",

    reviews: [

        {
            id: 1,
            bookId: 1,
            userId: 1,
            rating: 5,
            headline: "Amazing adventure",
            text: "This book was an amazing journey through Middle Earth.",
            isApproved: true,
            spoiler: false,
            createdAt: "2026-07-21",
            approvedAt: "2026-07-22",
            updatedAt: null
        }

    ]

};

function getBook(id: number) {
    return books.find(
        book => book.id === id
    )!;
}

function editReview(review: any) {
    console.log("Edit:", review);
}

function deleteReview(id: number) {
    console.log("Delete:", id);
}
</script>