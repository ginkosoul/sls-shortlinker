import { handlerPath } from "@libs/helpers/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        path: "/auth/signup",
        method: "post",
        cors: true,
        bodyType: "AuthBody",
        responseData: {
          201: {
            description: "User successfully registered",
            bodyType: "AuthResponse",
          },
          400: "Bad Request",
          409: "Email already in use",
          502: "server error",
        },
      },
    },
  ],
};
