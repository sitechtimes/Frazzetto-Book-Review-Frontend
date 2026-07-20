<template>
    <div class="min-h-screen bg-base-200">
        <main class="max-w-7xl mx-auto px-6 py-12">
            <h1 class="text-4xl font-bold text-center mb-10">Explore Books</h1>

            <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
                <div class="relative w-full max-w-md">
                    <input v-model="search" type="text" placeholder="Search books by title or author..."
                        class="input input-bordered w-full" />
                </div>

                <select v-model="sortOption" class="select select-bordered">
                    <option value="">Sort by:</option>

                    <option value="title">Alphabetical</option>

                    <option value="rating">Highest Rated</option>
                </select>

                <button class="btn btn-outline" @click="showGenres = !showGenres">
                    Genres ▾
                </button>
            </div>

            <div v-if="showGenres" class="flex flex-wrap justify-center gap-3 mb-10">
                <label v-for="genre in genres" :key="genre" class="flex items-center gap-2 text-sm">
                    <input type="checkbox" class="checkbox checkbox-sm" :value="genre" v-model="selectedGenres" />

                    {{ genre }}
                </label>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-14">
                <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
            </div>

            <RouterLink v-if="currentUser.userType === 'teacher'" to="/books/add"
                class="fixed bottom-10 right-10 h-16 w-16 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl font-light hover:bg-gray-100 transition">
                +
            </RouterLink>
        </main>
    </div>
</template>

<script setup lang="ts">
const currentUser: User = {
    id: 1,
    email: "teacher@test.com",
    firstName: "John",
    lastName: "Smith",
    userType: "teacher",
};

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

const search = ref("");
const sortOption = ref("");
const showGenres = ref(false);

const selectedGenres = ref<string[]>([]);

const genres = [
    "Fiction",
    "Nonfiction",
    "Adult",
    "Young Adult",
    "Biography",
    "Classics",
    "Fantasy",
    "Adventure",
    "Mystery",
    "Historical",
    "Romance",
    "SciFi",
];

const filteredBooks = computed(() => {
    let result = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(search.value.toLowerCase()) ||
            book.author.toLowerCase().includes(search.value.toLowerCase());

        const matchesGenre =
            selectedGenres.value.length === 0 ||
            selectedGenres.value.some((genre) => book.genre.includes(genre));

        return matchesSearch && matchesGenre;
    });

    if (sortOption.value === "title") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortOption.value === "rating") {
        result.sort((a, b) => b.averageRating - a.averageRating);
    }

    return result;
});
</script>
