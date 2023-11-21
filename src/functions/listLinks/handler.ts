import { APIGatewayProxyEvent } from "aws-lambda";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";
import {
  formatJSONResponse,
  getLinksByUserId,
  formatLinkList,
  HttpError,
} from "@libs/helpers";

import { Link } from "@t/types";

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
