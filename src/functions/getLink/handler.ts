import { APIGatewayProxyEvent } from "aws-lambda";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";
import {
  formatJSONResponse,
  HttpError,
  getLinkById,
  updateVisitCount,
  sqsDeactivateLink,
} from "@libs/helpers";

import { Link } from "@t/types";

const _handler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    throw new HttpError(400, { message: "missing id in path" });
  }

  const record = (await getLinkById(id)) as Link;

  if (!record) {
    throw new HttpError();
  }
  if (record.lifetime === "one-time") {
    await sqsDeactivateLink(record);
  } else {
    await updateVisitCount(record);
  }

  return formatJSONResponse({
    statusCode: 301,
    headers: {
      Location: record.originalUrl,
    },
  });
};

export const handler = errorHadlerWrapper(_handler);
