import { APIGatewayProxyEvent } from "aws-lambda";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";
import { formatJSONResponse } from "@libs/apiGateway";
import { getLinksByUserId } from "@libs/dynamo";
import { formatLinkList } from "@libs/helpers";
import { HttpError } from "@libs/httpError";

import { Link } from "src/types/types";

const _handler = async (event: APIGatewayProxyEvent) => {
  const userId = event.requestContext.authorizer?.principalId as string;
  const links = (await getLinksByUserId(userId)) as Link[];

  if (links.length === 0) {
    throw new HttpError();
  }

  return formatJSONResponse({
    data: formatLinkList(links),
  });
};

export const handler = errorHadlerWrapper(_handler);
