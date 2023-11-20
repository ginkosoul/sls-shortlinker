import { APIGatewayEvent } from "aws-lambda";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";
import { formatJSONResponse } from "@libs/apiGateway";
import { HttpError } from "@libs/httpError";
import { validateUser } from "@libs/validations";
import { createUser, getUsersByEmail } from "@libs/dynamo";
import { generateTokens } from "@libs/helpers";

import { User } from "src/types/types";
import { AuthBody, AuthResponse } from "src/types/apiTypes";

const SALT = Number(process.env.HASH_SALT);

const _handler = async (event: APIGatewayEvent) => {
  const body: AuthBody = JSON.parse(event.body as string);

  validateUser(body);

  const { email, password } = body;

  const records = await getUsersByEmail(email);

  if (records.length) {
    throw new HttpError(409, { message: "Email already in use" });
  }

  const id = nanoid();
  const hashPassword = await hash(password, SALT);
  const { accessToken, refreshToken } = generateTokens(id);

  const user: User = {
    id,
    email,
    hashPassword,
    refreshToken,
    accessToken,
  };

  await createUser(user);

  const response: AuthResponse = {
    id,
    email,
    refreshToken,
    accessToken,
  };

  return formatJSONResponse({
    statusCode: 201,
    data: response,
  });
};

export const handler = errorHadlerWrapper(_handler);
