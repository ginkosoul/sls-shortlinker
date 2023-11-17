import type { AWS } from "@serverless/typescript";

import {
  getLink,
  setLink,
  sendReminder,
  receiver,
  signIn,
  signUp,
  userVerify,
} from "@functions/index";
import dynamoConfig from "@config/dynamo";
import sqsConfig from "@config/sqs";
import scheduleRole from "@config/schedulerRole";

const serverlessConfiguration: AWS = {
  service: "sls-shortlinker",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "eu-central-1",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:PutItem",
              "dynamodb:GetItem",
              "dynamodb:DeleteItem",
              "dynamodb:Query",
              "dynamodb:UpdateItem",
            ],
            Resource: [
              "arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:service}-linksTable-${sls:stage}*",
              "arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:service}-usersTable-${sls:stage}*",
            ],
          },
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["scheduler:CreateSchedule", "iam:PassRole"],
            Resource: [
              "arn:aws:scheduler:${aws:region}:${aws:accountId}:*",
              "arn:aws:iam::${aws:accountId}:role/SchedulerExecutionRole",
            ],
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
      usersTable: "${self:service}-usersTable-${sls:stage}",
      baseUrl: {
        "Fn::Join": [
          "",
          [
            "https://",
            { Ref: "ApiGatewayRestApi" },
            ".execute-api.${aws:region}.amazonaws.com",
          ],
        ],
      },
      queueUrl:
        "https://sqs.${aws:region}.amazonaws.com/${aws:accountId}/receiverQueue",
      arnSQS: "arn:aws:sqs:${aws:region}:${aws:accountId}:receiverQueue",
      arnScheduler: "arn:aws:scheduler:::aws-sdk:sqs:sendMessage",
      arnRole: "arn:aws:iam::${aws:accountId}:role/SchedulerExecutionRole",
    },
  },
  // import the function via paths
  functions: {
    userVerify,
    sendReminder,
    getLink,
    setLink,
    receiver,
    signIn,
    signUp,
  },
  package: { individually: true },
  resources: {
    Resources: {
      ...dynamoConfig,
      ...sqsConfig,
      ...scheduleRole,
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
