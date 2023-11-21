import { handlerPath } from "@libs/helpers/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/{id}",
        method: "get",
        cors: true,
        responseData: {
          301: "Redirecting to the original Location",
          404: "Link Not Found",
          502: "server error",
        },
      },
    },
  ],
};
