import { APIGatewayProxyEvent } from "aws-lambda";
// import { v4 as uuid } from "uuid";
import { nanoid } from "nanoid";

import { formatJSONResponse } from "@libs/api-gateway";
import { dynamo } from "@libs/dynamo";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body);
    const tableName = process.env.urlTable;
    const baseUrl = process.env.baseUrl;

    const originalUrl = body.url;
    const code = nanoid(6);
    const shortUrl = `${baseUrl}/${code}`;

    const data = {
      id: code,
      shortUrl,
      originalUrl,
    };

    await dynamo.write(data, tableName);

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
