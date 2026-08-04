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

  async function getReviewsByUserId(
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

  async function createReview(reviewData: {
    book_id: number;
    user_id: number;
    rating: number;
    headline: string;
    comment: string;
    spoiler: boolean;
  }): Promise<Result<Review, Error>> {
    const userStore = useUserStore();
    const { token } = storeToRefs(userStore);
    const { data, error } = await tryRequestEndpoint<Review>(
      `/books/review/create`,
      "POST",
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

  async function getPendingReviews(): Promise<Result<Review[], Error>> {
    const userStore = useUserStore();
    const { token } = storeToRefs(userStore);

    const { data, error } = await tryRequestEndpoint<Review[]>(
      "/books/reviews/pending",
      "GET",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    );

    if (error) {
      return { error };
    }

    return { data };
  }

  async function getApprovedReviews(): Promise<Result<Review[], Error>> {
    const userStore = useUserStore();
    const { token } = storeToRefs(userStore);
    const { data, error } = await tryRequestEndpoint<Review[]>(
      "/books/reviews/approved",
      "GET",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    );

    if (error) {
      return { error };
    }

    return { data };
  }

  async function approveReview(
    review_id: number,
    is_approved: boolean,
    review: Review,
  ): Promise<Result<Review, Error>> {
    const userStore = useUserStore();
    const { token } = storeToRefs(userStore);

    const { data, error } = await tryRequestEndpoint<Review>(
      `/books/review/approve/${review_id}`,
      "POST",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      {
        book_id: review.book_id,
        user_id: review.user_id,
        rating: review.rating,
        headline: review.headline,
        comment: review.comment,
        spoiler: review.spoiler,
        is_approved,
      },
    );

    if (error) {
      return { error };
    }

    const updatedReview = data ?? {
      ...review,
      is_approved,
    };

    reviews.value = reviews.value.map((item) =>
      item.id === review_id ? updatedReview : item,
    );

    selectedBookReviews.value = selectedBookReviews.value.map((item) =>
      item.id === review_id ? updatedReview : item,
    );

    selectedUserReviews.value = selectedUserReviews.value.map((item) =>
      item.id === review_id ? updatedReview : item,
    );

    if (selectedReview.value?.id === review_id) {
      selectedReview.value = updatedReview;
    }

    return { data: updatedReview };
  }

  return {
    reviews,
    selectedBookReviews,
    selectedUserReviews,
    selectedReview,
    getAllReviews,
    getReviewByBookId,
    getReviewsByUserId,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getPendingReviews,
    getApprovedReviews,
    approveReview,
  };
});
