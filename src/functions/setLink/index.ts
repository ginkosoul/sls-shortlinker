import { handlerPath } from "@libs/handlerResolver";
import { authorizer } from "@functions/authVerify";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/",
        method: "post",
        authorizer,
        cors: true,
        bodyType: "LinkBody",
        responseData: {
          201: {
            description: "Link created successfully",
            bodyType: "LinkResponse",
          },
          400: "Bad Request",
          502: "server error",
        },
      },
    },
  ],
};
