<template>
  <div class="min-h-screen bg-base-200">
    <main class="max-w-6xl mx-auto py-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-black">
            {{ course?.name }}
          </h1>
          <p class="text-gray-600">Period {{ course?.classPeriod }}</p>
        </div>
        <button class="btn btn-outline">Assign +</button>
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
                    ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
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
  allowedRoles: ["teacher"],
});

// emit from sidebar to get selected and replace "Selected: All" w/ the selected student name
const route = useRoute();

const courseID = route.params.courseID;

// replace w/ API call later
const courses = [
  {
    id: 1,
    name: "AP English Literature",
    classPeriod: 3,
    students: students,
  },
];

const course = courses.find((course) => course.id.toString() === courseID);

const selectedStudentId = ref<number | null>(null);
const selectedStudent = computed(() => {
  if (!selectedStudentId.value || !course) {
    return null;
  }

  return course.students.find(
    (student) => student.id === selectedStudentId.value,
  );
});

// have to get the reviews from the course students
const pendingReviews = [
  {
    id: 1,
    bookId: 1,
    userId: 1,
    rating: 4,
    headline: "This book is so good",
    text: "u should read this book",
    isApproved: false,
    spoiler: false,
    createdAt: "01/01/2026",
    approvedAt: null,
    updatedAt: null,
  },
];

const approvedReviews = [
  {
    id: 2,
    bookId: 2,
    userId: 2,
    rating: 1,
    headline: "This book is terrible",
    text: "Never reading this again. would not recommend",
    isApproved: true,
    spoiler: true,
    createdAt: "01/31/2026",
    approvedAt: "02/01/2026",
    updatedAt: null,
  },
];

const filteredPendingReviews = computed(() => {
  if (!selectedStudentId.value) {
    return pendingReviews;
  }

  return pendingReviews.filter(
    (review) => review.userId === selectedStudentId.value,
  );
});
const filteredApprovedReviews = computed(() => {
  if (!selectedStudentId.value) {
    return approvedReviews;
  }

  return approvedReviews.filter(
    (review) => review.userId === selectedStudentId.value,
  );
});

function approveReview(id: number) {
  console.log("approve", id);
  //backend
}

function rejectReview(id: number) {
  console.log("reject", id);
  //backend
}

function selectStudent(studentId: number | null) {
  selectedStudentId.value = studentId;
}
</script>

<style scoped></style>
