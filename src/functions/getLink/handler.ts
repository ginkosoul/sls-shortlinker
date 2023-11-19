import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/apiGateway";
import { getLinkById, updateVisitCount } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { sqsDeactivateLink } from "@libs/notification";
import { Link } from "@libs/types";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
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
  } catch (error) {
    return formatJSONResponse({
      statusCode: error.statusCode || 500,
      data: {
        message: error.message,
      },
    });
  }
};
