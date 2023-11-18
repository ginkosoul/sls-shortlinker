import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { deleteLink, getLinkById, updateVisitCount } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { sendMessage } from "@libs/notification";
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
      await sendMessage(
        JSON.stringify({ ...record, message: "One-time Link deactivated" })
      );
      await deleteLink(record.id);
    } else {
      await updateVisitCount({
        id: record.id,
        visitCount: Number(record.visitCount),
      });
    }

    return formatJSONResponse({
      data: {},
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
