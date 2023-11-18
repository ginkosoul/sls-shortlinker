import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/{id}",
        method: "delete",
      },
    },
  ],
};
