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
      },
    },
  ],
};
