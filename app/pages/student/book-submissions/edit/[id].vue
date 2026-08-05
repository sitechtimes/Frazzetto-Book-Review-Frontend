<template>
  <div v-if="submission" class="min-h-screen bg-base-200">
    <section class="max-w-6xl mx-auto px-10 py-14">
      <h1 class="text-4xl font-bold text-center mb-14">Edit Book Submission</h1>

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
            </div>
          </div>

          <div class="flex justify-center gap-6 pt-16">
            <button class="btn bg-white border px-10" @click="goBack">
              Cancel
            </button>

            <button
              class="btn bg-slate-800 text-white px-10"
              @click="updateSubmission"
            >
              Save Changes
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
  middleware: "role-check",
  allowedRoles: ["student"],
});

const route = useRoute();
const router = useRouter();

const submissionStore = useBookSubmissionStore();
const bookStore = useBookStore();

const submission = ref<BookSubmission | null>(null);

const { genres } = storeToRefs(bookStore);

const coverPreview = ref("");
const coverFile = ref<File | null>(null);

const genreSearch = ref("");

const book = ref({
  title: "",
  author: "",
  description: "",
  genres: [] as number[],
});

onMounted(async () => {
  await bookStore.getGenres();

  const id = Number(route.params.id);

  const result = await submissionStore.getBookSubmissionById(id);

  if (result.error) {
    console.error(result.error);
    return;
  }

  submission.value = result.data;

  book.value = {
    title: result.data.title,
    author: result.data.author,
    description: result.data.description,
    genres: result.data.genres.map((genre) => genre.id),
  };

  if (result.data.cover_image) {
    coverPreview.value = result.data.cover_image;
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

function uploadCover(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) {
    return;
  }

  coverFile.value = file;
  coverPreview.value = URL.createObjectURL(file);
}

async function updateSubmission() {
  if (!submission.value) {
    return;
  }

  const { error } = await submissionStore.updateBookSubmission(
    submission.value.id,
    {
      ...submission.value,
      title: book.value.title,
      author: book.value.author,
      description: book.value.description,
      genres: book.value.genres,
      cover_image: coverFile.value,
    },
  );

  if (error) {
    console.error(error);
    return;
  }

  await router.push("/student/book-submissions");
}

function goBack() {
  router.push("/student/book-submissions");
}
</script>
