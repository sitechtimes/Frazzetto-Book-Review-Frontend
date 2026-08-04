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

            <span v-else class="text-gray-500"> Cover </span>
          </div>

          <label class="mt-8 cursor-pointer text-lg underline">
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
              class="w-full h-11 px-4 border bg-white rounded-md"
            />
          </div>

          <div>
            <label class="block text-xl mb-2"> Author </label>

            <input
              v-model="book.author"
              class="w-full h-11 px-4 border bg-white rounded-md"
            />
          </div>

          <div>
            <label class="block text-xl mb-2"> Description </label>

            <textarea
              v-model="book.description"
              class="w-full h-28 px-4 py-3 border bg-white rounded-md"
            />
          </div>

          <div>
            <label class="block text-xl mb-4"> Genres </label>

            <input
              v-model="genreSearch"
              class="w-full h-11 px-4 border bg-white rounded-md"
              placeholder="Search genres..."
            />

            <div class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="genreId in book.genres"
                :key="genreId"
                class="badge badge-neutral gap-2"
              >
                {{ getGenreName(genreId) }}

                <button type="button" @click="removeGenre(genreId)">×</button>
              </span>
            </div>

            <div
              class="mt-4 max-h-48 overflow-y-auto border rounded-md bg-white"
            >
              <button
                v-for="genre in filteredGenres"
                :key="genre.id"
                type="button"
                class="w-full text-left px-4 py-2 hover:bg-gray-100"
                @click="toggleGenre(genre.id)"
              >
                {{ book.genres.includes(genre.id) ? "✓ " : "" }}

                {{ genre.name }}
              </button>

              <p
                v-if="filteredGenres.length === 0"
                class="px-4 py-2 text-gray-500"
              >
                No genres found
              </p>
            </div>

            <label class="flex items-center gap-3 mt-5">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                v-model="showOtherGenre"
              />

              Other
            </label>

            <div v-if="showOtherGenre" class="mt-5">
              <div class="flex gap-3">
                <input
                  v-model="newGenre"
                  class="flex-1 h-11 px-4 border bg-white rounded-md"
                  placeholder="Enter new genre..."
                  @keyup.enter="addOtherGenre"
                />

                <button
                  type="button"
                  class="btn bg-slate-800 text-white"
                  @click="addOtherGenre"
                >
                  Add
                </button>
              </div>

              <div class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="(genre, index) in otherGenres"
                  :key="index"
                  class="badge badge-neutral gap-2"
                >
                  {{ genre }}

                  <button type="button" @click="removeOtherGenre(index)">
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-center gap-6 pt-16">
            <NuxtLink to="/explore" class="btn bg-white border px-10">
              Cancel
            </NuxtLink>

            <button
              class="btn bg-slate-800 text-white px-10"
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
definePageMeta({
  layout: false,
  requiresAuth: true,
  redirectIfAuth: false,
});

const router = useRouter();
const bookStore = useBookStore();

const { genres } = storeToRefs(bookStore);
const coverPreview = ref("");
const coverFile = ref<File | null>(null);
const genreSearch = ref("");
const showOtherGenre = ref(false);
const otherGenres = ref<string[]>([]);
const newGenre = ref("");

const book = ref({
  title: "",
  author: "",
  description: "",
  genres: [] as number[],
  cover_image: null as File | null,
});

onMounted(async () => {
  const { error } = await bookStore.getGenres();

  if (error) {
    console.error(error);
  }
});

const filteredGenres = computed(() => {
  if (!genreSearch.value.trim()) {
    return genres.value;
  }

  return genres.value.filter((genre) =>
    genre.name.toLowerCase().includes(genreSearch.value.toLowerCase()),
  );
});

function toggleGenre(id: number) {
  if (book.value.genres.includes(id)) {
    book.value.genres = book.value.genres.filter((genreId) => genreId !== id);

    return;
  }

  book.value.genres.push(id);
}

function removeGenre(id: number) {
  book.value.genres = book.value.genres.filter((genreId) => genreId !== id);
}

function getGenreName(id: number) {
  return genres.value.find((genre) => genre.id === id)?.name ?? "Unknown";
}

function addOtherGenre() {
  const genre = newGenre.value.trim();

  if (!genre) {
    return;
  }

  if (!otherGenres.value.includes(genre)) {
    otherGenres.value.push(genre);
  }

  newGenre.value = "";
}

function removeOtherGenre(index: number) {
  otherGenres.value.splice(index, 1);
}

function uploadCover(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) {
    return;
  }

  coverFile.value = file;

  coverPreview.value = URL.createObjectURL(file);
}

async function submitBook() {
  if (!book.value.title || !book.value.author || !book.value.description) {
    alert("Please fill all fields");
    return;
  }

  const selectedGenres = [...book.value.genres];

  if (showOtherGenre.value) {
    for (const genreName of otherGenres.value) {
      const { data, error } = await bookStore.createGenre(genreName);

      if (error) {
        console.error(error);
        return;
      }

      selectedGenres.push(data.id);
    }
  }

  const { error } = await bookStore.createBook({
    title: book.value.title,
    author: book.value.author,
    description: book.value.description,
    genres: selectedGenres,
    cover_image: coverFile.value,
  });

  //add logic here to add book to pending approval if submitted by student

  if (error) {
    console.error(error);
    return;
  }

  await router.push("/explore");
}
</script>
