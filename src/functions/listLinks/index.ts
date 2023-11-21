import { handlerPath } from "@libs/helpers/handlerResolver";
import { authorizer } from "@functions/authVerify";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/listmylinks",
        method: "get",
        authorizer,
        cors: true,
        responseData: {
          200: {
            description: "Lists user's links",
            bodyType: "LinksList",
          },
          404: "Links not found",
          502: "server error",
        },
      },
    },
  ],
};
