import { APIGatewayEvent } from "aws-lambda";
import { compare } from "bcryptjs";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";

import {
  generateTokens,
  HttpError,
  getUsersByEmail,
  updateUserToken,
  validateUser,
  formatJSONResponse,
} from "@libs/helpers";

import { AuthBody, AuthResponse } from "@t/apiTypes";
import { User } from "@t/types";

const _handler = async (event: APIGatewayEvent) => {
  const body: AuthBody = JSON.parse(event.body as string);

  validateUser(body);

  const { email, password } = body;

  const [user] = (await getUsersByEmail(email)) as User[];

  if (!user)
    throw new HttpError(409, { message: "Email or password incorect" });

  const isValid = await compare(password, user.hashPassword);

  if (!isValid)
    throw new HttpError(409, { message: "Email or password incorect" });

  const upateData = { ...generateTokens(user.id), id: user.id };

  await updateUserToken(upateData);

  const response: AuthResponse = {
    id: user.id,
    email: user.email,
    refreshToken: upateData.refreshToken,
    accessToken: upateData.accessToken,
  };

  return formatJSONResponse({
    statusCode: 200,
    data: response,
  });
};

export const handler = errorHadlerWrapper(_handler);
