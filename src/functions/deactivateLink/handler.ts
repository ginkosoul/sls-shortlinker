import { formatJSONResponse } from "@libs/apiGateway";
import { getLinkById } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { sqsDeactivateLink } from "@libs/notification";
import { Link } from "@libs/types";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = event.requestContext.authorizer?.principalId as string;
    const { id } = event.pathParameters || {};
    const link = (await getLinkById(id)) as Link;

    if (!link) {
      throw new HttpError(404, {
        message: "Link not found",
      });
    }

    if (link.userId !== userId) {
      throw new HttpError(403, {
        message: "You don't have permission to delete this Link.",
      });
    }

    await sqsDeactivateLink(link);

    return formatJSONResponse({
      data: {
        message:
          "Deactivate task successfully added. You will receive message after task is completed",
      },
    });
  } catch (error) {
    return formatJSONResponse({
      data: {
        message: error.message,
      },
      statusCode: error.statusCode || 500,
    });
  }
};
