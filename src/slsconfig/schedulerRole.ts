import type { AWS } from "@serverless/typescript";

const sqsResource: AWS["resources"]["Resources"] = {
  SchedulerExecutionRole: {
    Type: "AWS::IAM::Role",
    Properties: {
      RoleName: "SchedulerExecutionRole",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: "Allow",

            Principal: {
              Service: [
                "lambda.amazonaws.com",
                "events.amazonaws.com",
                "scheduler.amazonaws.com",
              ],
            },
            Action: ["sts:AssumeRole"],
            Condition: {
              StringEquals: {
                "aws:SourceAccount": "${aws:accountId}",
              },
            },
          },
        ],
      },
      Policies: [
        {
          PolicyName: "scheduler-role",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "sts:AssumeRole",
                  "scheduler:*",
                  "iam:PassRole",
                  "lambda:InvokeFunction",
                  "sqs:SendMessage",
                ],
                Resource: [
                  "arn:aws:scheduler:${aws:region}:${aws:accountId}:*",
                  "arn:aws:iam::${aws:accountId}:role/SchedulerExecutionRole",
                  "arn:aws:iam::${aws:accountId}:role/${self:service}-${sls:stage}-${aws:region}-lambdaRole",
                  "*",
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default sqsResource;
