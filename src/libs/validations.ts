import { HttpError } from "./httpError";
import { AuthBody } from "./types";

export const validateUser = (body: AuthBody) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;
  if (!body.email) {
    throw new HttpError(400, { message: "Missing field: email" });
  }
  if (!body.email.match(emailRegex)) {
    throw new HttpError(400, { message: "Invalid email: " + body.email });
  }
  if (!body.password) {
    throw new HttpError(400, { message: "Missing field: password" });
  }
  if (!body.password.match(passwordRegex)) {
    throw new HttpError(400, {
      message:
        "Password minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
    });
  }
};
