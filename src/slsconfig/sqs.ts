import type { AWS } from "@serverless/typescript";

export const sqsResource: AWS["resources"]["Resources"] = {
  receiverQueue: {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: "receiverQueue",
    },
  },
};
