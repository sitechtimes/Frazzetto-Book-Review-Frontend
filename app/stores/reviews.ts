export const useReviewStore = defineStore("reviewStore", () => {
  const reviews = ref<Review[]>([]);
  const selectedBookReviews = ref<Review[]>([]);
  const selectedUserReviews = ref<Review[]>([]);
  const selectedReview = ref<Review | null>(null);

  async function getAllReviews(): Promise<Result<Review[], Error>> {
    const { data, error } = await tryRequestEndpoint<Review[]>(
      "/books/reviews",
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    reviews.value = data;

    return { data };
  }

  async function getReviewByBookId(
    book_id: number,
  ): Promise<Result<Review[], Error>> {
    const { data, error } = await tryRequestEndpoint<Review[]>(
      `/books/reviews/book/${book_id}`,
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    selectedBookReviews.value = data;

    return { data };
  }

  async function getReviewsByStudentId(
    user_id: number,
  ): Promise<Result<Review[], Error>> {
    const userStore = useUserStore();

    const { token } = storeToRefs(userStore);

    const { data, error } = await tryRequestEndpoint<Review[]>(
      `/books/reviews/user/${user_id}`,
      "GET",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    );

    if (error) {
      return { error };
    }

    selectedUserReviews.value = data;

    return { data };
  }

  async function getReviewById(id: number): Promise<Result<Review, Error>> {
    const { data, error } = await tryRequestEndpoint<Review>(
      `/books/review/${id}`,
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    selectedReview.value = data;

    return { data };
  }

  async function updateReview(
    review_id: number,
    reviewData: {
      book_id: number;
      user_id: number;
      rating: number;
      headline: string;
      comment: string;
      spoiler: boolean;
    },
  ): Promise<Result<Review, Error>> {
    const userStore = useUserStore();

    const { token } = storeToRefs(userStore);

    const { data, error } = await tryRequestEndpoint<Review>(
      `/books/review/update/${review_id}`,
      "PUT",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      reviewData,
    );

    if (error) {
      return { error };
    }

    selectedReview.value = data;

    return { data };
  }

  async function deleteReview(review_id: number): Promise<Result<null, Error>> {
    const userStore = useUserStore();

    const { token } = storeToRefs(userStore);

    const { error } = await tryRequestEndpoint<null>(
      `/books/review/delete/${review_id}`,
      "DELETE",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    );

    if (error) {
      return { error };
    }

    reviews.value = reviews.value.filter((review) => review.id !== review_id);

    selectedUserReviews.value = selectedUserReviews.value.filter(
      (review) => review.id !== review_id,
    );

    selectedBookReviews.value = selectedBookReviews.value.filter(
      (review) => review.id !== review_id,
    );

    return { data: null };
  }

  return {
    reviews,
    selectedBookReviews,
    selectedUserReviews,
    getAllReviews,
    getReviewByBookId,
    getReviewsByStudentId,
    getReviewById,
    updateReview,
    deleteReview,
  };
});
