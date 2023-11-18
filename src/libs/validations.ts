import { HttpError } from "./httpError";
import { AuthBody } from "./types";

export const validateUser = (body: AuthBody) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!body.email) {
    throw new HttpError(400, { message: "Missing field: email" });
  }
  if (!body.email.match(emailRegex)) {
    throw new HttpError(400, { message: "Invalid email: " + body.email });
  }
  if (!body.password) {
    throw new HttpError(400, { message: "Missing field: password" });
  }
  if (body.password.length < 6) {
    throw new HttpError(400, { message: "Password min length 6" });
  }
};
