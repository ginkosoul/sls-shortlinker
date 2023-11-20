import { handlerPath } from "@libs/handlerResolver";
import { authorizer } from "@functions/authVerify";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/{id}",
        method: "delete",
        authorizer,
        cors: true,
        responseData: {
          200: "Deactivate successfully",
          404: "Link not found",
          403: "Unauthorized",
          502: "server error",
        },
      },
    },
  ],
};
