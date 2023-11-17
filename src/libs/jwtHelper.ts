import { sign, verify } from "jsonwebtoken";

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
