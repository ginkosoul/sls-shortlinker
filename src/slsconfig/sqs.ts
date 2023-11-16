import type { AWS } from "@serverless/typescript";

const sqsResource: AWS["resources"]["Resources"] = {
  receiverQueue: {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: "receiverQueue",
    },
  },
};

export default sqsResource;
