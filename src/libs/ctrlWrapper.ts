import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  Callback,
} from "aws-lambda";
import { formatJSONResponse } from "./api-gateway";

export const ctrlWrapper =
  (handler: APIGatewayProxyHandler) =>
  async (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback<APIGatewayProxyResult>
  ) => {
    try {
      return await handler(event, context, callback);
    } catch (error) {
      return formatJSONResponse({
        statusCode: error.statusCode || 500,
        data: {
          message: error.message,
        },
      });
    }
  };
