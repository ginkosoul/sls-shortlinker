import { getUserById } from "@libs/dynamo";
import { validateAccessToken } from "@libs/helpers";
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
    console.log("Entering authorization function:", JSON.stringify(event));
    console.log("AuthArn:", authArn);
    const userData = validateAccessToken(token);
    console.log(JSON.stringify(userData));
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
