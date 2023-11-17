import { HttpError } from "./httpError";

export interface User {
  email: string;
  password: string;
}

export const validateUser = (body: User) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!body.email) {
    return {
      error: new HttpError(400, { message: "Missing field: email" }),
    };
  }
  if (!body.email.match(emailRegex)) {
    return {
      error: new HttpError(400, { message: "Invalid email: " + body.email }),
    };
  }
  if (!body.password) {
    return {
      error: new HttpError(400, { message: "Missing field: password" }),
    };
  }
  if (body.email.length < 6) {
    return {
      error: new HttpError(400, { message: "Password min length 6" }),
    };
  }
  return { email: body.email, password: body.password };
};