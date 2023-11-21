import { sign, verify } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_TTL = "60m";
const REFRESH_TTL = "14d";

interface UserData {
  id: string;
}

export const generateTokens = (id: string) => {
  const user: UserData = { id };
  const accessToken = sign(user, SECRET, {
    expiresIn: ACCESS_TTL,
  });

  const refreshToken = sign(user, REFRESH_SECRET, {
    expiresIn: REFRESH_TTL,
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
