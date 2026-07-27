<template>
  <div class="min-h-screen bg-base-200">
    <section class="max-w-6xl mx-auto px-10 py-14">
      <h1 class="text-4xl font-bold text-center mb-14">Add a Book</h1>

      <div class="grid grid-cols-[280px_1fr] gap-16">
        <div class="flex flex-col items-center">
          <div
            class="w-64 h-96 bg-gray-300 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="coverPreview"
              :src="coverPreview"
              class="w-full h-full object-contain"
            />

            <span v-else class="text-gray-500 text-lg"> Cover </span>
          </div>

          <label
            class="mt-8 cursor-pointer text-lg underline hover:text-gray-600"
          >
            Upload Book Cover

            <input
              type="file"
              class="hidden"
              accept="image/*"
              @change="uploadCover"
            />
          </label>
        </div>

        <div class="space-y-7">
          <div>
            <label class="block text-xl mb-2"> Title </label>

            <input
              v-model="book.title"
              class="w-full h-11 px-4 border border-gray-300 bg-white rounded-md focus:outline-none focus:border-gray-500"
              placeholder="Enter Book Title..."
            />
          </div>

          <div>
            <label class="block text-xl mb-2"> Author </label>

            <input
              v-model="book.author"
              class="w-full h-11 px-4 border border-gray-300 bg-white rounded-md focus:outline-none focus:border-gray-500"
              placeholder="Enter Book author..."
            />
          </div>

          <div>
            <label class="block text-xl mb-2"> Description </label>

            <textarea
              v-model="book.description"
              class="w-full h-28 px-4 py-3 border border-gray-300 bg-white rounded-md resize-none focus:outline-none focus:border-gray-500"
              placeholder="Enter Description..."
            />
          </div>

          <div>
            <label class="block text-xl mb-4"> Genres </label>

            <div class="grid grid-cols-4 gap-y-4 gap-x-8">
              <label
                v-for="genre in genres"
                :key="genre"
                class="flex items-center gap-3 text-sm"
              >
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm border-gray-300"
                  :value="genre"
                  v-model="book.genre"
                />

                {{ genre }}
              </label>
            </div>
          </div>

          <div class="flex justify-center gap-6 pt-16">
            <NuxtLink
              to="/explore"
              class="btn bg-white border border-gray-300 text-gray-800 px-10"
            >
              Cancel
            </NuxtLink>

            <button
              class="btn bg-slate-800 text-white px-10 hover:bg-slate-900"
              @click="submitBook"
            >
              Submit Book
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const coverPreview = ref("");

const book = ref({
  title: "",
  author: "",
  description: "",
  genre: [],
  coverImage: "",
  reviews: [],
  averageRating: 0,
});

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

function uploadCover(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) return;

  coverPreview.value = URL.createObjectURL(file);

  book.value.coverImage = coverPreview.value;
}

function submitBook() {
  console.log(book.value);
}
</script>
