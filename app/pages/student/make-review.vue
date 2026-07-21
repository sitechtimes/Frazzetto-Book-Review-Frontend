<template>
    <StudentWriteReview :book="book" @submit="submitReview" @cancel="$router.push('/explore')" />
</template>

<script setup lang="ts">
const books: Book[] = [
    {
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: ["Fantasy", "Adventure"],
        description:
            "Bilbo Baggins is a quiet hobbit who enjoys a peaceful life until the wizard Gandalf arrives and pulls him into an unexpected adventure. Alongside a group of dwarves, Bilbo travels across Middle-earth to reclaim a lost kingdom from the dragon Smaug.",
        coverImage: "/hobbit.jpg",

        averageRating: 4.5,

        reviews: [
            {
                id: 1,
                bookId: 1,
                userId: 1,
                rating: 5,
                headline: "Amazing adventure",
                isApproved: true,
                spoiler: false,
            },
            {
                id: 2,
                bookId: 1,
                userId: 2,
                rating: 4,
                headline: "Great fantasy book",
                isApproved: true,
                spoiler: false,
            },
        ],
    },

    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        genre: ["Science Fiction", "Fantasy"],
        description:
            "On the desert planet Arrakis, young Paul Atreides is drawn into a conflict involving politics, prophecy, and control of the most valuable resource in the universe. Dune explores power, survival, and destiny.",
        coverImage: "/dune.jpg",

        averageRating: 4.8,

        reviews: [
            {
                id: 3,
                bookId: 2,
                userId: 3,
                rating: 5,
                headline: "Masterpiece",
                isApproved: true,
                spoiler: false,
            },
            {
                id: 4,
                bookId: 2,
                userId: 4,
                rating: 5,
                headline: "Amazing world building",
                isApproved: true,
                spoiler: false,
            },
            {
                id: 5,
                bookId: 2,
                userId: 5,
                rating: 4,
                headline: "Very detailed",
                isApproved: true,
                spoiler: false,
            },
        ],
    },

    {
        id: 3,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: ["Mystery", "Thriller"],
        description:
            "A famous painter is accused of murdering her husband and then stops speaking entirely. A therapist becomes determined to uncover the truth behind her silence and discovers a much deeper mystery.",
        coverImage: "/the-silent-patient.jpg",

        averageRating: 4.2,

        reviews: [
            {
                id: 6,
                bookId: 3,
                userId: 6,
                rating: 4,
                headline: "Great mystery",
                isApproved: true,
                spoiler: false,
            },
            {
                id: 7,
                bookId: 3,
                userId: 7,
                rating: 5,
                headline: "Fantastic ending",
                isApproved: true,
                spoiler: false,
            },
            {
                id: 8,
                bookId: 3,
                userId: 8,
                rating: 3,
                headline: "Good but slow",
                isApproved: true,
                spoiler: false,
            },
        ],
    },
];
const book = books[0];

function submitReview(review: any) {
    console.log("Review submitted:", review);
}
</script>