import { HttpError } from "./httpError";
import { AuthBody } from "./types";

export const validateUser = (body: AuthBody) => {
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
