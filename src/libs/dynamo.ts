import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DeleteCommandInput,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Link, User } from "./types";

const dynamoClient = new DynamoDBClient({});
const usersTable = process.env.usersTable as string;
const urlTable = process.env.urlTable as string;

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

export const del = async (id: string, tableName: string) => {
  const params: DeleteCommandInput = {
    TableName: tableName,
    Key: {
      id,
    },
  };
  const command = new DeleteCommand(params);

  await dynamoClient.send(command);
};

export const query = async (
  key: string,
  value: string,
  indexName: string,
  tableName: string
) => {
  const queryCommand = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: `${key} = :${key}`,
    ExpressionAttributeValues: {
      [`:${key}`]: value,
    },
  });
  const response = await dynamoClient.send(queryCommand);
  return response.Items;
};

export const updateVisitCount = async ({
  id,
  visitCount,
}: {
  id: string;
  visitCount: number;
}) => {
  const updateCommand = new UpdateCommand({
    TableName: urlTable,
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
  const updateCommand = new UpdateCommand({
    TableName: usersTable,
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

export const getUsersByEmail = async (email: string) =>
  await query("email", email, "EmailIndex", usersTable);

export const getLinksByUserId = async (userId: string) =>
  await query("userId", userId, "UserIndex", urlTable);

export const getUserById = async (id: string) => await get(id, usersTable);

export const getLinkById = async (id: string) => await get(id, urlTable);

export const createUser = async (user: User) => await write(user, usersTable);

export const createLink = async (link: Link) => await write(link, urlTable);

export const deleteLink = async (id: string) => await del(id, urlTable);
