import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      stream: {
        type: "dynamodb",
        arn: {
          "Fn::GetAtt": ["urlTable", "StreamArn"],
        },
        filterPatterns: [{ eventName: ["REMOVE"] }],
      },
    },
  ],
  iam: {
    role: {
      statements: [
        {
          Effect: "Allow",
          Action: "ses:SendEmail",
          Resource: "*",
        },
      ],
    },
  },
};
