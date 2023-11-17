import { sign, verify } from "jsonwebtoken";
import { LifeTime } from "./types";

const SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

interface UserData {
  id: string;
}

export const generateTokens = (id: string) => {
  const user: UserData = { id };
  const accessToken = sign(user, SECRET, {
    expiresIn: "60m",
  });

  const refreshToken = sign(user, REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const validateAccessToken = (token: string) => {
  try {
    const userData = verify(token, SECRET) as UserData;
    return userData;
  } catch (error) {
    return null;
  }
};

export const getScheduledDate = (lifetime: LifeTime) => {
  const date = new Date();
  switch (lifetime) {
    case "1 day":
      date.setDate(date.getDate() + 1);
      break;
    case "3 days":
      date.setDate(date.getDate() + 3);
      break;
    case "7 days":
      date.setDate(date.getDate() + 7);
      break;
    default:
      break;
  }
  return new Date(date);
};
