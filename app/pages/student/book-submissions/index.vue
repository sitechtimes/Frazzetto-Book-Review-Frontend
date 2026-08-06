<template>
  <div class="min-h-screen bg-base-200">
    <div class="flex justify-center py-6">
      <div role="tablist" class="tabs tabs-border">
        <NuxtLink to="/student/home" role="tab" class="tab">
          My Reviews
        </NuxtLink>

        <NuxtLink
          to="/student/book-submissions"
          role="tab"
          class="tab tab-active"
        >
          My Book Submissions
        </NuxtLink>
      </div>
    </div>
    <section class="max-w-5xl mx-auto px-10 py-10">
      <h1 class="text-4xl font-bold text-center mb-12">My Book Submissions</h1>

      <div v-if="selectedUserBookSubmissions.length" class="space-y-6">
        <StudentBookSubmissionCard
          v-for="submission in selectedUserBookSubmissions"
          :key="submission.id"
          :submission="submission"
          @edit="editBookSubmission"
          @delete="deleteBookSubmission"
        />
      </div>

      <div v-else class="flex flex-col items-center gap-4">
        <p class="text-center text-gray-500">
          You haven't submitted any books yet.
        </p>

        <NuxtLink
          to="/books/add"
          class="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors"
        >
          Add a Book
        </NuxtLink>
      </div>
    </section>
  </div>
  <ConfirmationModal
    :show="showDeleteModal"
    title="Delete Book Submission"
    message="Are you sure you want to delete this book submission? This action cannot be undone."
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["student"],
});

const userStore = useUserStore();
const submissionStore = useBookSubmissionStore();

const showDeleteModal = ref(false);
const submissionToDelete = ref<number | null>(null);

const { user } = storeToRefs(userStore);
const { selectedUserBookSubmissions } = storeToRefs(submissionStore);

onMounted(async () => {
  await userStore.loadSession();

  if (!user.value) return;

  await submissionStore.getBookSubmissionsByUserId(user.value.id);
});

function editBookSubmission(submission: BookSubmission) {
  navigateTo(`/student/book-submissions/edit/${submission.id}`);
}

async function deleteBookSubmission(id: number) {
  submissionToDelete.value = id;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (submissionToDelete.value === null) {
    return;
  }

  const { error } = await submissionStore.deleteBookSubmission(
    submissionToDelete.value,
  );

  if (error) {
    console.error(error);
    return;
  }

  if (user.value) {
    await submissionStore.getBookSubmissionsByUserId(user.value.id);
  }

  showDeleteModal.value = false;
  submissionToDelete.value = null;
}

function cancelDelete() {
  showDeleteModal.value = false;
  submissionToDelete.value = null;
}
</script>
