import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});

export const dynamo = {
  write: async (data: Record<string, any>, tableName: string) => {
    const params: PutCommandInput = {
      TableName: tableName,
      Item: data,
    };
    const command = new PutCommand(params);

    await dynamoClient.send(command);

    return data;
  },
  get: async (id: string, tableName: string) => {
    const params: GetCommandInput = {
      TableName: tableName,
      Key: {
        id,
      },
    };
    const command = new GetCommand(params);

    const response = await dynamoClient.send(command);
    if (response.Item) {
      const updateCommand = new UpdateCommand({
        TableName: tableName,
        Key: {
          id,
        },
        UpdateExpression: "set visitCount = :visitCount",
        ExpressionAttributeValues: {
          ":visitCount": response.Item.visitCount + 1,
        },
        ReturnValues: "ALL_NEW",
      });
      const updateRes = await dynamoClient.send(updateCommand);
      console.log("Update response", JSON.stringify(updateRes));
    }

    return response.Item;
  },
};
