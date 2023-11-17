import { getUserById } from "@libs/dynamo";
import { validateAccessToken } from "@libs/jwtHelper";
import {
  AuthResponse,
  PolicyDocument,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
} from "aws-lambda";

type PolicyData = {
  principalId?: string;
  allow?: boolean;
  resource: string;
};

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _,
  callback: APIGatewayAuthorizerCallback
) => {
  const [bearer, token] = event.authorizationToken.split(" ");
  const data: PolicyData = {
    resource: event.methodArn,
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

function generatePolicy({
  principalId = "anonymous",
  allow = false,
  resource,
}: PolicyData) {
  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: allow ? "Allow" : "Deny",
        Resource: resource,
      },
    ],
  };
  const authResponse: AuthResponse = { principalId, policyDocument };

  return authResponse;
}
