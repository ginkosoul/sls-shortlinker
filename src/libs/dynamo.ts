import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});

export const write = async (data: Record<string, any>, tableName: string) => {
  const params: PutCommandInput = {
    TableName: tableName,
    Item: data,
  };
  const command = new PutCommand(params);

  await dynamoClient.send(command);

  return data;
};
export const get = async (id: string, tableName: string) => {
  const params: GetCommandInput = {
    TableName: tableName,
    Key: {
      id,
    },
  };
  const command = new GetCommand(params);

  const response = await dynamoClient.send(command);

  return response.Item;
};

export const updateVisitCount = async ({
  id,
  visitCount,
}: {
  id: string;
  visitCount: number;
}) => {
  const tableName = process.env.urlTable as string;

  const updateCommand = new UpdateCommand({
    TableName: tableName,
    Key: {
      id,
    },
    UpdateExpression: "set visitCount = :visitCount",
    ExpressionAttributeValues: {
      ":visitCount": visitCount + 1,
    },
    ReturnValues: "ALL_NEW",
  });
  const response = await dynamoClient.send(updateCommand);
  return response;
};

export const updateUserToken = async ({
  id,
  accessToken,
  refreshToken,
}: {
  id: string;
  accessToken: string;
  refreshToken: string;
}) => {
  const tableName = process.env.usersTable as string;

  const updateCommand = new UpdateCommand({
    TableName: tableName,
    Key: {
      id,
    },
    UpdateExpression:
      "set accessToken = :accessToken, refreshToken = :refreshToken",
    ExpressionAttributeValues: {
      ":accessToken": accessToken,
      ":refreshToken": refreshToken,
    },
    ReturnValues: "ALL_NEW",
  });
  const response = await dynamoClient.send(updateCommand);
  return response;
};

export const getUserByEmail = async (email: string) => {
  const tableName = process.env.usersTable as string;

  const queryCommand = new QueryCommand({
    TableName: tableName,
    IndexName: "EmailIndex",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  });
  const response = await dynamoClient.send(queryCommand);
  const [user] = response.Items;
  return user;
};
