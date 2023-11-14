import type { AWS } from "@serverless/typescript";

import { getLink, hello, setLink } from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "sls-shortlinker",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:PutItem",
              "dynamodb:GetItem",
              "dynamodb:DeleteItem",
              "dynamodb:Scan",
            ],
            Resource:
              "arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:service}-linksTable-${sls:stage}*",
          },
        ],
      },
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      urlTable: "${self:service}-linksTable-${sls:stage}",
      baseUrl: {
        "Fn::Join": [
          "",
          [
            "https://",
            { Ref: "HttpApi" },
            ".execute-api.${aws:region}.amazonaws.com",
          ],
        ],
      },
    },
  },
  // import the function via paths
  functions: { hello, getLink, setLink },
  package: { individually: true },
  resources: {
    Resources: {
      urlTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:service}-linksTable-${sls:stage}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
