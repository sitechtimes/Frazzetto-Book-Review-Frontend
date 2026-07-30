<template>
  <RoleLayout>
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

              <div class="grid grid-cols-4 gap-4">
                <label
                  v-for="genre in genres"
                  :key="genre.id"
                  class="flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm border-gray-300"
                    :value="genre.id"
                    v-model="book.genres"
                  />

                  {{ genre.name }}
                </label>

                <label class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="showOtherGenre"
                  />
                  Other
                </label>
              </div>

              <div v-if="showOtherGenre" class="mt-5">
                <input
                  v-model="otherGenre"
                  class="w-full h-11 px-4 border bg-white rounded-md"
                  placeholder="Enter new genre..."
                />
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
  </RoleLayout>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["teacher"],
  layout: false,
});

const router = useRouter();
const bookStore = useBookStore();

const { genres } = storeToRefs(bookStore);
const coverPreview = ref("");
const coverFile = ref<File | null>(null);
const showOtherGenre = ref(false);
const otherGenre = ref("");

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

  if (showOtherGenre.value && otherGenre.value.trim()) {
    const { data, error } = await bookStore.createGenre(
      otherGenre.value.trim(),
    );

    if (error) {
      console.error(error);
      return;
    }
    selectedGenres.push(data.id);
  }

  console.log("Sending genre IDs:", selectedGenres);

  const { error } = await bookStore.createBook({
    title: book.value.title,
    author: book.value.author,
    description: book.value.description,
    genres: selectedGenres,
    cover_image: coverFile.value,
  });

  if (error) {
    console.error(error);
    return;
  }

  await router.push("/explore");
}
</script>
