import type { AWS } from "@serverless/typescript";

const dynamoResources: AWS["resources"]["Resources"] = {
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
      TimeToLiveSpecification: {
        AttributeName: "TTL",
        Enabled: true,
      },
      StreamSpecification: {
        StreamViewType: "OLD_IMAGE",
      },
    },
  },
};

export default dynamoResources;
