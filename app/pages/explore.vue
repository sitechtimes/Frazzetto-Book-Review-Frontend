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
                class="fixed bottom-10 right-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl hover:bg-gray-100 transition">
                <span class="text-5xl leading-none -translate-y-1">+</span>
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
    userType: "student",
};


definePageMeta({
    layout: false
});


const layout = computed(() => {

    return currentUser.userType === "teacher"
        ? "teacher"
        : "student";

});


setPageLayout(layout.value);


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
    "Science Fiction",
];

const filteredBooks = computed(() => {
    let result = books.filter((book) => {

        const searchText = search.value.toLowerCase();

        const matchesSearch =
            book.title
                .toLowerCase()
                .includes(searchText) ||

            book.author
                .toLowerCase()
                .includes(searchText);

        const matchesGenre =
            selectedGenres.value.length === 0 ||

            selectedGenres.value.some((genre) =>
                book.genre.includes(genre)
            );

        return matchesSearch && matchesGenre;
    });

    if (sortOption.value === "title") {

        result.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

    }

    if (sortOption.value === "rating") {

        result.sort((a, b) =>
            b.averageRating - a.averageRating
        );

    }

    return result;
});
</script>
