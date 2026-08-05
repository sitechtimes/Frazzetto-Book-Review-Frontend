<template>
  <div class="min-h-screen bg-base-200">
    <main class="max-w-6xl mx-auto py-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-black">
            {{ course?.name }}
          </h1>

          <p class="text-gray-600">Period {{ course?.period }}</p>
        </div>
        <div role="tablist" class="tabs tabs-border">
          <NuxtLink
            :to="`/teacher/classes/${course?.id}`"
            role="tab"
            class="tab"
            >Reviews</NuxtLink
          >
          <NuxtLink
            :to="`/teacher/classes/book-submissions/${course?.id}`"
            role="tab"
            class="tab tab-active gap-2"
            >Book Submissions<span
              v-if="pendingBookSubmissions.length > 0"
              class="badge badge-error badge-sm"
            >
              {{ pendingBookSubmissions.length }}
            </span></NuxtLink
          >
        </div>
      </div>

      <div class="flex gap-8">
        <TeacherSideBar
          :students="course?.students ?? []"
          title="Students"
          @select="selectStudent"
        />

        <section class="flex-1">
          <div class="p-6">
            <div class="flex justify-between mb-6">
              <h2 class="text-xl font-semibold">Books</h2>

              <span>
                Selected:
                {{
                  selectedStudent
                    ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
                    : "All"
                }}
              </span>
            </div>

            <div class="mb-10">
              <div class="flex items-center gap-3 mb-4">
                <h3 class="text-gray-700">Pending</h3>

                <hr class="flex-1 border-gray-300" />
              </div>
              <TeacherBookApprovalCard
                v-for="submission in filteredPendingSubmissions"
                :key="submission.id"
                :submission="submission"
                :student="getStudent(submission.user_id)"
                :show-actions="true"
                @approve="approveSubmission"
                @reject="rejectSubmission"
              />
            </div>

            <div class="mt-10">
              <div class="flex items-center gap-3 mb-4">
                <h3 class="text-gray-700">Approved</h3>

                <hr class="flex-1 border-gray-300" />
              </div>

              <TeacherBookApprovalCard
                v-for="submission in filteredApprovedSubmissions"
                :key="submission.id"
                :submission="submission"
                :student="getStudent(submission.user_id)"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["teacher"],
});

const route = useRoute();

const courseStore = useCourseStore();
const userStore = useUserStore();
const submissionStore = useBookSubmissionStore();

const course = ref<CourseWithStudents | null>(null);

const selectedStudentId = ref<number | null>(null);

const { pendingBookSubmissions, approvedBookSubmissions } =
  storeToRefs(submissionStore);

onMounted(async () => {
  const courseId = Number(route.params.courseId);

  const courseResult = await courseStore.getCourseById(courseId);

  if (courseResult.error) {
    console.error(courseResult.error);
    return;
  }

  const courseData = courseResult.data;

  const studentResults = await Promise.all(
    courseData.students.map((id) => userStore.getUserById(id)),
  );

  const students: Student[] = studentResults
    .filter((result): result is { data: User } => result.data !== undefined)
    .map((result) => ({
      ...result.data,
      reviews: [],
    }));

  course.value = {
    ...courseData,
    students,
  };

  const pendingResult = await submissionStore.getPendingBookSubmissions();

  if (pendingResult.error) {
    console.error(pendingResult.error);
    return;
  }

  const approvedResult = await submissionStore.getApprovedBookSubmissions();

  if (approvedResult.error) {
    console.error(approvedResult.error);
  }
});

const selectedStudent = computed(() => {
  if (!selectedStudentId.value || !course.value) {
    return null;
  }

  return course.value.students.find(
    (student) => student.id === selectedStudentId.value,
  );
});

const filteredPendingSubmissions = computed(() => {
  if (!selectedStudentId.value) {
    return pendingBookSubmissions.value;
  }

  return pendingBookSubmissions.value.filter(
    (submission) => submission.user_id === selectedStudentId.value,
  );
});

const filteredApprovedSubmissions = computed(() => {
  if (!selectedStudentId.value) {
    return approvedBookSubmissions.value;
  }

  return approvedBookSubmissions.value.filter(
    (submission) => submission.user_id === selectedStudentId.value,
  );
});

function selectStudent(studentId: number | null) {
  selectedStudentId.value = studentId;
}

function getStudent(userId: number) {
  return (
    course.value?.students.find((student) => student.id === userId) ?? {
      id: userId,
      first_name: "Unknown",
      last_name: "Student",
      email: "",
      is_student: true,
      is_teacher: false,
      reviews: [],
    }
  );
}

async function approveSubmission(submission: BookSubmission) {
  const { error } = await submissionStore.approveBookSubmission(
    submission.id,
    true,
    submission,
  );

  if (error) {
    console.error(error);
    return;
  }

  await submissionStore.getPendingBookSubmissions();
  await submissionStore.getApprovedBookSubmissions();
}

async function rejectSubmission(submission: BookSubmission) {
  const { error } = await submissionStore.approveBookSubmission(
    submission.id,
    false,
    submission,
  );

  if (error) {
    console.error(error);
    return;
  }

  await submissionStore.getPendingBookSubmissions();
  await submissionStore.getApprovedBookSubmissions();
}
</script>
