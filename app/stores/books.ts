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
