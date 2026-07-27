export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_student: boolean;
  is_teacher: boolean;
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
  text: string;
  isApproved: boolean;
  spoiler: boolean;
  createdAt: string;
  approvedAt: string | null;
  updatedAt: string | null;
}

export interface Course {
  id: number;
  name: string;
  classPeriod: string;
  students: Student[];
}
