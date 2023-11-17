import { handlerPath } from "@libs/handler-resolver";
import { authorizer } from "@functions/authorizer";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/",
        method: "post",
        authorizer,
      },
    },
  ],
};
