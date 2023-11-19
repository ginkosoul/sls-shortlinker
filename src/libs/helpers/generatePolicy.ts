import { PolicyData } from "@libs/types";
import { AuthResponse, PolicyDocument } from "aws-lambda";

export const generatePolicy = ({
  principalId = "anonymous",
  allow = false,
  resource,
}: PolicyData) => {
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
};
