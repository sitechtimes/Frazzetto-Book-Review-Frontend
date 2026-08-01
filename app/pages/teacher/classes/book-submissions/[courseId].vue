<template>
  <RoleLayout>
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
              class="tab tab-active"
              >Book Submissions</NuxtLink
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
                <h2 class="text-xl font-semibold">Pending Books</h2>

                <span>
                  Selected:
                  {{
                    selectedStudent
                      ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
                      : "All"
                  }}
                </span>
              </div>

              <!-- <TeacherBookApprovalCard
                v-for="submission in filteredPendingSubmissions"
                :key="submission.id"
                :submission="submission"
                :student="getStudent(submission.submitted_by)"
                :show-actions="true"
                @approve="approveSubmission"
                @reject="rejectSubmission"
              /> -->

              <div class="mt-10">
                <div class="flex items-center gap-3 mb-4">
                  <h3 class="text-gray-700">Approved</h3>

                  <hr class="flex-1 border-gray-300" />
                </div>

                <!-- <TeacherBookApprovalCard
                  v-for="submission in filteredApprovedSubmissions"
                  :key="submission.id"
                  :submission="submission"
                  :student="getStudent(submission.submitted_by)"
                /> -->
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </RoleLayout>
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
//const submissionStore = useBookSubmissionStore();

const course = ref<CourseWithStudents | null>(null);

//const pendingSubmissions = ref<BookSubmission[]>([]);
//const approvedSubmissions = ref<BookSubmission[]>([]);

const selectedStudentId = ref<number | null>(null);

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

  /* const pendingResult = await submissionStore.getPendingSubmissions();
  const approvedResult = await submissionStore.getApprovedSubmissions();

  if (pendingResult.error) {
    console.error(pendingResult.error);
    return;
  }

  if (approvedResult.error) {
    console.error(approvedResult.error);
    return;
  }

  pendingSubmissions.value = pendingResult.data.filter((submission) =>
    courseData.students.includes(submission.submitted_by),
  );

  approvedSubmissions.value = approvedResult.data.filter((submission) =>
    courseData.students.includes(submission.submitted_by),
  ); */
});

const selectedStudent = computed(() => {
  if (!selectedStudentId.value || !course.value) {
    return null;
  }

  return course.value.students.find(
    (student) => student.id === selectedStudentId.value,
  );
});

/* const filteredPendingSubmissions = computed(() => {
  if (!selectedStudentId.value) {
    return pendingSubmissions.value;
  }

  return pendingSubmissions.value.filter(
    (submission) => submission.submitted_by === selectedStudentId.value,
  );
});

const filteredApprovedSubmissions = computed(() => {
  if (!selectedStudentId.value) {
    return approvedSubmissions.value;
  }

  return approvedSubmissions.value.filter(
    (submission) => submission.submitted_by === selectedStudentId.value,
  );
}); */

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

/* async function approveSubmission(submission: BookSubmission) {
  const { error } = await submissionStore.approveSubmission(submission.id);

  if (error) {
    console.error("Failed to approve submission:", error);
    return;
  }

  pendingSubmissions.value = pendingSubmissions.value.filter(
    (item) => item.id !== submission.id,
  );

  approvedSubmissions.value.push({
    ...submission,
    status: "approved",
  });
}

async function rejectSubmission(submission: BookSubmission) {
  const { error } = await submissionStore.rejectSubmission(submission.id);

  if (error) {
    console.error("Failed to reject submission:", error);
    return;
  }

  pendingSubmissions.value = pendingSubmissions.value.filter(
    (item) => item.id !== submission.id,
  );
} */
</script>
