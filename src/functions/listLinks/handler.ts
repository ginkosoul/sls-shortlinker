import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/apiGateway";
import { getLinksByUserId } from "@libs/dynamo";
import { formatLinkList } from "@libs/helpers";
import { HttpError } from "@libs/httpError";
import { Link } from "@libs/types";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = event.requestContext.authorizer?.principalId as string;
    const links = (await getLinksByUserId(userId)) as Link[];

    if (links.length === 0) {
      throw new HttpError();
    }

    return formatJSONResponse({
      data: {
        links: formatLinkList(links),
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
