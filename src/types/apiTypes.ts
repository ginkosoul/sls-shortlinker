export type LifeTime = "one-time" | "1 day" | "3 days" | "7 days";

export type AuthBody = {
  email: string;
  password: string;
};

export type LinkBody = {
  url: string;
  lifetime: LifeTime;
};

type SingleLink = {
  id: string;
  createdAt: string;
  lifetime: LifeTime;
  originalUrl: string;
  shortUrl: string;
  visitCount: number;
};

export type LinkResponse = { shortUrl: string; originalUrl: string };

export type LinksList = SingleLink[];

export type AuthResponse = {
  id: string;
  email: string;
  refreshToken: string;
  accessToken: string;
};
