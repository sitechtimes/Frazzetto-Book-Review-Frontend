export const useCourseStore = defineStore("courseStore", () => {
  const courses = ref<Course[]>([]);
  const selectedCourse = ref<Course | null>(null);

  async function getAllCourses(): Promise<Result<Course[], Error>> {
    const { data, error } = await tryRequestEndpoint<Course[]>(
      "/courses/",
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    courses.value = data;

    return { data };
  }

  async function getCourseById(id: number): Promise<Result<Course, Error>> {
    const { data, error } = await tryRequestEndpoint<Course>(
      `/courses/${id}`,
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    selectedCourse.value = data;

    return { data };
  }

  return {
    courses,
    selectedCourse,
    getAllCourses,
    getCourseById,
  };
});
