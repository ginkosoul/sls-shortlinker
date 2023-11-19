import { HttpError } from "./httpError";
import { AuthBody, LinkBody } from "./types";

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

export const validateLinkBody = (body: LinkBody) => {
  const linkRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;
  const lifetimeRegex = /(?:^|(?<= ))(one-time|1 day|3 days|7 days)(?:(?= )|$)/;
  if (!body.url) {
    throw new HttpError(400, { message: "Missing field: url" });
  }
  if (!body.url.match(linkRegex)) {
    throw new HttpError(400, { message: "Invalid URL" });
  }
  if (!body.lifetime) {
    throw new HttpError(400, { message: "Missing field: lifetime" });
  }
  if (!body.lifetime.match(lifetimeRegex)) {
    throw new HttpError(400, {
      message:
        "Invalid lifetime: must be one of: ['one-time', '1 day', '3 days', '7 days']",
    });
  }
};
