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

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genres: Genre[];
  description: string;
  cover_image: string;
  reviews: Review[];
  average_rating: number | null;
}

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  headline: string;
  comment: string;
  is_approved: boolean;
  spoiler: boolean;
  created_at: string;
  approved_at: string | null;
  updated_at: string | null;
}

export interface Course {
  id: number;
  name: string;
  period: string;
  students: number[];
}

export interface CourseWithStudents {
  id: number;
  name: string;
  period: string;
  students: Student[];
}
