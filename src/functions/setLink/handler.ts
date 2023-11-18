import { APIGatewayProxyEvent } from "aws-lambda";
import { nanoid } from "nanoid";

import { formatJSONResponse } from "@libs/apiGateway";
import { createLink } from "@libs/dynamo";
import { scheduleSQSMessage } from "@libs/scheduler";
import { Link, LinkBody } from "@libs/types";
import { getScheduledDate } from "@libs/helpers";

const baseUrl = process.env.baseUrl;

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body: LinkBody = JSON.parse(event.body);
    const userId = event.requestContext.authorizer?.principalId as string;

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

    return formatJSONResponse({ data: { shortUrl, originalUrl } });
  } catch (error) {
    console.log("error", error);
    return formatJSONResponse({
      statusCode: 502,
      data: {
        message: error.message,
      },
    });
  }
};
