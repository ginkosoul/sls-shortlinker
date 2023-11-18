import { formatJSONResponse } from "@libs/apiGateway";
import { deleteLink, getLinkById } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { sendMessage } from "@libs/notification";
import { Link } from "@libs/types";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = event.requestContext.authorizer?.principalId as string;
    const { id } = event.pathParameters || {};
    const link = (await getLinkById(id)) as Link;

    if (link.userId !== userId) {
      console.log("UserId unmuched:", link.userId, userId);
      console.log("Link data", JSON.stringify(link));
      throw new HttpError(403, {
        message: "You don't have permission to delete this Link.",
      });
    }

    await deleteLink(link.id);
    await sendMessage(
      JSON.stringify({ ...link, message: "Link deleted by request" })
    );

    if (link.lifetime !== "one-time") {
      console.log("Schedule removed");
    }
    return formatJSONResponse({
      data: {},
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
