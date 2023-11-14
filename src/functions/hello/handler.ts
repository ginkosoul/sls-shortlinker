import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";

export const handler = async (event: APIGatewayProxyEvent) => {
  return formatJSONResponse({
    data: {
      message: `Hello, welcome to the exciting Serverless world!`,
      event,
    },
  });
};
