import { formatJSONResponse } from "@libs/apiGateway";
import { getLinksByUserId } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { Link } from "@libs/types";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = event.requestContext.authorizer?.principalId as string;
    const links = (await getLinksByUserId(userId)) as Link[];

    if (links.length === 0) {
      throw new HttpError();
    }

    return formatJSONResponse({
      data: {
        links: links.map(
          ({ id, createdAt, lifetime, originalUrl, shortUrl, visitCount }) => ({
            id,
            createdAt,
            lifetime,
            originalUrl,
            shortUrl,
            visitCount,
          })
        ),
      },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: 502,
      data: {
        message: error.message,
      },
    });
  }
};
