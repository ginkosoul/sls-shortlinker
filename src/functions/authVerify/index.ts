import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
};

export const authorizer = {
  name: "authVerify",
  // Identity: {
  //   ReauthorizeEvery: 0,
  // },
};
