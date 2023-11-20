import { APIGatewayProxyEvent } from "aws-lambda";
import { nanoid } from "nanoid";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";
import { formatJSONResponse } from "@libs/apiGateway";
import { scheduleSQSMessage } from "@libs/scheduler";
import { validateLinkBody } from "@libs/validations";
import { getScheduledDate } from "@libs/helpers";
import { createLink } from "@libs/dynamo";

import { Link } from "src/types/types";
import { LinkBody, LinkResponse } from "src/types/apiTypes";

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
