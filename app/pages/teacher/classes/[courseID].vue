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

        <!-- <button class="btn btn-outline">
          Assign +
        </button> -->
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
              <h2 class="text-xl font-semibold">Reviews</h2>

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

              <TeacherApprovalCard
                v-for="review in filteredPendingReviews"
                :key="review.id"
                :review="review"
                :book="getBook(review.book_id)"
                :student="getStudent(review.user_id)"
                :show-actions="true"
                @approve="approveReview"
                @reject="rejectReview"
              />
            </div>

            <div>
              <div class="flex items-center gap-3 mb-4">
                <h3 class="text-gray-700">Approved</h3>

                <hr class="flex-1 border-gray-300" />
              </div>

              <TeacherApprovalCard
                v-for="review in filteredApprovedReviews"
                :key="review.id"
                :review="review"
                :book="getBook(review.book_id)"
                :student="getStudent(review.user_id)"
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
  layout: "teacher",
  requiresAuth: true,
  redirectIfAuth: false,
  middleware: "role-check",
  allowedRoles: ["teacher"],
});

const route = useRoute();

const courseStore = useCourseStore();
const userStore = useUserStore();
const reviewStore = useReviewStore();
const bookStore = useBookStore();

const course = ref<CourseWithStudents | null>(null);

const pendingReviews = ref<Review[]>([]);
const approvedReviews = ref<Review[]>([]);

const selectedStudentId = ref<number | null>(null);

onMounted(async () => {
  const courseId = Number(route.params.courseId);

  const courseResult = await courseStore.getCourseById(courseId);

  if (courseResult.error) {
    console.error(courseResult.error);
    return;
  }

  const courseData = courseResult.data;

  await bookStore.getAllBooks();

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

  const pendingResult = await reviewStore.getPendingReviews();

  const approvedResult = await reviewStore.getApprovedReviews();

  if (pendingResult.error) {
    console.error(pendingResult.error);
    return;
  }

  if (approvedResult.error) {
    console.error(approvedResult.error);
    return;
  }

  pendingReviews.value = pendingResult.data.filter((review) =>
    courseData.students.includes(review.user_id),
  );

  approvedReviews.value = approvedResult.data.filter((review) =>
    courseData.students.includes(review.user_id),
  );
});

const selectedStudent = computed(() => {
  if (!selectedStudentId.value || !course.value) {
    return null;
  }

  return course.value.students.find(
    (student) => student.id === selectedStudentId.value,
  );
});

const filteredPendingReviews = computed(() => {
  if (!selectedStudentId.value) {
    return pendingReviews.value;
  }

  return pendingReviews.value.filter(
    (review) => review.user_id === selectedStudentId.value,
  );
});

const filteredApprovedReviews = computed(() => {
  if (!selectedStudentId.value) {
    return approvedReviews.value;
  }

  return approvedReviews.value.filter(
    (review) => review.user_id === selectedStudentId.value,
  );
});

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

function getBook(bookId: number) {
  return (
    bookStore.books.find((book) => book.id === bookId) ?? {
      id: bookId,
      title: "Unknown Book",
      author: "Unknown Author",
      genres: [],
      description: "",
      cover_image: "",
      reviews: [],
      average_rating: null,
    }
  );
}

function selectStudent(studentId: number | null) {
  selectedStudentId.value = studentId;
}

async function approveReview(review: Review) {
  const { error } = await reviewStore.approveReview(review.id, true, review);

  if (error) {
    console.error("Failed to approve review:", error);
    return;
  }

  const approvedReview = {
    ...review,
    is_approved: true,
  };

  pendingReviews.value = pendingReviews.value.filter(
    (item) => item.id !== review.id,
  );

  approvedReviews.value.push(approvedReview);
}

async function rejectReview(review: Review) {
  const { error } = await reviewStore.approveReview(review.id, false, review);

  if (error) {
    console.error("Failed to reject review:", error);
    return;
  }

  pendingReviews.value = pendingReviews.value.filter(
    (item) => item.id !== review.id,
  );
}
</script>
