import { APIGatewayEvent } from "aws-lambda";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";

import { validateUser } from "@libs/validations";
import { createUser, getUsersByEmail } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { generateTokens } from "@libs/helpers";
import { formatJSONResponse } from "@libs/apiGateway";
import { AuthBody, User } from "@libs/types";
import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";

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

  return formatJSONResponse({
    statusCode: 201,
    data: {
      id,
      email,
      refreshToken,
      accessToken,
    },
  });
};

export const handler = errorHadlerWrapper(_handler);
