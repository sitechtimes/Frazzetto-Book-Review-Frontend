export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: "teacher" | "user";
}

export interface Student extends User {
  reviews: Review[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string[];
  description: string;
  coverImage: string;
  reviews: Review[];
  averageRating: number;
}

export interface Review {
  id: number;
  bookId: number;
  userId: number;
  rating: number;
  headline: string;
  isApproved: boolean;
  spoiler: boolean;
}

export interface Course {
  id: number;
  name: string;
  classPeriod: string;
  students: Student[];
}
