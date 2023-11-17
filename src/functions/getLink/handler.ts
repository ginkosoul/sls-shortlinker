import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { get, updateVisitCount } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.urlTable;
    const { code } = event.pathParameters || {};

    if (!code) {
      throw new HttpError(400, { message: "missing code in path" });
    }

    const record = await get(code, tableName);

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
    console.log("error", error);
    return formatJSONResponse({
      statusCode: 502,
      data: {
        message: error.message,
      },
    });
  }
};
