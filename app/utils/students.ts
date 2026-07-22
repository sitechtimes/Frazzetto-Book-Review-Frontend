export const students: Student[] = [
  {
    id: 1,
    email: "student@test.com",
    firstName: "John",
    lastName: "Smith",
    userType: "student",

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
  }, {
    id: 2,
    email: "student@test.com",
    firstName: "Jane",
    lastName: "Smith",
    userType: "user",

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
  }
];
