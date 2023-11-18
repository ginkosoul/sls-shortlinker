import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/auth/signin",
        method: "post",
        cors: true,
      },
    },
  ],
};
