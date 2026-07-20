interface LoginBody {
  email: string;
  pin: string;
}

interface LoginResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: "teacher" | "user";
}

const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    pin: "uoyg57",
    firstName: "John",
    lastName: "Doe",
    userType: "teacher" as const,
  },
  {
    id: 2,
    email: "user@gmail.com",
    pin: "sd3645",
    firstName: "Tina",
    lastName: "Zhen",
    userType: "user" as const,
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
