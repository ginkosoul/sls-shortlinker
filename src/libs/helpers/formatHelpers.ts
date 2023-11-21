import { LifeTime, LinksList } from "@t/apiTypes";
import { Entity, Link } from "@t/types";

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

export const formatLinkList = (links: Link[]): LinksList =>
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

export const getScheduledNameById = (id: string): string => `task-${id}`;

export const generateEmailMessage = (link: Link, entity: Entity): string =>
  entity === "SCHEDULER"
    ? `${link.shortUrl} lifetime period expired and link was deactivated. Original URL:${link.originalUrl}`
    : `${link.shortUrl} deactivated by user's request. Original URL:${link.originalUrl}`;
