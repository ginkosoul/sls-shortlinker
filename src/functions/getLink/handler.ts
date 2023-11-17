import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { getLinkById, updateVisitCount } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const { code } = event.pathParameters || {};

    if (!code) {
      throw new HttpError(400, { message: "missing code in path" });
    }

    const record = await getLinkById(code);

    if (!record) {
      throw new HttpError();
    }
    await updateVisitCount({
      id: record.id,
      visitCount: Number(record.visitCount),
    });

    const originalUrl = record["originalUrl"];

    return formatJSONResponse({
      data: {},
      statusCode: 301,
      headers: {
        Location: originalUrl,
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
