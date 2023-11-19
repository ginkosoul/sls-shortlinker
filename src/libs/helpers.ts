import { sign, verify } from "jsonwebtoken";
import { Entity, LifeTime, Link } from "./types";

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

export const formatLinkList = (links: Link[]) =>
  links.map(
    ({ id, createdAt, lifetime, originalUrl, shortUrl, visitCount }) => ({
      id,
      createdAt,
      lifetime,
      originalUrl,
      shortUrl,
      visitCount,
    })
  );

export const getScheduledNameById = (id: string): string => `deactivate-${id}`;

export const generateEmailMessage = (link: Link, entity: Entity): string =>
  entity === "SCHEDULER"
    ? `${link.shortUrl} lifetime period expired and link was deactivated. Original URL:${link.originalUrl}`
    : `${link.shortUrl} deactivated by user's request. Original URL:${link.originalUrl}`;
