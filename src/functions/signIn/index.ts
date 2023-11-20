import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/auth/signin",
        method: "post",
        cors: true,
        bodyType: "AuthBody",
        responseData: {
          200: {
            description: "User has been signed in successfully",
            bodyType: "AuthResponse",
          },
          400: "Bad Request",
          409: "Email or password incorect",
          502: "server error",
        },
      },
    },
  ],
};
