interface LoginBody {
  email: string;
  pin: number;
}

interface LoginResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: "teacher" | "student";
}

const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    pin: 435658,
    firstName: "John",
    lastName: "Doe",
    userType: "teacher" as const,
  },
  {
    id: 2,
    email: "user@gmail.com",
    pin: 861851,
    firstName: "Tina",
    lastName: "Zhen",
    userType: "student" as const,
  },
];

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event);

  const foundUser = users.find(
    (user) => user.email === body.email && user.pin === body.pin,
  );

  if (!foundUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Incorrect email or password",
    });
  }

  return foundUser satisfies LoginResponse;
});
