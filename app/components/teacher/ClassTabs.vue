<template>
  <div role="tablist" class="tabs tabs-border">
    <NuxtLink
      :to="`/teacher/classes/${courseId}`"
      role="tab"
      class="tab gap-2"
      :class="{ 'tab-active': active === 'reviews' }"
    >
      Reviews

      <span v-if="pendingReviewCount > 0" class="badge badge-error badge-sm">
        {{ pendingReviewCount }}
      </span>
    </NuxtLink>

    <NuxtLink
      :to="`/teacher/classes/${courseId}/book-submissions`"
      role="tab"
      class="tab gap-2"
      :class="{ 'tab-active': active === 'submissions' }"
    >
      Book Submissions

      <span
        v-if="pendingSubmissionCount > 0"
        class="badge badge-error badge-sm"
      >
        {{ pendingSubmissionCount }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  courseId: number;
  studentIds: number[];
  active: "reviews" | "submissions";
}>();

const reviewStore = useReviewStore();
const submissionStore = useBookSubmissionStore();

const pendingReviewCount = ref(0);
const pendingSubmissionCount = ref(0);

onMounted(async () => {
  const [reviewResult, submissionResult] = await Promise.all([
    reviewStore.getPendingReviews(),
    submissionStore.getPendingBookSubmissions(),
  ]);

  if (!reviewResult.error) {
    pendingReviewCount.value = reviewResult.data.filter((review) =>
      props.studentIds.includes(review.user_id),
    ).length;
  }

  if (!submissionResult.error) {
    pendingSubmissionCount.value = submissionResult.data.filter((submission) =>
      props.studentIds.includes(submission.user_id),
    ).length;
  }
});
</script>
