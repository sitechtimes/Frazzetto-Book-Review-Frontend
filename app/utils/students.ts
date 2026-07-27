export const students: Student[] = [
  {
    id: 1,
    email: "student@test.com",
    first_name: "John",
    last_name: "Smith",
    is_student: true,
    is_teacher: false,

    reviews: [
      {
        id: 1,
        bookId: 1,
        userId: 1,
        rating: 5,
        headline: "Amazing adventure",
        text: "This book was an amazing journey through Middle Earth.",

        isApproved: true,
        spoiler: false,

        createdAt: "2026-07-21",
        approvedAt: "2026-07-22",
        updatedAt: null,
      },

      {
        id: 2,
        bookId: 2,
        userId: 1,
        rating: 4,
        headline: "Great world building",
        text: "Dune has one of the most interesting worlds I have ever read.",

        isApproved: true,
        spoiler: false,

        createdAt: "2026-07-10",
        approvedAt: "2026-07-11",
        updatedAt: null,
      },
    ],
  },
  {
    id: 2,
    email: "student@test.com",
    first_name: "Jane",
    last_name: "Smith",
    is_student: true,
    is_teacher: false,
    reviews: [
      {
        id: 1,
        bookId: 1,
        userId: 1,
        rating: 5,
        headline: "Amazing adventure",
        text: "This book was an amazing journey through Middle Earth.",

        isApproved: true,
        spoiler: false,

        createdAt: "2026-07-21",
        approvedAt: "2026-07-22",
        updatedAt: null,
      },

      {
        id: 2,
        bookId: 2,
        userId: 1,
        rating: 4,
        headline: "Great world building",
        text: "Dune has one of the most interesting worlds I have ever read.",

        isApproved: true,
        spoiler: false,

        createdAt: "2026-07-10",
        approvedAt: "2026-07-11",
        updatedAt: null,
      },
    ],
  },
];

export const teachers: User[] = [
  {
    id: 1,
    email: "teacher@test.com",
    first_name: "Dr. Smith",
    last_name: "Smith",
    is_student: false,
    is_teacher: true,
  },
];
