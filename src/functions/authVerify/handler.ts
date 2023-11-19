import { getUserById } from "@libs/dynamo";
import { validateAccessToken } from "@libs/helpers";
import { generatePolicy } from "@libs/helpers/generatePolicy";
import { PolicyData } from "@libs/types";
import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
} from "aws-lambda";

const authArn = process.env.authArn as string;

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _,
  callback: APIGatewayAuthorizerCallback
) => {
  const [bearer, token] = event.authorizationToken.split(" ");
  const data: PolicyData = {
    resource: authArn,
  };

  if (bearer === "Bearer" && token) {
    const userData = validateAccessToken(token);
    if (userData) {
      const user = await getUserById(userData.id);
      if (user.accessToken === token) {
        data.allow = true;
        data.principalId = userData.id;
      }
    }
  }

  callback(null, generatePolicy(data));
};
