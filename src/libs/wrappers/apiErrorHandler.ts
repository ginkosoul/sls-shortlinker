import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  Callback,
} from "aws-lambda";
import { formatJSONResponse } from "../apiGateway";

export const errorHadlerWrapper =
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
        data: error.message,
      });
    }
  };