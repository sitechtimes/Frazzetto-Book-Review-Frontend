export interface Genre {
  id: number;
  name: string;
}

export interface BackendBook {
  id: number;
  title: string;
  author: string;
  description: string;
  genres: Genre[];
  cover_image: string;
  average_rating: number;
  reviews?: Review[];
}

export const useBookStore = defineStore("bookStore", () => {
  const books = ref<Book[]>([]);
  const genres = ref<string[]>([]);
  const selectedBook = ref<Book | null>(null);

  async function getAllBooks(): Promise<Result<Book[], Error>> {
    const { data, error } = await tryRequestEndpoint<BackendBook[]>(
      "/books/all",
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    books.value = data.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genres.map((genre) => genre.name),
      coverImage: book.cover_image,
      averageRating: book.average_rating,
      reviews: book.reviews ?? [],
    }));

    return { data: books.value };
  }

  async function getGenres(): Promise<Result<string[], Error>> {
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

    genres.value = data.map((genre) => genre.name);

    return { data: genres.value };
  }

  async function getBookById(id: number): Promise<Result<Book, Error>> {
    const { data, error } = await tryRequestEndpoint<BackendBook>(
      `/books/${id}`,
      "GET",
      {
        "Content-Type": "application/json",
      },
    );

    if (error) {
      return { error };
    }

    const formattedBook: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      description: data.description,
      genre: data.genres.map((genre) => genre.name),
      coverImage: data.cover_image,
      averageRating: data.average_rating,
      reviews: data.reviews ?? [],
    };

    selectedBook.value = formattedBook;

    return { data: formattedBook };
  }

  return {
    books,
    genres,
    selectedBook,
    getAllBooks,
    getGenres,
    getBookById,
  };
});
