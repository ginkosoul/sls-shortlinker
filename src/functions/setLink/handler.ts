import { APIGatewayProxyEvent } from "aws-lambda";
import { nanoid } from "nanoid";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";

import {
  formatJSONResponse,
  scheduleSQSMessage,
  validateLinkBody,
  getScheduledDate,
  createLink,
} from "@libs/helpers";

import { Link } from "@t/types";
import { LinkBody, LinkResponse } from "@t/apiTypes";

const baseUrl = process.env.baseUrl;

const _handler = async (event: APIGatewayProxyEvent) => {
  const userId = event.requestContext.authorizer?.principalId as string;
  const body: LinkBody = JSON.parse(event.body);
  validateLinkBody(body);

  const originalUrl = body.url;
  const lifetime = body.lifetime;

  const id = nanoid(6);
  const shortUrl = `${baseUrl}/${id}`;

  const link: Link = {
    id,
    createdAt: new Date().toISOString().split(".")[0],
    userId,
    shortUrl,
    originalUrl,
    lifetime,
    visitCount: 0,
  };
  if (lifetime !== "one-time") {
    link.TTL = Math.floor(getScheduledDate(lifetime).getTime() / 1000);
    await scheduleSQSMessage(link);
  }

  await createLink(link);

  const data: LinkResponse = { shortUrl, originalUrl };

  return formatJSONResponse({ data, statusCode: 201 });
};

export const handler = errorHadlerWrapper(_handler);
