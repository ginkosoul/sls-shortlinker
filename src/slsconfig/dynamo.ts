import type { AWS } from "@serverless/typescript";

export const dynamoResources: AWS["resources"]["Resources"] = {
  urlTable: {
    Type: "AWS::DynamoDB::GlobalTable",
    Properties: {
      TableName: "${self:service}-linksTable-${sls:stage}",
      Replicas: [{ Region: "${aws:region}" }],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "userId",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "UserIndex",
          KeySchema: [
            {
              AttributeName: "userId",
              KeyType: "HASH",
            },
          ],
          Projection: { ProjectionType: "ALL" },
        },
      ],
      TimeToLiveSpecification: {
        AttributeName: "TTL",
        Enabled: true,
      },
      StreamSpecification: {
        StreamViewType: "OLD_IMAGE",
      },
      BillingMode: "PAY_PER_REQUEST",
    },
  },
  usersTable: {
    Type: "AWS::DynamoDB::GlobalTable",
    Properties: {
      TableName: "${self:service}-usersTable-${sls:stage}",
      Replicas: [{ Region: "${aws:region}" }],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "email",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "EmailIndex",
          KeySchema: [
            {
              AttributeName: "email",
              KeyType: "HASH",
            },
          ],
          Projection: { ProjectionType: "ALL" },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
};
