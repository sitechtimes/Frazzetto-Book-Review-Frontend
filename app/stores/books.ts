export const useBookStore = defineStore("bookStore", () => {
  const books = ref<Book[]>([]);
  const genres = ref<Genre[]>([]);
  const selectedBook = ref<Book | null>(null);

  async function getAllBooks(): Promise<Result<Book[], Error>> {
    const { data, error } = await tryRequestEndpoint<Book[]>(
      "/books/all",
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    books.value = data;

    return { data };
  }

  async function getGenres(): Promise<Result<Genre[], Error>> {
    const { data, error } = await tryRequestEndpoint<Genre[]>(
      "/books/genres",
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    genres.value = data;

    return { data };
  }

  async function getBookReviews(
    bookId: number,
  ): Promise<Result<Review[], Error>> {
    const { data, error } = await tryRequestEndpoint<Review[]>(
      `/books/reviews/book/${bookId}`,
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    return { data };
  }

  async function getBookById(id: number): Promise<Result<Book, Error>> {
    const { data, error } = await tryRequestEndpoint<Book>(
      `/books/${id}`,
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    const reviewsResult = await getBookReviews(id);

    if (reviewsResult.error) {
      return { error: reviewsResult.error };
    }

    const bookWithReviews: Book = {
      ...data,
      reviews: reviewsResult.data,
    };

    selectedBook.value = bookWithReviews;

    return {
      data: bookWithReviews,
    };
  }

  async function createBook(bookData: {
    title: string;
    author: string;
    description: string;
    genres: number[];
    cover_image: File | null;
  }): Promise<Result<Book, Error>> {
    const userStore = useUserStore();

    const { token } = storeToRefs(userStore);

    const formData = new FormData();

    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("description", bookData.description);

    bookData.genres.forEach((genreId) => {
      formData.append("genre_ids", genreId.toString());
    });

    if (bookData.cover_image) {
      formData.append("cover_image", bookData.cover_image);
    }

    console.log("FormData being sent:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const { data, error } = await tryRequestEndpoint<Book>(
      "/books/create",
      "POST",
      {
        Authorization: `Bearer ${token.value}`,
      },
      formData,
    );

    if (error) {
      return { error };
    }

    books.value.push(data);

    return { data };
  }

  async function createGenre(name: string): Promise<Result<Genre, Error>> {
    const userStore = useUserStore();

    const { token } = storeToRefs(userStore);

    const existingGenre = genres.value.find(
      (genre) => genre.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingGenre) {
      return {
        data: existingGenre,
      };
    }

    const { data, error } = await tryRequestEndpoint<Genre>(
      "/books/genres/create",
      "POST",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      {
        name,
      },
    );

    if (error) {
      return { error };
    }

    genres.value.push(data);

    return { data };
  }

  return {
    books,
    genres,
    selectedBook,
    getAllBooks,
    getGenres,
    getBookReviews,
    getBookById,
    createBook,
    createGenre,
  };
});


export const useBookSubmissionStore = defineStore(
  "bookSubmissionStore",
  () => {
    const bookSubmissions = ref<BookSubmission[]>([]);
    const pendingBookSubmissions = ref<BookSubmission[]>([]);
    const approvedBookSubmissions = ref<BookSubmission[]>([]);
    const selectedUserBookSubmissions = ref<BookSubmission[]>([]);
    const selectedBookSubmission = ref<BookSubmission | null>(null);

    async function submitBook(bookData: {
      title: string;
      author: string;
      description: string;
      genres: number[];
      cover_image: File | null;
    }): Promise<Result<BookSubmission, Error>> {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const formData = new FormData();

      formData.append("title", bookData.title);
      formData.append("author", bookData.author);
      formData.append("description", bookData.description);

      bookData.genres.forEach((genreId) => {
        formData.append("genre_ids", genreId.toString());
      });

      if (bookData.cover_image) {
        formData.append("cover_image", bookData.cover_image);
      }

      const { data, error } = await tryRequestEndpoint<BookSubmission>(
        "/books/create",
        "POST",
        {
          Authorization: `Bearer ${token.value}`,
        },
        formData,
      );

      if (error) {
        return { error };
      }

      selectedUserBookSubmissions.value.push(data);

      return { data };
    }

    async function getBookSubmissionsByUserId(
      userId: number,
    ): Promise<Result<BookSubmission[], Error>> {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const { data, error } = await tryRequestEndpoint<BookSubmission[]>(
        `/books/user/${userId}`,
        "GET",
        {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      );

      if (error) {
        return { error };
      }

      selectedUserBookSubmissions.value = data;

      return { data };
    }

    async function getBookSubmissionById(
      id: number,
    ): Promise<Result<BookSubmission, Error>> {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const { data, error } = await tryRequestEndpoint<BookSubmission>(
        `/books/${id}`,
        "GET",
        {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      );

      if (error) {
        return { error };
      }

      selectedBookSubmission.value = data;

      return { data };
    }

    async function updateBookSubmission(
      id: number,
      submission: {
        title: string;
        author: string;
        description: string;
        genres: number[];
        cover_image: File | null;
      },
    ): Promise<Result<BookSubmission, Error>> {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const formData = new FormData();

      formData.append("title", submission.title);
      formData.append("author", submission.author);
      formData.append("description", submission.description);

      submission.genres.forEach((genreId) => {
        formData.append("genre_ids", genreId.toString());
      });

      if (submission.cover_image) {
        formData.append("cover_image", submission.cover_image);
      }

      const { data, error } = await tryRequestEndpoint<BookSubmission>(
        `/books/${id}`,
        "PUT",
        {
          Authorization: `Bearer ${token.value}`,
        },
        formData,
      );

      if (error) {
        return { error };
      }

      selectedBookSubmission.value = data;

      selectedUserBookSubmissions.value =
        selectedUserBookSubmissions.value.map((item) =>
          item.id === id ? data : item,
        );

      return { data };
    }

    async function deleteBookSubmission(
      id: number,
    ): Promise<Result<null, Error>> {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const { error } = await tryRequestEndpoint<null>(
        `/books/delete/${id}`,
        "DELETE",
        {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      );

      if (error) {
        return { error };
      }

      bookSubmissions.value = bookSubmissions.value.filter(
        (submission) => submission.id !== id,
      );

      selectedUserBookSubmissions.value =
        selectedUserBookSubmissions.value.filter(
          (submission) => submission.id !== id,
        );

      if (selectedBookSubmission.value?.id === id) {
        selectedBookSubmission.value = null;
      }

      return { data: null };
    }

    async function getPendingBookSubmissions(): Promise<
      Result<BookSubmission[], Error>
    > {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const { data, error } = await tryRequestEndpoint<BookSubmission[]>(
        "/books/pending",
        "GET",
        {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      );

      if (error) {
        return { error };
      }

      pendingBookSubmissions.value = data;

      return { data };
      
    }

    async function getApprovedBookSubmissions(): Promise<
      Result<BookSubmission[], Error>
    > {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const { data, error } = await tryRequestEndpoint<BookSubmission[]>(
        "/books/approved",
        "GET",
        {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      );

      if (error) {
        return { error };
      }

      approvedBookSubmissions.value = data;

      return { data };
    }

    async function approveBookSubmission(
      id: number,
      isApproved: boolean,
    ): Promise<Result<BookSubmission, Error>> {
      const userStore = useUserStore();
      const { token } = storeToRefs(userStore);

      const { data, error } = await tryRequestEndpoint<BookSubmission>(
        `/books/update-approval/${id}`,
        "POST",
        {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        {
          is_approved: isApproved,
        },
      );

      if (error) {
        return { error };
      }

      bookSubmissions.value = bookSubmissions.value.map((submission) =>
        submission.id === id ? data : submission,
      );

      selectedUserBookSubmissions.value =
        selectedUserBookSubmissions.value.map((submission) =>
          submission.id === id ? data : submission,
        );

      if (selectedBookSubmission.value?.id === id) {
        selectedBookSubmission.value = data;
      }

      return { data };
    }

    return {
      bookSubmissions,
      pendingBookSubmissions,
      approvedBookSubmissions,
      selectedUserBookSubmissions,
      selectedBookSubmission,
      submitBook,
      getBookSubmissionsByUserId,
      getBookSubmissionById,
      updateBookSubmission,
      deleteBookSubmission,
      getPendingBookSubmissions,
      getApprovedBookSubmissions,
      approveBookSubmission,
    };
  },
);