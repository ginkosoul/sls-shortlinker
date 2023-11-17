export type User = {
  id: string;
  email: string;
  hashPassword: string;
  refreshToken: string;
  accessToken: string;
};

export type AuthBody = {
  email: string;
  password: string;
};

export type LifeTime = "one-time" | "1 day" | "3 days" | "7 days";

export type LinkBody = {
  url: string;
  lifetime: LifeTime;
};

export type Link = {
  id: string;
  createdAt: string;
  userId: string;
  shortUrl: string;
  originalUrl: string;
  visitCount: number;
  lifetime: LifeTime;
  TTL?: number;
};
